// Compiled into index.js with the interface from ui.html. Never store credentials here.
const HTML = __HTML__;
const encoder = new TextEncoder();
const decoder = new TextDecoder();
const DEFAULTS = {
  scanEnabled: false, dryRun: true, autoSwitch: false, scanIntervalMinutes: 5,
  minRating: 0, minReviews: 0, priceCap: 0, preserveMaxPrice: true,
  saveMode: "manual", autoFillMaxPrice: true, proactiveScan: false,
  reoptimizeHours: 0, minSavingsPercent: 5, cooldownHours: 24, autoSwitchBatchSize: 5,
  weights: { price: 40, connection: 30, sla: 20, stock: 10 },
  maxPriceOffset: 0
};
const secureHeaders = {
  "cache-control": "no-store", "x-content-type-options": "nosniff",
  "referrer-policy": "no-referrer", "x-frame-options": "DENY"
};
function reply(value, status = 200) {
  return Response.json(value, { status, headers: { ...secureHeaders, "content-security-policy": "default-src 'none'; frame-ancestors 'none'" } });
}
function failure(error, status = 400) {
  return reply({ ok: false, error: error instanceof Error ? error.message : String(error) }, status);
}
function bounded(value, min, max, fallback = min) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback;
}
function bool(v) { return v === true || v === 1 || v === "true"; }
function str(v) { return String(v ?? "").trim(); }
function domainAllowed(host) { return host.toLowerCase() === "member.digiflazz.com"; }
function hostUrl(value) {
  const u = new URL(value);
  if (u.protocol !== "https:" || !domainAllowed(u.hostname)) throw Error("Alamat Digiflazz tidak sah.");
  return u;
}
async function getJson(req) {
  if (!req.headers.get("content-type")?.startsWith("application/json")) throw Error("Gunakan JSON.");
  const s = await req.text();
  if (s.length > 100000) throw Error("Permintaan terlalu besar.");
  return JSON.parse(s || "{}");
}
function fromBase64(s) {
  const data = atob(s.replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(data, x => x.charCodeAt(0));
}
function toBase64(bytes) { return btoa(String.fromCharCode(...bytes)); }
async function sessionKey(secret) {
  const hash = await crypto.subtle.digest("SHA-256", encoder.encode(secret));
  return crypto.subtle.importKey("raw", hash, "AES-GCM", false, ["encrypt", "decrypt"]);
}
async function seal(data, secret) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const cipher = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, await sessionKey(secret), encoder.encode(JSON.stringify(data)));
  return { encrypted: toBase64(new Uint8Array(cipher)), iv: toBase64(iv) };
}
async function unseal(row, secret) {
  const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv: fromBase64(row.iv) }, await sessionKey(secret), fromBase64(row.encrypted_payload));
  return JSON.parse(decoder.decode(plain));
}
function option(source, name) {
  const clean = name.replace(/[.*+?^$()|[\]\\]/g, "\\$&");
  const m = source.match(new RegExp("(?:^|\\s)" + clean + "\\s+(?:'([^']*)'|\"([^\"]*)\"|(\\S+))", "i"));
  return m ? m[1] || m[2] || m[3] || null : null;
}
function parseCurl(value) {
  const source = str(value).replace(/\\\r?\n/g, " ");
  if (!/^curl\s/i.test(source) || source.length > 100000) throw Error("Masukkan cURL GET dari Digiflazz.");
  const m = source.match(/['"](https:\/\/[^'"]+)['"]/) || source.match(/\b(https:\/\/[^\s]+)/);
  if (!m) throw Error("URL HTTPS tidak ditemukan.");
  const url = hostUrl(m[1]);
  const method = str(option(source, "-X") || option(source, "--request") || "GET").toUpperCase();
  if (!["GET", "HEAD"].includes(method)) throw Error("Gunakan request GET/HEAD.");
  const allowed = new Set(["cookie", "x-csrf-token", "x-xsrf-token", "user-agent", "accept", "x-requested-with"]);
  const headers = {};
  for (const h of source.matchAll(/(?:^|\s)(?:-H|--header)\s+(?:'([^']*)'|"([^"]*)")/gi)) {
    const raw = h[1] || h[2] || "";
    const at = raw.indexOf(":");
    if (at > 0) {
      const name = raw.slice(0, at).trim().toLowerCase();
      if (allowed.has(name)) headers[name] = raw.slice(at + 1).trim();
    }
  }
  headers.cookie ||= option(source, "-b") || option(source, "--cookie");
  if (!headers.cookie) throw Error("Cookie sesi tidak ditemukan.");
  return { url: url.toString(), method, headers, capturedAt: new Date().toISOString() };
}
async function authorize(request, env) {
  if (!env.ACCESS_AUD || !env.ACCESS_TEAM_DOMAIN) return false;
  const jwt = request.headers.get("cf-access-jwt-assertion");
  if (!jwt) return false;
  const parts = jwt.split(".");
  if (parts.length !== 3) return false;
  try {
    const header = JSON.parse(decoder.decode(fromBase64(parts[0])));
    const payload = JSON.parse(decoder.decode(fromBase64(parts[1])));
    if (!Array.isArray(payload.aud) || !payload.aud.includes(env.ACCESS_AUD) || payload.exp <= Math.floor(Date.now() / 1000)) return false;
    const certUrl = "https://" + env.ACCESS_TEAM_DOMAIN + "/cdn-cgi/access/certs";
    if (!globalThis.__accessCertCache || globalThis.__accessCertCache.expires < Date.now()) {
      const certs = await fetch(certUrl).then(r => r.json());
      globalThis.__accessCertCache = { keys: certs.keys || [], expires: Date.now() + 600000 };
    }
    const certs = globalThis.__accessCertCache;
    const jwk = certs.keys?.find(k => k.kid === header.kid);
    if (!jwk || !["RS256", "ES256"].includes(header.alg)) return false;
    const algorithm = header.alg === "RS256" ? { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" } : { name: "ECDSA", namedCurve: "P-256" };
    const key = await crypto.subtle.importKey("jwk", jwk, algorithm, false, ["verify"]);
    const verifyParams = header.alg === "ES256" ? { name: "ECDSA", hash: "SHA-256" } : algorithm;
    return crypto.subtle.verify(verifyParams, key, fromBase64(parts[2]), encoder.encode(parts[0] + "." + parts[1]));
  } catch { return false; }
}
async function conn(env) {
  return env.DB.prepare("SELECT encrypted_payload,iv,source_host,last_test_status,last_test_at,updated_at FROM digiflazz_connections WHERE id=1").first();
}
async function remote(env, path, htmlRequest = false) {
  const row = await conn(env);
  if (!row || !env.SESSION_ENCRYPTION_KEY) throw Error("Sesi Digiflazz belum terhubung.");
  const session = await unseal(row, env.SESSION_ENCRYPTION_KEY);
  const target = hostUrl("https://member.digiflazz.com" + path);
  const headers = { ...session.headers, accept: htmlRequest ? "text/html,application/xhtml+xml" : "application/json" };
  delete headers.host;
  if (htmlRequest) delete headers["x-requested-with"];
  const res = await fetch(target, { method: "GET", headers, redirect: "manual", signal: AbortSignal.timeout(20000) });
  if (res.status === 401 || res.status === 403 || (res.status >= 300 && res.status < 400)) throw Error("Sesi Digiflazz kedaluwarsa atau ditolak (HTTP " + res.status + ").");
  if (!res.ok) throw Error("Digiflazz mengembalikan HTTP " + res.status + " untuk " + target.pathname);
  return res;
}
async function remoteJson(env, path) {
  const res = await remote(env, path);
  if (!res.headers.get("content-type")?.includes("json")) throw Error("Digiflazz tidak mengembalikan JSON untuk " + path);
  return res.json();
}
async function remoteSave(env, body) {
  const row = await conn(env);
  if (!row || !env.SESSION_ENCRYPTION_KEY) throw Error("Sesi Digiflazz belum terhubung.");
  const session = await unseal(row, env.SESSION_ENCRYPTION_KEY);
  const headers = { ...session.headers, accept:"application/json", "content-type":"application/json", origin:"https://member.digiflazz.com", referer:"https://member.digiflazz.com/buyer-area" };
  delete headers.host;
  // A save is never retried: an ambiguous response must be inspected first.
  const res = await fetch("https://member.digiflazz.com/api/v1/buyer/product", { method:"POST", headers, body:JSON.stringify(body), redirect:"manual", signal:AbortSignal.timeout(20000) });
  if (!res.ok) throw Error("Digiflazz menolak perubahan produk (HTTP " + res.status + ").");
  if (!res.headers.get("content-type")?.includes("json")) throw Error("Respons perubahan produk bukan JSON; periksa produk di Digiflazz.");
  const data = await res.json();
  if (data.status === false || data.success === false || data.error) throw Error("Digiflazz tidak menerima perubahan produk.");
  return data;
}
function listOf(obj, keys) {
  if (Array.isArray(obj)) return obj;
  for (const k of keys) {
    const parts = k.split(".");
    const v = parts.reduce((a, p) => a?.[p], obj);
    if (Array.isArray(v)) return v;
  }
  return null;
}
function normalizeProduct(x) {
  const sku = str(x.buyer_sku_code || x.code || x.buyerSkuCode || x.sku || (x.id ? "ID:"+x.id : ""));
  if (!sku) return null;
  const seller = x.seller || x.supplier || {};
  const product = typeof x.product_details === "object" ? x.product_details : typeof x.product === "object" ? x.product : {};
  return {
    sku, product_id: str(x.id ?? x.product_id ?? product.id),
    name: str(x.product_name ?? x.name ?? (typeof x.product==="string" ? x.product : null) ?? product.name ?? sku),
    category: str(x.category?.name ?? product.category?.name ?? x.category ?? product.category),
    brand: str(x.brand?.name ?? product.brand?.name ?? x.brand ?? product.brand),
    product_type: str(x.type?.name ?? product.type?.name ?? x.type ?? product.type),
    seller_id: str(x.seller_id ?? seller.id ?? x.supplier_id),
    seller_name: str(x.seller_name ?? seller.name ?? (typeof x.seller==="string" ? x.seller : null) ?? x.supplier_name),
    price: bounded(x.price ?? x.seller_price ?? x.cost, 0, 1000000000, 0),
    max_price: bounded(x.max_price ?? x.maxPrice, 0, 1000000000, 0),
    active: bool(x.buyer_product_status ?? x.status ?? x.is_active) ? 1 : 0,
    seller_active: x.status_sellerSku != null ? (Number(x.status_sellerSku) <= 0 ? 0 : 1) : bool(x.seller_product_status ?? seller.active ?? x.is_seller_active ?? true) ? 1 : 0,
    stock: x.stock == null ? null : bounded(x.stock, 0, 1000000000, 0),
    unlimited_stock: bool(x.unlimited_stock ?? x.unlimitedStock) ? 1 : 0,
    end_cut_off: str(x.end_cut_off ?? seller.end_cut_off),
    raw: JSON.stringify(x).slice(0, 40000)
  };
}
function normalizeSeller(x) {
  const id = str(x.id ?? x.seller_id ?? x.company_id ?? x.name ?? x.seller_name);
  if (!id) return null;
  return {
    seller_id: id, name: str(x.company_name ?? x.seller_name ?? x.name ?? id),
    rating: x.review_avg == null && x.rating == null ? null : bounded(x.review_avg ?? x.rating, 0, 5, 0),
    review_count: x.review_count == null ? null : bounded(x.review_count, 0, 10000000),
    product_count: x.product_count == null ? null : bounded(x.product_count, 0, 10000000),
    invoice: x.tax_invoice == null ? null : bool(x.tax_invoice) ? 1 : 0,
    raw: JSON.stringify(x).slice(0, 20000)
  };
}
async function log(env, level, kind, message, sku = null) {
  await env.DB.prepare("INSERT INTO events(level,kind,sku,message) VALUES(?,?,?,?)").bind(level, kind, sku, String(message).slice(0, 400)).run();
}
async function settings(env) {
  const rows = await env.DB.prepare("SELECT key,value FROM app_settings").all();
  const values = { ...DEFAULTS };
  for (const r of rows.results) {
    if (r.key in DEFAULTS) {
      try { values[r.key] = JSON.parse(r.value); } catch {}
    }
  }
  return values;
}
function validateSettings(input, current) {
  const next = { ...current };
  for (const [key, value] of Object.entries(input)) {
    if (!(key in DEFAULTS)) continue;
    if (["scanEnabled","dryRun","autoSwitch","preserveMaxPrice","autoFillMaxPrice","proactiveScan"].includes(key)) next[key] = bool(value);
    else if (key === "maxPriceOffset") {
      if(!Number.isSafeInteger(Number(value))||Number(value)<0||Number(value)>1000000000)throw Error("Tambahan max price harus angka rupiah bulat antara 0 dan 1 miliar.");
      next[key]=Number(value);
    } else if (["minRating","minReviews","priceCap","scanIntervalMinutes","reoptimizeHours","minSavingsPercent","cooldownHours","autoSwitchBatchSize"].includes(key)) {
      const limits = {minRating:[0,5],minReviews:[0,100000],priceCap:[0,1000000000],scanIntervalMinutes:[5,1440],reoptimizeHours:[0,720],minSavingsPercent:[0,100],cooldownHours:[1,720],autoSwitchBatchSize:[1,10]};
      next[key] = bounded(value, ...limits[key], current[key]);
    } else if (key === "saveMode" && ["manual","auto"].includes(value)) next[key] = value;
    else if (key === "weights") {
      const w = Object.fromEntries(["price","connection","sla","stock"].map(k => [k, bounded(value?.[k],0,100,0)]));
      if (Object.values(w).reduce((a,b)=>a+b,0) !== 100) throw Error("Total bobot harus 100%.");
      next.weights = w;
    }
  }
  return next;
}
async function scan(env, reason = "manual") {
  const created = await env.DB.prepare("INSERT INTO scan_runs(status) VALUES('running')").run();
  const runId = created.meta.last_row_id;
  try {
    const catalog = await remoteJson(env, "/api/v1/buyer/product/category");
    const categories = listOf(catalog, ["data", "data.data", "categories"]);
    if (!categories) throw Error("Format kategori Digiflazz belum dikenali.");
    const items = [];
    for (const category of categories) {
      const id = str(category.id);
      if (!id || !/^[a-zA-Z0-9_-]{1,80}$/.test(id)) continue;
      const response = await remoteJson(env, "/api/v1/buyer/product/category/" + encodeURIComponent(id) + "/");
      const members = listOf(response, ["data", "data.data", "products"]);
      if (!members) throw Error("Format produk kategori " + id + " belum dikenali.");
      for (const member of members) items.push(member);
    }
    const products = items.map(normalizeProduct).filter(Boolean);
    if (items.length && !products.length) throw Error("Data produk tidak memiliki SKU yang dikenali.");
    let issues = 0;
    for (let i=0;i<products.length;i+=100) {
      const chunk = products.slice(i,i+100);
      const old = await env.DB.prepare("SELECT sku,price,seller_name,active FROM products WHERE sku IN (" + chunk.map(()=>"?").join(",") + ")").bind(...chunk.map(x=>x.sku)).all();
      const before = new Map(old.results.map(x=>[x.sku,x]));
      const queries = [];
      for (const p of chunk) {
        const previous = before.get(p.sku);
        const problem = !p.seller_name || !p.seller_active || (p.max_price > 0 && p.price > p.max_price) || (!p.unlimited_stock && p.stock === 0);
        if (problem) issues++;
        queries.push(env.DB.prepare("INSERT INTO products(sku,product_id,name,category,brand,product_type,seller_id,seller_name,price,max_price,active,seller_active,stock,unlimited_stock,end_cut_off,raw,last_seen) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,CURRENT_TIMESTAMP) ON CONFLICT(sku) DO UPDATE SET product_id=excluded.product_id,name=excluded.name,category=excluded.category,brand=excluded.brand,product_type=excluded.product_type,seller_id=excluded.seller_id,seller_name=excluded.seller_name,price=excluded.price,max_price=excluded.max_price,active=excluded.active,seller_active=excluded.seller_active,stock=excluded.stock,unlimited_stock=excluded.unlimited_stock,end_cut_off=excluded.end_cut_off,raw=excluded.raw,last_seen=CURRENT_TIMESTAMP").bind(p.sku,p.product_id,p.name,p.category,p.brand,p.product_type,p.seller_id,p.seller_name,p.price,p.max_price,p.active,p.seller_active,p.stock,p.unlimited_stock,p.end_cut_off,p.raw));
        if (previous && previous.price !== p.price) {
          queries.push(env.DB.prepare("INSERT INTO price_history(buyer_sku_code,seller_name,price) VALUES(?,?,?)").bind(p.sku,p.seller_name,p.price));
          queries.push(env.DB.prepare("INSERT INTO events(level,kind,sku,message) VALUES('INFO','price',?,?)").bind(p.sku,"Harga berubah Rp"+previous.price+" → Rp"+p.price));
        }
        if (previous && previous.seller_name !== p.seller_name) queries.push(env.DB.prepare("INSERT INTO events(level,kind,sku,message) VALUES('INFO','seller',?,?)").bind(p.sku,"Seller berubah: "+(previous.seller_name||"—")+" → "+(p.seller_name||"—")));
        const embedded = listOf(JSON.parse(p.raw), ["sellers","suppliers","seller_products","alternatives"]);
        if (embedded) for (const raw of embedded.slice(0,100)) {
          const s = normalizeSeller(raw); if (!s) continue;
          const price = bounded(raw.price,0,1000000000);
          queries.push(env.DB.prepare("INSERT INTO seller_options(sku,seller_id,seller_name,price,rating,stock,unlimited_stock,connection,sla,description,raw,last_seen) VALUES(?,?,?,?,?,?,?,?,?,?,?,CURRENT_TIMESTAMP) ON CONFLICT(sku,seller_id) DO UPDATE SET seller_name=excluded.seller_name,price=excluded.price,rating=excluded.rating,stock=excluded.stock,unlimited_stock=excluded.unlimited_stock,connection=excluded.connection,sla=excluded.sla,description=excluded.description,raw=excluded.raw,last_seen=CURRENT_TIMESTAMP").bind(p.sku,s.seller_id,s.name,price,s.rating,raw.stock??null,bool(raw.unlimited_stock)?1:0,str(raw.connection),str(raw.sla),str(raw.desc??raw.description),JSON.stringify(raw).slice(0,20000)));
        }
      }
      for (let j=0;j<queries.length;j+=80) await env.DB.batch(queries.slice(j,j+80));
    }
    try {
      const sd = await remoteJson(env, "/api/v1/buyer/seller");
      const sellers = listOf(sd,["data.data","data.sellers","data","sellers","result.data","result"]) || [];
      const stmts = sellers.map(normalizeSeller).filter(Boolean).map(x=>env.DB.prepare("INSERT INTO sellers(seller_id,name,rating,review_count,product_count,invoice,raw,last_seen) VALUES(?,?,?,?,?,?,?,CURRENT_TIMESTAMP) ON CONFLICT(seller_id) DO UPDATE SET name=excluded.name,rating=excluded.rating,review_count=excluded.review_count,product_count=excluded.product_count,invoice=excluded.invoice,raw=excluded.raw,last_seen=CURRENT_TIMESTAMP").bind(x.seller_id,x.name,x.rating,x.review_count,x.product_count,x.invoice,x.raw));
      for(let i=0;i<stmts.length;i+=80) await env.DB.batch(stmts.slice(i,i+80));
    } catch (error) { await log(env,"WARN","sellers",error.message); }
    const sellerStmts = [...new Set(products.map(x=>x.seller_name).filter(Boolean))].map(name=>env.DB.prepare("INSERT INTO sellers(seller_id,name,raw) VALUES(?,?,?) ON CONFLICT(seller_id) DO NOTHING").bind(name,name,"{}"));
    for (let i=0;i<sellerStmts.length;i+=80) await env.DB.batch(sellerStmts.slice(i,i+80));
    await env.DB.prepare("UPDATE scan_runs SET status='success',finished_at=CURRENT_TIMESTAMP,total=?,issues=?,message=? WHERE id=?").bind(products.length,issues,reason,runId).run();
    await log(env,"INFO","scan",products.length+" produk dipindai; "+issues+" perlu perhatian.");
    return { ok:true,total:products.length,issues };
  } catch (error) {
    await env.DB.prepare("UPDATE scan_runs SET status='error',finished_at=CURRENT_TIMESTAMP,message=? WHERE id=?").bind(error.message,runId).run();
    await log(env,"ERROR","scan",error.message);
    throw error;
  }
}
function rank(product, rows, prefs, rule, config, zone) {
  const blocked = new Set(prefs.filter(p=>p.mode==="blocked").map(p=>p.seller_name.toLowerCase()));
  const preferred = new Set(prefs.filter(p=>p.mode==="preferred").map(p=>p.seller_name.toLowerCase()));
  const hasHealthState = Object.prototype.hasOwnProperty.call(product,"seller_name") || Object.prototype.hasOwnProperty.call(product,"seller_active") || Object.prototype.hasOwnProperty.call(product,"stock");
  const unhealthy = hasHealthState && (!product.seller_name || product.seller_active === 0 || (product.max_price > 0 && product.price > product.max_price) || (!product.unlimited_stock && product.stock === 0));
  const max = Math.min(...[rule?.max_price, unhealthy ? 0 : product.max_price, config.priceCap].filter(x=>Number(x)>0).map(Number), Infinity);
  const minRating = rule?.min_rating ?? config.minRating;
  return rows.map(x => {
    const reasons = [];
    const name = x.seller_name.toLowerCase();
    if (blocked.has(name)) reasons.push("Seller diblokir");
    if (!x.price || (x.seller_status != null && Number(x.seller_status) !== 1)) reasons.push("Seller tidak aktif");
    if (x.price > max) reasons.push("Harga di atas batas");
    if (minRating > 0 && (x.rating == null || Number(x.rating) < minRating)) reasons.push("Rating kurang atau tidak tersedia");
    const count = /^\d+/.exec(String(x.review_count || ""));
    if (config.minReviews > 0 && (!count || String(x.review_count).startsWith("<") || Number(count[0]) < config.minReviews)) reasons.push("Ulasan kurang atau tidak tersedia");
    if (rule?.require_stock !== 0 && x.stock != null && !x.unlimited_stock && !(x.stock > 0)) reasons.push("Stok habis");
    if (rule?.avoid_cutoff !== 0 && x.end_cut_off && x.end_cut_off !== "00:00") {
      const now = new Date();
      const clock = new Intl.DateTimeFormat("en-GB",{hour:"2-digit",minute:"2-digit",hour12:false,timeZone:"Asia/Jakarta"}).format(now);
      if (clock >= x.end_cut_off) reasons.push("Lewat cut-off");
    }
    if (zone && !zone.patterns.every(p=>String(x.description||"").toLowerCase().includes(p.toLowerCase()))) reasons.push("Zona tidak cocok");
    const peers = rows.map(s=>s.price).filter(n=>n>0), low=Math.min(...peers);
    const price = x.price>0 && Number.isFinite(low) ? 100*low/x.price : 0;
    const connection = /ip/i.test(x.connection) ? 100 : /h2h/i.test(x.connection) ? 70 : 50;
    const sla = /h\+?0/i.test(x.sla) ? 100 : /h\+?1/i.test(x.sla) ? 60 : 30;
    const stock = x.unlimited_stock || x.stock > 0 ? 100 : 0;
    const w=config.weights;
    const score = Math.round(price*w.price/100+connection*w.connection/100+sla*w.sla/100+stock*w.stock/100+(x.rating||0)*3+(preferred.has(name)?20:0));
    return { ...x, eligible:!reasons.length, reasons, score };
  }).sort((a,b)=>Number(b.eligible)-Number(a.eligible)||b.score-a.score||a.price-b.price);
}
async function refreshOptions(env, sku, productId) {
  if (!productId || !/^[a-zA-Z0-9_-]{1,80}$/.test(productId)) return 0;
  const response = await remoteJson(env, "/api/v1/buyer/product/seller/" + encodeURIComponent(productId));
  const choices = listOf(response, ["data", "data.data", "sellers"]);
  if (!choices) throw Error("Format alternatif seller belum dikenali.");
  const cmds = choices.map(x => {
    const id = str(x.id ?? x.seller_sku_id);
    if (!id) return null;
    const name = str(x.seller ?? x.seller_name ?? x.seller_details?.company_name ?? id);
    return env.DB.prepare("INSERT INTO seller_options(sku,seller_id,seller_name,price,rating,stock,unlimited_stock,connection,sla,description,raw,last_seen) VALUES(?,?,?,?,?,?,?,?,?,?,?,CURRENT_TIMESTAMP) ON CONFLICT(sku,seller_id) DO UPDATE SET seller_name=excluded.seller_name,price=excluded.price,rating=excluded.rating,stock=excluded.stock,unlimited_stock=excluded.unlimited_stock,connection=excluded.connection,sla=excluded.sla,description=excluded.description,raw=excluded.raw,last_seen=CURRENT_TIMESTAMP").bind(sku,id,name,bounded(x.price,0,1000000000),x.reviewAvg ?? x.seller_details?.review_avg ?? x.review_avg ?? null,x.stock??null,bool(x.unlimited_stock)?1:0,str(x.connectionType??x.connection),str(x.seller_details?.sla??x.sla),str(x.deskripsi??x.description),JSON.stringify(x).slice(0,20000));
  }).filter(Boolean);
  for (let i=0;i<cmds.length;i+=80) await env.DB.batch(cmds.slice(i,i+80));
  return cmds.length;
}
async function rankedOptions(env, sku, refresh = true) {
  const entry = await env.DB.prepare("SELECT product_id FROM products WHERE sku=?").bind(sku).first();
  if (!entry) throw Error("Produk tidak ditemukan.");
  if (refresh) await refreshOptions(env, sku, entry.product_id);
  const [product, options, preferences, rule, zone, config] = await Promise.all([
    env.DB.prepare("SELECT p.*,l.buyer_sku_code IS NOT NULL AS locked FROM products p LEFT JOIN product_locks l ON l.buyer_sku_code=p.sku WHERE p.sku=?").bind(sku).first(),
    env.DB.prepare("SELECT sku,seller_id,seller_name,price,rating,stock,unlimited_stock,connection,sla,description,json_extract(raw,'$.rating_qty') AS review_count,json_extract(raw,'$.status_sellerSku') AS seller_status,json_extract(raw,'$.end_cut_off') AS end_cut_off,raw FROM seller_options WHERE sku=?").bind(sku).all(),
    env.DB.prepare("SELECT seller_name,mode FROM seller_preferences").all(),
    env.DB.prepare("SELECT * FROM seller_rules WHERE is_active=1 AND (scope_type='global' OR (scope_type='product' AND scope_value=?) OR (scope_type='brand' AND scope_value=(SELECT brand FROM products WHERE sku=?)) OR (scope_type='category' AND scope_value=(SELECT category FROM products WHERE sku=?)) OR (scope_type='type' AND scope_value=(SELECT product_type FROM products WHERE sku=?))) ORDER BY CASE scope_type WHEN 'product' THEN 0 WHEN 'type' THEN 1 WHEN 'brand' THEN 2 WHEN 'category' THEN 3 ELSE 4 END,id DESC LIMIT 1").bind(sku,sku,sku,sku).first(),
    env.DB.prepare("SELECT z.patterns FROM zones z JOIN zone_assignments a ON a.zone_id=z.id WHERE a.sku=?").bind(sku).first(),settings(env)
  ]);
  return { product, config, options:rank(product, options.results, preferences.results, rule, config, zone?{patterns:JSON.parse(zone.patterns)}:null) };
}
async function freshProduct(env, sku) {
  const result = await remoteJson(env,"/api/v1/buyer/product/search/sku/" + encodeURIComponent(sku));
  const rows = listOf(result,["data","data.data","products"]);
  if (!rows) throw Error("Digiflazz tidak mengembalikan daftar produk terbaru.");
  const row = rows.find(x=>normalizeProduct(x)?.sku === sku);
  if (!row) throw Error("SKU tidak ditemukan pada data terbaru Digiflazz.");
  return row;
}
function serviceCode(game,product) {
  const name=str(game).normalize("NFKD").replace(/[\u0300-\u036f]/g,"").toUpperCase();
  const title=str(product).normalize("NFKD").replace(/[\u0300-\u036f]/g,"").toUpperCase();
  const gameName=name||title.replace(/\d[\d.,]*.*$/,"").trim();
  const aliases=[[/\bMOBILE\s+LEGENDS\b/,"ML"],[/\bFREE\s+FIRE\b/,"FF"],[/\bPUBG\s+MOBILE\b/,"PUBG"],[/\bCALL\s+OF\s+DUTY\s+MOBILE\b/,"CODM"]];
  const prefix=aliases.find(([pattern])=>pattern.test(gameName))?.[1] || gameName.split(/[^A-Z0-9]+/).filter(x=>x && !["GAME","TOP","UP"].includes(x)).slice(0,4).map(x=>x[0]).join("");
  const withoutGame=name&&title.startsWith(name)?title.slice(name.length):title;
  const amount=withoutGame.match(/(?:^|[^A-Z0-9])(\d{1,3}(?:[.,]\d{3})+|\d+)(?=[^0-9]|$)/)?.[1]?.replace(/[.,]/g,"");
  const value=Number(amount);
  if(!prefix||!Number.isSafeInteger(value)||value<1)return null;
  return prefix+String(value);
}
function changedProduct(current, choice, preserveMaxPrice=true, maxPriceOffset=0, preserveHigherMax=false) {
  const updated = { ...current };
  for (const [field, value] of Object.entries({
    seller:choice.seller,seller_sku_id:choice.id ?? choice.seller_sku_id,seller_sku_id_int:choice.id_int ?? choice.seller_sku_id_int,
    seller_connection_type:choice.connectionType,seller_sku_code:choice.seller_sku_code,
    seller_sku_desc:choice.deskripsi,price:choice.price,stock:choice.stock,
    unlimited_stock:choice.unlimited_stock,seller_details:choice.seller_details,
    status_sellerSku:choice.status_sellerSku,faktur:choice.faktur,
    start_cut_off:choice.start_cut_off,end_cut_off:choice.end_cut_off,
    multi:choice.connectionType!=="jabber"&&choice.multi,multi_counter:choice.multi_counter,
    change:true
  })) if (value !== undefined) updated[field] = value;
  if (!preserveMaxPrice) {
    const max=Number(choice.price)+Number(maxPriceOffset);
    if(!Number.isSafeInteger(max)||max<1||max>1000000000) throw Error("Harga maksimum hasil penambahan tidak valid.");
    updated.max_price=preserveHigherMax?Math.max(Number(updated.max_price)||0,max):max;
  }
  return updated;
}
async function switchSeller(env, sku, sellerId, reason) {
  const {product,config,options} = await rankedOptions(env,sku);
  if (reason === "auto" && (product.locked || !config.autoSwitch || config.dryRun)) throw Error("Perpindahan otomatis sedang nonaktif atau produk terkunci.");
  const candidate=options.find(x=>x.seller_id===sellerId);
  if (!candidate || !candidate.eligible) throw Error("Seller tujuan tidak memenuhi aturan harga, rating, stok, atau status.");
  const current = await freshProduct(env,sku);
  const cached = JSON.parse(product.raw);
  if (String(current.seller_sku_id) !== String(cached.seller_sku_id) || Number(current.price)!==Number(product.price)) throw Error("Produk berubah di Digiflazz. Pindai ulang sebelum memindahkan seller.");
  if (String(current.seller_sku_id)===sellerId) throw Error("Seller ini sudah dipakai produk.");
  const recent=await env.DB.prepare("SELECT created_at FROM switch_history WHERE buyer_sku_code=? AND status='success' ORDER BY id DESC LIMIT 1").bind(sku).first();
  if (reason==="auto" && recent && Date.now()-Date.parse(recent.created_at.replace(" ","T")+"Z") < config.cooldownHours*3600000) throw Error("Produk masih dalam masa jeda perpindahan.");
  const choice = JSON.parse(candidate.raw);
  const choiceId=String(choice.id ?? choice.seller_sku_id ?? "");
  if (choiceId!==sellerId || (choice.status_sellerSku != null && Number(choice.status_sellerSku)!==1) || Number(choice.price)!==candidate.price) throw Error("Data kandidat seller tidak konsisten.");
  const acquired=await env.DB.prepare("INSERT INTO switch_operations(sku,status,target_seller_id) VALUES(?,'pending',?) ON CONFLICT(sku) DO UPDATE SET status='pending',target_seller_id=excluded.target_seller_id,started_at=CURRENT_TIMESTAMP WHERE switch_operations.status IN ('success','error') AND switch_operations.started_at < datetime('now','-30 seconds')").bind(sku,sellerId).run();
  if (!acquired.meta.changes) throw Error("Ada perpindahan yang masih diproses atau perlu diperiksa untuk SKU ini.");
  const record=await env.DB.prepare("INSERT INTO switch_history(buyer_sku_code,from_seller,to_seller,reason,previous_price,new_price,status) VALUES(?,?,?,?,?,?,'pending')").bind(sku,String(current.seller||product.seller_name),candidate.seller_name,reason,Number(current.price),candidate.price).run();
  let sent=false;
  try {
    // Set before the network call: a lost response may still mean Digiflazz saved the change.
    sent=true;
    await remoteSave(env,changedProduct(current,choice,config.preserveMaxPrice && !config.autoFillMaxPrice,config.maxPriceOffset,config.preserveMaxPrice && config.autoFillMaxPrice));
    const verified=await freshProduct(env,sku);
    if (String(verified.seller_sku_id)!==sellerId) throw Error("Respons simpan diterima, tetapi seller baru belum terkonfirmasi.");
    await env.DB.batch([
      env.DB.prepare("UPDATE switch_history SET status='success' WHERE id=?").bind(record.meta.last_row_id),
      env.DB.prepare("UPDATE switch_operations SET status='success' WHERE sku=?").bind(sku)
    ]);
    await log(env,"INFO","switch","Seller dipindahkan dan dikonfirmasi di Digiflazz: "+candidate.seller_name,sku);
    return {ok:true,sku,seller:candidate.seller_name,price:candidate.price,verified:true};
  } catch(error) {
    const status=sent?"unknown":"error";
    await env.DB.batch([
      env.DB.prepare("UPDATE switch_history SET status=? WHERE id=?").bind(status,record.meta.last_row_id),
      env.DB.prepare("UPDATE switch_operations SET status=? WHERE sku=?").bind(status,sku)
    ]);
    await log(env,"ERROR","switch",error.message+" Tidak diulang otomatis.",sku);
    throw error;
  }
}
async function autoSwitchBatch(env, requestedLimit) {
  const cfg=await settings(env);
  if(!cfg.autoSwitch || cfg.dryRun) throw Error("Aktifkan Auto-switch dan matikan mode Pratinjau terlebih dahulu.");
  const verified=await env.DB.prepare("SELECT id FROM switch_history WHERE status='success' AND reason='manual' LIMIT 1").first();
  if(!verified) throw Error("Lakukan satu perpindahan seller manual yang berhasil sebelum menjalankan auto-switch.");
  const limit=Math.trunc(bounded(requestedLimit,1,10,cfg.autoSwitchBatchSize));
  const targets=await env.DB.prepare("SELECT sku FROM products WHERE active=1 AND (seller_name='' OR seller_active=0 OR (max_price>0 AND price>max_price) OR (stock=0 AND unlimited_stock=0)) AND sku NOT IN (SELECT buyer_sku_code FROM product_locks) AND sku NOT IN (SELECT sku FROM switch_operations WHERE status IN ('pending','unknown')) ORDER BY last_seen ASC LIMIT ?").bind(limit).all();
  let switched=0,noCandidate=0,failed=0;
  const results=[];
  for(const {sku} of targets.results) {
    try {
      const selection=await rankedOptions(env,sku);
      const current=JSON.parse(selection.product.raw);
      const best=selection.options.find(o=>o.eligible && o.seller_id!==String(current.seller_sku_id));
      if(!best) {
        noCandidate++;
        await log(env,"WARN","auto-switch","Tidak ada kandidat seller yang memenuhi aturan.",sku);
        results.push({sku,status:"no_candidate"});
        continue;
      }
      const changed=await switchSeller(env,sku,best.seller_id,"auto");
      switched++;
      results.push({sku,status:"switched",seller:changed.seller,price:changed.price});
    } catch(error) {
      failed++;
      await log(env,"WARN","auto-switch",error.message,sku);
      results.push({sku,status:"error",error:error.message});
    }
  }
  return {ok:true,examined:targets.results.length,switched,noCandidate,failed,remainingPossible:targets.results.length===limit,results};
}

async function updateMaxPrice(env,sku,amount) {
  if (!Number.isSafeInteger(amount) || amount<1 || amount>1000000000) throw Error("Harga maksimum harus berupa angka positif.");
  const product=await env.DB.prepare("SELECT raw,price FROM products WHERE sku=?").bind(sku).first();
  if(!product) throw Error("Produk tidak ditemukan.");
  const fresh=await freshProduct(env,sku);
  if(String(fresh.seller_sku_id)!==String(JSON.parse(product.raw).seller_sku_id)||Number(fresh.price)!==product.price) throw Error("Produk berubah di Digiflazz. Pindai ulang dahulu.");
  const acquired=await env.DB.prepare("INSERT INTO switch_operations(sku,status,target_seller_id) VALUES(?,'pending',?) ON CONFLICT(sku) DO UPDATE SET status='pending',target_seller_id=excluded.target_seller_id,started_at=CURRENT_TIMESTAMP WHERE switch_operations.status IN ('success','error') AND switch_operations.started_at < datetime('now','-30 seconds')").bind(sku,"max:"+amount).run();
  if(!acquired.meta.changes) throw Error("Produk sedang diproses atau ada perubahan yang perlu diperiksa.");
  try {
    await remoteSave(env,{...fresh,max_price:amount,change:true});
    const verified=await freshProduct(env,sku);
    if(Number(verified.max_price)!==amount) throw Error("Harga maksimum belum terkonfirmasi di Digiflazz.");
    await env.DB.prepare("UPDATE switch_operations SET status='success' WHERE sku=?").bind(sku).run();
    await log(env,"INFO","max-price","Harga maksimum tersimpan: Rp"+amount,sku);
    return {ok:true,maxPrice:amount,verified:true};
  } catch(error) {
    await env.DB.prepare("UPDATE switch_operations SET status='unknown' WHERE sku=?").bind(sku).run();
    await log(env,"ERROR","max-price",error.message+" Tidak diulang otomatis.",sku);
    throw error;
  }
}
async function reconcile(env,sku) {
  const op=await env.DB.prepare("SELECT status,target_seller_id,started_at FROM switch_operations WHERE sku=?").bind(sku).first();
  if(!op || !["pending","unknown"].includes(op.status)) throw Error("Tidak ada perubahan tertunda untuk diperiksa.");
  if(op.status==="pending" && Date.now()-Date.parse(op.started_at.replace(" ","T")+"Z")<120000) throw Error("Permintaan masih diproses. Tunggu dua menit sebelum memeriksa ulang.");
  const fresh=await freshProduct(env,sku);
  const confirmed=op.target_seller_id.startsWith("max:")
    ? Number(fresh.max_price)===Number(op.target_seller_id.slice(4))
    : String(fresh.seller_sku_id)===op.target_seller_id;
  const status=confirmed?"success":"error";
  await env.DB.prepare("UPDATE switch_operations SET status=? WHERE sku=?").bind(status,sku).run();
  if(!op.target_seller_id.startsWith("max:")) await env.DB.prepare("UPDATE switch_history SET status=? WHERE id=(SELECT id FROM switch_history WHERE buyer_sku_code=? AND status IN ('pending','unknown') ORDER BY id DESC LIMIT 1)").bind(status,sku).run();
  await log(env,confirmed?"INFO":"WARN","reconcile",confirmed?"Perubahan terkonfirmasi di Digiflazz.":"Target tidak ditemukan pada data terbaru; periksa sebelum mengulang.",sku);
  return {ok:true,confirmed,status};
}
async function discover(env) {
  const res = await remote(env,"/buyer-area",true);
  const html = (await res.text()).slice(0,750000);
  const scripts = [...html.matchAll(/<script[^>]+src=["']([^"']+)["']/gi)].map(x=>x[1]).filter(x=>!x.startsWith("//")).slice(0,12);
  const found = new Set();
  for (const m of html.matchAll(/\/api\/v1\/buyer\/[a-zA-Z0-9_/$?{}.:+-]+/g)) found.add(m[0].slice(0,200));
  const title = (html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]||"").slice(0,100);
  let responseKeys = [];
  try { responseKeys = Object.keys(JSON.parse(html)); } catch {}
  const summary = { title, htmlBytes:html.length,contentType:res.headers.get("content-type"), responseKeys, scripts:scripts.map(s=>{try{return new URL(s,"https://member.digiflazz.com").pathname}catch{return s}}).slice(0,12) };
  await env.DB.prepare("INSERT INTO app_settings(key,value) VALUES('discovery_summary',?) ON CONFLICT(key) DO UPDATE SET value=excluded.value").bind(JSON.stringify(summary)).run();
  for (const src of scripts) {
    let target;
    try { target = new URL(src,"https://member.digiflazz.com"); hostUrl(target.toString()); } catch { continue; }
    try {
      const r = await remote(env,target.pathname+target.search);
      if (!/javascript|text\/plain/.test(r.headers.get("content-type")||"")) continue;
      const text = (await r.text()).slice(0,1500000);
      for (const m of text.matchAll(/\/api\/v1\/buyer\/[a-zA-Z0-9_/$?{}.:+-]+/g)) found.add(m[0].slice(0,200));
    } catch {}
  }
  const paths = [...found].slice(0,300);
  for (const path of paths) await env.DB.prepare("INSERT INTO api_discovery(route,source_url,context) VALUES(?,?,?) ON CONFLICT(route) DO NOTHING").bind(path,"https://member.digiflazz.com/buyer-area","script reference").run();
  await log(env,"INFO","discovery",paths.length+" jalur API ditemukan; halaman "+(title||"(tanpa judul)")+", "+scripts.length+" skrip.");
  return {ok:true,count:paths.length,paths,summary};
}
async function api(req, env, url) {
  const path=url.pathname, method=req.method;
  try {
    if (method==="GET" && path==="/api/health") {
      await env.DB.prepare("SELECT 1").first();
      return reply({ok:true,service:"digiflazz-tools"});
    }
    if (!await authorize(req,env)) return failure("Akses pribadi diperlukan.",401);
    if (method!=="GET" && method!=="HEAD" && req.headers.get("origin")!==url.origin) return failure("Asal permintaan tidak sah.",403);
    if (method==="GET" && path==="/api/bootstrap") {
      const [c, cfg, count, sellerCount, last, events]=await Promise.all([
        conn(env),settings(env),
        env.DB.prepare("SELECT count(*) total,sum(CASE WHEN seller_name='' OR seller_active=0 OR (max_price>0 AND price>max_price) OR (stock=0 AND unlimited_stock=0) THEN 1 ELSE 0 END) issues FROM products").first(),
        env.DB.prepare("SELECT count(*) total FROM sellers").first(),
        env.DB.prepare("SELECT * FROM scan_runs ORDER BY id DESC LIMIT 1").first(),
        env.DB.prepare("SELECT id,level,kind,sku,message,created_at FROM events ORDER BY id DESC LIMIT 8").all()
      ]);
      const verified=await env.DB.prepare("SELECT id FROM switch_history WHERE status='success' AND reason='manual' LIMIT 1").first();
      return reply({ok:true,connection:{connected:!!c,lastTestStatus:c?.last_test_status,lastTestAt:c?.last_test_at},settings:cfg,counts:{products:count.total,issues:count.issues||0,sellers:sellerCount.total},lastScan:last,events:events.results,liveSwitchAvailable:!!verified});
    }
    if (method==="GET" && path==="/api/connection/status") {
      const c=await conn(env);
      return reply({ok:true,connected:!!c,sourceHost:c?.source_host,lastTestStatus:c?.last_test_status,lastTestAt:c?.last_test_at,updatedAt:c?.updated_at});
    }
    if (method==="POST" && path==="/api/connection") {
      if (!env.SESSION_ENCRYPTION_KEY) return failure("Secret enkripsi belum terpasang.",503);
      const body=await getJson(req), data=parseCurl(body.curl), sealed=await seal(data,env.SESSION_ENCRYPTION_KEY);
      await env.DB.prepare("INSERT INTO digiflazz_connections(id,encrypted_payload,iv,source_host) VALUES(1,?,?,'member.digiflazz.com') ON CONFLICT(id) DO UPDATE SET encrypted_payload=excluded.encrypted_payload,iv=excluded.iv,last_test_status=NULL,last_test_at=NULL,updated_at=CURRENT_TIMESTAMP").bind(sealed.encrypted,sealed.iv).run();
      await log(env,"INFO","connection","Sesi Digiflazz diperbarui.");
      return reply({ok:true,saved:true});
    }
    if (method==="POST" && path==="/api/connection/test") {
      const c=await conn(env); if (!c) return failure("Belum ada sesi.",404);
      const data=await unseal(c,env.SESSION_ENCRYPTION_KEY);
      const target=hostUrl(data.url);
      const res=await fetch(target,{method:data.method,headers:data.headers,redirect:"manual",signal:AbortSignal.timeout(20000)});
      const good=res.status>=200&&res.status<300;
      await env.DB.prepare("UPDATE digiflazz_connections SET last_test_status=?,last_test_at=CURRENT_TIMESTAMP WHERE id=1").bind(res.status).run();
      return reply({ok:true,connected:good,httpStatus:res.status});
    }
    if (method==="DELETE" && path==="/api/connection") {
      await env.DB.prepare("DELETE FROM digiflazz_connections WHERE id=1").run();
      return reply({ok:true,disconnected:true});
    }
    if (method==="POST" && path==="/api/scan") return reply(await scan(env));
    if (method==="POST" && path==="/api/automation/run") {
      const body=await getJson(req);
      return reply(await autoSwitchBatch(env,body.limit));
    }
    if (method==="POST" && path==="/api/discover") return reply(await discover(env));
    if (method==="GET" && path==="/api/discover") {
      const rows=await env.DB.prepare("SELECT route FROM api_discovery ORDER BY route LIMIT 300").all();
      return reply({ok:true,routes:rows.results});
    }
    if (method==="GET" && path==="/api/products") {
      const page=bounded(url.searchParams.get("page"),1,100000,1);
      const q="%"+str(url.searchParams.get("q")).slice(0,80)+"%";
      const status=str(url.searchParams.get("status"));
      const where="WHERE (p.sku LIKE ? OR p.name LIKE ? OR p.brand LIKE ?)"+(status==="issues"?" AND (p.seller_name='' OR p.seller_active=0 OR (p.max_price>0 AND p.price>p.max_price) OR (p.stock=0 AND p.unlimited_stock=0))":status==="locked"?" AND p.sku IN (SELECT buyer_sku_code FROM product_locks)":"");
      const args=[q,q,q];
      const [n,rows]=await Promise.all([
        env.DB.prepare("SELECT count(*) total FROM products p "+where).bind(...args).first(),
        env.DB.prepare("SELECT p.sku,p.product_id,p.name,p.category,p.brand,p.product_type,p.seller_name,p.price,p.max_price,p.active,p.seller_active,p.stock,p.unlimited_stock,p.last_seen,l.buyer_sku_code IS NOT NULL AS locked FROM products p LEFT JOIN product_locks l ON l.buyer_sku_code=p.sku "+where+" ORDER BY p.last_seen DESC,p.name LIMIT 50 OFFSET ?").bind(...args,(page-1)*50).all()
      ]);
      return reply({ok:true,total:n.total,page,products:rows.results});
    }
    const opt=path.match(/^\/api\/products\/([^/]+)\/options$/);
    if (method==="GET" && opt) {
      const sku=decodeURIComponent(opt[1]);
      try { const d=await rankedOptions(env,sku);const op=await env.DB.prepare("SELECT status,target_seller_id FROM switch_operations WHERE sku=?").bind(sku).first();return reply({ok:true,product:{...d.product,raw:undefined,current_seller_sku_id:JSON.parse(d.product.raw).seller_sku_id},operation:op,options:d.options.map(({raw,...option})=>option),connectorReady:true}); }
      catch(error) { await log(env,"WARN","seller-options",error.message,sku); }
      const d=await rankedOptions(env,sku,false);
      return reply({ok:true,product:{...d.product,raw:undefined,current_seller_sku_id:JSON.parse(d.product.raw).seller_sku_id},options:d.options.map(({raw,...option})=>option),connectorReady:false});
    }
    const lock=path.match(/^\/api\/products\/([^/]+)\/lock$/);
    if(method==="POST"&&lock) {
      const sku=decodeURIComponent(lock[1]),body=await getJson(req);
      if(bool(body.locked)) await env.DB.prepare("INSERT INTO product_locks(buyer_sku_code,reason) VALUES(?,?) ON CONFLICT(buyer_sku_code) DO UPDATE SET reason=excluded.reason").bind(sku,str(body.reason)).run();
      else await env.DB.prepare("DELETE FROM product_locks WHERE buyer_sku_code=?").bind(sku).run();
      return reply({ok:true,locked:bool(body.locked)});
    }
    const change=path.match(/^\/api\/products\/([^/]+)\/switch$/);
    if(method==="POST"&&change) {
      const body=await getJson(req),sellerId=str(body.sellerId);
      if (!sellerId || sellerId.length>80) throw Error("Pilih seller yang tersedia.");
      return reply(await switchSeller(env,decodeURIComponent(change[1]),sellerId,"manual"));
    }
    const maxPrice=path.match(/^\/api\/products\/([^/]+)\/max-price$/);
    if(method==="POST"&&maxPrice) {
      const body=await getJson(req);
      return reply(await updateMaxPrice(env,decodeURIComponent(maxPrice[1]),Number(body.maxPrice)));
    }
    const pending=path.match(/^\/api\/products\/([^/]+)\/reconcile$/);
    if(method==="POST"&&pending)return reply(await reconcile(env,decodeURIComponent(pending[1])));
    if(method==="GET"&&path==="/api/sellers") {
      const rows=await env.DB.prepare("SELECT s.seller_id,s.name,s.rating,s.review_count,s.product_count,s.invoice,p.mode FROM sellers s LEFT JOIN seller_preferences p ON p.seller_name=s.name ORDER BY s.rating DESC,s.name LIMIT 1000").all();
      return reply({ok:true,sellers:rows.results});
    }
    const pref=path.match(/^\/api\/sellers\/([^/]+)\/preference$/);
    if(method==="POST"&&pref) {
      const body=await getJson(req), name=decodeURIComponent(pref[1]);
      if(!["preferred","blocked","none"].includes(body.mode))throw Error("Pilihan tidak valid.");
      await env.DB.prepare("DELETE FROM seller_preferences WHERE seller_name=?").bind(name).run();
      if(body.mode!=="none") await env.DB.prepare("INSERT INTO seller_preferences(seller_name,mode) VALUES(?,?)").bind(name,body.mode).run();
      return reply({ok:true,mode:body.mode});
    }
    if(method==="GET"&&path==="/api/rules") {
      const rows=await env.DB.prepare("SELECT * FROM seller_rules ORDER BY id DESC").all();
      return reply({ok:true,rules:rows.results});
    }
    if(method==="POST"&&path==="/api/rules") {
      const b=await getJson(req);
      if(!["global","category","brand","type","product"].includes(b.scope_type))throw Error("Cakupan tidak valid.");
      if(b.scope_type!=="global"&&!str(b.scope_value))throw Error("Target aturan wajib diisi.");
      const r=await env.DB.prepare("INSERT INTO seller_rules(scope_type,scope_value,min_rating,max_price,require_stock,avoid_cutoff) VALUES(?,?,?,?,?,?)").bind(b.scope_type,str(b.scope_value),b.min_rating==null?null:bounded(b.min_rating,0,5),b.max_price==null?null:bounded(b.max_price,0,1000000000),bool(b.require_stock)?1:0,bool(b.avoid_cutoff)?1:0).run();
      return reply({ok:true,id:r.meta.last_row_id});
    }
    const rule=path.match(/^\/api\/rules\/(\d+)$/);
    if(method==="DELETE"&&rule) {
      await env.DB.prepare("DELETE FROM seller_rules WHERE id=?").bind(Number(rule[1])).run();
      return reply({ok:true});
    }
    if(method==="GET"&&path==="/api/zones") {
      const rows=await env.DB.prepare("SELECT z.*,count(a.sku) assignments FROM zones z LEFT JOIN zone_assignments a ON a.zone_id=z.id GROUP BY z.id ORDER BY z.name").all();
      return reply({ok:true,zones:rows.results});
    }
    if(method==="POST"&&path==="/api/zones") {
      const b=await getJson(req),patterns=str(b.patterns).split(",").map(x=>x.trim()).filter(Boolean);
      if(!str(b.name)||!str(b.product_id)||!patterns.length)throw Error("Nama, product ID, dan pola zona wajib diisi.");
      const r=await env.DB.prepare("INSERT INTO zones(name,product_id,patterns) VALUES(?,?,?)").bind(str(b.name),str(b.product_id),JSON.stringify(patterns)).run();
      return reply({ok:true,id:r.meta.last_row_id});
    }
    const zone=path.match(/^\/api\/zones\/(\d+)$/);
    if(method==="DELETE"&&zone) {
      await env.DB.prepare("DELETE FROM zones WHERE id=?").bind(Number(zone[1])).run();
      return reply({ok:true});
    }
    if(method==="POST"&&path==="/api/zones/assign") {
      const b=await getJson(req);
      if(!str(b.sku))throw Error("SKU wajib diisi.");
      if(b.zone_id) await env.DB.prepare("INSERT INTO zone_assignments(sku,zone_id) VALUES(?,?) ON CONFLICT(sku) DO UPDATE SET zone_id=excluded.zone_id").bind(str(b.sku),Number(b.zone_id)).run();
      else await env.DB.prepare("DELETE FROM zone_assignments WHERE sku=?").bind(str(b.sku)).run();
      return reply({ok:true});
    }
    if(method==="GET"&&path==="/api/events") {
      const rows=await env.DB.prepare("SELECT id,level,kind,sku,message,created_at FROM events ORDER BY id DESC LIMIT 200").all();
      return reply({ok:true,events:rows.results});
    }
    if(method==="GET"&&path==="/api/history") {
      const [prices,switches,runs]=await Promise.all([
        env.DB.prepare("SELECT buyer_sku_code,seller_name,price,captured_at FROM price_history ORDER BY id DESC LIMIT 100").all(),
        env.DB.prepare("SELECT buyer_sku_code,from_seller,to_seller,reason,status,created_at FROM switch_history ORDER BY id DESC LIMIT 100").all(),
        env.DB.prepare("SELECT * FROM scan_runs ORDER BY id DESC LIMIT 50").all()
      ]);
      return reply({ok:true,prices:prices.results,switches:switches.results,runs:runs.results});
    }
    if(method==="GET"&&path==="/api/settings")return reply({ok:true,settings:await settings(env)});
    if(method==="POST"&&path==="/api/settings") {
      const current=await settings(env),next=validateSettings(await getJson(req),current);
      if (next.autoSwitch && !next.dryRun) {
        const verified=await env.DB.prepare("SELECT id FROM switch_history WHERE status='success' AND reason='manual' LIMIT 1").first();
        if (!verified) throw Error("Coba satu perpindahan manual yang berhasil sebelum mengaktifkan auto-switch live.");
      }
      const operations=Object.entries(next).map(([k,v])=>env.DB.prepare("INSERT INTO app_settings(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value,updated_at=CURRENT_TIMESTAMP").bind(k,JSON.stringify(v)));
      await env.DB.batch(operations);
      return reply({ok:true,settings:next});
    }
    if(method==="POST"&&path==="/api/service-code") {
      const body=await getJson(req),code=serviceCode(body.game,body.product);
      if(!code) throw Error("Isi nama game dan jumlah nominal angka, misalnya Mobile Legends dan 5 Diamond.");
      return reply({ok:true,code,available:!await env.DB.prepare("SELECT sku FROM products WHERE sku=?").bind(code).first()});
    }
    return failure("Halaman API tidak ditemukan.",404);
  } catch(error) {
    return failure(error, /sesi|Digiflazz mengembalikan|format katalog|tidak mengembalikan/i.test(error.message)?502:400);
  }
}
export { rank, normalizeProduct, validateSettings, changedProduct, serviceCode };
export default {
  async fetch(req,env) {
    const url=new URL(req.url);
    if(url.pathname.startsWith("/api/")) return api(req,env,url);
    if(!await authorize(req,env)) return failure("Akses pribadi diperlukan.",401);
    if(url.pathname!=="/")return new Response(null,{status:404});
    return new Response(HTML,{headers:{...secureHeaders,"content-type":"text/html; charset=utf-8","content-security-policy":"default-src 'self'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; connect-src 'self'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'"}});
  },
  async scheduled(event,env) {
    try {
      const cfg=await settings(env);
      const last=await env.DB.prepare("SELECT finished_at FROM scan_runs WHERE status='success' ORDER BY id DESC LIMIT 1").first();
      const due=!last || Date.now()-Date.parse(last.finished_at.replace(" ","T")+"Z")>=cfg.scanIntervalMinutes*60000;
      if(cfg.scanEnabled&&due) {
        await scan(env,"cron");
        const probe=await env.DB.prepare("SELECT sku,product_id FROM products WHERE seller_name='' OR seller_active=0 OR (max_price>0 AND price>max_price) OR (stock=0 AND unlimited_stock=0) ORDER BY last_seen DESC LIMIT 1").first();
        if(probe) {
          try { const count=await refreshOptions(env,probe.sku,probe.product_id);await log(env,"INFO","seller-options",count+" kandidat dibaca untuk satu produk yang perlu perhatian.",probe.sku); }
          catch(error) { await log(env,"WARN","seller-options",error.message,probe.sku); }
          const preflight=await env.DB.prepare("SELECT value FROM app_settings WHERE key='search_preflight_ok'").first();
          if(!preflight) {
            try {
              const current=await freshProduct(env,probe.sku);
              if(!current.id || !current.seller_sku_id) throw Error("Data pencarian SKU tidak berisi ID dan seller.");
              await env.DB.prepare("INSERT INTO app_settings(key,value) VALUES('search_preflight_ok','true')").run();
              await log(env,"INFO","search-preflight","Pencarian ulang SKU Digiflazz terverifikasi.",probe.sku);
            } catch(error) { await log(env,"WARN","search-preflight",error.message,probe.sku); }
          }
        }
        if(cfg.proactiveScan) {
          const sample=await env.DB.prepare("SELECT p.sku FROM products p LEFT JOIN seller_options o ON o.sku=p.sku WHERE p.active=1 AND p.seller_active=1 AND p.price>0 AND (p.stock>0 OR p.unlimited_stock=1) GROUP BY p.sku ORDER BY min(COALESCE(o.last_seen,'1970-01-01')) ASC LIMIT ?").bind(Math.min(10,cfg.autoSwitchBatchSize)).all();
          for(const {sku} of sample.results) {
            try {
              const data=await rankedOptions(env,sku);
              const current=JSON.parse(data.product.raw);
              const best=data.options.find(o=>o.eligible && o.seller_id!==String(current.seller_sku_id) && o.price<data.product.price*(1-cfg.minSavingsPercent/100));
              if(best) {
                const saving=Math.round((1-best.price/data.product.price)*100);
                await log(env,"WARN","better_seller_available",best.seller_name+" lebih murah "+saving+"% (Rp"+best.price+").",sku);
                if(cfg.autoSwitch && !cfg.dryRun && cfg.reoptimizeHours>0) await switchSeller(env,sku,best.seller_id,"auto");
              }
            } catch(error) { await log(env,"WARN","proactive",error.message,sku); }
          }
        }
        if(cfg.autoSwitch && !cfg.dryRun) {
          try {
            const summary=await autoSwitchBatch(env,cfg.autoSwitchBatchSize);
            if(summary.examined) await log(env,"INFO","auto-switch","Batch otomatis: "+summary.switched+" pindah, "+summary.noCandidate+" tanpa kandidat, "+summary.failed+" gagal.");
          } catch(error) { await log(env,"WARN","auto-switch",error.message); }
        }
      }
      const known=await env.DB.prepare("SELECT count(*) total FROM api_discovery").first();
      const previous=await env.DB.prepare("SELECT value FROM app_settings WHERE key='discovery_last_attempt'").first();
      if(known.total===0&&await conn(env)&&(!previous||Date.now()-Date.parse(previous.value)>86400000)) {
        await env.DB.prepare("INSERT INTO app_settings(key,value) VALUES('discovery_last_attempt',?) ON CONFLICT(key) DO UPDATE SET value=excluded.value").bind(new Date().toISOString()).run();
        await discover(env);
      }
    } catch(error) { try { await log(env,"ERROR","cron",error.message); } catch {} }
  }
};
