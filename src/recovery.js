import original from "./index.js";
const allowed=new Set(["/","/api/health","/api/bootstrap","/api/connection/status","/api/products","/api/rules","/api/zones","/api/events","/api/history","/api/settings","/api/browser-config"]);
export default {
 async fetch(request,env,ctx){
  const path=new URL(request.url).pathname;
  if(request.method!=="GET" || !allowed.has(path)) return new Response(JSON.stringify({error:"Pemulihan sedang berlangsung. Operasi Digiflazz dinonaktifkan sementara."}),{status:503,headers:{"content-type":"application/json","cache-control":"no-store"}});
  return original.fetch(request,env,ctx);
 },
 async scheduled(){ }
};