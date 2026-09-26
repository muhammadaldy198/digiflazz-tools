export interface Env {
  DB: D1Database;
  SESSION_ENCRYPTION_KEY: string;
}

type StoredSession = {
  url: string;
  method: "GET" | "HEAD";
  headers: Record<string, string>;
  capturedAt: string;
};

const enc = new TextEncoder();
const dec = new TextDecoder();

function json(data: unknown, status = 200) {
  return Response.json(data, {
    status,
    headers: {
      "cache-control": "no-store",
      "content-security-policy": "default-src 'none'; frame-ancestors 'none'",
    },
  });
}

function b64(bytes: Uint8Array) {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s);
}

function unb64(value: string) {
  const s = atob(value);
  const out = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) out[i] = s.charCodeAt(i);
  return out;
}

async function key(secret: string) {
  const digest = await crypto.subtle.digest("SHA-256", enc.encode(secret));
  return crypto.subtle.importKey("raw", digest, { name: "AES-GCM" }, false, ["encrypt", "decrypt"]);
}

async function seal(payload: StoredSession, secret: string) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    await key(secret),
    enc.encode(JSON.stringify(payload)),
  );
  return { encrypted: b64(new Uint8Array(ciphertext)), iv: b64(iv) };
}

async function open(encrypted: string, iv: string, secret: string): Promise<StoredSession> {
  const plaintext = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: unb64(iv) },
    await key(secret),
    unb64(encrypted),
  );
  return JSON.parse(dec.decode(plaintext)) as StoredSession;
}

function digiflazzHost(hostname: string) {
  const host = hostname.toLowerCase();
  return host === "digiflazz.com" || host.endsWith(".digiflazz.com");
}

function option(source: string, name: string) {
  const escaped = name.replace(/[.*+?^$()|[\]\\]/g, "\\$&");
  const re = new RegExp("(?:^|\\s)" + escaped + "\\s+(?:'([^']*)'|\"([^\"]*)\"|(\\S+))", "i");
  const m = source.match(re);
  return m ? (m[1] || m[2] || m[3] || null) : null;
}

function parseCurl(input: string): StoredSession {
  if (!input || input.length > 100000) throw new Error("cURL kosong atau terlalu panjang.");
  const source = input.replace(/\\\r?\n/g, " ").trim();
  if (!/^curl\s/i.test(source)) throw new Error("Format harus berupa perintah cURL.");

  const match = source.match(/['"](https:\/\/[^'"]+)['"]/) || source.match(/\b(https:\/\/[^\s]+)/);
  if (!match || !match[1]) throw new Error("URL HTTPS tidak ditemukan.");

  const url = new URL(match[1]);
  if (!digiflazzHost(url.hostname)) throw new Error("cURL harus berasal dari domain Digiflazz.");

  const method = String(option(source, "-X") || option(source, "--request") || "GET").toUpperCase();
  if (method !== "GET" && method !== "HEAD") {
    throw new Error("Pilih request GET/HEAD dari dashboard Digiflazz untuk koneksi awal.");
  }

  const headers: Record<string, string> = {};
  const allowed = new Set([
    "cookie", "x-csrf-token", "x-xsrf-token", "user-agent",
    "referer", "origin", "accept", "content-type", "x-requested-with",
  ]);

  const headerRe = /(?:^|\s)(?:-H|--header)\s+(?:'([^']*)'|"([^"]*)")/gi;
  for (const m of source.matchAll(headerRe)) {
    const raw = m[1] || m[2] || "";
    const idx = raw.indexOf(":");
    if (idx < 1) continue;
    const name = raw.slice(0, idx).trim().toLowerCase();
    const value = raw.slice(idx + 1).trim();
    if (allowed.has(name)) headers[name] = value;
  }

  const cookie = option(source, "-b") || option(source, "--cookie");
  if (cookie && !headers.cookie) headers.cookie = cookie;
  if (!headers.cookie) throw new Error("Cookie sesi tidak ditemukan pada cURL.");

  return {
    url: url.toString(),
    method: method as "GET" | "HEAD",
    headers,
    capturedAt: new Date().toISOString(),
  };
}

async function row(env: Env) {
  return env.DB.prepare(
    "SELECT encrypted_payload, iv, source_host, last_test_status, last_test_at, updated_at FROM digiflazz_connections WHERE id = 1",
  ).first<{
    encrypted_payload: string;
    iv: string;
    source_host: string;
    last_test_status: number | null;
    last_test_at: string | null;
    updated_at: string;
  }>();
}

async function api(request: Request, env: Env, url: URL): Promise<Response> {
  if (url.pathname === "/api/health") {
    let database = false;
    try { await env.DB.prepare("SELECT 1").first(); database = true; } catch {}
    return json({ ok: true, service: "digiflazz-tools", database });
  }

  if (!request.headers.get("cf-access-jwt-assertion")) {
    return json({ ok: false, error: "Cloudflare Access authentication required." }, 401);
  }

  if (url.pathname === "/api/connection/status" && request.method === "GET") {
    const current = await row(env);
    return json({
      ok: true,
      connected: Boolean(current),
      sourceHost: current?.source_host || null,
      lastTestStatus: current?.last_test_status || null,
      lastTestAt: current?.last_test_at || null,
      updatedAt: current?.updated_at || null,
    });
  }

  if (url.pathname === "/api/connection" && request.method === "POST") {
    if (!env.SESSION_ENCRYPTION_KEY) return json({ ok: false, error: "Encryption secret belum aktif." }, 503);
    try {
      const body = await request.json<{ curl?: string }>();
      const session = parseCurl(body.curl || "");
      const encrypted = await seal(session, env.SESSION_ENCRYPTION_KEY);
      const host = new URL(session.url).hostname;

      await env.DB.prepare(
        "INSERT INTO digiflazz_connections (id, encrypted_payload, iv, source_host, created_at, updated_at) VALUES (1, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) ON CONFLICT(id) DO UPDATE SET encrypted_payload = excluded.encrypted_payload, iv = excluded.iv, source_host = excluded.source_host, last_test_status = NULL, last_test_at = NULL, updated_at = CURRENT_TIMESTAMP",
      ).bind(encrypted.encrypted, encrypted.iv, host).run();

      return json({ ok: true, saved: true, sourceHost: host });
    } catch (error) {
      return json({ ok: false, error: error instanceof Error ? error.message : "Gagal memproses cURL." }, 400);
    }
  }

  if (url.pathname === "/api/connection/test" && request.method === "POST") {
    if (!env.SESSION_ENCRYPTION_KEY) return json({ ok: false, error: "Encryption secret belum aktif." }, 503);
    const current = await row(env);
    if (!current) return json({ ok: false, error: "Belum ada sesi Digiflazz tersimpan." }, 404);

    try {
      const session = await open(current.encrypted_payload, current.iv, env.SESSION_ENCRYPTION_KEY);
      const target = new URL(session.url);
      if (!digiflazzHost(target.hostname)) throw new Error("Host sesi tidak valid.");

      const response = await fetch(target.toString(), {
        method: session.method,
        headers: session.headers,
        redirect: "manual",
      });

      const location = response.headers.get("location") || "";
      const connected = response.status >= 200 && response.status < 400 && !/login|signin|auth/i.test(location);

      await env.DB.prepare(
        "UPDATE digiflazz_connections SET last_test_status = ?, last_test_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = 1",
      ).bind(response.status).run();

      return json({
        ok: true,
        connected,
        httpStatus: response.status,
        message: connected ? "Sesi Digiflazz merespons dengan baik." : "Sesi perlu diperbarui atau request cURL tidak cocok.",
      });
    } catch (error) {
      return json({ ok: false, connected: false, error: error instanceof Error ? error.message : "Tes koneksi gagal." }, 502);
    }
  }

  if (url.pathname === "/api/connection" && request.method === "DELETE") {
    await env.DB.prepare("DELETE FROM digiflazz_connections WHERE id = 1").run();
    return json({ ok: true, disconnected: true });
  }

  return json({ ok: false, error: "Not found." }, 404);
}

const PAGE = [
  "<!doctype html><html lang=\"id\"><head><meta charset=\"utf-8\">",
  "<meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><meta name=\"color-scheme\" content=\"dark\">",
  "<title>Digiflazz Tools</title><style>",
  "body{font-family:system-ui,sans-serif;background:#080d19;color:#eef2ff;margin:0;min-height:100vh}",
  "main{width:min(760px,calc(100% - 28px));margin:auto;padding:42px 0}.card{background:#0e1628;border:1px solid #26324e;border-radius:18px;padding:22px}",
  "h1{margin:0 0 8px}.lead,.help{color:#9dadcb;line-height:1.6}.status{padding:12px;border:1px solid #293650;border-radius:12px;margin:18px 0}",
  "textarea{width:100%;min-height:210px;background:#070c16;color:#dbeafe;border:1px solid #33405d;border-radius:12px;padding:14px;box-sizing:border-box}",
  ".actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:12px}button{border:0;border-radius:10px;padding:11px 15px;font-weight:800;background:#2563eb;color:white}",
  "button.secondary{background:#17233a}button.danger{background:#451a24}#message{min-height:22px;margin-top:12px;color:#bfdbfe}</style></head><body><main>",
  "<h1>Hubungkan Digiflazz</h1><p class=\"lead\">Seperti OtoSwitch: login Digiflazz, Copy as cURL dari request GET dashboard, lalu paste sekali di sini. Password Digiflazz tidak disimpan.</p>",
  "<section class=\"card\"><div class=\"status\" id=\"status\">Memeriksa koneksi...</div>",
  "<textarea id=\"curl\" spellcheck=\"false\" placeholder=\"Paste Copy as cURL dari dashboard Digiflazz\"></textarea>",
  "<div class=\"actions\"><button id=\"save\">Simpan Session</button><button id=\"test\" class=\"secondary\">Tes Koneksi</button><button id=\"disconnect\" class=\"danger\">Putuskan</button></div>",
  "<div id=\"message\"></div><p class=\"help\">Session disaring lalu dienkripsi AES-GCM sebelum disimpan di D1. Jangan taruh cURL/session di GitHub atau chat.</p></section>",
  "<script>",
  "const q=id=>document.getElementById(id);async function call(path,opt={}){const r=await fetch(path,{...opt,headers:{'content-type':'application/json',...(opt.headers||{})}});const b=await r.json().catch(()=>({}));if(!r.ok)throw Error(b.error||'Request gagal');return b}",
  "async function refresh(){try{const d=await call('/api/connection/status');q('status').textContent=d.connected?'Session tersimpan'+(d.lastTestStatus?' · HTTP '+d.lastTestStatus:''):'Belum terhubung'}catch(e){q('status').textContent='Status tidak tersedia'}}",
  "q('save').onclick=async()=>{try{q('message').textContent='Menyimpan session terenkripsi...';const d=await call('/api/connection',{method:'POST',body:JSON.stringify({curl:q('curl').value})});q('message').textContent='Session tersimpan dari '+d.sourceHost+'. Klik Tes Koneksi.';q('curl').value='';refresh()}catch(e){q('message').textContent=e.message}};",
  "q('test').onclick=async()=>{try{q('message').textContent='Menguji session...';const d=await call('/api/connection/test',{method:'POST',body:'{}'});q('message').textContent=d.message+' HTTP '+d.httpStatus;refresh()}catch(e){q('message').textContent=e.message}};",
  "q('disconnect').onclick=async()=>{try{await call('/api/connection',{method:'DELETE'});q('message').textContent='Session dihapus.';refresh()}catch(e){q('message').textContent=e.message}};refresh();",
  "</script></main></body></html>",
].join("");

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/")) return api(request, env, url);

    return new Response(PAGE, {
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "no-store",
        "content-security-policy": "default-src 'self'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'",
        "referrer-policy": "no-referrer",
        "x-content-type-options": "nosniff",
      },
    });
  },
} satisfies ExportedHandler<Env>;
