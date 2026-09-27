// ==UserScript==
// @name         Digi Tools — Auto Select Seller
// @namespace    https://tools.lfamiliastore.my.id/
// @version      2.0.0
// @description  Pilih seller langsung di halaman produk Digiflazz. Sesi tetap di browser.
// @match        https://member.digiflazz.com/*
// @match        https://tools.lfamiliastore.my.id/*
// @run-at       document-end
// @inject-into  content
// @grant        GM_info
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @noframes
// @downloadURL  https://raw.githubusercontent.com/muhammadaldy198/digiflazz-tools/main/extension/digi-select.user.js
// @updateURL    https://raw.githubusercontent.com/muhammadaldy198/digiflazz-tools/main/extension/digi-select.user.js
// ==/UserScript==

(() => {
  "use strict";
  const testing=typeof module!=="undefined" && !!module.exports;
  const KEY = "digiTools.autoSeller.v1";
  const SYNC_KEY = "digiTools.syncedSellerConfig.v1";
  const BROWSER_DEFAULTS = {enabled:true,saveMode:"manual",autoServiceCode:true};
  const RANK_DEFAULTS = {minRating:4,minReviews:0,priceTolerancePercent:2,preferred:[],blocked:[],syncedAt:null};
  const DEFAULTS = {...BROWSER_DEFAULTS,...RANK_DEFAULTS};
  const str = value => String(value ?? "").trim();
  const names = value => new Set((Array.isArray(value)?value:str(value).split(/[\n,]/)).map(x=>str(x).toLowerCase()).filter(Boolean));
  function reviewCount(value) {
    const raw=str(value);
    if (raw.startsWith("<")) return 0;
    return Number(raw.match(/^\d+/)?.[0] || 0);
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
    if(!prefix || !Number.isSafeInteger(value) || value<1) return null;
    return prefix+String(value);
  }
  function slaDays(value) {
    const text=str(value).replace(/\s+/g," ").trim();
    if(!text)return 999;
    const primary=[...text.matchAll(/(?:SLA|penyelesaian(?:\s+(?:komplain|komplen|masalah))?|rekon|validasi|clear|cek)\D{0,48}?H\s*\+\s*(\d{1,2})/ig)].map(m=>Number(m[1])).filter(Number.isFinite);
    if(primary.length)return Math.min(...primary);
    const hits=[];const re=/H\s*\+\s*(\d{1,2})/ig;let match;
    while((match=re.exec(text))){
      const before=text.slice(Math.max(0,match.index-55),match.index).toLowerCase();
      const acceptance=/(?:terima|penerima|penerimaan|max(?:imal)?\s+komplain|maks(?:imal)?\s+komplain)/i.test(before);
      const service=/(?:sla|penyelesaian|rekon|validasi|clear|cek)/i.test(before);
      if(!acceptance||service)hits.push(Number(match[1]));
    }
    return hits.length?Math.min(...hits):999;
  }
  function reviewValue(value) {
    const raw=str(value),match=raw.match(/\d+/);
    if(!match)return 0;
    const n=Number(match[0]);
    return raw.startsWith("<")?Math.max(0,n-1):n;
  }
  function chooseSeller(choices, product, options) {
    const cfg={...DEFAULTS,...options}, blocked=names(cfg.blocked), preferred=names(cfg.preferred);
    const cap=Number(product?.max_price)>0?Number(product.max_price):Infinity;
    const minRating=Math.max(4,Math.min(5,Number(cfg.minRating)||4));
    const tolerance=Math.max(0,Math.min(20,Number(cfg.priceTolerancePercent)||0));
    const valid=(Array.isArray(choices)?choices:[]).filter(x=>{
      const price=Number(x.price),rating=x.reviewAvg==null?null:Number(x.reviewAvg);
      return x.id!=null && str(x.id)!==str(product?.seller_sku_id) &&
        Number(x.status_sellerSku)===1 && Number.isFinite(price) && price>0 && price<=cap &&
        !blocked.has(str(x.seller).toLowerCase()) &&
        rating!=null && Number.isFinite(rating) && rating>=minRating &&
        reviewCount(x.rating_qty)>=Number(cfg.minReviews||0) &&
        (Number(x.stock)>0 || Number(x.unlimited_stock)===1);
    }).map(x=>({...x,_sla:slaDays(x.seller_details?.sla),_reviews:reviewValue(x.rating_qty)}));
    const cheapestBySla=new Map();
    for(const x of valid){
      const old=cheapestBySla.get(x._sla);
      if(old==null||Number(x.price)<old)cheapestBySla.set(x._sla,Number(x.price));
    }
    for(const x of valid){
      const ref=cheapestBySla.get(x._sla);
      x._within=Number(x.price)<=ref*(1+tolerance/100)+1e-9;
    }
    return valid.sort((a,b)=>{
      const sla=a._sla-b._sla;if(sla)return sla;
      const band=Number(b._within)-Number(a._within);if(band)return band;
      if(a._within&&b._within) {
        return Number(b.reviewAvg||0)-Number(a.reviewAvg||0) ||
          b._reviews-a._reviews ||
          Number(a.price)-Number(b.price) ||
          Number(preferred.has(str(b.seller).toLowerCase()))-Number(preferred.has(str(a.seller).toLowerCase()));
      }
      return Number(a.price)-Number(b.price) ||
        Number(b.reviewAvg||0)-Number(a.reviewAvg||0) ||
        b._reviews-a._reviews ||
        Number(preferred.has(str(b.seller).toLowerCase()))-Number(preferred.has(str(a.seller).toLowerCase()));
    })[0] || null;
  }

  function readSynced() {
    try {
      const value=typeof GM_getValue==="function"?GM_getValue(SYNC_KEY,null):null;
      if(value&&typeof value==="object")return {...RANK_DEFAULTS,...value};
    } catch {}
    return {...RANK_DEFAULTS};
  }
  function readBrowser() {
    try {
      const value=JSON.parse(localStorage.getItem(KEY)||"{}");
      return {
        enabled:value.enabled!==false,
        saveMode:["manual","auto"].includes(value.saveMode)?value.saveMode:"manual",
        autoServiceCode:value.autoServiceCode!==false
      };
    } catch { return {...BROWSER_DEFAULTS} }
  }
  function read() { return {...readBrowser(),...readSynced()} }
  async function syncFromTools() {
    try {
      const res=await fetch("/api/browser-config",{credentials:"include",headers:{accept:"application/json"}});
      if(!res.ok)return false;
      const data=await res.json();
      const config={...RANK_DEFAULTS,...(data.config||{}),syncedAt:data.generatedAt||new Date().toISOString()};
      if(typeof GM_setValue==="function")await GM_setValue(SYNC_KEY,config);
      return true;
    } catch { return false }
  }
  if (!testing && location.hostname === "tools.lfamiliastore.my.id") {
    syncFromTools();
    setInterval(syncFromTools,15000);
    window.addEventListener("focus",syncFromTools);
    return;
  }
  if (!testing && location.hostname !== "member.digiflazz.com") return;
  let settings=testing?{...DEFAULTS}:read(),status=()=>{},lastProduct=null,lastSeller=null,lastActionTime=0;
  function update(message) {status(message)}
  function handle(vm,product) {
    const cfg=settings;
    if(!cfg.enabled || !product || !Array.isArray(vm.sellers))return;
    const candidate=chooseSeller(vm.sellers,product,cfg);
    if(!candidate){update("Tidak ada seller yang lolos harga, rating, dan stok.");return}
    if(lastProduct===str(product.id) && lastSeller===str(candidate.id) && Date.now()-lastActionTime<3000)return;
    lastProduct=str(product.id);lastSeller=str(candidate.id);lastActionTime=Date.now();
    try {
      // Use Digiflazz's own Vue action, which fills all linked seller fields.
      // Keep Digiflazz's per-product Max Price unchanged while selecting a seller.
      vm.autoUpdateMaxPrice=false;
      vm.selectSeller(candidate);
      update("Dipilih: "+str(candidate.seller)+" · rating "+str(candidate.reviewAvg??"—")+" · SLA "+(slaDays(candidate.seller_details?.sla)<999?"H+"+slaDays(candidate.seller_details?.sla):"—")+" · Rp"+Number(candidate.price).toLocaleString("id-ID")+(cfg.saveMode==="auto"?" · menyimpan…":" · tekan Simpan di Digiflazz"));
      if(cfg.saveMode==="auto") {
        if(typeof vm.editProduct!=="function") {update("Seller terpilih. Tombol simpan otomatis tidak ditemukan; tekan Simpan di Digiflazz.");return}
        setTimeout(()=>{
          if(vm.currentEditted!==product || str(product.seller_sku_id)!==str(candidate.id))return;
          try {vm.editProduct(product)} catch {update("Seller terpilih. Penyimpanan otomatis gagal; tekan Simpan di Digiflazz.")}
        },120);
      }
    } catch {update("Pemilihan otomatis gagal; pilih seller secara manual.")}
  }
  function unwrap(value) {
    if(!value)return value;
    try { return value.wrappedJSObject || value; } catch { return value; }
  }
  function vueOf(element) {
    if(!element)return null;
    try {
      const raw=unwrap(element);
      return unwrap(raw?.__vue__ || element.__vue__) || null;
    } catch { return null; }
  }
  // IMPORTANT: never replace Digiflazz's fetchSellers/click handler.
  // We only observe the Vue state after Digiflazz itself opens the seller dialog.
  function patch(vm) {
    vm=unwrap(vm);
    if(!settings.enabled || !vm || vm._isDestroyed || typeof vm.selectSeller!=="function")return;
    let sellers,product;
    try {
      sellers=unwrap(vm.sellers);
      product=unwrap(vm.currentEditted);
    } catch { return; }
    if(!vm.dialogSeller || vm.fetchingSellers || !product || !Array.isArray(sellers) || !sellers.length)return;
    update("Seller terbuka. Memilih kandidat terbaik…");
    handle(vm,product);
  }
  function scanVue() {
    const roots=[];
    for(const selector of ["#app","#__nuxt","body"]){const root=vueOf(document.querySelector(selector));if(root)roots.push(root)}
    if(!roots.length)for(const el of document.querySelectorAll("[id],.el-dialog")){const root=vueOf(el);if(root)roots.push(root);if(roots.length>8)break}
    const seen=new Set();
    function walk(vm) {
      vm=unwrap(vm);
      if(!vm||seen.has(vm))return;
      seen.add(vm);patch(vm);
      let children=[];
      try { children=Array.from(unwrap(vm.$children)||[]); } catch {}
      for(const child of children)walk(child);
    }
    for(const vm of roots)walk(vm);
  }
  const autoCodes=new WeakMap();
  function fieldValue(scope, selectors) {
    for(const selector of selectors) {
      const el=scope.querySelector(selector);
      if(!el)continue;
      const value=str(el.value ?? el.getAttribute?.("data-game-name") ?? el.getAttribute?.("data-product-name") ?? el.textContent);
      if(value)return value;
    }
    return "";
  }
  function selectedText(scope, names) {
    for(const name of names) {
      const select=scope.querySelector('select[name="'+name+'"]');
      const value=str(select?.selectedOptions?.[0]?.textContent || select?.value);
      if(value)return value;
    }
    return "";
  }
  function codeFields() {
    const found=new Set(document.querySelectorAll([
      'input[name="buyer_sku_code"]',
      'input[name="buyerSkuCode"]',
      'input[placeholder*="Kode Produk"]',
      'input[placeholder*="kode produk"]',
      'input[placeholder*="SKU Buyer"]',
      'input[placeholder*="SKU buyer"]',
      'input[placeholder*="Kode Layanan"]'
    ].join(",")));
    for(const label of document.querySelectorAll("label")) {
      if(!/kode\s*(produk|layanan)|sku\s*buyer/i.test(str(label.textContent)))continue;
      const box=label.closest(".el-form-item,.form-group,.form-field,.field") || label.parentElement;
      const input=box?.querySelector("input");
      if(input)found.add(input);
    }
    return [...found];
  }
  function inferCodeParts(field) {
    const scope=field.closest(".el-dialog,.modal,.modal-dialog,form,.el-form,.drawer,.el-drawer,.card,tr") || field.parentElement || document;
    const game=fieldValue(scope,[
      'input[name="game"]','input[name="brand"]','input[name="category"]',
      '[data-game-name]','.game-name','.brand-name','.category-name'
    ]) || selectedText(scope,["game","brand","category"]);
    const product=fieldValue(scope,[
      'input[name="product"]','input[name="product_name"]','input[name="productName"]',
      'input[name="nominal"]','input[name="denomination"]','input[name="name"]',
      '[data-product-name]','.product-name','.product_name','.nominal-name','.denomination-name'
    ]) || selectedText(scope,["product","product_name","nominal","denomination"]);
    return {scope,game,product};
  }
  function setNativeValue(field,value) {
    const proto=field instanceof HTMLTextAreaElement?HTMLTextAreaElement.prototype:HTMLInputElement.prototype;
    const setter=Object.getOwnPropertyDescriptor(proto,"value")?.set;
    if(!setter)return false;
    setter.call(field,value);
    field.dispatchEvent(new Event("input",{bubbles:true}));
    field.dispatchEvent(new Event("change",{bubbles:true}));
    return true;
  }
  function fillAllCodes(showStatus=false) {
    if(!settings.autoServiceCode)return {filled:0,unresolved:0,kept:0,total:0};
    let filled=0,unresolved=0,kept=0;
    const fields=codeFields();
    for(const field of fields) {
      if(!field || field.disabled || field.readOnly)continue;
      const {scope,game,product}=inferCodeParts(field);
      const previous=autoCodes.get(field);
      if(field.value && field.value!==previous){kept++;continue}
      const code=serviceCode(game,product);
      if(!code){unresolved++;continue}
      if(field.value===code){autoCodes.set(field,code);continue}
      if(!setNativeValue(field,code)){unresolved++;continue}
      autoCodes.set(field,code);
      if(scope && scope!==document)autoCodes.set(scope,code);
      filled++;
    }
    if(showStatus) {
      if(filled) update(filled+" SKU diisi otomatis. "+(unresolved?unresolved+" belum terbaca; buka/pilih produk lalu coba lagi.":"Semua field yang terbaca sudah terisi."));
      else if(fields.length===0) update("Belum ada field SKU di halaman ini. Buka Tambah Produk; SKU akan terisi otomatis tanpa ketik satu-satu.");
      else if(unresolved) update("Ada "+unresolved+" field SKU, tetapi nama game/nominal belum terbaca. Pilih produknya dulu; kode akan muncul otomatis.");
      else update("Semua SKU yang terbaca sudah terisi.");
    }
    return {filled,unresolved,kept,total:fields.length};
  }
  function fillNewCode() { return fillAllCodes(false); }
  function panel() {
    if(document.getElementById("digi-tools-auto-seller"))return;
    const host=document.createElement("div");host.id="digi-tools-auto-seller";
    const viewportScale=Number(window.visualViewport?.scale)||1;
    const uiScale=Math.max(1,Math.min(3,1/viewportScale));
    host.style.cssText="all:initial!important;position:fixed!important;right:16px!important;top:90px!important;z-index:2147483647!important;display:block!important;visibility:visible!important;opacity:1!important;pointer-events:none!important;transform-origin:top right!important;transform:scale("+uiScale+")!important";
    const ui=host.attachShadow({mode:"open"});
    const synced=settings.syncedAt?new Date(settings.syncedAt).toLocaleString("id-ID"):"belum pernah";
    ui.innerHTML=`<style>
      *{box-sizing:border-box}button,input,select{font:inherit}button{cursor:pointer}
      .bubble{display:block!important;pointer-events:auto!important;min-width:132px;min-height:46px;border:0;border-radius:26px;background:#087b96;color:white;padding:12px 16px;box-shadow:0 4px 20px #0008;font:700 14px system-ui;visibility:visible!important;opacity:1!important}
      .box{display:none;pointer-events:auto!important;width:min(310px,calc(100vw - 24px));max-height:min(78vh,670px);overflow:auto;border:1px solid #35667a;border-radius:13px;background:#102330;color:#eef6fa;padding:14px;box-shadow:0 8px 26px #0008;font:13px system-ui;margin-bottom:8px}
      .box.open{display:block}h3{margin:0 0 8px;font-size:16px}p{margin:5px 0 12px;color:#b9d3dc;line-height:1.4}
      label{display:block;margin:10px 0 4px}select{width:100%;background:#071925;border:1px solid #426579;border-radius:7px;color:white;padding:8px}
      input[type=checkbox]{margin-right:6px}.row{display:flex;justify-content:space-between;gap:10px;padding:5px 0;border-bottom:1px solid #234254}.row strong{text-align:right}
      .status{padding:8px;border-radius:7px;background:#234254;color:#d6eff5;margin-top:10px}
    </style><div class="box" id="box"><h3>Auto Seller Digiflazz</h3>
      <p>Aturan seller disinkron dari <strong>tools.lfamiliastore.my.id</strong>. Tidak ada lagi setelan rating/toleransi/blokir terpisah di browser.</p>
      <div class="row"><span>Rating minimum</span><strong>${settings.minRating}</strong></div>
      <div class="row"><span>Ulasan minimum</span><strong>${settings.minReviews}</strong></div>
      <div class="row"><span>Toleransi harga</span><strong>${settings.priceTolerancePercent}%</strong></div>
      <div class="row"><span>Prioritas / blokir</span><strong>${names(settings.preferred).size} / ${names(settings.blocked).size}</strong></div>
      <div class="row"><span>Sinkron terakhir</span><strong>${synced}</strong></div>
      <label><input id="enabled" type="checkbox"> Aktifkan pemilihan seller di halaman Digiflazz</label>
      <label for="mode">Simpan perubahan produk</label><select id="mode"><option value="manual">Manual: tekan Simpan di Digiflazz</option><option value="auto">Otomatis setelah seller dipilih</option></select>
      <p>Max Price tidak diubah. Batas harga absolut tetap Max Price produk Digiflazz.</p>
      <label><input id="code" type="checkbox"> Isi SKU otomatis</label>
      <p>Mobile Legends 5 Diamond → ML5, Free Fire 1000 Diamond → FF1000. SKU manual tidak ditimpa.</p>
      <button id="fill-all-codes" type="button">⚡ Isi semua SKU di halaman</button>
      <div id="status" class="status" role="status">Auto Seller v2.0 aktif. Aturan production dipakai untuk ranking.</div>
    </div><button class="bubble" id="toggle" aria-label="Buka Auto Seller">⚡ Auto Seller</button>`;
    const get=id=>ui.getElementById(id);
    get("enabled").checked=settings.enabled;
    get("mode").value=settings.saveMode;
    get("code").checked=settings.autoServiceCode;
    status=message=>{get("status").textContent=message};
    get("toggle").onclick=()=>get("box").classList.toggle("open");
    get("fill-all-codes").onclick=()=>fillAllCodes(true);
    ui.addEventListener("change",()=>{
      const browser={enabled:get("enabled").checked,saveMode:get("mode").value,autoServiceCode:get("code").checked};
      settings={...settings,...browser};
      localStorage.setItem(KEY,JSON.stringify(browser));
      update("Pengaturan browser tersimpan. Aturan seller tetap mengikuti dashboard.");
    });
    (document.documentElement||document.body).append(host);
    host.__openDigiTools=()=>get("box").classList.add("open");
  }
  let timer;
  function init() {
    panel();scanVue();fillNewCode();
    const observer=new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(()=>{scanVue();fillNewCode()},180)});
    observer.observe(document.documentElement,{childList:true,subtree:true});
    // Typing into an already open product form changes its value without a DOM mutation.
    document.addEventListener("input",()=>{clearTimeout(timer);timer=setTimeout(fillNewCode,180)},true);
    document.addEventListener("change",()=>{clearTimeout(timer);timer=setTimeout(fillNewCode,180)},true);
    document.addEventListener("click",e=>{
      const label=str(e.target?.closest?.("button,a,[role=button]")?.textContent || e.target?.textContent);
      if(/seller|penjual/i.test(label)) {
        update("Tombol Digiflazz ditekan. Menunggu daftar seller…");
        setTimeout(scanVue,80);setTimeout(scanVue,250);setTimeout(scanVue,700);
      }
    },true);
    setInterval(scanVue,900);
  }
  if(testing) {module.exports={chooseSeller,reviewCount,patch,serviceCode,slaDays,reviewValue};return}
  try {
    if(typeof GM_registerMenuCommand==="function") GM_registerMenuCommand("Buka Auto Seller",()=>{
      panel();
      document.getElementById("digi-tools-auto-seller")?.__openDigiTools?.();
    });
  } catch {}
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
  setTimeout(()=>{if(!document.getElementById("digi-tools-auto-seller"))init()},1200);
})();
