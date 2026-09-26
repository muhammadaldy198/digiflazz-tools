function json(data,status=200){return Response.json(data,{status,headers:{"cache-control":"no-store","content-security-policy":"default-src 'none'; frame-ancestors 'none'"}})}
const enc=new TextEncoder(),dec=new TextDecoder();
function b64(bytes){let s="";for(const b of bytes)s+=String.fromCharCode(b);return btoa(s)}
function unb64(v){const s=atob(v),o=new Uint8Array(s.length);for(let i=0;i<s.length;i++)o[i]=s.charCodeAt(i);return o}
async function cryptoKey(secret){const d=await crypto.subtle.digest("SHA-256",enc.encode(secret));return crypto.subtle.importKey("raw",d,{name:"AES-GCM"},false,["encrypt","decrypt"])}
async function seal(payload,secret){const iv=crypto.getRandomValues(new Uint8Array(12));const c=await crypto.subtle.encrypt({name:"AES-GCM",iv},await cryptoKey(secret),enc.encode(JSON.stringify(payload)));return{encrypted:b64(new Uint8Array(c)),iv:b64(iv)}}
async function openSession(cipher,iv,secret){const p=await crypto.subtle.decrypt({name:"AES-GCM",iv:unb64(iv)},await cryptoKey(secret),unb64(cipher));return JSON.parse(dec.decode(p))}
function isDigi(host){host=host.toLowerCase();return host==="digiflazz.com"||host.endsWith(".digiflazz.com")}
function opt(src,name){const e=name.replace(/[.*+?^$()|[\]\\]/g,"\\$&");const m=src.match(new RegExp("(?:^|\\s)"+e+"\\s+(?:'([^']*)'|\\\"([^\\\"]*)\\\"|(\\S+))","i"));return m?(m[1]||m[2]||m[3]||null):null}
function parseCurl(input){
  if(!input||input.length>100000)throw Error("cURL kosong atau terlalu panjang.");
  const src=input.replace(/\\\r?\n/g," ").trim();
  if(!/^curl\s/i.test(src))throw Error("Format harus berupa perintah cURL.");
  const m=src.match(/['"](https:\/\/[^'"]+)['"]/)||src.match(/\b(https:\/\/[^\s]+)/);
  if(!m||!m[1])throw Error("URL HTTPS tidak ditemukan.");
  const url=new URL(m[1]);if(!isDigi(url.hostname))throw Error("cURL harus berasal dari domain Digiflazz.");
  const method=String(opt(src,"-X")||opt(src,"--request")||"GET").toUpperCase();
  if(method!=="GET"&&method!=="HEAD")throw Error("Pilih request GET/HEAD dari dashboard Digiflazz untuk koneksi awal.");
  const headers={},allowed=new Set(["cookie","x-csrf-token","x-xsrf-token","user-agent","referer","origin","accept","content-type","x-requested-with"]);
  const re=/(?:^|\s)(?:-H|--header)\s+(?:'([^']*)'|"([^"]*)")/gi;
  for(const x of src.matchAll(re)){const raw=x[1]||x[2]||"",i=raw.indexOf(":");if(i<1)continue;const n=raw.slice(0,i).trim().toLowerCase(),v=raw.slice(i+1).trim();if(allowed.has(n))headers[n]=v}
  const cookie=opt(src,"-b")||opt(src,"--cookie");if(cookie&&!headers.cookie)headers.cookie=cookie;
  if(!headers.cookie)throw Error("Cookie sesi tidak ditemukan pada cURL.");
  return{url:url.toString(),method,headers,capturedAt:new Date().toISOString()}
}
async function getRow(env){return env.DB.prepare("SELECT encrypted_payload,iv,source_host,last_test_status,last_test_at,updated_at FROM digiflazz_connections WHERE id=1").first()}
async function api(request,env,url){
  if(url.pathname==="/api/health"){let database=false;try{await env.DB.prepare("SELECT 1").first();database=true}catch{}return json({ok:true,service:"digiflazz-tools",database})}
  if(!request.headers.get("cf-access-jwt-assertion"))return json({ok:false,error:"Cloudflare Access authentication required."},401);
  if(url.pathname==="/api/connection/status"&&request.method==="GET"){const r=await getRow(env);return json({ok:true,connected:!!r,sourceHost:r?.source_host||null,lastTestStatus:r?.last_test_status||null,lastTestAt:r?.last_test_at||null,updatedAt:r?.updated_at||null})}
  if(url.pathname==="/api/connection"&&request.method==="POST"){
    if(!env.SESSION_ENCRYPTION_KEY)return json({ok:false,error:"Encryption secret belum aktif."},503);
    try{const body=await request.json(),session=parseCurl(body.curl||""),sealed=await seal(session,env.SESSION_ENCRYPTION_KEY),host=new URL(session.url).hostname;
      await env.DB.prepare("INSERT INTO digiflazz_connections(id,encrypted_payload,iv,source_host,created_at,updated_at) VALUES(1,?,?,?,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP) ON CONFLICT(id) DO UPDATE SET encrypted_payload=excluded.encrypted_payload,iv=excluded.iv,source_host=excluded.source_host,last_test_status=NULL,last_test_at=NULL,updated_at=CURRENT_TIMESTAMP").bind(sealed.encrypted,sealed.iv,host).run();
      return json({ok:true,saved:true,sourceHost:host})
    }catch(e){return json({ok:false,error:e instanceof Error?e.message:"Gagal memproses cURL."},400)}
  }
  if(url.pathname==="/api/connection/test"&&request.method==="POST"){
    if(!env.SESSION_ENCRYPTION_KEY)return json({ok:false,error:"Encryption secret belum aktif."},503);
    const r=await getRow(env);if(!r)return json({ok:false,error:"Belum ada sesi Digiflazz tersimpan."},404);
    try{const s=await openSession(r.encrypted_payload,r.iv,env.SESSION_ENCRYPTION_KEY),u=new URL(s.url);if(!isDigi(u.hostname))throw Error("Host sesi tidak valid.");
      const res=await fetch(u.toString(),{method:s.method,headers:s.headers,redirect:"manual"}),loc=res.headers.get("location")||"",connected=res.status>=200&&res.status<400&&!/login|signin|auth/i.test(loc);
      await env.DB.prepare("UPDATE digiflazz_connections SET last_test_status=?,last_test_at=CURRENT_TIMESTAMP,updated_at=CURRENT_TIMESTAMP WHERE id=1").bind(res.status).run();
      return json({ok:true,connected,httpStatus:res.status,message:connected?"Sesi Digiflazz merespons dengan baik.":"Sesi perlu diperbarui atau request cURL tidak cocok."})
    }catch(e){return json({ok:false,connected:false,error:e instanceof Error?e.message:"Tes koneksi gagal."},502)}
  }
  if(url.pathname==="/api/connection"&&request.method==="DELETE"){await env.DB.prepare("DELETE FROM digiflazz_connections WHERE id=1").run();return json({ok:true,disconnected:true})}
  return json({ok:false,error:"Not found."},404)
}
const PAGE='<!doctype html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="dark"><title>Digiflazz Tools</title><style>body{font-family:system-ui,sans-serif;background:#080d19;color:#eef2ff;margin:0;min-height:100vh}main{width:min(760px,calc(100% - 28px));margin:auto;padding:42px 0}.card{background:#0e1628;border:1px solid #26324e;border-radius:18px;padding:22px}h1{margin:0 0 8px}.lead,.help{color:#9dadcb;line-height:1.6}.status{padding:12px;border:1px solid #293650;border-radius:12px;margin:18px 0}textarea{width:100%;min-height:210px;background:#070c16;color:#dbeafe;border:1px solid #33405d;border-radius:12px;padding:14px;box-sizing:border-box}.actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:12px}button{border:0;border-radius:10px;padding:11px 15px;font-weight:800;background:#2563eb;color:white}button.secondary{background:#17233a}button.danger{background:#451a24}#message{min-height:22px;margin-top:12px;color:#bfdbfe}</style></head><body><main><h1>Hubungkan Digiflazz</h1><p class="lead">Seperti OtoSwitch: login Digiflazz, Copy as cURL dari request GET dashboard, lalu paste sekali di sini. Password Digiflazz tidak disimpan.</p><section class="card"><div class="status" id="status">Memeriksa koneksi...</div><textarea id="curl" spellcheck="false" placeholder="Paste Copy as cURL dari dashboard Digiflazz"></textarea><div class="actions"><button id="save">Simpan Session</button><button id="test" class="secondary">Tes Koneksi</button><button id="disconnect" class="danger">Putuskan</button></div><div id="message"></div><p class="help">Session disaring lalu dienkripsi AES-GCM sebelum disimpan di D1. Jangan taruh cURL/session di GitHub atau chat.</p></section></main><script>const q=id=>document.getElementById(id);async function call(path,opt={}){const r=await fetch(path,{...opt,headers:{"content-type":"application/json",...(opt.headers||{})}}),b=await r.json().catch(()=>({}));if(!r.ok)throw Error(b.error||"Request gagal");return b}async function refresh(){try{const d=await call("/api/connection/status");q("status").textContent=d.connected?"Session tersimpan"+(d.lastTestStatus?" · HTTP "+d.lastTestStatus:""):"Belum terhubung"}catch{q("status").textContent="Status tidak tersedia"}}q("save").onclick=async()=>{try{q("message").textContent="Menyimpan session terenkripsi...";const d=await call("/api/connection",{method:"POST",body:JSON.stringify({curl:q("curl").value})});q("message").textContent="Session tersimpan dari "+d.sourceHost+". Klik Tes Koneksi.";q("curl").value="";refresh()}catch(e){q("message").textContent=e.message}};q("test").onclick=async()=>{try{q("message").textContent="Menguji session...";const d=await call("/api/connection/test",{method:"POST",body:"{}"});q("message").textContent=d.message+" HTTP "+d.httpStatus;refresh()}catch(e){q("message").textContent=e.message}};q("disconnect").onclick=async()=>{try{await call("/api/connection",{method:"DELETE"});q("message").textContent="Session dihapus.";refresh()}catch(e){q("message").textContent=e.message}};refresh()</script></body></html>';
export default{async fetch(request,env){const url=new URL(request.url);if(url.pathname.startsWith("/api/"))return api(request,env,url);return new Response(PAGE,{headers:{"content-type":"text/html; charset=utf-8","cache-control":"no-store","content-security-policy":"default-src 'self'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'","referrer-policy":"no-referrer","x-content-type-options":"nosniff"}})}};
