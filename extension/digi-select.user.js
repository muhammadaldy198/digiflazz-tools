// ==UserScript==
// @name         Digi Tools — Auto Select Seller
// @namespace    https://tools.lfamiliastore.my.id/
// @version      1.5.0
// @description  Pilih seller langsung di halaman produk Digiflazz. Sesi tetap di browser.
// @match        https://member.digiflazz.com/*
// @run-at       document-end
// @inject-into  content
// @grant        GM_info
// @grant        GM_registerMenuCommand
// @noframes
// @downloadURL  https://raw.githubusercontent.com/muhammadaldy198/digiflazz-tools/main/extension/digi-select.user.js
// @updateURL    https://raw.githubusercontent.com/muhammadaldy198/digiflazz-tools/main/extension/digi-select.user.js
// ==/UserScript==

(() => {
  "use strict";
  const testing=typeof module!=="undefined" && !!module.exports;
  const KEY = "digiTools.autoSeller.v1";
  const DEFAULTS = {enabled:true,saveMode:"manual",minRating:4,minReviews:0,priceCap:0,autoFillMaxPrice:true,maxPriceOffset:0,autoServiceCode:true,preferred:"",blocked:""};
  const str = value => String(value ?? "").trim();
  const names = value => new Set(str(value).split(/[\n,]/).map(x=>x.trim().toLowerCase()).filter(Boolean));
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
  function maxPriceForSeller(price,offset) {
    const base=Number(price),extra=Number(offset);
    if(!Number.isSafeInteger(base)||base<1||!Number.isSafeInteger(extra)||extra<0||base+extra>1000000000) return null;
    return base+extra;
  }
  function chooseSeller(choices, product, options) {
    const cfg={...DEFAULTS,...options}, blocked=names(cfg.blocked), preferred=names(cfg.preferred);
    const cap=Math.min(...[product?.max_price,cfg.priceCap].map(Number).filter(x=>x>0),Infinity);
    const valid=(Array.isArray(choices)?choices:[]).filter(x=>{
      const price=Number(x.price),rating=x.reviewAvg==null?null:Number(x.reviewAvg);
      return x.id!=null && str(x.id)!==str(product?.seller_sku_id) &&
        Number(x.status_sellerSku)===1 && Number.isFinite(price) && price>0 && price<=cap &&
        !blocked.has(str(x.seller).toLowerCase()) &&
        (Number(cfg.minRating)<=0 || rating!=null && Number.isFinite(rating) && rating>=Number(cfg.minRating)) &&
        reviewCount(x.rating_qty)>=Number(cfg.minReviews||0) &&
        (Number(x.stock)>0 || Number(x.unlimited_stock)===1);
    });
    const low=Math.min(...valid.map(x=>Number(x.price)));
    const score=x=>{
      const connection=/ip/i.test(str(x.connectionType))?100:/h2h/i.test(str(x.connectionType))?70:50;
      const sla=str(x.seller_details?.sla),speed=/h\+?0/i.test(sla)?100:/h\+?1/i.test(sla)?60:30;
      return 40*low/Number(x.price)+.3*connection+.2*speed+10+Number(x.reviewAvg||0)*3+(preferred.has(str(x.seller).toLowerCase())?20:0);
    };
    return valid.sort((a,b)=>score(b)-score(a)||Number(a.price)-Number(b.price))[0] || null;
  }

  if (!testing && location.hostname !== "member.digiflazz.com") return;
  function read() {
    try {return {...DEFAULTS,...JSON.parse(localStorage.getItem(KEY)||"{}")}} catch {return {...DEFAULTS}}
  }
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
      vm.autoUpdateMaxPrice=false;
      vm.selectSeller(candidate);
      if(cfg.autoFillMaxPrice) {
        const max=maxPriceForSeller(candidate.price,cfg.maxPriceOffset);
        if(max==null){update("Seller terpilih, tetapi nilai max price tidak valid. Periksa sebelum menyimpan.");return}
        product.max_price=max;
        product.change=true;
      }
      update("Dipilih: "+str(candidate.seller)+" · Rp"+Number(candidate.price).toLocaleString("id-ID")+" · rating "+str(candidate.reviewAvg??"—")+(cfg.saveMode==="auto"?" · menyimpan…":" · tekan Simpan di Digiflazz"));
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
    ui.innerHTML=`<style>
      *{box-sizing:border-box}button,input,select,textarea{font:inherit}button{cursor:pointer}
      .bubble{display:block!important;pointer-events:auto!important;min-width:132px;min-height:46px;border:0;border-radius:26px;background:#087b96;color:white;padding:12px 16px;box-shadow:0 4px 20px #0008;font:700 14px system-ui;visibility:visible!important;opacity:1!important}
      .box{display:none;pointer-events:auto!important;width:min(310px,calc(100vw - 24px));max-height:min(78vh,670px);overflow:auto;border:1px solid #35667a;border-radius:13px;background:#102330;color:#eef6fa;padding:14px;box-shadow:0 8px 26px #0008;font:13px system-ui;margin-bottom:8px}
      .box.open{display:block}h3{margin:0 0 8px;font-size:16px}p{margin:5px 0 12px;color:#b9d3dc;line-height:1.4}
      label{display:block;margin:10px 0 4px}input:not([type=checkbox]),textarea,select{width:100%;background:#071925;border:1px solid #426579;border-radius:7px;color:white;padding:8px}
      input[type=checkbox]{margin-right:6px} .row{display:flex;align-items:center;gap:8px}.row>label{flex:1}
      textarea{height:43px;resize:vertical} .status{padding:8px;border-radius:7px;background:#234254;color:#d6eff5;margin-top:10px}
    </style><div class="box" id="box"><h3>Auto Seller Digiflazz</h3>
      <p>Otomatis memilih seller setelah kamu membuka pilihan seller suatu produk.</p>
      <label><input id="enabled" type="checkbox"> Aktifkan pemilihan</label>
      <label for="mode">Simpan perubahan produk</label><select id="mode"><option value="manual">Manual: tekan Simpan di Digiflazz</option><option value="auto">Otomatis setelah seller dipilih</option></select>
      <div class="row"><label for="rating">Rating minimal<input id="rating" type="number" min="0" max="5" step="0.1"></label><label for="reviews">Ulasan minimal<input id="reviews" type="number" min="0"></label></div>
      <label for="cap">Batas harga global (Rp; 0 = ikut max produk)</label><input id="cap" type="number" min="0">
      <label><input id="fill" type="checkbox"> Isi max price saat seller terpilih</label>
      <label for="offset">Tambahan max price untuk semua produk (Rp)</label><input id="offset" type="number" min="0" placeholder="1000">
      <p>Contoh harga seller Rp15.000 + tambahan Rp1.000 = max price Rp16.000.</p>
      <label><input id="code" type="checkbox"> Buat SKU otomatis untuk semua produk</label>
      <p><strong>Tidak perlu isi SKU satu-satu.</strong> Saat form produk muncul dan nama game + nominal terbaca, kode langsung dibuat: Mobile Legends 5 Diamond → ML5, Free Fire 1000 Diamond → FF1000.</p>
      <button id="fill-all-codes" type="button">⚡ Isi semua SKU di halaman</button>
      <label for="preferred">Seller prioritas (pisah koma)</label><textarea id="preferred"></textarea>
      <label for="blocked">Seller diblokir (pisah koma)</label><textarea id="blocked"></textarea>
      <div id="status" class="status" role="status">Auto Seller v1.5 aktif. Tombol Digiflazz tidak diubah; pilih seller tetap bisa ditekan.</div>
    </div><button class="bubble" id="toggle" aria-label="Buka pengaturan auto seller">⚡ Auto Seller</button>`;
    const get=id=>ui.getElementById(id);
    get("enabled").checked=settings.enabled;
    get("mode").value=settings.saveMode;
    get("rating").value=settings.minRating;
    get("reviews").value=settings.minReviews;
    get("cap").value=settings.priceCap;
    get("fill").checked=settings.autoFillMaxPrice;
    get("offset").value=settings.maxPriceOffset;
    get("code").checked=settings.autoServiceCode;
    get("preferred").value=settings.preferred;
    get("blocked").value=settings.blocked;
    status=message=>{get("status").textContent=message};
    get("toggle").onclick=()=>get("box").classList.toggle("open");
    get("fill-all-codes").onclick=()=>fillAllCodes(true);
    ui.addEventListener("change",()=>{
      settings={enabled:get("enabled").checked,saveMode:get("mode").value,minRating:Math.min(5,Math.max(0,Number(get("rating").value)||0)),minReviews:Math.max(0,Number(get("reviews").value)||0),priceCap:Math.max(0,Number(get("cap").value)||0),autoFillMaxPrice:get("fill").checked,maxPriceOffset:Math.min(1000000000,Math.max(0,Math.trunc(Number(get("offset").value)||0))),autoServiceCode:get("code").checked,preferred:get("preferred").value,blocked:get("blocked").value};
      localStorage.setItem(KEY,JSON.stringify(settings));update("Pengaturan tersimpan di browser ini.");
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
  if(testing) {module.exports={chooseSeller,reviewCount,patch,serviceCode,maxPriceForSeller};return}
  try {
    if(typeof GM_registerMenuCommand==="function") GM_registerMenuCommand("Buka Auto Seller",()=>{
      panel();
      document.getElementById("digi-tools-auto-seller")?.__openDigiTools?.();
    });
  } catch {}
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
  setTimeout(()=>{if(!document.getElementById("digi-tools-auto-seller"))init()},1200);
})();
