// Compiled into index.js with the interface from ui.html. Never store credentials here.
const HTML = __HTML__;
const encoder = new TextEncoder();
const decoder = new TextDecoder();
const DEFAULTS = {
  scanEnabled: false, dryRun: true, autoSwitch: false, scanIntervalMinutes: 5,
  minRating: 4, minReviews: 0,
  saveMode: "manual",
  cooldownHours: 24, autoSwitchBatchSize: 5, attentionRefreshBatchSize: 5,
  priceTolerancePercent: 2
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
  if (res.status === 401 || (res.status >= 300 && res.status < 400)) {
    const error=Error("Sesi Digiflazz kedaluwarsa atau perlu diperbarui (HTTP " + res.status + ").");
    error.status=res.status; error.endpoint=target.pathname; throw error;
  }
  if (res.status === 403) {
    const error=Error("Digiflazz menolak akses endpoint " + target.pathname + " (HTTP 403). Sesi belum tentu kedaluwarsa.");
    error.status=403; error.endpoint=target.pathname; throw error;
  }
  if (!res.ok) {
    const error=Error("Digiflazz mengembalikan HTTP " + res.status + " untuk " + target.pathname);
    error.status=res.status; error.endpoint=target.pathname; throw error;
  }
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
  // A save is never retried blindly: ambiguous responses must be inspected first.
  const res = await fetch("https://member.digiflazz.com/api/v1/buyer/product", { method:"POST", headers, body:JSON.stringify(body), redirect:"manual", signal:AbortSignal.timeout(20000) });
  const contentType=res.headers.get("content-type")||"";
  if (!res.ok) {
    let detail="";
    try {
      if(contentType.includes("json")) {
        const data=await res.json();
        detail=str(data?.message ?? data?.error?.message ?? data?.error ?? data?.detail);
      } else {
        detail=str(await res.text()).replace(/<[^>]+>/g," ").replace(/\s+/g," ").slice(0,160);
      }
    } catch {}
    const error=Error("Digiflazz menolak perubahan produk (HTTP "+res.status+")"+(detail?": "+detail.slice(0,160):"."));
    error.status=res.status;
    error.definitive=res.status>=400&&res.status<500&&![408,409,423,425,429].includes(res.status);
    throw error;
  }
  if (!contentType.includes("json")) {
    const error=Error("Respons perubahan produk bukan JSON; periksa produk di Digiflazz.");
    error.definitive=false;
    throw error;
  }
  const data = await res.json();
  if (data.status === false || data.success === false || data.error) {
    const detail=str(data?.message ?? data?.error?.message ?? data?.error);
    const error=Error("Digiflazz tidak menerima perubahan produk"+(detail?": "+detail.slice(0,160):"."));
    error.definitive=true;
    throw error;
  }
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
function entityId(value) {
  if (value && typeof value === "object") return str(value.id ?? value.value ?? value.key);
  return str(value);
}
function entityName(value) {
  if (value && typeof value === "object") return str(value.name ?? value.label ?? value.title ?? value.text);
  return typeof value === "string" ? str(value) : "";
}
function entityMap(rows) {
  const map=new Map();
  for(const row of rows||[]) {
    const id=entityId(row),name=entityName(row);
    if(id&&name)map.set(id,name);
  }
  return map;
}
function metadataName(value,map,fallback="") {
  const direct=entityName(value);
  if(direct)return direct;
  const id=entityId(value);
  return (id&&map?.get(id))||str(fallback);
}
function normalizeProduct(x, metadata={}) {
  const sku = str(x.buyer_sku_code || x.code || x.buyerSkuCode || x.sku || (x.id ? "ID:"+x.id : ""));
  if (!sku) return null;
  const seller = x.seller || x.supplier || {};
  const product = typeof x.product_details === "object" ? x.product_details : typeof x.product === "object" ? x.product : {};
  return {
    sku, product_id: str(x.id ?? x.product_id ?? product.id),
    name: str(x.product_name ?? x.name ?? (typeof x.product==="string" ? x.product : null) ?? product.name ?? sku),
    category: metadataName(x.category ?? product.category,metadata.categories,metadata.categoryName),
    brand: metadataName(x.brand ?? product.brand,metadata.brands),
    product_type: metadataName(x.type ?? product.type,metadata.types),
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
    if (["scanEnabled","dryRun","autoSwitch"].includes(key)) next[key] = bool(value);
    else if (["minRating","minReviews","scanIntervalMinutes","cooldownHours","autoSwitchBatchSize","attentionRefreshBatchSize","priceTolerancePercent"].includes(key)) {
      const limits = {
        minRating:[4,5],minReviews:[0,100000],scanIntervalMinutes:[5,1440],
        cooldownHours:[1,720],autoSwitchBatchSize:[1,10],attentionRefreshBatchSize:[1,10],priceTolerancePercent:[0,20]
      };
      next[key] = bounded(value, ...limits[key], current[key]);
    } else if (key === "saveMode" && ["manual","auto"].includes(value)) next[key] = value;
  }
  return next;
}
async function scan(env, reason = "manual") {
  await env.DB.prepare("UPDATE scan_runs SET status='error',finished_at=CURRENT_TIMESTAMP,message='Invocation sebelumnya berhenti sebelum scan selesai.' WHERE status='running' AND started_at < datetime('now','-20 minutes')").run();
  const created = await env.DB.prepare("INSERT INTO scan_runs(status) VALUES('running')").run();
  const runId = created.meta.last_row_id;
  try {
    const [catalog,brandCatalog,typeCatalog] = await Promise.all([
      remoteJson(env, "/api/v1/buyer/product/category"),
      remoteJson(env, "/api/v1/buyer/product/brand").catch(()=>null),
      remoteJson(env, "/api/v1/buyer/product/type").catch(()=>null)
    ]);
    const categories = listOf(catalog, ["data", "data.data", "categories"]);
    if (!categories) throw Error("Format kategori Digiflazz belum dikenali.");
    const brands=listOf(brandCatalog,["data","data.data","brands"])||[];
    const types=listOf(typeCatalog,["data","data.data","types"])||[];
    const metadata={categories:entityMap(categories),brands:entityMap(brands),types:entityMap(types)};
    const items = [];
    for (const category of categories) {
      const id = entityId(category);
      if (!id || !/^[a-zA-Z0-9_-]{1,80}$/.test(id)) continue;
      const response = await remoteJson(env, "/api/v1/buyer/product/category/" + encodeURIComponent(id) + "/");
      const members = listOf(response, ["data", "data.data", "products"]);
      if (!members) throw Error("Format produk kategori " + id + " belum dikenali.");
      const categoryName=entityName(category)||metadata.categories.get(id)||id;
      for (const member of members) items.push({member,categoryName});
    }
    const products = items.map(x=>normalizeProduct(x.member,{...metadata,categoryName:x.categoryName})).filter(Boolean);
    if (items.length && !products.length) throw Error("Data produk tidak memiliki SKU yang dikenali.");
    let issues = 0;
    for (let i=0;i<products.length;i+=75) {
      const chunk = products.slice(i,i+75);
      const old = await env.DB.prepare("SELECT sku,price,max_price,seller_name,seller_active,active,stock,unlimited_stock,raw FROM products WHERE sku IN (" + chunk.map(()=>"?").join(",") + ")").bind(...chunk.map(x=>x.sku)).all();
      const before = new Map(old.results.map(x=>[x.sku,x]));
      const queries = [],chunkDirty=[];
      for (const p of chunk) {
        const previous = before.get(p.sku);
        const previousRaw=previous?JSON.parse(previous.raw):null,currentRaw=JSON.parse(p.raw);
        const changed=!previous ||
          Number(previous.price)!==Number(p.price) ||
          Number(previous.max_price)!==Number(p.max_price) ||
          str(previous.seller_name)!==str(p.seller_name) ||
          Number(previous.seller_active)!==Number(p.seller_active) ||
          Number(previous.active)!==Number(p.active) ||
          Number(previous.stock)!==Number(p.stock) ||
          Number(previous.unlimited_stock)!==Number(p.unlimited_stock) ||
          String(previousRaw?.seller_sku_id??"")!==String(currentRaw?.seller_sku_id??"") ||
          str(previousRaw?.start_cut_off)!==str(currentRaw?.start_cut_off) ||
          str(previousRaw?.end_cut_off)!==str(currentRaw?.end_cut_off);
        if(changed)chunkDirty.push(p.sku);
        queries.push(env.DB.prepare("INSERT INTO products(sku,product_id,name,category,brand,product_type,seller_id,seller_name,price,max_price,active,seller_active,stock,unlimited_stock,end_cut_off,raw,nominal_value,last_seen) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,CURRENT_TIMESTAMP) ON CONFLICT(sku) DO UPDATE SET product_id=excluded.product_id,name=excluded.name,category=excluded.category,brand=excluded.brand,product_type=excluded.product_type,seller_id=excluded.seller_id,seller_name=excluded.seller_name,price=excluded.price,max_price=excluded.max_price,active=excluded.active,seller_active=excluded.seller_active,stock=excluded.stock,unlimited_stock=excluded.unlimited_stock,end_cut_off=excluded.end_cut_off,raw=excluded.raw,nominal_value=excluded.nominal_value,last_seen=CURRENT_TIMESTAMP").bind(p.sku,p.product_id,p.name,p.category,p.brand,p.product_type,p.seller_id,p.seller_name,p.price,p.max_price,p.active,p.seller_active,p.stock,p.unlimited_stock,p.end_cut_off,p.raw,Number.isFinite(productNominalValue(p))?productNominalValue(p):null));
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
      if(chunkDirty.length)await markAttentionDirty(env,chunkDirty);
    }
    const stale=await env.DB.prepare("SELECT sku FROM products WHERE last_seen < (SELECT started_at FROM scan_runs WHERE id=?)").bind(runId).all();
    if(stale.results.length) {
      for(let i=0;i<stale.results.length;i+=75) {
        const skus=stale.results.slice(i,i+75).map(x=>x.sku);
        const marks=skus.map(()=>"?").join(",");
        await env.DB.batch([
          env.DB.prepare("DELETE FROM seller_options WHERE sku IN ("+marks+")").bind(...skus),
          env.DB.prepare("DELETE FROM product_attention WHERE sku IN ("+marks+")").bind(...skus),
          env.DB.prepare("DELETE FROM products WHERE sku IN ("+marks+")").bind(...skus)
        ]);
      }
      await log(env,"INFO","catalog-cleanup",stale.results.length+" produk lama dihapus karena tidak ada lagi di katalog Digiflazz.");
    }
    const sellerRetry=await env.DB.prepare("SELECT value FROM app_settings WHERE key='seller_directory_retry_after'").first();
    if(!sellerRetry || Date.now()>=Date.parse(sellerRetry.value)) {
      try {
        const sd = await remoteJson(env, "/api/v1/buyer/seller");
        const sellers = listOf(sd,["data.data","data.sellers","data","sellers","result.data","result"]) || [];
        const stmts = sellers.map(normalizeSeller).filter(Boolean).map(x=>env.DB.prepare("INSERT INTO sellers(seller_id,name,rating,review_count,product_count,invoice,raw,last_seen) VALUES(?,?,?,?,?,?,?,CURRENT_TIMESTAMP) ON CONFLICT(seller_id) DO UPDATE SET name=excluded.name,rating=excluded.rating,review_count=excluded.review_count,product_count=excluded.product_count,invoice=excluded.invoice,raw=excluded.raw,last_seen=CURRENT_TIMESTAMP").bind(x.seller_id,x.name,x.rating,x.review_count,x.product_count,x.invoice,x.raw));
        for(let i=0;i<stmts.length;i+=80) await env.DB.batch(stmts.slice(i,i+80));
        await env.DB.prepare("DELETE FROM app_settings WHERE key='seller_directory_retry_after'").run();
      } catch (error) {
        if(error?.status===403) {
          const retryAt=new Date(Date.now()+24*3600000).toISOString();
          await env.DB.prepare("INSERT INTO app_settings(key,value) VALUES('seller_directory_retry_after',?) ON CONFLICT(key) DO UPDATE SET value=excluded.value").bind(retryAt).run();
          await log(env,"WARN","sellers","Endpoint direktori seller Digiflazz ditolak HTTP 403; scan produk tetap berjalan. Dicoba lagi setelah 24 jam.");
        } else await log(env,"WARN","sellers",error.message);
      }
    }
    const sellerStmts = [...new Set(products.map(x=>x.seller_name).filter(Boolean))].map(name=>env.DB.prepare("INSERT INTO sellers(seller_id,name,raw) VALUES(?,?,?) ON CONFLICT(seller_id) DO NOTHING").bind(name,name,"{}"));
    for (let i=0;i<sellerStmts.length;i+=80) await env.DB.batch(sellerStmts.slice(i,i+80));
    const cfg=await settings(env);
    const qualityRefresh=await refreshAttentionCoverage(env,cfg.attentionRefreshBatchSize);
    if(qualityRefresh.skus?.length)await markAttentionDirty(env,qualityRefresh.skus);
    const cacheRefresh=await refreshAttentionCache(env,cfg,null,100);
    const summary=await attentionSummary(env,cfg);
    issues=summary.issues;
    await env.DB.prepare("UPDATE scan_runs SET status='success',finished_at=CURRENT_TIMESTAMP,total=?,issues=?,message=? WHERE id=?").bind(products.length,issues,reason,runId).run();
    await log(env,"INFO","scan",products.length+" produk dipindai; "+issues+" perlu perhatian; "+qualityRefresh.refreshed+" rating/SLA diperbarui; "+cacheRefresh.refreshed+" cache perhatian dihitung.");
    return { ok:true,total:products.length,issues,qualityRefreshed:qualityRefresh.refreshed,attentionRefreshed:cacheRefresh.refreshed,attentionPending:summary.attentionPending };
  } catch (error) {
    await env.DB.prepare("UPDATE scan_runs SET status='error',finished_at=CURRENT_TIMESTAMP,message=? WHERE id=?").bind(error.message,runId).run();
    await log(env,"ERROR","scan",error.message);
    throw error;
  }
}
function inCutoffWindow(start,end,now=new Date()) {
  const clean=v=>/^([01]\d|2[0-3]):[0-5]\d$/.test(str(v))?str(v):null;
  const a=clean(start),b=clean(end);
  if(!a||!b||a===b) return false;
  const clock=new Intl.DateTimeFormat("en-GB",{hour:"2-digit",minute:"2-digit",hour12:false,timeZone:"Asia/Jakarta"}).format(now);
  return a<b ? clock>=a&&clock<b : clock>=a||clock<b;
}
function slaDays(value) {
  const text=str(value).replace(/\s+/g," ").trim();
  if(!text) return 999;
  const preferredPatterns=[
    /(?:SLA|penyelesaian(?:\s+(?:komplain|komplen|masalah))?|rekon|validasi|clear|cek)\D{0,48}?H\s*\+\s*(\d{1,2})/ig
  ];
  for(const pattern of preferredPatterns) {
    const hits=[...text.matchAll(pattern)].map(m=>Number(m[1])).filter(Number.isFinite);
    if(hits.length) return Math.min(...hits);
  }
  const hits=[];
  const re=/H\s*\+\s*(\d{1,2})/ig;
  let match;
  while((match=re.exec(text))) {
    const before=text.slice(Math.max(0,match.index-55),match.index).toLowerCase();
    const acceptance=/(?:terima|penerima|penerimaan|max(?:imal)?\s+komplain|maks(?:imal)?\s+komplain)/i.test(before);
    const service=/(?:sla|penyelesaian|rekon|validasi|clear|cek)/i.test(before);
    if(!acceptance || service) hits.push(Number(match[1]));
  }
  return hits.length?Math.min(...hits):999;
}
function reviewValue(value) {
  const text=str(value);
  const match=text.match(/\d+/);
  if(!match)return 0;
  const n=Number(match[0]);
  return text.startsWith("<")?Math.max(0,n-1):n;
}
function rank(product, rows, prefs, rule, config, zone) {
  const blocked = new Set(prefs.filter(p=>p.mode==="blocked").map(p=>p.seller_name.toLowerCase()));
  const max = Number(product.max_price)>0 ? Number(product.max_price) : Infinity;
  const configuredMinRating=Number(rule?.min_rating ?? config.minRating ?? 4);
  const minRating=Math.max(4,Math.min(5,Number.isFinite(configuredMinRating)?configuredMinRating:4));
  const tolerance=bounded(config.priceTolerancePercent,0,20,2);
  const mapped=rows.map(x => {
    const reasons = [];
    const name = x.seller_name.toLowerCase();
    if (blocked.has(name)) reasons.push("Seller diblokir");
    if (!x.price || (x.seller_status != null && Number(x.seller_status) !== 1)) reasons.push("Seller tidak aktif");
    if (x.price > max) reasons.push("Harga di atas batas");
    if (minRating > 0 && (x.rating == null || Number(x.rating) < minRating)) reasons.push("Rating kurang atau tidak tersedia");
    const reviews=reviewValue(x.review_count),reviewText=str(x.review_count);
    if (config.minReviews > 0 && (reviewText.startsWith("<") || reviews < config.minReviews)) reasons.push("Ulasan kurang atau tidak tersedia");
    if (x.stock != null && !x.unlimited_stock && !(x.stock > 0)) reasons.push("Stok habis");
    if (inCutoffWindow(x.start_cut_off,x.end_cut_off)) reasons.push("Sedang cut-off");
    if (zone && !zone.patterns.every(p=>String(x.description||"").toLowerCase().includes(p.toLowerCase()))) reasons.push("Zona tidak cocok");
    const sla_days=slaDays(x.sla);
    return { ...x, eligible:!reasons.length, reasons, sla_days, review_value:reviews };
  });
  const cheapestBySla=new Map();
  for(const x of mapped) if(x.eligible) {
    const previous=cheapestBySla.get(x.sla_days);
    if(previous==null||Number(x.price)<previous)cheapestBySla.set(x.sla_days,Number(x.price));
  }
  for(const x of mapped) {
    const reference=cheapestBySla.get(x.sla_days);
    x.reference_price=reference??null;
    x.within_price_tolerance=!!x.eligible&&reference!=null&&Number(x.price)<=reference*(1+tolerance/100)+1e-9;
    x.price_tolerance_percent=tolerance;
  }
  return mapped.sort((a,b)=>{
    const eligibility=Number(b.eligible)-Number(a.eligible);
    if(eligibility)return eligibility;
    const sla=Number(a.sla_days)-Number(b.sla_days);
    if(sla)return sla;
    if(a.eligible&&b.eligible) {
      const band=Number(b.within_price_tolerance)-Number(a.within_price_tolerance);
      if(band)return band;
      if(a.within_price_tolerance&&b.within_price_tolerance) {
        return Number(b.rating||0)-Number(a.rating||0) ||
          Number(b.review_value||0)-Number(a.review_value||0) ||
          Number(a.price)-Number(b.price) ||
          str(a.seller_name).localeCompare(str(b.seller_name),"id-ID",{sensitivity:"base",numeric:true});
      }
    }
    return Number(a.price)-Number(b.price) ||
      Number(b.rating||0)-Number(a.rating||0) ||
      Number(b.review_value||0)-Number(a.review_value||0) ||
      str(a.seller_name).localeCompare(str(b.seller_name),"id-ID",{sensitivity:"base",numeric:true});
  });
}
function parseNominalToken(value) {
  const token=str(value);
  if(!token)return Infinity;
  if(/^\d{1,3}(?:[.,]\d{3})+$/.test(token)) {
    const n=Number(token.replace(/[.,]/g,""));
    return Number.isFinite(n)?n:Infinity;
  }
  const normalized=token.replace(",",".");
  const n=Number(normalized);
  return Number.isFinite(n)?n:Infinity;
}
function escapeRegex(value) {
  return str(value).replace(/[.*+?^$()|[\]\\]/g,"\\$&");
}
function productNominalValue(product) {
  let title=str(product?.name),brand=str(product?.brand);
  if(brand) title=title.replace(new RegExp("^\\s*"+escapeRegex(brand)+"\\s*","i"),"");
  const match=title.match(/\d+(?:[.,]\d+)*/);
  if(match)return parseNominalToken(match[0]);
  const skuMatch=str(product?.sku).match(/\d+(?:[.,]\d+)*/);
  return skuMatch?parseNominalToken(skuMatch[0]):Infinity;
}
function productSortCompare(a,b) {
  const familyA=str(a.brand||a.category||a.name).toLocaleUpperCase("id-ID");
  const familyB=str(b.brand||b.category||b.name).toLocaleUpperCase("id-ID");
  const family=familyA.localeCompare(familyB,"id-ID",{sensitivity:"base",numeric:true});
  if(family)return family;
  const nominalA=productNominalValue(a),nominalB=productNominalValue(b);
  if(nominalA!==nominalB)return nominalA-nominalB;
  const type=str(a.product_type).localeCompare(str(b.product_type),"id-ID",{sensitivity:"base",numeric:true});
  if(type)return type;
  return str(a.name).localeCompare(str(b.name),"id-ID",{sensitivity:"base",numeric:true})||str(a.sku).localeCompare(str(b.sku),"id-ID",{numeric:true});
}
function matchingRuleForProduct(product,rules) {
  const priority={product:0,type:1,brand:2,category:3};
  return (rules||[]).filter(rule=>{
    if(!Number(rule.is_active))return false;
    if(rule.scope_type==="product")return str(rule.scope_value)===str(product.sku);
    if(rule.scope_type==="type")return str(rule.scope_value)===str(product.product_type);
    if(rule.scope_type==="brand")return str(rule.scope_value)===str(product.brand);
    if(rule.scope_type==="category")return str(rule.scope_value)===str(product.category);
    return false;
  }).sort((a,b)=>(priority[a.scope_type]??9)-(priority[b.scope_type]??9)||Number(b.id||0)-Number(a.id||0))[0]||null;
}
function attentionReasons(product, config, now=new Date(), context=null) {
  const reasons=[];
  const operation=str(product.operation_status);
  if(operation==="pending")reasons.push("Operasi masih pending");
  if(operation==="unknown")reasons.push("Hasil operasi belum pasti");
  if(!Number(product.active))return reasons;
  if(!str(product.seller_name))reasons.push("Seller belum dipilih");
  else if(Number(product.seller_active)===0)reasons.push("Seller OFF");
  if(Number(product.max_price)<=0)reasons.push("Max Price belum diisi");
  else if(Number(product.price)>Number(product.max_price))reasons.push("Harga di atas max price");
  if(product.stock!=null&&!Number(product.unlimited_stock)&&Number(product.stock)<=0)reasons.push("Stok habis");
  if(inCutoffWindow(product.start_cut_off,product.end_cut_off,now))reasons.push("Sedang cut-off");
  if(Number(product.option_count)>0) {
    if(!str(product.current_option_seller_id)) reasons.push("Seller saat ini tidak ada di kandidat terbaru");
    else {
      const minRating=Math.max(4,Math.min(5,Number(config.minRating)||4));
      const currentRating=product.current_rating==null?null:Number(product.current_rating);
      if(currentRating==null||!Number.isFinite(currentRating))reasons.push("Rating tidak tersedia");
      else if(currentRating<minRating)reasons.push("Rating < "+minRating);

      const currentSla=slaDays(product.current_sla);
      const best=context?.best||null,current=context?.current||null;
      if(best&&current&&String(best.seller_id)!==String(current.seller_id)) {
        if(best.sla_days<currentSla) {
          reasons.push(currentSla===999
            ? "SLA tidak diketahui · kandidat H+"+best.sla_days+" tersedia"
            : "SLA H+"+currentSla+" · kandidat H+"+best.sla_days+" tersedia");
        } else if(best.sla_days===currentSla&&current.eligible) {
          const bestRating=Number(best.rating||0),curRating=Number(current.rating||0);
          if(bestRating>curRating) reasons.push("Rating lebih baik tersedia ("+bestRating+")");
          else if(bestRating===curRating&&Number(best.review_value||0)>Number(current.review_value||0)) reasons.push("Ulasan seller lebih banyak tersedia");
          else if(bestRating===curRating&&Number(best.review_value||0)===Number(current.review_value||0)&&Number(best.price)<Number(current.price)) reasons.push("Harga seller lebih murah tersedia");
        }
      }
    }
  }
  return [...new Set(reasons)];
}
function attentionCategory(reason) {
  if(/Harga|Max Price/i.test(reason))return "harga";
  if(/Rating|SLA/i.test(reason))return "kualitas";
  if(/Operasi|hasil operasi/i.test(reason))return "tertunda";
  return "operasional";
}
async function loadAttentionRows(env, config, where="WHERE 1=1", args=[]) {
  const rows=await env.DB.prepare(`
    SELECT p.sku,p.product_id,p.name,p.category,p.brand,p.product_type,p.seller_name,p.price,p.max_price,p.active,p.seller_active,p.stock,p.unlimited_stock,p.last_seen,
      l.buyer_sku_code IS NOT NULL AS locked,
      op.status AS operation_status,
      op.target_seller_id AS operation_target_seller_id,
      op.started_at AS operation_started_at,
      json_extract(p.raw,'$.seller_sku_id') AS current_seller_sku_id,
      json_extract(p.raw,'$.start_cut_off') AS start_cut_off,
      json_extract(p.raw,'$.end_cut_off') AS end_cut_off,
      cur.seller_id AS current_option_seller_id,
      cur.rating AS current_rating,
      cur.sla AS current_sla,
      json_extract(cur.raw,'$.rating_qty') AS current_review_count,
      COALESCE(option_counts.option_count,0) AS option_count
    FROM products p
    LEFT JOIN product_locks l ON l.buyer_sku_code=p.sku
    LEFT JOIN switch_operations op ON op.sku=p.sku
    LEFT JOIN seller_options cur ON cur.sku=p.sku AND cur.seller_id=json_extract(p.raw,'$.seller_sku_id')
    LEFT JOIN (SELECT sku,count(*) AS option_count FROM seller_options GROUP BY sku) option_counts ON option_counts.sku=p.sku
    `+where
  ).bind(...args).all();
  if(!rows.results.length)return [];
  const skus=rows.results.map(x=>x.sku);
  const chunks=[];
  for(let i=0;i<skus.length;i+=75)chunks.push(skus.slice(i,i+75));
  const optionStatements=chunks.map(chunk=>{
    const placeholders=chunk.map(()=>"?").join(",");
    return env.DB.prepare(`SELECT sku,seller_id,seller_name,price,rating,stock,unlimited_stock,connection,sla,description,
      json_extract(raw,'$.rating_qty') AS review_count,
      json_extract(raw,'$.status_sellerSku') AS seller_status,
      json_extract(raw,'$.start_cut_off') AS start_cut_off,
      json_extract(raw,'$.end_cut_off') AS end_cut_off
      FROM seller_options WHERE sku IN (`+placeholders+`)`).bind(...chunk);
  });
  const zoneStatements=chunks.map(chunk=>{
    const placeholders=chunk.map(()=>"?").join(",");
    return env.DB.prepare("SELECT a.sku,z.patterns FROM zone_assignments a JOIN zones z ON z.id=a.zone_id WHERE a.sku IN ("+placeholders+")").bind(...chunk);
  });
  const batch=await env.DB.batch([
    ...optionStatements,
    ...zoneStatements,
    env.DB.prepare("SELECT seller_name,mode FROM seller_preferences"),
    env.DB.prepare("SELECT * FROM seller_rules WHERE is_active=1")
  ]);
  const optionRows=batch.slice(0,optionStatements.length).flatMap(result=>result.results||[]);
  const zoneOffset=optionStatements.length;
  const zoneRows=batch.slice(zoneOffset,zoneOffset+zoneStatements.length).flatMap(result=>result.results||[]);
  const preferences=batch[zoneOffset+zoneStatements.length]?.results||[];
  const rules=batch[zoneOffset+zoneStatements.length+1]?.results||[];
  const optionsBySku=new Map();
  for(const option of optionRows) {
    if(!optionsBySku.has(option.sku))optionsBySku.set(option.sku,[]);
    optionsBySku.get(option.sku).push(option);
  }
  const zoneBySku=new Map();
  for(const row of zoneRows) {
    try { zoneBySku.set(row.sku,{patterns:JSON.parse(row.patterns)}); } catch {}
  }
  return rows.results.map(row=>{
    const options=optionsBySku.get(row.sku)||[];
    const rejectedAt=row.operation_status==="error"&&row.operation_started_at
      ?Date.parse(String(row.operation_started_at).replace(" ","T")+"Z")
      :0;
    const rejectedId=rejectedAt&&Date.now()-rejectedAt<6*3600000?str(row.operation_target_seller_id):"";
    const policyOptions=rejectedId?options.filter(x=>String(x.seller_id)!==rejectedId):options;
    const rule=matchingRuleForProduct(row,rules);
    const ranked=rank(row,policyOptions,preferences,rule,config,zoneBySku.get(row.sku)||null);
    const current=ranked.find(x=>String(x.seller_id)===String(row.current_seller_sku_id))||null;
    const best=ranked.find(x=>x.eligible)||null;
    const replacement=ranked.find(x=>x.eligible&&String(x.seller_id)!==String(row.current_seller_sku_id))||null;
    const attention_reasons=attentionReasons(row,config,new Date(),{ranked,current,best});
    return {
      ...row,
      nominal_value:productNominalValue(row),
      best_candidate_seller:replacement?.seller_name||null,
      best_candidate_price:replacement?.price??null,
      best_candidate_rating:replacement?.rating??null,
      best_candidate_sla:replacement?.sla_days??null,
      attention_reasons,
      needs_attention:attention_reasons.length>0
    };
  });
}
function attentionBreakdown(rows) {
  const out={operasional:0,kualitas:0,harga:0,tertunda:0};
  for(const row of rows) if(row.needs_attention) {
    const seen=new Set(row.attention_reasons.map(attentionCategory));
    for(const key of seen)out[key]=(out[key]||0)+1;
  }
  return out;
}

function attentionFlags(reasons) {
  const categories=new Set((reasons||[]).map(attentionCategory));
  return {
    operational:categories.has("operasional")?1:0,
    quality:categories.has("kualitas")?1:0,
    price:categories.has("harga")?1:0,
    pending:categories.has("tertunda")?1:0
  };
}
async function persistAttentionRows(env, rows) {
  if(!rows?.length)return 0;
  const statements=[];
  for(const row of rows) {
    const flags=attentionFlags(row.attention_reasons);
    statements.push(
      env.DB.prepare(`INSERT INTO product_attention(
        sku,needs_attention,reasons_json,operational_issue,quality_issue,price_issue,pending_issue,
        current_rating,current_sla,best_candidate_seller,best_candidate_price,best_candidate_rating,best_candidate_sla,
        option_count,locked,operation_status,dirty,evaluated_at,updated_at
      ) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,0,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)
      ON CONFLICT(sku) DO UPDATE SET
        needs_attention=excluded.needs_attention,reasons_json=excluded.reasons_json,
        operational_issue=excluded.operational_issue,quality_issue=excluded.quality_issue,price_issue=excluded.price_issue,pending_issue=excluded.pending_issue,
        current_rating=excluded.current_rating,current_sla=excluded.current_sla,
        best_candidate_seller=excluded.best_candidate_seller,best_candidate_price=excluded.best_candidate_price,
        best_candidate_rating=excluded.best_candidate_rating,best_candidate_sla=excluded.best_candidate_sla,
        option_count=excluded.option_count,locked=excluded.locked,operation_status=excluded.operation_status,
        dirty=0,evaluated_at=CURRENT_TIMESTAMP,updated_at=CURRENT_TIMESTAMP`)
      .bind(
        row.sku,row.needs_attention?1:0,JSON.stringify(row.attention_reasons||[]),
        flags.operational,flags.quality,flags.price,flags.pending,
        row.current_rating??null,row.current_sla??null,row.best_candidate_seller??null,row.best_candidate_price??null,
        row.best_candidate_rating??null,row.best_candidate_sla??null,
        Number(row.option_count)||0,Number(row.locked)||0,str(row.operation_status)||null
      )
    );
    statements.push(env.DB.prepare("UPDATE products SET nominal_value=? WHERE sku=?").bind(
      Number.isFinite(Number(row.nominal_value))&&Number(row.nominal_value)<Infinity?Number(row.nominal_value):null,row.sku
    ));
  }
  for(let i=0;i<statements.length;i+=80)await env.DB.batch(statements.slice(i,i+80));
  return rows.length;
}
async function markAttentionDirty(env, skus=null) {
  if(!skus) {
    await env.DB.batch([
      env.DB.prepare("INSERT OR IGNORE INTO product_attention(sku,dirty) SELECT sku,1 FROM products"),
      env.DB.prepare("UPDATE product_attention SET dirty=1,updated_at=CURRENT_TIMESTAMP")
    ]);
    return;
  }
  const unique=[...new Set(skus.map(str).filter(Boolean))];
  for(let i=0;i<unique.length;i+=75) {
    const chunk=unique.slice(i,i+75),marks=chunk.map(()=>"?").join(",");
    await env.DB.batch([
      env.DB.prepare("INSERT OR IGNORE INTO product_attention(sku,dirty) SELECT sku,1 FROM products WHERE sku IN ("+marks+")").bind(...chunk),
      env.DB.prepare("UPDATE product_attention SET dirty=1,updated_at=CURRENT_TIMESTAMP WHERE sku IN ("+marks+")").bind(...chunk)
    ]);
  }
}
async function refreshAttentionCache(env, config, skus=null, limit=50) {
  let targets=skus?[...new Set(skus.map(str).filter(Boolean))]:null;
  if(!targets) {
    const rows=await env.DB.prepare(`SELECT p.sku
      FROM products p LEFT JOIN product_attention a ON a.sku=p.sku
      WHERE a.sku IS NULL OR a.dirty=1
      ORDER BY p.last_seen ASC,p.sku ASC LIMIT ?`).bind(Math.trunc(bounded(limit,1,200,50))).all();
    targets=rows.results.map(x=>x.sku);
  }
  if(!targets.length)return {refreshed:0,pending:0};
  let refreshed=0;
  for(let i=0;i<targets.length;i+=50) {
    const chunk=targets.slice(i,i+50),marks=chunk.map(()=>"?").join(",");
    const rows=await loadAttentionRows(env,config,"WHERE p.sku IN ("+marks+")",chunk);
    refreshed+=await persistAttentionRows(env,rows);
  }
  const pending=await env.DB.prepare("SELECT count(*) total FROM products p LEFT JOIN product_attention a ON a.sku=p.sku WHERE a.sku IS NULL OR a.dirty=1").first();
  return {refreshed,pending:Number(pending?.total)||0};
}
function autoSwitchCooldownCutoff(config) {
  return new Date(Date.now()-Number(config.cooldownHours||24)*3600000).toISOString().replace("T"," ").slice(0,19);
}
const ACTIONABLE_ATTENTION_FROM=`FROM product_attention a
  JOIN products p ON p.sku=a.sku
  LEFT JOIN product_locks l ON l.buyer_sku_code=p.sku
  LEFT JOIN switch_operations op ON op.sku=p.sku
  WHERE a.dirty=0 AND a.needs_attention=1 AND p.active=1
    AND p.max_price>0
    AND a.best_candidate_seller IS NOT NULL
    AND l.buyer_sku_code IS NULL
    AND COALESCE(op.status,'') NOT IN ('pending','unknown')
    AND NOT EXISTS (
      SELECT 1 FROM switch_history sh
      WHERE sh.buyer_sku_code=p.sku AND sh.status='success' AND sh.created_at>?
    )`;
async function actionableAttentionCount(env, config) {
  const row=await env.DB.prepare("SELECT count(*) total "+ACTIONABLE_ATTENTION_FROM).bind(autoSwitchCooldownCutoff(config)).first();
  return Number(row?.total)||0;
}
async function actionableAttentionRows(env, config, limit) {
  return env.DB.prepare(`SELECT p.sku,p.last_seen,a.reasons_json `+ACTIONABLE_ATTENTION_FROM+`
    ORDER BY p.last_seen ASC,p.sku ASC LIMIT ?`)
    .bind(autoSwitchCooldownCutoff(config),Math.trunc(bounded(limit,1,10,5))).all();
}
async function attentionSummary(env, config) {
  const [summary,quality,autoReady]=await Promise.all([
    env.DB.prepare(`SELECT
      count(*) products,
      sum(CASE WHEN p.active=1 THEN 1 ELSE 0 END) activeProducts,
      sum(CASE WHEN p.max_price<=0 THEN 1 ELSE 0 END) missingMaxPrice,
      sum(CASE WHEN a.dirty=0 AND a.needs_attention=1 THEN 1 ELSE 0 END) issues,
      sum(CASE WHEN a.dirty=0 AND a.operational_issue=1 THEN 1 ELSE 0 END) operational,
      sum(CASE WHEN a.dirty=0 AND a.quality_issue=1 THEN 1 ELSE 0 END) quality,
      sum(CASE WHEN a.dirty=0 AND a.price_issue=1 THEN 1 ELSE 0 END) price,
      sum(CASE WHEN a.dirty=0 AND a.pending_issue=1 THEN 1 ELSE 0 END) pendingIssues,
      sum(CASE WHEN a.sku IS NULL OR a.dirty=1 THEN 1 ELSE 0 END) attentionPending,
      sum(CASE WHEN a.dirty=0 THEN 1 ELSE 0 END) attentionFresh
    FROM products p LEFT JOIN product_attention a ON a.sku=p.sku`).first(),
    env.DB.prepare("SELECT count(DISTINCT o.sku) total FROM seller_options o JOIN products p ON p.sku=o.sku WHERE p.active=1").first(),
    actionableAttentionCount(env,config)
  ]);
  return {
    products:Number(summary?.products)||0,
    activeProducts:Number(summary?.activeProducts)||0,
    missingMaxPrice:Number(summary?.missingMaxPrice)||0,
    issues:Number(summary?.issues)||0,
    autoSwitchReady:autoReady,
    qualityKnown:Number(quality?.total)||0,
    attentionFresh:Number(summary?.attentionFresh)||0,
    attentionPending:Number(summary?.attentionPending)||0,
    attentionBreakdown:{
      operasional:Number(summary?.operational)||0,
      kualitas:Number(summary?.quality)||0,
      harga:Number(summary?.price)||0,
      tertunda:Number(summary?.pendingIssues)||0
    }
  };
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
  await env.DB.prepare("DELETE FROM seller_options WHERE sku=?").bind(sku).run();
  for (let i=0;i<cmds.length;i+=80) await env.DB.batch(cmds.slice(i,i+80));
  return cmds.length;
}
async function refreshAttentionCoverage(env, requestedLimit=5) {
  const limit=Math.trunc(bounded(requestedLimit,1,10,5));
  const rows=await env.DB.prepare(`
    SELECT p.sku,p.product_id,max(o.last_seen) AS quality_last_seen,q.next_retry_at,q.last_attempt
    FROM products p
    LEFT JOIN seller_options o ON o.sku=p.sku
    LEFT JOIN quality_refresh_state q ON q.sku=p.sku
    WHERE p.active=1
      AND (q.next_retry_at IS NULL OR q.next_retry_at<=CURRENT_TIMESTAMP)
    GROUP BY p.sku,p.product_id,q.next_retry_at,q.last_attempt
    ORDER BY CASE WHEN max(o.last_seen) IS NULL THEN 0 ELSE 1 END ASC,
      COALESCE(max(o.last_seen),q.last_attempt,'1970-01-01 00:00:00') ASC,
      p.sku ASC
    LIMIT ?
  `).bind(limit).all();
  let refreshed=0,empty=0,failed=0,lastError=null;
  const refreshedSkus=[];
  for(const row of rows.results) {
    try {
      const count=await refreshOptions(env,row.sku,row.product_id);
      if(count>0) {
        refreshed++;
        await env.DB.prepare("INSERT INTO quality_refresh_state(sku,last_attempt,last_result,empty_count,next_retry_at) VALUES(?,CURRENT_TIMESTAMP,'ok',0,NULL) ON CONFLICT(sku) DO UPDATE SET last_attempt=CURRENT_TIMESTAMP,last_result='ok',empty_count=0,next_retry_at=NULL").bind(row.sku).run();
      } else {
        empty++;
        await env.DB.prepare("INSERT INTO quality_refresh_state(sku,last_attempt,last_result,empty_count,next_retry_at) VALUES(?,CURRENT_TIMESTAMP,'empty',1,datetime('now','+6 hours')) ON CONFLICT(sku) DO UPDATE SET last_attempt=CURRENT_TIMESTAMP,last_result='empty',empty_count=quality_refresh_state.empty_count+1,next_retry_at=datetime('now','+6 hours')").bind(row.sku).run();
      }
      refreshedSkus.push(row.sku);
    } catch(error) {
      failed++;lastError=error;
      await env.DB.prepare("INSERT INTO quality_refresh_state(sku,last_attempt,last_result,empty_count,next_retry_at) VALUES(?,CURRENT_TIMESTAMP,'error',0,datetime('now','+30 minutes')) ON CONFLICT(sku) DO UPDATE SET last_attempt=CURRENT_TIMESTAMP,last_result='error',next_retry_at=datetime('now','+30 minutes')").bind(row.sku).run();
      if(error?.status===401||error?.status===403)break;
    }
  }
  if(failed) await log(env,"WARN","attention-refresh",failed+" pembaruan rating/SLA gagal"+(lastError?": "+lastError.message:"")+".");
  if(empty) await log(env,"INFO","attention-refresh",empty+" produk tidak punya kandidat seller; dicoba lagi setelah 6 jam.");
  if(refreshed) await log(env,"INFO","attention-refresh",refreshed+" produk diperbarui data rating/SLA-nya.");
  return {refreshed,empty,failed,skus:refreshedSkus};
}
async function rankedOptions(env, sku, refresh = true) {
  const entry = await env.DB.prepare("SELECT product_id FROM products WHERE sku=?").bind(sku).first();
  if (!entry) throw Error("Produk tidak ditemukan.");
  if (refresh) await refreshOptions(env, sku, entry.product_id);
  const [product, options, preferences, rule, zone, config] = await Promise.all([
    env.DB.prepare("SELECT p.*,l.buyer_sku_code IS NOT NULL AS locked FROM products p LEFT JOIN product_locks l ON l.buyer_sku_code=p.sku WHERE p.sku=?").bind(sku).first(),
    env.DB.prepare("SELECT sku,seller_id,seller_name,price,rating,stock,unlimited_stock,connection,sla,description,json_extract(raw,'$.rating_qty') AS review_count,json_extract(raw,'$.status_sellerSku') AS seller_status,json_extract(raw,'$.start_cut_off') AS start_cut_off,json_extract(raw,'$.end_cut_off') AS end_cut_off,raw FROM seller_options WHERE sku=?").bind(sku).all(),
    env.DB.prepare("SELECT seller_name,mode FROM seller_preferences").all(),
    env.DB.prepare("SELECT * FROM seller_rules WHERE is_active=1 AND (scope_type='global' OR (scope_type='product' AND scope_value=?) OR (scope_type='brand' AND scope_value=(SELECT brand FROM products WHERE sku=?)) OR (scope_type='category' AND scope_value=(SELECT category FROM products WHERE sku=?)) OR (scope_type='type' AND scope_value=(SELECT product_type FROM products WHERE sku=?))) ORDER BY CASE scope_type WHEN 'product' THEN 0 WHEN 'type' THEN 1 WHEN 'brand' THEN 2 WHEN 'category' THEN 3 ELSE 4 END,id DESC LIMIT 1").bind(sku,sku,sku,sku).first(),
    env.DB.prepare("SELECT z.patterns FROM zones z JOIN zone_assignments a ON a.zone_id=z.id WHERE a.sku=?").bind(sku).first(),settings(env)
  ]);
  return { product, config, options:rank(product, options.results, preferences.results, rule, config, zone?{patterns:JSON.parse(zone.patterns)}:null) };
}
async function findProductBySku(env, sku) {
  let result;
  try {
    result = await remoteJson(env,"/api/v1/buyer/product/search/sku/" + encodeURIComponent(sku));
  } catch(error) {
    if(error?.status===404)return null;
    throw error;
  }
  const rows = listOf(result,["data","data.data","products"]);
  if (!rows) throw Error("Digiflazz tidak mengembalikan daftar produk terbaru.");
  return rows.find(x=>normalizeProduct(x)?.sku === sku) || null;
}
async function freshProduct(env, sku) {
  const row=await findProductBySku(env,sku);
  if (!row) throw Error("SKU tidak ditemukan pada data terbaru Digiflazz.");
  return row;
}
function validBuyerSku(value) {
  return /^[A-Za-z0-9._-]{1,50}$/.test(str(value));
}
async function remoteProductDelete(env, productId) {
  const row=await conn(env);
  if(!row||!env.SESSION_ENCRYPTION_KEY)throw Error("Sesi Digiflazz belum terhubung.");
  if(!/^[A-Za-z0-9_-]{1,80}$/.test(str(productId)))throw Error("ID produk Digiflazz tidak valid.");
  const session=await unseal(row,env.SESSION_ENCRYPTION_KEY);
  const headers={...session.headers,accept:"application/json",origin:"https://member.digiflazz.com",referer:"https://member.digiflazz.com/buyer-area"};
  delete headers.host;
  const res=await fetch("https://member.digiflazz.com/api/v1/buyer/product/delete/"+encodeURIComponent(productId),{method:"POST",headers,redirect:"manual",signal:AbortSignal.timeout(20000)});
  if(!res.ok)throw Error("Digiflazz menolak penghapusan produk (HTTP "+res.status+").");
  if(res.headers.get("content-type")?.includes("json")) {
    const data=await res.json();
    if(data.status===false||data.success===false||data.error)throw Error("Digiflazz tidak menerima penghapusan produk.");
    return data;
  }
  return {ok:true};
}
async function ensureNoPendingProductOperation(env,sku) {
  const op=await env.DB.prepare("SELECT status FROM switch_operations WHERE sku=? AND status IN ('pending','unknown')").bind(sku).first();
  if(op)throw Error("Produk masih punya operasi seller/harga yang belum selesai. Rekonsiliasi dulu sebelum mengubah produk.");
}
async function updateBuyerSku(env,oldSku,newSku) {
  oldSku=str(oldSku);newSku=str(newSku);
  if(!validBuyerSku(newSku))throw Error("SKU hanya boleh huruf, angka, titik, garis bawah, atau minus; maksimal 50 karakter.");
  if(oldSku.toLowerCase()===newSku.toLowerCase()&&oldSku!==newSku)throw Error("Perubahan huruf besar/kecil saja tidak didukung.");
  if(oldSku===newSku)return {ok:true,sku:newSku,unchanged:true};
  await ensureNoPendingProductOperation(env,oldSku);
  const duplicate=await env.DB.prepare("SELECT sku FROM products WHERE lower(sku)=lower(?) AND sku<>? LIMIT 1").bind(newSku,oldSku).first();
  if(duplicate)throw Error("SKU "+newSku+" sudah dipakai produk lain.");
  const current=await freshProduct(env,oldSku);
  const remoteDuplicate=await findProductBySku(env,newSku);
  if(remoteDuplicate&&String(remoteDuplicate.id)!==String(current.id))throw Error("SKU "+newSku+" sudah dipakai di Digiflazz.");
  await remoteSave(env,{...current,code:newSku,change:true});
  const verified=await findProductBySku(env,newSku);
  if(!verified||String(verified.id)!==String(current.id))throw Error("Perubahan SKU belum terkonfirmasi di Digiflazz. Jangan ulangi sebelum memeriksa produk.");
  const normalized=normalizeProduct(verified);
  await env.DB.batch([
    env.DB.prepare("DELETE FROM product_attention WHERE sku=?").bind(oldSku),
    env.DB.prepare("UPDATE products SET sku=?,raw=?,active=?,seller_active=?,price=?,max_price=?,stock=?,unlimited_stock=?,nominal_value=?,last_seen=CURRENT_TIMESTAMP WHERE sku=?").bind(newSku,JSON.stringify(verified),normalized.active,normalized.seller_active,normalized.price,normalized.max_price,normalized.stock,normalized.unlimited_stock,Number.isFinite(productNominalValue(normalized))?productNominalValue(normalized):null,oldSku),
    env.DB.prepare("UPDATE seller_options SET sku=? WHERE sku=?").bind(newSku,oldSku),
    env.DB.prepare("UPDATE product_locks SET buyer_sku_code=? WHERE buyer_sku_code=?").bind(newSku,oldSku),
    env.DB.prepare("UPDATE zone_assignments SET sku=? WHERE sku=?").bind(newSku,oldSku),
    env.DB.prepare("UPDATE switch_operations SET sku=? WHERE sku=?").bind(newSku,oldSku),
    env.DB.prepare("UPDATE seller_rules SET scope_value=? WHERE scope_type='product' AND scope_value=?").bind(newSku,oldSku),
    env.DB.prepare("INSERT OR REPLACE INTO product_attention(sku,dirty,updated_at) VALUES(?,1,CURRENT_TIMESTAMP)").bind(newSku)
  ]);
  await log(env,"INFO","product-sku","SKU Digiflazz diubah: "+oldSku+" → "+newSku,newSku);
  return {ok:true,oldSku,sku:newSku,verified:true};
}
async function setBuyerProductStatus(env,sku,active) {
  sku=str(sku);active=!!active;
  await ensureNoPendingProductOperation(env,sku);
  const current=await freshProduct(env,sku);
  await remoteSave(env,{...current,status:active,change:true});
  const verified=await freshProduct(env,sku);
  const normalized=normalizeProduct(verified);
  if(Boolean(normalized.active)!==active)throw Error("Status produk belum terkonfirmasi di Digiflazz. Jangan ulangi sebelum memeriksa produk.");
  await env.DB.prepare("UPDATE products SET active=?,raw=?,last_seen=CURRENT_TIMESTAMP WHERE sku=?").bind(active?1:0,JSON.stringify(verified),sku).run();
  await markAttentionDirty(env,[sku]);
  await log(env,"INFO","product-status","Produk "+(active?"diaktifkan":"dinonaktifkan")+" langsung di Digiflazz.",sku);
  return {ok:true,sku,active,verified:true};
}
async function deleteBuyerProduct(env,sku) {
  sku=str(sku);
  await ensureNoPendingProductOperation(env,sku);
  const current=await freshProduct(env,sku);
  await remoteProductDelete(env,current.id);
  const after=await findProductBySku(env,sku);
  if(after&&String(after.id)===String(current.id))throw Error("Penghapusan belum terkonfirmasi di Digiflazz. Jangan ulangi sebelum memeriksa produk.");
  await env.DB.batch([
    env.DB.prepare("DELETE FROM product_attention WHERE sku=?").bind(sku),
    env.DB.prepare("DELETE FROM seller_options WHERE sku=?").bind(sku),
    env.DB.prepare("DELETE FROM product_locks WHERE buyer_sku_code=?").bind(sku),
    env.DB.prepare("DELETE FROM zone_assignments WHERE sku=?").bind(sku),
    env.DB.prepare("DELETE FROM switch_operations WHERE sku=?").bind(sku),
    env.DB.prepare("DELETE FROM seller_rules WHERE scope_type='product' AND scope_value=?").bind(sku),
    env.DB.prepare("DELETE FROM products WHERE sku=?").bind(sku)
  ]);
  await log(env,"WARN","product-delete","Produk dihapus langsung dari Digiflazz.",sku);
  return {ok:true,sku,deleted:true,verified:true};
}
function changedProduct(current, choice) {
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
  // Max Price is owned per product in Digiflazz and is never recalculated by seller switching.
  return updated;
}
async function switchSeller(env, sku, sellerId, reason, preparedSelection = null) {
  const {product,config,options} = preparedSelection || await rankedOptions(env,sku);
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
    await remoteSave(env,changedProduct(current,choice));
    const verified=await freshProduct(env,sku);
    if (String(verified.seller_sku_id)!==sellerId) throw Error("Respons simpan diterima, tetapi seller baru belum terkonfirmasi.");
    const normalizedVerified=normalizeProduct(verified);
    await env.DB.batch([
      env.DB.prepare("UPDATE switch_history SET status='success' WHERE id=?").bind(record.meta.last_row_id),
      env.DB.prepare("UPDATE switch_operations SET status='success' WHERE sku=?").bind(sku),
      env.DB.prepare("UPDATE products SET seller_id=?,seller_name=?,price=?,max_price=?,seller_active=?,stock=?,unlimited_stock=?,raw=?,last_seen=CURRENT_TIMESTAMP WHERE sku=?").bind(
        normalizedVerified.seller_id,normalizedVerified.seller_name,normalizedVerified.price,normalizedVerified.max_price,normalizedVerified.seller_active,normalizedVerified.stock,normalizedVerified.unlimited_stock,JSON.stringify(verified),sku
      )
    ]);
    await markAttentionDirty(env,[sku]);
    await log(env,"INFO","switch","Seller dipindahkan dan dikonfirmasi di Digiflazz: "+candidate.seller_name,sku);
    return {ok:true,sku,seller:candidate.seller_name,price:candidate.price,verified:true};
  } catch(error) {
    const status=error?.definitive===true?"error":sent?"unknown":"error";
    await env.DB.batch([
      env.DB.prepare("UPDATE switch_history SET status=? WHERE id=?").bind(status,record.meta.last_row_id),
      env.DB.prepare("UPDATE switch_operations SET status=? WHERE sku=?").bind(status,sku)
    ]);
    await log(env,"ERROR","switch",error.message+(status==="error"?" Target ditandai gagal; Auto Switch tidak mengulang seller ini sementara.":" Hasil belum pasti; tidak diulang otomatis."),sku);
    throw error;
  }
}
async function autoSwitchBatch(env, requestedLimit) {
  const cfg=await settings(env);
  if(!cfg.autoSwitch || cfg.dryRun) throw Error("Aktifkan Auto Switch dan matikan Mode Uji terlebih dahulu.");
  const verified=await env.DB.prepare("SELECT id FROM switch_history WHERE status='success' AND reason='manual' LIMIT 1").first();
  if(!verified) throw Error("Lakukan satu perpindahan seller manual yang berhasil sebelum menjalankan auto-switch.");
  const limit=Math.trunc(bounded(requestedLimit,1,10,cfg.autoSwitchBatchSize));
  const rows=await actionableAttentionRows(env,cfg,limit);
  const targets=rows.results.map(row=>{
    let attention_reasons=[];
    try { attention_reasons=JSON.parse(row.reasons_json||"[]"); } catch {}
    return {...row,attention_reasons};
  });
  let switched=0,noCandidate=0,skipped=0,failed=0;
  const results=[];
  for(const target of targets) {
    const sku=target.sku;
    try {
      const selection=await rankedOptions(env,sku);
      const current=JSON.parse(selection.product.raw),currentId=String(current.seller_sku_id??"");
      const rejected=await env.DB.prepare("SELECT target_seller_id FROM switch_operations WHERE sku=? AND status='error' AND started_at > datetime('now','-6 hours')").bind(sku).first();
      const rejectedId=str(rejected?.target_seller_id);
      const eligibleOptions=selection.options.filter(o=>o.eligible&&(!rejectedId||String(o.seller_id)!==rejectedId));
      const top=eligibleOptions[0]||null;
      const hardIssue=target.attention_reasons.some(reason=>[
        "Seller belum dipilih","Seller OFF","Harga di atas max price","Stok habis","Sedang cut-off"
      ].includes(reason));
      const best=top&&String(top.seller_id)!==currentId
        ? top
        : hardIssue
          ? eligibleOptions.find(o=>String(o.seller_id)!==currentId)
          : null;
      if(!best) {
        noCandidate++;
        await log(env,"INFO","auto-switch",top&&String(top.seller_id)===currentId?"Seller saat ini masih kandidat terbaik; tidak dipindahkan.":"Tidak ada kandidat seller yang memenuhi aturan.",sku);
        results.push({sku,status:"no_candidate"});
        continue;
      }
      const changed=await switchSeller(env,sku,best.seller_id,"auto",selection);
      switched++;
      results.push({sku,status:"switched",seller:changed.seller,price:changed.price});
      await refreshAttentionCache(env,cfg,[sku],1);
    } catch(error) {
      if(error?.message==="Produk masih dalam masa jeda perpindahan.") {
        skipped++;
        await log(env,"INFO","auto-switch","Dilewati: produk masih dalam masa jeda perpindahan.",sku);
        results.push({sku,status:"skipped",reason:"cooldown"});
        continue;
      }
      failed++;
      await log(env,"WARN","auto-switch",error.message,sku);
      results.push({sku,status:"error",error:error.message});
      await markAttentionDirty(env,[sku]);
    }
  }
  return {ok:true,examined:targets.length,switched,noCandidate,skipped,failed,remainingPossible:targets.length===limit,results};
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
    await env.DB.batch([
      env.DB.prepare("UPDATE switch_operations SET status='success' WHERE sku=?").bind(sku),
      env.DB.prepare("UPDATE products SET max_price=?,raw=?,last_seen=CURRENT_TIMESTAMP WHERE sku=?").bind(amount,JSON.stringify(verified),sku)
    ]);
    await markAttentionDirty(env,[sku]);
    await log(env,"INFO","max-price","Harga maksimum tersimpan: Rp"+amount,sku);
    return {ok:true,maxPrice:amount,verified:true};
  } catch(error) {
    const status=error?.definitive===true?"error":"unknown";
    await env.DB.prepare("UPDATE switch_operations SET status=? WHERE sku=?").bind(status,sku).run();
    await markAttentionDirty(env,[sku]);
    await log(env,"ERROR","max-price",error.message+(status==="error"?" Penolakan terkonfirmasi.":" Hasil belum pasti; tidak diulang otomatis."),sku);
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
  await markAttentionDirty(env,[sku]);
  await log(env,confirmed?"INFO":"WARN","reconcile",confirmed?"Perubahan terkonfirmasi di Digiflazz.":"Target tidak ditemukan pada data terbaru; periksa sebelum mengulang.",sku);
  return {ok:true,confirmed,status};
}
async function canonicalRuleTarget(env, scopeType, value) {
  const raw=str(value);
  if(!raw) throw Error("Target aturan wajib dipilih.");
  const columns={category:"category",brand:"brand",type:"product_type",product:"sku"};
  const column=columns[scopeType];
  if(!column) throw Error("Cakupan aturan tidak valid.");
  const row=await env.DB.prepare("SELECT "+column+" AS value FROM products WHERE "+column+"=? COLLATE NOCASE LIMIT 1").bind(raw).first();
  if(!row?.value) throw Error("Target aturan tidak ditemukan di katalog aktif. Pilih target dari daftar.");
  return str(row.value);
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
      const cfg=await settings(env);
      const [c, counts, sellerCount, last, events, verified]=await Promise.all([
        conn(env),attentionSummary(env,cfg),
        env.DB.prepare("SELECT count(*) total FROM sellers").first(),
        env.DB.prepare("SELECT * FROM scan_runs ORDER BY id DESC LIMIT 1").first(),
        env.DB.prepare("SELECT id,level,kind,sku,message,created_at FROM events ORDER BY id DESC LIMIT 8").all(),
        env.DB.prepare("SELECT id FROM switch_history WHERE status='success' AND reason='manual' LIMIT 1").first()
      ]);
      return reply({ok:true,connection:{connected:!!c,lastTestStatus:c?.last_test_status,lastTestAt:c?.last_test_at},settings:cfg,counts:{...counts,sellers:Number(sellerCount?.total)||0},lastScan:last,events:events.results,liveSwitchAvailable:!!verified});
    }
    if (method==="GET" && path==="/api/connection/status") {
      const c=await conn(env);
      return reply({ok:true,connected:!!c,sourceHost:c?.source_host,lastTestStatus:c?.last_test_status,lastTestAt:c?.last_test_at,updatedAt:c?.updated_at});
    }
    if (method==="POST" && path==="/api/connection") {
      if (!env.SESSION_ENCRYPTION_KEY) return failure("Secret enkripsi belum terpasang.",503);
      const body=await getJson(req),data=parseCurl(body.curl),target=hostUrl(data.url);
      const test=await fetch(target,{method:data.method,headers:data.headers,redirect:"manual",signal:AbortSignal.timeout(20000)});
      if(test.status<200||test.status>=300) throw Error("cURL tidak disimpan karena sesi Digiflazz gagal diuji (HTTP "+test.status+").");
      const sealed=await seal(data,env.SESSION_ENCRYPTION_KEY);
      await env.DB.prepare("INSERT INTO digiflazz_connections(id,encrypted_payload,iv,source_host,last_test_status,last_test_at) VALUES(1,?,?,'member.digiflazz.com',?,CURRENT_TIMESTAMP) ON CONFLICT(id) DO UPDATE SET encrypted_payload=excluded.encrypted_payload,iv=excluded.iv,source_host=excluded.source_host,last_test_status=excluded.last_test_status,last_test_at=CURRENT_TIMESTAMP,updated_at=CURRENT_TIMESTAMP").bind(sealed.encrypted,sealed.iv,test.status).run();
      await log(env,"INFO","connection","Sesi Digiflazz diuji dan diperbarui (HTTP "+test.status+").");
      return reply({ok:true,saved:true,connected:true,httpStatus:test.status});
    }
    if (method==="POST" && path==="/api/connection/test") {
      const c=await conn(env); if (!c) return failure("Belum ada sesi.",404);
      if (!env.SESSION_ENCRYPTION_KEY) return failure("Secret enkripsi belum terpasang.",503);
      const data=await unseal(c,env.SESSION_ENCRYPTION_KEY),target=hostUrl(data.url);
      const res=await fetch(target,{method:data.method,headers:data.headers,redirect:"manual",signal:AbortSignal.timeout(20000)});
      const good=res.status>=200&&res.status<300;
      await env.DB.prepare("UPDATE digiflazz_connections SET last_test_status=?,last_test_at=CURRENT_TIMESTAMP WHERE id=1").bind(res.status).run();
      await log(env,good?"INFO":"WARN","connection-test","Uji sesi Digiflazz HTTP "+res.status+".");
      return reply({ok:true,connected:good,httpStatus:res.status});
    }
    if (method==="DELETE" && path==="/api/connection") {
      await env.DB.prepare("DELETE FROM digiflazz_connections WHERE id=1").run();
      await log(env,"WARN","connection","Sesi Digiflazz diputus dari tools.");
      return reply({ok:true,disconnected:true});
    }
    if (method==="POST" && path==="/api/scan") return reply(await scan(env));
    if (method==="POST" && path==="/api/automation/run") {
      const body=await getJson(req);
      return reply(await autoSwitchBatch(env,body.limit));
    }
    if (method==="GET" && path==="/api/products") {
      const page=Math.trunc(bounded(url.searchParams.get("page"),1,100000,1));
      const offset=(page-1)*50;
      const q="%"+str(url.searchParams.get("q")).slice(0,80)+"%";
      const status=str(url.searchParams.get("status"));
      const category=str(url.searchParams.get("category")).slice(0,120);
      const brand=str(url.searchParams.get("brand")).slice(0,120);
      const cfg=status==="actionable"?await settings(env):null;
      let where="WHERE (p.sku LIKE ? OR p.name LIKE ? OR p.brand LIKE ? OR p.category LIKE ?)";
      const args=[q,q,q,q];
      if(category){where+=" AND p.category=?";args.push(category)}
      if(brand){where+=" AND p.brand=?";args.push(brand)}
      if(status==="issues")where+=" AND a.dirty=0 AND a.needs_attention=1";
      else if(status==="actionable"){
        where+=" AND a.dirty=0 AND a.needs_attention=1 AND p.active=1 AND p.max_price>0 AND a.best_candidate_seller IS NOT NULL AND l.buyer_sku_code IS NULL AND COALESCE(op.status,'') NOT IN ('pending','unknown') AND NOT EXISTS (SELECT 1 FROM switch_history sh WHERE sh.buyer_sku_code=p.sku AND sh.status='success' AND sh.created_at>?)";
        args.push(autoSwitchCooldownCutoff(cfg));
      }
      else if(status==="missing-max")where+=" AND p.max_price<=0";
      else if(status==="locked")where+=" AND l.buyer_sku_code IS NOT NULL";
      else if(status==="active")where+=" AND p.active=1";
      else if(status==="inactive")where+=" AND p.active=0";
      const from=` FROM products p
        LEFT JOIN product_attention a ON a.sku=p.sku
        LEFT JOIN product_locks l ON l.buyer_sku_code=p.sku
        LEFT JOIN switch_operations op ON op.sku=p.sku `;
      const brandSql=category?"SELECT DISTINCT brand FROM products WHERE category=? AND brand<>'' ORDER BY brand COLLATE NOCASE":"SELECT DISTINCT brand FROM products WHERE brand<>'' ORDER BY brand COLLATE NOCASE";
      const [count,rows,categories,brands]=await Promise.all([
        env.DB.prepare("SELECT count(*) total"+from+where).bind(...args).first(),
        env.DB.prepare(`SELECT p.sku,p.product_id,p.name,p.category,p.brand,p.product_type,p.seller_name,p.price,p.max_price,p.active,p.seller_active,p.stock,p.unlimited_stock,p.last_seen,p.nominal_value,
          l.buyer_sku_code IS NOT NULL AS locked,
          COALESCE(a.needs_attention,0) AS needs_attention,COALESCE(a.dirty,1) AS attention_dirty,
          a.reasons_json,a.current_rating,a.current_sla,a.best_candidate_seller,a.best_candidate_price,a.best_candidate_rating,a.best_candidate_sla,
          a.option_count,a.operation_status
          `+from+where+`
          ORDER BY p.brand COLLATE NOCASE ASC,
            CASE WHEN p.nominal_value IS NULL THEN 1 ELSE 0 END ASC,
            p.nominal_value ASC,p.name COLLATE NOCASE ASC,p.sku COLLATE NOCASE ASC
          LIMIT 50 OFFSET ?`).bind(...args,offset).all(),
        env.DB.prepare("SELECT DISTINCT category FROM products WHERE category<>'' ORDER BY category COLLATE NOCASE").all(),
        category?env.DB.prepare(brandSql).bind(category).all():env.DB.prepare(brandSql).all()
      ]);
      const products=rows.results.map(row=>{
        let attention_reasons=[];
        try { attention_reasons=JSON.parse(row.reasons_json||"[]"); } catch {}
        return {...row,attention_reasons,needs_attention:Boolean(row.needs_attention),attention_dirty:Boolean(row.attention_dirty),locked:Boolean(row.locked)};
      });
      return reply({ok:true,total:Number(count?.total)||0,page,products,categories:categories.results.map(x=>x.category),brands:brands.results.map(x=>x.brand)});
    }
    const opt=path.match(/^\/api\/products\/([^/]+)\/options$/);
    if (method==="GET" && opt) {
      const sku=decodeURIComponent(opt[1]);
      const shape=async(d,connectorReady)=>{
        const op=await env.DB.prepare("SELECT status,target_seller_id,started_at FROM switch_operations WHERE sku=?").bind(sku).first();
        const raw=JSON.parse(d.product.raw),currentId=String(raw.seller_sku_id??"");
        const rejectedAt=op?.status==="error"&&op?.started_at?Date.parse(String(op.started_at).replace(" ","T")+"Z"):0;
        const rejectedId=rejectedAt&&Date.now()-rejectedAt<6*3600000?str(op?.target_seller_id):"";
        const policyOptions=rejectedId?d.options.filter(x=>String(x.seller_id)!==rejectedId):d.options;
        const current=policyOptions.find(x=>String(x.seller_id)===currentId)||null;
        const best=policyOptions.find(x=>x.eligible)||null;
        const replacement=policyOptions.find(x=>x.eligible&&String(x.seller_id)!==currentId)||null;
        const attention=attentionReasons({...d.product,operation_status:op?.status,start_cut_off:raw.start_cut_off,end_cut_off:raw.end_cut_off,option_count:policyOptions.length,current_option_seller_id:current?.seller_id,current_rating:current?.rating,current_sla:current?.sla},d.config,new Date(),{ranked:policyOptions,current,best});
        const cached={...d.product,operation_status:op?.status,current_rating:current?.rating??null,current_sla:current?.sla??null,option_count:policyOptions.length,attention_reasons:attention,needs_attention:attention.length>0,nominal_value:productNominalValue(d.product),best_candidate_seller:replacement?.seller_name||null,best_candidate_price:replacement?.price??null,best_candidate_rating:replacement?.rating??null,best_candidate_sla:replacement?.sla_days??null};
        await persistAttentionRows(env,[cached]);
        return {ok:true,product:{...cached,raw:undefined,current_seller_sku_id:currentId},operation:op,options:d.options.map(({raw,...option})=>option),connectorReady};
      };
      try { return reply(await shape(await rankedOptions(env,sku),true)); }
      catch(error) { await log(env,"WARN","seller-options",error.message,sku); }
      return reply(await shape(await rankedOptions(env,sku,false),false));
    }
    const lock=path.match(/^\/api\/products\/([^/]+)\/lock$/);
    if(method==="POST"&&lock) {
      const sku=decodeURIComponent(lock[1]),body=await getJson(req),locked=bool(body.locked);
      if(locked) await env.DB.prepare("INSERT INTO product_locks(buyer_sku_code,reason) VALUES(?,?) ON CONFLICT(buyer_sku_code) DO UPDATE SET reason=excluded.reason").bind(sku,str(body.reason)||"manual").run();
      else await env.DB.prepare("DELETE FROM product_locks WHERE buyer_sku_code=?").bind(sku).run();
      await markAttentionDirty(env,[sku]);
      await log(env,"INFO","automation-lock",locked?"Auto Switch dikunci untuk produk ini. Aksi manual tetap diperbolehkan.":"Kunci Auto Switch dibuka.",sku);
      return reply({ok:true,locked});
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
    const skuEdit=path.match(/^\/api\/products\/([^/]+)\/sku$/);
    if(method==="POST"&&skuEdit) {
      const body=await getJson(req);
      return reply(await updateBuyerSku(env,decodeURIComponent(skuEdit[1]),body.sku));
    }
    const statusEdit=path.match(/^\/api\/products\/([^/]+)\/status$/);
    if(method==="POST"&&statusEdit) {
      const body=await getJson(req);
      if(!Object.prototype.hasOwnProperty.call(body,"active"))throw Error("Status aktif wajib dikirim.");
      return reply(await setBuyerProductStatus(env,decodeURIComponent(statusEdit[1]),bool(body.active)));
    }
    const productDelete=path.match(/^\/api\/products\/([^/]+)$/);
    if(method==="DELETE"&&productDelete) {
      return reply(await deleteBuyerProduct(env,decodeURIComponent(productDelete[1])));
    }
    const pending=path.match(/^\/api\/products\/([^/]+)\/reconcile$/);
    if(method==="POST"&&pending)return reply(await reconcile(env,decodeURIComponent(pending[1])));
    if(method==="GET"&&path==="/api/sellers") {
      const rows=await env.DB.prepare("SELECT s.seller_id,s.name,s.rating,s.review_count,s.product_count,s.invoice,p.mode FROM sellers s LEFT JOIN seller_preferences p ON p.seller_name=s.name AND p.mode='blocked' ORDER BY s.rating DESC,s.name LIMIT 1000").all();
      return reply({ok:true,sellers:rows.results});
    }
    const pref=path.match(/^\/api\/sellers\/([^/]+)\/preference$/);
    if(method==="POST"&&pref) {
      const body=await getJson(req), name=decodeURIComponent(pref[1]);
      if(!["blocked","none"].includes(body.mode))throw Error("Pilihan tidak valid.");
      await env.DB.prepare("DELETE FROM seller_preferences WHERE seller_name=?").bind(name).run();
      if(body.mode!=="none") await env.DB.prepare("INSERT INTO seller_preferences(seller_name,mode) VALUES(?,?)").bind(name,body.mode).run();
      await markAttentionDirty(env);
      return reply({ok:true,mode:body.mode});
    }
    if(method==="GET"&&path==="/api/rules") {
      const [rows,categories,brands,types,products]=await Promise.all([
        env.DB.prepare("SELECT id,scope_type,scope_value,min_rating,is_active,created_at FROM seller_rules WHERE scope_type IN ('category','brand','type','product') ORDER BY id DESC").all(),
        env.DB.prepare("SELECT DISTINCT category value FROM products WHERE category<>'' ORDER BY category COLLATE NOCASE").all(),
        env.DB.prepare("SELECT DISTINCT brand value FROM products WHERE brand<>'' ORDER BY brand COLLATE NOCASE").all(),
        env.DB.prepare("SELECT DISTINCT product_type value FROM products WHERE product_type<>'' ORDER BY product_type COLLATE NOCASE").all(),
        env.DB.prepare("SELECT sku value,name,brand FROM products ORDER BY brand COLLATE NOCASE,nominal_value,name COLLATE NOCASE LIMIT 2000").all()
      ]);
      return reply({
        ok:true,
        rules:rows.results,
        targets:{
          category:categories.results.map(x=>x.value),
          brand:brands.results.map(x=>x.value),
          type:types.results.map(x=>x.value),
          product:products.results.map(x=>({value:x.value,label:(x.brand?x.brand+" · ":"")+x.name+" · "+x.value}))
        }
      });
    }
    if(method==="POST"&&path==="/api/rules") {
      const b=await getJson(req),scope=str(b.scope_type);
      if(!["category","brand","type","product"].includes(scope))throw Error("Cakupan tidak valid.");
      const target=await canonicalRuleTarget(env,scope,b.scope_value);
      const rating=b.min_rating==null||b.min_rating===""?null:Number(b.min_rating);
      if(rating!=null&&(!Number.isFinite(rating)||rating<4||rating>5))throw Error("Rating minimal harus antara 4.0 dan 5.0.");
      const existing=await env.DB.prepare("SELECT id FROM seller_rules WHERE scope_type=? AND scope_value=? COLLATE NOCASE ORDER BY id DESC LIMIT 1").bind(scope,target).first();
      let id;
      if(existing?.id) {
        id=Number(existing.id);
        await env.DB.batch([
          env.DB.prepare("UPDATE seller_rules SET scope_value=?,min_rating=?,max_price=NULL,require_stock=1,avoid_cutoff=1,is_active=1 WHERE id=?").bind(target,rating,id),
          env.DB.prepare("DELETE FROM seller_rules WHERE scope_type=? AND scope_value=? COLLATE NOCASE AND id<>?").bind(scope,target,id)
        ]);
      } else {
        const r=await env.DB.prepare("INSERT INTO seller_rules(scope_type,scope_value,min_rating,max_price,require_stock,avoid_cutoff) VALUES(?,?,?,NULL,1,1)").bind(scope,target,rating).run();
        id=Number(r.meta.last_row_id);
      }
      await markAttentionDirty(env);
      return reply({ok:true,id,updated:!!existing?.id});
    }
    const rule=path.match(/^\/api\/rules\/(\d+)$/);
    if(method==="DELETE"&&rule) {
      await env.DB.prepare("DELETE FROM seller_rules WHERE id=?").bind(Number(rule[1])).run();
      await markAttentionDirty(env);
      return reply({ok:true});
    }
    if(method==="GET"&&path==="/api/zones") {
      const [zones,assignments,products]=await Promise.all([
        env.DB.prepare("SELECT z.id,z.name,z.patterns,z.created_at,count(a.sku) assignment_count FROM zones z LEFT JOIN zone_assignments a ON a.zone_id=z.id GROUP BY z.id ORDER BY z.name COLLATE NOCASE").all(),
        env.DB.prepare("SELECT a.sku,a.zone_id,z.name zone_name,p.name product_name,p.brand FROM zone_assignments a JOIN zones z ON z.id=a.zone_id LEFT JOIN products p ON p.sku=a.sku ORDER BY p.brand COLLATE NOCASE,p.nominal_value,p.name COLLATE NOCASE,a.sku").all(),
        env.DB.prepare("SELECT sku,name,brand,nominal_value FROM products ORDER BY brand COLLATE NOCASE,CASE WHEN nominal_value IS NULL THEN 1 ELSE 0 END,nominal_value,name COLLATE NOCASE,sku COLLATE NOCASE LIMIT 2000").all()
      ]);
      return reply({ok:true,zones:zones.results,assignments:assignments.results,products:products.results});
    }
    if(method==="POST"&&path==="/api/zones") {
      const b=await getJson(req),name=str(b.name),patterns=[...new Set(str(b.patterns).split(",").map(x=>x.trim().toLowerCase()).filter(Boolean))];
      if(!name||name.length>80||!patterns.length)throw Error("Nama zona dan minimal satu pola wajib diisi.");
      const duplicate=await env.DB.prepare("SELECT id FROM zones WHERE name=? COLLATE NOCASE LIMIT 1").bind(name).first();
      if(duplicate)throw Error("Nama zona sudah digunakan.");
      const r=await env.DB.prepare("INSERT INTO zones(name,product_id,patterns) VALUES(?,'',?)").bind(name,JSON.stringify(patterns)).run();
      return reply({ok:true,id:r.meta.last_row_id});
    }
    const zone=path.match(/^\/api\/zones\/(\d+)$/);
    if(method==="DELETE"&&zone) {
      const zoneId=Number(zone[1]);
      const assigned=await env.DB.prepare("SELECT sku FROM zone_assignments WHERE zone_id=?").bind(zoneId).all();
      await env.DB.prepare("DELETE FROM zones WHERE id=?").bind(zoneId).run();
      if(assigned.results.length)await markAttentionDirty(env,assigned.results.map(x=>x.sku));
      return reply({ok:true});
    }
    if(method==="POST"&&path==="/api/zones/assign") {
      const b=await getJson(req),sku=str(b.sku);
      if(!sku)throw Error("SKU wajib dipilih.");
      const product=await env.DB.prepare("SELECT sku FROM products WHERE sku=?").bind(sku).first();
      if(!product)throw Error("SKU tidak ditemukan di katalog.");
      if(b.zone_id) {
        const zoneId=Number(b.zone_id);
        if(!Number.isInteger(zoneId)||zoneId<1)throw Error("Zona tidak valid.");
        const exists=await env.DB.prepare("SELECT id FROM zones WHERE id=?").bind(zoneId).first();
        if(!exists)throw Error("Zona tidak ditemukan.");
        await env.DB.prepare("INSERT INTO zone_assignments(sku,zone_id) VALUES(?,?) ON CONFLICT(sku) DO UPDATE SET zone_id=excluded.zone_id").bind(sku,zoneId).run();
      } else {
        await env.DB.prepare("DELETE FROM zone_assignments WHERE sku=?").bind(sku).run();
      }
      await markAttentionDirty(env,[sku]);
      return reply({ok:true});
    }
    if(method==="GET"&&path==="/api/events") {
      const level=str(url.searchParams.get("level")).toUpperCase();
      const kind=str(url.searchParams.get("kind")).slice(0,80);
      const sku=str(url.searchParams.get("sku")).slice(0,80);
      const q=str(url.searchParams.get("q")).slice(0,120);
      let where="WHERE 1=1",args=[];
      if(level&&["INFO","WARN","ERROR"].includes(level)){where+=" AND level=?";args.push(level)}
      if(kind){where+=" AND kind=?";args.push(kind)}
      if(sku){where+=" AND sku LIKE ?";args.push("%"+sku+"%")}
      if(q){where+=" AND message LIKE ?";args.push("%"+q+"%")}
      const [rows,kinds]=await Promise.all([
        env.DB.prepare("SELECT id,level,kind,sku,message,created_at FROM events "+where+" ORDER BY id DESC LIMIT 200").bind(...args).all(),
        env.DB.prepare("SELECT DISTINCT kind FROM events WHERE kind<>'' ORDER BY kind COLLATE NOCASE").all()
      ]);
      return reply({ok:true,events:rows.results,kinds:kinds.results.map(x=>x.kind)});
    }
    if(method==="GET"&&path==="/api/history") {
      const sku=str(url.searchParams.get("sku")).slice(0,80);
      const status=str(url.searchParams.get("status")).toLowerCase();
      const reason=str(url.searchParams.get("reason")).toLowerCase();
      let priceWhere="",priceArgs=[],switchWhere="WHERE 1=1",switchArgs=[];
      if(sku){
        priceWhere="WHERE buyer_sku_code LIKE ?";priceArgs.push("%"+sku+"%");
        switchWhere+=" AND buyer_sku_code LIKE ?";switchArgs.push("%"+sku+"%");
      }
      if(status&&["pending","unknown","success","error"].includes(status)){switchWhere+=" AND status=?";switchArgs.push(status)}
      if(reason&&["manual","auto"].includes(reason)){switchWhere+=" AND reason=?";switchArgs.push(reason)}
      const [prices,switches,runs]=await Promise.all([
        env.DB.prepare("SELECT buyer_sku_code,seller_name,price,captured_at FROM price_history "+priceWhere+" ORDER BY id DESC LIMIT 100").bind(...priceArgs).all(),
        env.DB.prepare("SELECT buyer_sku_code,from_seller,to_seller,reason,status,created_at FROM switch_history "+switchWhere+" ORDER BY id DESC LIMIT 100").bind(...switchArgs).all(),
        env.DB.prepare("SELECT id,status,total,issues,message,started_at,finished_at FROM scan_runs ORDER BY id DESC LIMIT 50").all()
      ]);
      return reply({ok:true,prices:prices.results,switches:switches.results,runs:runs.results});
    }
    if(method==="GET"&&path==="/api/browser-config") {
      const cfg=await settings(env),prefs=await env.DB.prepare("SELECT seller_name,mode FROM seller_preferences ORDER BY seller_name COLLATE NOCASE").all();
      return reply({
        ok:true,
        version:1,
        generatedAt:new Date().toISOString(),
        config:{
          minRating:cfg.minRating,
          minReviews:cfg.minReviews,
          priceTolerancePercent:cfg.priceTolerancePercent,
          blocked:prefs.results.filter(x=>x.mode==="blocked").map(x=>x.seller_name)
        }
      });
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
      await markAttentionDirty(env);
      return reply({ok:true,settings:next});
    }
    return failure("Halaman API tidak ditemukan.",404);
  } catch(error) {
    return failure(error, /sesi|Digiflazz mengembalikan|format katalog|tidak mengembalikan/i.test(error.message)?502:400);
  }
}
export { rank, normalizeProduct, validateSettings, changedProduct, inCutoffWindow, slaDays, validBuyerSku, reviewValue, attentionReasons, parseNominalToken, productNominalValue, productSortCompare, matchingRuleForProduct };
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
      await env.DB.prepare("UPDATE scan_runs SET status='error',finished_at=CURRENT_TIMESTAMP,message='Invocation sebelumnya berhenti sebelum scan selesai.' WHERE status='running' AND started_at < datetime('now','-20 minutes')").run();
      const cfg=await settings(env);
      const last=await env.DB.prepare("SELECT finished_at FROM scan_runs WHERE status='success' ORDER BY id DESC LIMIT 1").first();
      const lastMs=last?.finished_at?Date.parse(last.finished_at.replace(" ","T")+"Z"):0;
      const age=lastMs?Date.now()-lastMs:Infinity;
      const liveAuto=cfg.autoSwitch&&!cfg.dryRun;
      const scanCadence=cfg.scanIntervalMinutes*60000*(liveAuto?2:1);

      // Never combine a full catalog scan and live auto-switch in the same invocation.
      // On the Free plan this keeps external/internal subrequests safely separated.
      if(cfg.scanEnabled && age>=scanCadence) {
        await scan(env,"cron");
        return;
      }

      // Recompute only dirty materialized attention rows; overview/product pages never fan out across all sellers.
      await refreshAttentionCache(env,cfg,null,100);

      if(liveAuto) {
        try {
          const summary=await autoSwitchBatch(env,cfg.autoSwitchBatchSize);
          if(summary.examined) await log(env,"INFO","auto-switch","Batch otomatis: "+summary.switched+" pindah, "+summary.noCandidate+" tanpa kandidat, "+summary.skipped+" dilewati, "+summary.failed+" gagal.");
        } catch(error) { await log(env,"WARN","auto-switch",error.message); }
        return;
      }

    } catch(error) { try { await log(env,"ERROR","cron",error.message); } catch {} }
  }};
