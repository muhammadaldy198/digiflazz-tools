// Compiled into index.js with the interface from ui.html. Never store credentials here.
const HTML = "<!doctype html>\n<html lang=\"id\">\n<head>\n  <meta charset=\"utf-8\">\n  <meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">\n  <meta name=\"theme-color\" content=\"#07111e\">\n  <title>Digi Tools · Seller Control</title>\n  <style>\n    :root{color-scheme:dark;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,\"Segoe UI\",sans-serif;font-size:16px;background:#07111e;color:#eaf1fa}\n    *{box-sizing:border-box}body{margin:0;min-height:100vh;background:radial-gradient(circle at 92% -15%,#17486b 0,transparent 35%),#07111e}\n    button,input,select,textarea{font:inherit}button{cursor:pointer}button:disabled{cursor:not-allowed;opacity:.48}\n    :focus-visible{outline:2px solid #5bcbe8;outline-offset:2px}\n    .shell{display:grid;grid-template-columns:222px minmax(0,1fr);min-height:100vh}\n    aside{border-right:1px solid #23364b;background:#0a1929;position:sticky;top:0;height:100vh;display:flex;flex-direction:column;padding:20px 12px}\n    .brand{display:flex;align-items:center;gap:10px;font-size:1rem;font-weight:800;letter-spacing:.02em;margin:1px 10px 24px}\n    .brand-mark{display:grid;place-items:center;width:32px;height:32px;border-radius:9px;background:#30afd1;color:#07111e;font-weight:900}\n    nav{display:grid;gap:3px;overflow:auto}nav button{border:0;background:transparent;color:#9db3c8;text-align:left;padding:10px 12px;border-radius:9px;min-height:40px;font-size:.92rem}\n    nav button:hover,nav button.active{color:#f4fbff;background:#163149}nav button.active{box-shadow:inset 3px 0 #4cc7e8}\n    .aside-foot{margin-top:auto;padding:16px 10px 3px;border-top:1px solid #26394c;color:#91a9bc;font-size:.8rem;line-height:1.5}\n    .dot{display:inline-block;width:8px;height:8px;border-radius:50%;background:#697b90;margin-right:7px}.dot.good{background:#43d6ab}.dot.warn{background:#f6bd65}\n    main{min-width:0;width:min(1390px,100%);padding:27px clamp(16px,3.4vw,46px) 65px;margin:0 auto}\n    header{display:flex;align-items:flex-start;justify-content:space-between;gap:20px;margin-bottom:24px}\n    h1{font-size:1.65rem;letter-spacing:-.035em;line-height:1.2;margin:0 0 5px}h2{font-size:1.08rem;margin:0 0 14px;letter-spacing:-.015em}h3{font-size:1rem;margin:0 0 8px}\n    .sub,.muted,small{color:#91a9bc}.sub{font-size:.88rem;line-height:1.5;margin:0}\n    .top-actions{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}\n    .button{border:1px solid #334c61;background:#132c42;color:#eaf5ff;padding:9px 13px;border-radius:9px;min-height:40px;font-size:.88rem;font-weight:650}\n    .button:hover{background:#1c405b}.button.primary{background:#27a7c7;border-color:#27a7c7;color:#031723}.button.primary:hover{background:#56c6df}.button.danger{color:#ffbac2;border-color:#734451;background:#35232f}\n    .button.tiny{min-height:32px;padding:5px 9px;font-size:.8rem}\n    .button.plain{background:transparent;border-color:transparent;color:#91d7ec;padding-left:4px;padding-right:4px}\n    .grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}.grid.two{grid-template-columns:repeat(2,minmax(0,1fr))}\n    .card{border:1px solid #274058;background:#0e2133;border-radius:13px;padding:17px;min-width:0}\n    .metric{font-size:1.45rem;font-weight:740;letter-spacing:-.03em;margin:9px 0 3px}.metric-label{color:#9fb3c7;font-size:.84rem}\n    .section{margin-top:16px}.section-head{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:12px}.section-head h2{margin:0}\n    .badge{display:inline-flex;align-items:center;border:1px solid #3b5a70;border-radius:99px;padding:3px 8px;font-size:.75rem;color:#bbd3e3;white-space:nowrap}\n    .badge.good{border-color:#245f58;color:#65e0b7}.badge.warn{border-color:#73512f;color:#ffd18b}.badge.bad{border-color:#78404a;color:#ffadb6}\n    .banner{padding:13px 15px;border:1px solid #70502e;background:#342b23;border-radius:10px;color:#ffe0aa;margin-bottom:16px;font-size:.9rem;line-height:1.5}\n    .banner.error{border-color:#78404a;background:#34232b;color:#ffbfc5}.banner.ok{border-color:#245f58;background:#15342f;color:#9cf0d0}\n    .controls,.toolbar{display:flex;gap:8px;flex-wrap:wrap;align-items:center}.controls{margin-bottom:14px}.toolbar{margin-bottom:15px}\n    label{display:block;color:#c8d8e6;font-size:.86rem;font-weight:600;margin-bottom:7px}\n    input,select,textarea{width:100%;padding:9px 10px;min-height:40px;border:1px solid #35516a;border-radius:8px;color:#eaf3f9;background:#0a1b2b;outline:none}\n    input:focus,select:focus,textarea:focus{border-color:#4cc7e8}textarea{resize:vertical;min-height:130px;line-height:1.45}\n    input[type=checkbox]{width:17px;height:17px;min-height:auto;accent-color:#31b6d6;margin:0}\n    .check{display:flex;align-items:center;gap:9px;font-weight:500;font-size:.9rem;margin:0}\n    .field{min-width:0}.fields{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin:14px 0}.fields.two{grid-template-columns:repeat(2,minmax(0,1fr))}\n    .toolbar input{max-width:320px}.toolbar select{max-width:180px}\n    .table-wrap{overflow-x:auto;border:1px solid #284058;border-radius:11px}\n    table{width:100%;border-collapse:collapse;font-size:.88rem}th,td{text-align:left;padding:11px 12px;border-bottom:1px solid #253b50;vertical-align:middle}th{font-size:.78rem;letter-spacing:.02em;color:#96adbf;font-weight:700;background:#132b3d;white-space:nowrap}tr:last-child td{border-bottom:0}tbody tr:hover{background:#13283a}\n    .name{font-weight:650;color:#ecf6fb}.sku{color:#97b1c7;font-size:.77rem;display:block;margin-top:3px;word-break:break-all}.nowrap{white-space:nowrap}\n    .empty{padding:27px 16px;text-align:center;color:#9cb2c7;line-height:1.6}.empty strong{display:block;color:#dceaf5;margin-bottom:4px}\n    .row{display:flex;justify-content:space-between;gap:10px;align-items:center;padding:12px 0;border-bottom:1px solid #253b50}.row:last-child{border:0}\n    .stack{display:grid;gap:12px}.right{text-align:right}.spread{display:flex;justify-content:space-between;gap:12px;align-items:center}\n    .feed{display:grid;max-height:470px;overflow:auto}.feed-line{display:flex;gap:11px;padding:10px 0;border-bottom:1px solid #253b50;font-size:.84rem;line-height:1.45}.feed-line:last-child{border:0}\n    .feed-time{flex:0 0 128px;color:#87a1b5;font-variant-numeric:tabular-nums}.feed-msg{overflow-wrap:anywhere}\n    .pill{font-size:.7rem;border-radius:5px;padding:2px 5px;margin-right:6px;background:#1d3a50;color:#8cddf2}.pill.ERROR{background:#5c303a;color:#ffbdc4}.pill.WARN{background:#5b452f;color:#ffdc9b}\n    .pagination{display:flex;gap:8px;align-items:center;justify-content:flex-end;margin-top:12px;font-size:.84rem;color:#abc3d4}\n    .hint{font-size:.81rem;color:#93a9bc;line-height:1.55;margin:9px 0 0}.hint strong{color:#d7eaf4}\n    .modal-shell{position:fixed;inset:0;z-index:10;background:#03101ecc;display:grid;place-items:center;padding:15px}\n    .modal{width:min(680px,100%);max-height:90vh;overflow:auto;background:#10263a;border:1px solid #41617b;border-radius:15px;padding:20px}\n    .modal-top{display:flex;justify-content:space-between;align-items:start;gap:15px;margin-bottom:12px}\n    .code{font-family:ui-monospace,SFMono-Regular,Consolas,monospace;font-size:.91rem;letter-spacing:.07em;color:#8ee6ea}\n    #toast{position:fixed;bottom:20px;right:20px;max-width:min(440px,calc(100vw - 32px));padding:12px 15px;background:#1b4052;border:1px solid #56b9cc;border-radius:10px;z-index:20;box-shadow:0 15px 45px #0008;font-size:.88rem}\n    #toast[hidden],#modal[hidden]{display:none}\n    @media(max-width:900px){.shell{grid-template-columns:1fr}aside{height:auto;z-index:3;position:sticky;top:0;padding:8px 12px 0;border-right:0;border-bottom:1px solid #294157}.brand{margin:1px 0 7px;font-size:.91rem}.brand-mark{width:27px;height:27px}nav{display:flex;overflow-x:auto;gap:3px;scrollbar-width:none;margin:0 -2px}nav::-webkit-scrollbar{display:none}nav button{white-space:nowrap;padding:8px 11px;font-size:.82rem;min-height:38px}nav button.active{box-shadow:inset 0 -2px #4cc7e8}.aside-foot{display:none}main{padding:19px 14px 60px}.grid{grid-template-columns:repeat(2,minmax(0,1fr))}}\n    @media(max-width:560px){header{display:block;margin-bottom:16px}h1{font-size:1.35rem}.top-actions{justify-content:flex-start;margin-top:13px}.grid,.grid.two{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.card{padding:13px}.metric{font-size:1.2rem}.fields,.fields.two{grid-template-columns:1fr}.feed-time{flex-basis:85px;font-size:.74rem}.toolbar input,.toolbar select{max-width:none}.toolbar>*{flex:1 1 145px}.section{margin-top:12px}.table-wrap{margin:0 -2px}}\n  </style>\n</head>\n<body>\n  <div class=\"shell\">\n    <aside>\n      <div class=\"brand\"><span class=\"brand-mark\">D</span><span>Digi Tools</span></div>\n      <nav aria-label=\"Menu utama\" id=\"nav\">\n        <button data-view=\"overview\" class=\"active\">Ringkasan</button>\n        <button data-view=\"products\">Produk</button>\n        <button data-view=\"sellers\">Penjual</button>\n        <button data-view=\"rules\">Aturan</button>\n        <button data-view=\"zones\">Grup produk</button>\n        <button data-view=\"history\">Perubahan</button>\n        <button data-view=\"logs\">Log sistem</button>\n        <button data-view=\"tools\">Auto Seller Browser</button>\n        <button data-view=\"settings\">Pengaturan</button>\n        <button data-view=\"connection\">Koneksi</button>\n      </nav>\n      <div class=\"aside-foot\"><span class=\"dot\" id=\"sidebar-dot\"></span><span id=\"sidebar-status\">Memuat status…</span><br>Penggunaan pribadi · dilindungi Access</div>\n    </aside>\n    <main>\n      <header>\n        <div><h1 id=\"title\">Ringkasan</h1><p class=\"sub\" id=\"subtitle\">Pantau katalog dan seller Digiflazz.</p></div>\n        <div class=\"top-actions\"><button class=\"button\" id=\"refresh\">↻ Muat ulang</button><button class=\"button\" id=\"scan\">Pindai sekarang</button><button class=\"button primary\" data-action=\"run-auto\">Switch sekarang</button></div>\n      </header>\n      <div id=\"alert\" role=\"status\"></div>\n      <div id=\"content\" aria-live=\"polite\"></div>\n    </main>\n  </div>\n  <div id=\"modal\" hidden></div><div id=\"toast\" role=\"status\" hidden></div>\n  <script>\n  (() => {\n    const $=id=>document.getElementById(id);\n    const esc=value=>String(value??\"\").replace(/[&<>\"']/g,c=>({\"&\":\"&amp;\",\"<\":\"&lt;\",\">\":\"&gt;\",'\"':\"&quot;\",\"'\":\"&#39;\"}[c]));\n    const rupiah=n=>\"Rp\"+Number(n||0).toLocaleString(\"id-ID\");\n    const fmt=s=>s?new Date(String(s).replace(\" \",\"T\")+\"Z\").toLocaleString(\"id-ID\",{dateStyle:\"short\",timeStyle:\"short\"}):\"—\";\n    const state={view:\"overview\",bootstrap:null,page:1,q:\"\",status:\"all\",category:\"\",brand:\"\",selected:null,toastTimer:null,ruleTargets:null,historySku:\"\",historyStatus:\"\",historyReason:\"\",logLevel:\"\",logKind:\"\",logSku:\"\",logQ:\"\"};\n    const names={overview:[\"Ringkasan\",\"Pantau katalog dan seller Digiflazz.\"],products:[\"Produk\",\"Daftar SKU buyer dan status seller.\"],sellers:[\"Penjual\",\"Cermin data seller langsung dari sesi cURL Digiflazz.\"],rules:[\"Aturan\",\"Pengecualian rating minimum untuk kategori, brand, tipe, atau SKU.\"],zones:[\"Grup produk\",\"Pisahkan supplier dengan aturan zona.\"],history:[\"Perubahan\",\"Riwayat scan, harga, dan perpindahan seller.\"],logs:[\"Log sistem\",\"Aktivitas terbaru dari pemindaian dan koneksi.\"],tools:[\"Auto Seller Browser\",\"Pendamping browser Digiflazz yang mengikuti aturan seller dari dashboard.\"],settings:[\"Pengaturan\",\"Atur pemindaian, penilaian, dan penyimpanan.\"],connection:[\"Koneksi\",\"Periksa sesi Digiflazz yang sudah tersimpan.\"]};\n    async function api(path,options={}) {\n      const res=await fetch(path,{...options,headers:{\"content-type\":\"application/json\",...(options.headers||{})}});\n      const data=await res.json().catch(()=>({}));\n      if(!res.ok)throw Error(data.error||\"Permintaan gagal (HTTP \"+res.status+\")\");\n      return data;\n    }\n    function toast(text,bad=false) {\n      clearTimeout(state.toastTimer);\n      $(\"toast\").textContent=text;$(\"toast\").style.borderColor=bad?\"#d8747d\":\"#56b9cc\";$(\"toast\").hidden=false;\n      state.toastTimer=setTimeout(()=>$(\"toast\").hidden=true,4500);\n    }\n    function message(text,type=\"warn\"){$(\"alert\").innerHTML=text?'<div class=\"banner '+type+'\">'+esc(text)+'</div>':\"\"}\n    function loading(){$(\"content\").innerHTML='<div class=\"card empty\">Memuat data…</div>'}\n    function badge(text,type=\"\") {return '<span class=\"badge '+type+'\">'+esc(text)+'</span>'}\n    function error(e){message(e.message,\"error\");toast(e.message,true)}\n    function button(label,action,extra=\"\"){return '<button class=\"button '+extra+'\" data-action=\"'+esc(action)+'\">'+label+'</button>'}\n    async function bootstrap() {\n      const d=await api(\"/api/bootstrap\");state.bootstrap=d;\n      $(\"sidebar-dot\").className=\"dot \"+(d.connection.connected?\"good\":\"warn\");\n      $(\"sidebar-status\").textContent=d.connection.connected?\"Digiflazz terhubung\":\"Digiflazz belum terhubung\";\n      if(!d.connection.connected)message(\"Sesi Digiflazz belum tersimpan. Buka Koneksi untuk menghubungkannya.\");\n      else if(d.lastScan?.status===\"error\")message(\"Scan terakhir gagal: \"+d.lastScan.message);\n      else if(d.counts.issues)message(d.counts.issues+\" produk perlu perhatian. Periksa daftar Produk.\",\"warn\");\n      else message(\"\");\n      return d;\n    }\n    function feed(rows) {return rows?.length?'<div class=\"feed\">'+rows.map(x=>'<div class=\"feed-line\"><span class=\"feed-time\">'+fmt(x.created_at)+'</span><span class=\"feed-msg\"><b class=\"pill '+esc(x.level)+'\">'+esc(x.level)+'</b>'+esc(x.kind?x.kind+\" · \":\"\")+esc(x.sku?x.sku+\" · \":\"\")+esc(x.message)+'</span></div>').join(\"\")+'</div>':'<div class=\"empty\">Belum ada aktivitas.</div>'}\n    async function overview() {\n      const d=await bootstrap(),scan=d.lastScan,issues=d.counts.issues;\n      $(\"content\").innerHTML=\n        '<div class=\"grid\">'+\n          metric(\"Koneksi\",d.connection.connected?\"Aktif\":\"Belum aktif\",d.connection.lastTestStatus?\"HTTP \"+d.connection.lastTestStatus:\"Sesi terenkripsi di D1\")+\n          metric(\"Produk\",d.counts.products,\"SKU hasil scan\")+\n          metric(\"Perlu perhatian\",issues,(issues?(\"Masalah seller saat ini \"+(d.counts.attentionStateBreakdown?.currentSeller||0)+\" · Tanpa kandidat \"+(d.counts.attentionStateBreakdown?.tanpaKandidat||0)+\" · Terhalang Max Price \"+(d.counts.attentionStateBreakdown?.maxPrice||0)+\" · Cooldown \"+(d.counts.attentionStateBreakdown?.cooldown||0)):\"Tidak ada yang terdeteksi\")+(d.counts.attentionPending?\" · \"+d.counts.attentionPending+\" menunggu evaluasi\":\"\"),\"goto-issues\")+\n          metric(\"Siap Auto Switch\",d.counts.autoSwitchReady||0,(d.counts.autoSwitchReady?\"Punya kandidat pengganti · cooldown & operasi pending sudah disaring\":\"Belum ada SKU yang siap dipindahkan otomatis\"),\"goto-actionable\")+\n          metric(\"Max Price kosong\",d.counts.missingMaxPrice||0,(d.counts.missingMaxPrice?\"Auto Switch diblokir sampai Max Price produk diisi\":\"Semua produk sudah punya Max Price\"),\"goto-missing-max\")+\n          metric(\"Seller\",d.counts.sellers,\"Terdata di katalog\")+\n        '</div>'+\n        '<section class=\"section grid two\">'+\n          '<div class=\"card\"><div class=\"section-head\"><h2>Monitor</h2>'+badge(d.settings.scanEnabled?\"Aktif\":\"Berhenti\",d.settings.scanEnabled?\"good\":\"\")+'</div>'+\n            '<p class=\"sub\">Pemindaian otomatis dijalankan paling cepat setiap '+esc(Math.max(60,Number(d.settings.scanIntervalMinutes)||60))+' menit. Auto Switch berjalan 1x per jam.</p>'+\n            '<div class=\"controls\" style=\"margin-top:16px\">'+button(d.settings.scanEnabled?\"Hentikan monitor\":\"Mulai monitor\",\"monitor\",\"primary\")+button(\"Pindai sekali\",\"scan-now\")+'</div>'+\n            '<p class=\"hint\">Scan terakhir: '+(scan?fmt(scan.finished_at)+\" · \"+esc(scan.status)+\" · \"+esc(scan.total)+\" produk\":\"belum pernah\")+'</p>'+\n            '<p class=\"hint\">Cakupan rating/SLA: <strong>'+esc(d.counts.qualityKnown)+' / '+esc(d.counts.activeProducts)+'</strong> produk aktif sudah punya data kandidat seller.</p>'+\n            '<p class=\"hint\">Cache perhatian: <strong>'+esc(d.counts.attentionFresh)+' / '+esc(d.counts.products)+'</strong> siap'+(d.counts.attentionPending?' · '+esc(d.counts.attentionPending)+' menunggu evaluasi':\"\")+'. Ringkasan membaca cache ini, bukan seluruh kandidat seller setiap kali halaman dibuka.</p>'+\n          '</div>'+\n          '<div class=\"card\"><div class=\"section-head\"><h2>Auto Switch</h2>'+badge(d.settings.autoSwitch&&!d.settings.dryRun?\"AKTIF\":d.liveSwitchAvailable?\"SIAP DIAKTIFKAN\":\"BELUM DIVERIFIKASI\",d.settings.autoSwitch&&!d.settings.dryRun?\"good\":\"warn\")+'</div>'+\n            '<p class=\"sub\">'+(d.liveSwitchAvailable?\"Switch manual sudah terverifikasi. Auto Switch otomatis dijalankan 1x per jam.\":\"Lakukan 1x switch manual untuk memastikan Digiflazz menerima perubahan seller. Setelah berhasil, Auto Switch bisa dinyalakan dan akan berjalan 1x per jam.\")+'</p>'+\n            '<div class=\"controls\" style=\"margin-top:16px\">'+\n              button(\"1. Tes Switch Manual\",\"manual-test\",d.liveSwitchAvailable?\"\":\"primary\")+\n              button(d.settings.autoSwitch&&!d.settings.dryRun?\"Matikan Auto Switch\":\"2. Aktifkan Auto Switch\",\"toggle-auto\",d.liveSwitchAvailable?\"primary\":\"\")+\n              button(\"3. Jalankan Auto Switch Sekarang\",\"run-auto\",d.settings.autoSwitch&&!d.settings.dryRun?\"primary\":\"\")+\n            '</div>'+\n            '<p class=\"hint\"><strong>Prioritas Auto Switch: rating 4,5–5 lebih dulu (fallback 4,0–4,49 bila tier atas kosong) → Seller Prioritas → SLA tercepat → kelompok harga maksimal '+esc(d.settings.priceTolerancePercent)+'% dari termurah → rating tertinggi → ulasan terbanyak → harga termurah.</strong> Cooldown hanya menahan optimasi biasa. Seller OFF, stok habis, cut-off, harga di atas Max Price, seller hilang, atau rating di bawah minimum boleh pindah segera jika ada kandidat layak. Jenis koneksi IP/API/H2H tidak ikut menentukan.</p>'+\n          '</div>'+\n        '</section>'+\n        '<section class=\"section card\"><div class=\"section-head\"><h2>Aktivitas terbaru</h2>'+button(\"Semua log\",\"goto-logs\",\"tiny\")+'</div>'+feed(d.events)+'</section>';\n    }\n    function metric(label,value,detail,action){return '<div class=\"card\"><div class=\"metric-label\">'+esc(label)+'</div><div class=\"metric\">'+esc(value)+'</div><div class=\"sub\">'+esc(detail)+'</div>'+(action?'<div class=\"controls\" style=\"margin-top:12px\">'+button(\"Lihat produk\",action,\"tiny\")+'</div>':\"\")+'</div>'}\n    function problem(p){return !p.attention_dirty&&!!p.needs_attention}\n    function attentionText(p){return Array.isArray(p.attention_reasons)&&p.attention_reasons.length?p.attention_reasons.join(\" · \"):\"\"}\n    function attentionStateLabel(p){\n      if(!p.active&&!problem(p))return \"Nonaktif\";\n      return ({\n        evaluating:\"Menunggu evaluasi\",\n        pending:\"Operasi tertunda\",\n        locked:\"Terkunci\",\n        cooldown:\"Menunggu cooldown\",\n        actionable:\"Siap Auto Switch\",\n        \"max-price\":\"Terhalang Max Price\",\n        \"current-seller\":\"Masalah seller saat ini\",\n        \"no-candidate\":\"Tidak ada kandidat memenuhi syarat\",\n        ok:\"Aktif\"\n      })[p.attention_state]||(problem(p)?\"Perlu perhatian\":p.active?\"Aktif\":\"Nonaktif\");\n    }\n    function attentionStateTone(p){\n      if(p.attention_state===\"actionable\"||p.attention_state===\"ok\")return \"good\";\n      if([\"evaluating\",\"pending\",\"cooldown\",\"max-price\"].includes(p.attention_state))return \"warn\";\n      if([\"current-seller\",\"no-candidate\"].includes(p.attention_state))return \"bad\";\n      return \"\";\n    }\n    async function products() {\n      const params=new URLSearchParams({page:state.page,q:state.q,status:state.status,category:state.category,brand:state.brand});\n      const d=await api(\"/api/products?\"+params);\n      $(\"content\").innerHTML='<div class=\"card\">'+\n        '<div class=\"toolbar\"><input id=\"search-product\" aria-label=\"Cari produk\" placeholder=\"Cari nama, SKU, brand, kategori\" value=\"'+esc(state.q)+'\">'+\n        '<select id=\"filter-category\" aria-label=\"Kategori\"><option value=\"\">Semua kategori</option>'+d.categories.map(x=>'<option value=\"'+esc(x)+'\" '+(state.category===x?\"selected\":\"\")+'>'+esc(x)+'</option>').join(\"\")+'</select>'+\n        '<select id=\"filter-brand\" aria-label=\"Brand\"><option value=\"\">Semua brand</option>'+d.brands.map(x=>'<option value=\"'+esc(x)+'\" '+(state.brand===x?\"selected\":\"\")+'>'+esc(x)+'</option>').join(\"\")+'</select>'+\n        '<select id=\"filter-product\" aria-label=\"Status produk\"><option value=\"all\">Semua status</option><option value=\"active\" '+(state.status===\"active\"?\"selected\":\"\")+'>Aktif</option><option value=\"inactive\" '+(state.status===\"inactive\"?\"selected\":\"\")+'>Nonaktif</option><option value=\"issues\" '+(state.status===\"issues\"?\"selected\":\"\")+'>Perlu perhatian</option><option value=\"actionable\" '+(state.status===\"actionable\"?\"selected\":\"\")+'>Siap Auto Switch</option><option value=\"cooldown\" '+(state.status===\"cooldown\"?\"selected\":\"\")+'>Menunggu cooldown</option><option value=\"blocked-max\" '+(state.status===\"blocked-max\"?\"selected\":\"\")+'>Terhalang Max Price</option><option value=\"current-issue\" '+(state.status===\"current-issue\"?\"selected\":\"\")+'>Masalah seller saat ini</option><option value=\"no-candidate\" '+(state.status===\"no-candidate\"?\"selected\":\"\")+'>Tidak ada kandidat memenuhi syarat</option><option value=\"missing-max\" '+(state.status===\"missing-max\"?\"selected\":\"\")+'>Max Price belum diisi</option><option value=\"locked\" '+(state.status===\"locked\"?\"selected\":\"\")+'>Terkunci</option></select>'+button(\"Terapkan\",\"search\",\"primary\")+'</div>'+\n        '<div class=\"controls\" style=\"margin:-2px 0 12px;gap:6px;flex-wrap:wrap\">'+\n          button(\"Semua\",\"quick-status:all\",state.status===\"all\"?\"primary tiny\":\"tiny\")+\n          button(\"Perlu perhatian\",\"quick-status:issues\",state.status===\"issues\"?\"primary tiny\":\"tiny\")+\n          button(\"Siap Auto Switch\",\"quick-status:actionable\",state.status===\"actionable\"?\"primary tiny\":\"tiny\")+\n          button(\"Cooldown\",\"quick-status:cooldown\",state.status===\"cooldown\"?\"primary tiny\":\"tiny\")+\n          button(\"Terhalang Max Price\",\"quick-status:blocked-max\",state.status===\"blocked-max\"?\"primary tiny\":\"tiny\")+\n          button(\"Masalah seller\",\"quick-status:current-issue\",state.status===\"current-issue\"?\"primary tiny\":\"tiny\")+\n          button(\"Tanpa kandidat\",\"quick-status:no-candidate\",state.status===\"no-candidate\"?\"primary tiny\":\"tiny\")+\n        '</div>'+\n        '<p class=\"hint\" style=\"margin:-4px 0 12px\"><strong>Urutan:</strong> brand/game A–Z → nominal terkecil → terbesar. Harga seller tidak menentukan posisi produk. Filter perhatian menjelaskan kenapa SKU bisa atau tidak bisa dipindahkan otomatis.</p>'+\n        '<div class=\"table-wrap\"><table><thead><tr><th>Produk</th><th>Kategori</th><th>Brand</th><th>Seller</th><th>Harga</th><th>Max</th><th>Status</th><th>Aksi Digiflazz</th></tr></thead><tbody>'+\n        (d.products.length?d.products.map(p=>'<tr><td><span class=\"name\">'+esc(p.name)+'</span><span class=\"sku\">'+esc(p.sku)+(Number.isFinite(Number(p.nominal_value))&&Number(p.nominal_value)<1e99?' · nominal '+esc(p.nominal_value):\"\")+'</span></td><td>'+esc(p.category||\"—\")+'</td><td>'+esc(p.brand||\"—\")+'</td><td><span class=\"name\">'+esc(p.seller_name||\"—\")+'</span><span class=\"sku\">'+(p.current_rating!=null?'Rating '+esc(p.current_rating):'Rating —')+' · '+(p.current_sla?('SLA '+esc((String(p.current_sla).match(/H\\s*\\+\\s*\\d+/i)||[\"—\"])[0])):'SLA —')+'</span></td><td class=\"nowrap\"><strong>'+rupiah(p.price)+'</strong></td><td class=\"nowrap\">'+(p.max_price?rupiah(p.max_price):\"—\")+(p.required_max_price&&Number(p.required_max_price)>Number(p.max_price)?'<span class=\"sku\">Kandidat butuh '+rupiah(p.required_max_price)+' (+'+rupiah(Number(p.required_max_price)-Number(p.max_price))+')</span>':\"\")+'</td><td>'+badge(attentionStateLabel(p),attentionStateTone(p))+(p.attention_dirty?'<span class=\"sku\">Cache perhatian sedang dihitung ulang</span>':attentionText(p)?'<span class=\"sku\">'+esc(attentionText(p))+'</span>':\"\")+'</td><td><div class=\"controls\"><button class=\"button tiny primary\" data-action=\"product\" data-sku=\"'+esc(p.sku)+'\">Kelola</button></div></td></tr>').join(\"\"):'<tr><td colspan=\"8\" class=\"empty\">Tidak ada produk sesuai filter.</td></tr>')+\n        '</tbody></table></div>'+\n        '<div class=\"pagination\"><span>'+esc(d.total)+' produk · halaman '+esc(d.page)+'</span><button class=\"button tiny\" data-action=\"prev\" '+(state.page<=1?\"disabled\":\"\")+'>Sebelumnya</button><button class=\"button tiny\" data-action=\"next\" '+(d.page*50>=d.total?\"disabled\":\"\")+'>Berikutnya</button></div>'+\n      '</div>';\n    }\n    async function product(sku) {\n      const d=await api(\"/api/products/\"+encodeURIComponent(sku)+\"/options\"),p=d.product;\n      state.selected=p;\n      $(\"modal\").hidden=false;\n      $(\"modal\").innerHTML='<div class=\"modal-shell\"><div class=\"modal\" role=\"dialog\" aria-modal=\"true\" aria-labelledby=\"modal-title\"><div class=\"modal-top\"><div><h2 id=\"modal-title\">'+esc(p.name)+'</h2><span class=\"sku\">'+esc(p.sku)+'</span></div><button class=\"button tiny\" data-action=\"close\">Tutup</button></div>'+\n        '<div class=\"grid two\"><div class=\"card\"><div class=\"metric-label\">Seller sekarang</div><div class=\"name\">'+esc(p.seller_name||\"—\")+'</div><div class=\"hint\">'+rupiah(p.price)+(p.current_rating!=null?' · rating '+esc(p.current_rating):\"\")+'</div></div><div class=\"card\"><div class=\"metric-label\">Kandidat terbaik</div><div class=\"name\">'+esc(p.best_candidate_seller||\"—\")+'</div><div class=\"hint\">'+attentionStateLabel(p)+(p.best_candidate_price!=null?' · '+rupiah(p.best_candidate_price):\"\")+(p.best_candidate_rating!=null?' · rating '+esc(p.best_candidate_rating):\"\")+(p.best_candidate_sla!=null&&p.best_candidate_sla<999?' · H+'+esc(p.best_candidate_sla):\"\")+'</div></div><div class=\"card\"><div class=\"metric-label\">Status Auto Switch</div><div class=\"name\">'+esc(attentionStateLabel(p))+'</div><div class=\"hint\">'+(attentionText(p)?esc(attentionText(p)):\"Tidak ada masalah aktif.\")+'</div></div><div class=\"card\"><div class=\"metric-label\">Max Price Digiflazz</div><div class=\"name\">'+(p.max_price?rupiah(p.max_price):\"—\")+'</div><div class=\"hint\">Batas per produk · tidak berubah saat ganti seller'+(p.required_max_price&&Number(p.required_max_price)>Number(p.max_price)?' · kandidat terbaik butuh '+rupiah(p.required_max_price)+' (+'+rupiah(Number(p.required_max_price)-Number(p.max_price))+')':\"\")+' · '+(problem(p)?\"perlu perhatian: \"+esc(attentionText(p)):\"terpantau\")+'</div></div><div class=\"card\"><div class=\"metric-label\">Nominal</div><div class=\"name\">'+(Number.isFinite(Number(p.nominal_value))&&Number(p.nominal_value)<1e99?esc(p.nominal_value):\"—\")+'</div><div class=\"hint\">Urutan produk mengikuti nominal, bukan harga seller.</div></div></div>'+\n        '<div class=\"controls\" style=\"margin-top:14px\"><button class=\"button tiny '+(p.locked?\"warn\":\"\")+'\" data-action=\"lock\" data-sku=\"'+esc(p.sku)+'\">'+(p.locked?\"Buka Kunci Auto Switch\":\"Kunci Auto Switch\")+'</button><button class=\"button tiny\" data-action=\"copy-price\">Salin Max Price</button><button class=\"button tiny '+(p.active?\"warn\":\"primary\")+'\" data-action=\"toggle-product\" data-sku=\"'+esc(p.sku)+'\" data-active=\"'+(p.active?1:0)+'\">'+(p.active?\"OFF Produk\":\"ON Produk\")+'</button><button class=\"button tiny danger\" data-action=\"delete-product\" data-sku=\"'+esc(p.sku)+'\" data-name=\"'+esc(p.name)+'\">Hapus dari Digiflazz</button></div>'+\n        '<p class=\"hint\">'+(p.locked?'<strong>Auto Switch terkunci:</strong> sistem tidak akan mengganti seller SKU ini. Pindah seller manual, edit Max Price, SKU, dan ON/OFF tetap bisa digunakan.':'Auto Switch boleh mengelola seller SKU ini sesuai aturan yang aktif.')+'</p>'+\n        '<div class=\"controls\" style=\"margin-top:12px\"><label for=\"product-sku\" style=\"margin:0\">SKU Buyer</label><input id=\"product-sku\" type=\"text\" maxlength=\"50\" autocomplete=\"off\" style=\"max-width:180px\" value=\"'+esc(p.sku)+'\"><button class=\"button tiny primary\" data-action=\"save-sku\">Simpan SKU</button></div>'+\n        '<p class=\"hint\">Edit SKU, ON/OFF, dan Hapus di halaman ini menulis langsung ke produk Buyer Digiflazz lalu diverifikasi ulang.</p>'+\n        '<div class=\"controls\" style=\"margin-top:12px\"><label for=\"product-max\" style=\"margin:0\">Max Price Digiflazz</label><input id=\"product-max\" type=\"number\" min=\"1\" inputmode=\"numeric\" style=\"max-width:180px\" value=\"'+esc(p.max_price||\"\")+'\">'+(p.required_max_price&&Number(p.required_max_price)>Number(p.max_price)?'<button class=\"button tiny\" data-action=\"use-required-max\">Isi '+rupiah(p.required_max_price)+'</button>':\"\")+'<button class=\"button tiny\" data-action=\"save-max\">Simpan Max Price</button></div>'+\n        '<p class=\"hint\">Perubahan manual menulis langsung ke Max Price produk Buyer Digiflazz. Nilai ini dipertahankan ketika seller diganti dan menjadi batas harga kandidat Auto Switch untuk produk tersebut.</p>'+\n        (d.operation&&[\"pending\",\"unknown\"].includes(d.operation.status)?'<div class=\"banner\" style=\"margin-top:12px\">Ada perubahan yang hasilnya belum pasti. <button class=\"button tiny\" data-action=\"reconcile\">Periksa ulang di Digiflazz</button></div>':\"\")+\n        '<h3 style=\"margin-top:20px\">Kandidat seller · Rating → SLA → toleransi harga '+esc(d.options?.[0]?.price_tolerance_percent??2)+'%</h3>'+\n        (d.options.length?'<div class=\"table-wrap\"><table><thead><tr><th>Seller</th><th>Rating</th><th>SLA</th><th>Harga</th><th>Aturan</th><th>Tindakan</th></tr></thead><tbody>'+d.options.map(o=>'<tr><td class=\"name\">'+(o.eligible&&String(p.current_seller_sku_id)!==String(o.seller_id)&&o.seller_name===p.best_candidate_seller?'<span class=\"badge good\">Kandidat pengganti</span> ':'')+esc(o.seller_name)+'</td><td><strong>'+esc(o.rating??\"—\")+'</strong> <small>('+esc(o.review_count||\"—\")+')</small></td><td>'+(o.sla_days<999?'<strong>H+'+esc(o.sla_days)+'</strong>':'<span class=\"badge warn\">Fallback SLA</span>')+'<span class=\"sku\">'+esc(o.sla||\"SLA tidak tersedia\")+'</span></td><td><strong>'+rupiah(o.price)+'</strong>'+(o.within_price_tolerance?'<span class=\"sku\">Dalam toleransi '+esc(o.price_tolerance_percent)+'% · acuan '+rupiah(o.reference_price)+'</span>':\"\")+'</td><td>'+badge(o.auto_block_reason?\"Diblokir Auto Switch\":o.eligible?\"Lolos\":o.reasons.join(\", \"),o.auto_block_reason?\"warn\":o.eligible?\"good\":\"bad\")+(o.auto_block_reason?'<span class=\"sku\">Penolakan Digiflazz: '+esc(o.auto_block_reason)+' · manual tetap boleh dicoba</span>':\"\")+'</td><td><button class=\"button tiny '+(o.eligible&&d.connectorReady&&String(p.current_seller_sku_id)!==o.seller_id?\"primary\":\"\")+'\" data-action=\"switch-seller\" data-seller-id=\"'+esc(o.seller_id)+'\" data-seller-name=\"'+esc(o.seller_name)+'\" data-seller-price=\"'+esc(o.price)+'\" '+(!o.eligible||!d.connectorReady||String(p.current_seller_sku_id)===o.seller_id?\"disabled\":\"\")+'>Pindah ke seller ini</button></td></tr>').join(\"\")+'</tbody></table></div>':'<div class=\"empty\">Data alternatif seller belum tersedia dari respons Digiflazz.</div>')+\n        '<p class=\"hint\"><strong>Urutan: rating 4,5–5 lebih dulu (fallback 4,0–4,49 bila tier atas kosong) → Seller Prioritas → SLA tercepat → kandidat dalam '+esc(d.options?.[0]?.price_tolerance_percent??2)+'% dari harga termurah → rating tertinggi → ulasan terbanyak → harga termurah.</strong> Status “Terhalang Max Price” hanya muncul bila memang ada alasan untuk berpindah seller dan kandidat penggantinya lolos semua aturan lain tetapi melewati Max Price produk. Tools tidak menaikkan Max Price otomatis. “Masalah seller saat ini” berarti seller yang dipakai sekarang bermasalah atau berada di bawah syarat minimum dan menjadi status utama meskipun kandidat pengganti juga terhalang Max Price. “Tidak ada kandidat memenuhi syarat” berarti belum ada pengganti yang lolos seluruh aturan tanpa masalah seller aktif yang lebih spesifik. Cooldown tidak menahan kondisi darurat seperti Seller OFF, stok habis, cut-off, harga di atas Max Price, seller hilang, atau rating di bawah minimum. Seller berstatus “Diblokir Auto Switch” pernah ditolak Digiflazz karena kebijakan akun; seller itu tidak dicoba otomatis lagi, tetapi manual tetap boleh dicoba setelah persyaratan akun dibereskan. IP/API/H2H tidak memengaruhi pilihan.</p></div></div>';\n    }\n    function filterSellerRows() {\n      const q=String($(\"seller-search\")?.value||\"\").trim().toLowerCase();\n      const mode=$(\"seller-filter\")?.value||\"all\";\n      let visible=0;\n      document.querySelectorAll(\"#seller-body tr[data-seller-row]\").forEach(row=>{\n        const text=(row.dataset.search||\"\").toLowerCase();\n        const rowMode=row.dataset.mode||\"none\";\n        const matchText=!q||text.includes(q);\n        const matchMode=mode===\"all\"||rowMode===mode;\n        row.hidden=!(matchText&&matchMode);\n        if(!row.hidden)visible++;\n      });\n      const count=$(\"seller-visible\");\n      if(count)count.textContent=String(visible);\n    }\n    async function sellers() {\n      const d=await api(\"/api/sellers\"),rows=d.sellers||[],summary=d.summary||{};\n      if(d.warning)message(esc(d.warning),\"warn\");\n      const sellerRows=rows.map(s=>\n        '<tr data-seller-row=\"1\" data-search=\"'+esc((s.name||\"\")+\" \"+(s.seller_id||\"\"))+'\" data-mode=\"'+esc(s.mode||\"none\")+'\">'+\n          '<td class=\"name\">'+esc(s.name??\"—\")+'</td>'+\n          '<td>'+esc(s.rating??\"—\")+'</td>'+\n          '<td>'+esc(s.review_count??\"—\")+'</td>'+\n          '<td>'+esc(s.product_count??\"—\")+'</td>'+\n          '<td><select class=\"seller-mode\" data-key=\"'+esc(s.preference_key)+'\" data-label=\"'+esc(s.name)+'\" aria-label=\"Pilihan untuk '+esc(s.name)+'\">'+\n            '<option value=\"none\">Biasa</option><option value=\"preferred\" '+(s.mode===\"preferred\"?\"selected\":\"\")+'>Prioritas</option><option value=\"blocked\" '+(s.mode===\"blocked\"?\"selected\":\"\")+'>Blokir</option>'+\n          '</select></td>'+\n        '</tr>'\n      ).join(\"\");\n      $(\"content\").innerHTML=\n        '<div class=\"grid\">'+\n          metric(\"Seller\",summary.total??rows.length,\"Jumlah yang dikirim Digiflazz\")+\n          metric(\"Sumber\",d.source===\"live\"?\"Digiflazz langsung\":\"Cache Digiflazz\",d.source===\"live\"?\"Diambil sekarang memakai sesi cURL\":\"Salinan terakhir dari response Digiflazz\")+\n          metric(\"Endpoint\",d.endpoint||\"—\",\"Tidak ada agregasi rating/ulasan/produk dari database lokal\")+\n        '</div>'+\n        '<section class=\"section card\">'+\n          '<div class=\"toolbar\"><input id=\"seller-search\" placeholder=\"Cari nama seller\" autocomplete=\"off\">'+\n          '<select id=\"seller-filter\"><option value=\"all\">Semua seller</option><option value=\"preferred\">Prioritas</option><option value=\"blocked\">Diblokir</option></select>'+\n          '<span class=\"hint\">Tampil <strong id=\"seller-visible\">'+esc(rows.length)+'</strong> seller</span></div>'+\n          '<div class=\"table-wrap\"><table><thead><tr><th>Penjual</th><th>Rating</th><th>Ulasan</th><th>Produk</th><th>Pilihan</th></tr></thead><tbody id=\"seller-body\">'+\n          (sellerRows||'<tr><td colspan=\"5\" class=\"empty\">Digiflazz tidak mengirim data seller.</td></tr>')+\n          '</tbody></table></div>'+\n          '<p class=\"hint\"><strong>Penjual, Rating, Ulasan, dan Produk ditampilkan sesuai nilai yang dikirim endpoint seller Digiflazz melalui sesi cURL.</strong> Tools tidak menghitung ulang, merata-ratakan, atau mengganti nama seller pada tabel ini. Kolom Pilihan hanya aturan lokal untuk Auto Switch dan tidak mengubah data seller Digiflazz.</p>'+\n        '</section>';\n    }\n    function ruleTargetRows(scope) {\n      const rows=state.ruleTargets?.[scope]||[];\n      return rows.map(x=>typeof x===\"string\"?{value:x,label:x}:x);\n    }\n    function syncRuleTarget(scope) {\n      const el=$(\"rule-target\");\n      if(!el)return;\n      el.disabled=false;\n      const label=scope===\"category\"?\"kategori\":scope===\"brand\"?\"brand\":scope===\"type\"?\"tipe\":\"SKU\";\n      el.innerHTML='<option value=\"\">Pilih '+label+'</option>'+ruleTargetRows(scope).map(x=>'<option value=\"'+esc(x.value)+'\">'+esc(x.label||x.value)+'</option>').join(\"\");\n    }\n    async function rules() {\n      const d=await api(\"/api/rules\");\n      state.ruleTargets=d.targets||{};\n      $(\"content\").innerHTML='<div class=\"grid two\"><section class=\"card\"><h2>Aturan rating khusus</h2><form id=\"rule-form\"><div class=\"fields two\"><div class=\"field\"><label for=\"rule-scope\">Berlaku untuk</label><select id=\"rule-scope\" name=\"scope_type\"><option value=\"category\">Kategori</option><option value=\"brand\">Brand</option><option value=\"type\">Tipe</option><option value=\"product\">Satu SKU</option></select></div><div class=\"field\"><label for=\"rule-target\">Target</label><select id=\"rule-target\" name=\"scope_value\" required></select><span class=\"hint\">Target diambil langsung dari katalog agar kategori/brand tidak tertukar.</span></div><div class=\"field\"><label for=\"rule-rating\">Rating minimal</label><input id=\"rule-rating\" name=\"min_rating\" type=\"number\" min=\"4\" max=\"5\" step=\".1\" placeholder=\"Ikut pengaturan global\"></div></div><p class=\"hint\">Aturan ini hanya menaikkan/menentukan rating minimum untuk target tertentu. <strong>Stok tersedia dan tidak sedang cut-off selalu wajib</strong> dan tidak dapat dimatikan. Batas harga tetap Max Price per produk Digiflazz.</p><div style=\"margin-top:16px\"><button class=\"button primary\">Simpan aturan</button></div></form></section>'+\n      '<section class=\"card\"><h2>Aturan tersimpan</h2>'+(d.rules.length?d.rules.map(r=>'<div class=\"row\"><div><span class=\"name\">'+esc(r.scope_value)+'</span><span class=\"sku\">'+esc(r.scope_type)+' · Rating '+(r.min_rating!=null?\"≥ \"+esc(r.min_rating):\"ikut global\")+' · stok wajib · hindari cut-off</span></div><button class=\"button tiny danger\" data-action=\"delete-rule\" data-id=\"'+esc(r.id)+'\">Hapus</button></div>').join(\"\"):'<div class=\"empty\">Belum ada aturan khusus. Pengaturan global tetap berlaku.</div>')+'</section></div>';\n      syncRuleTarget(\"category\");\n    }\n    async function zones() {\n      const d=await api(\"/api/zones\");\n      $(\"content\").innerHTML='<div class=\"grid two\"><section class=\"card\"><h2>Buat grup zona</h2><form id=\"zone-form\"><div class=\"field\"><label for=\"zone-name\">Nama grup</label><input id=\"zone-name\" name=\"name\" required maxlength=\"80\" placeholder=\"ML Zona Sumatra\"></div><div class=\"field\"><label for=\"zone-pattern\">Pola deskripsi seller</label><input id=\"zone-pattern\" name=\"patterns\" required placeholder=\"sumatra, all region\"><span class=\"hint\">Pisahkan dengan koma. Semua pola harus ada pada deskripsi seller agar seller dianggap cocok.</span></div><div style=\"margin-top:16px\"><button class=\"button primary\">Simpan zona</button></div></form></section>'+\n      '<section class=\"card\"><h2>Grup tersimpan</h2>'+(d.zones.length?d.zones.map(z=>'<div class=\"row\"><div><span class=\"name\">'+esc(z.name)+'</span><span class=\"sku\">'+esc(z.patterns)+' · '+esc(z.assignment_count)+' SKU</span></div><button class=\"button tiny danger\" data-action=\"delete-zone\" data-id=\"'+esc(z.id)+'\">Hapus</button></div>').join(\"\"):'<div class=\"empty\">Belum ada grup zona.</div>')+'</section></div>'+\n      '<section class=\"section card\"><h2>Pasangkan produk ke zona</h2><form id=\"assign-form\" class=\"fields two\"><div class=\"field\"><label for=\"zone-sku\">Produk / SKU</label><select id=\"zone-sku\" name=\"sku\" required><option value=\"\">Pilih produk</option>'+d.products.map(p=>'<option value=\"'+esc(p.sku)+'\">'+esc((p.brand?p.brand+\" · \":\"\")+p.name+\" · \"+p.sku)+'</option>').join(\"\")+'</select></div><div class=\"field\"><label for=\"zone-choice\">Zona</label><select id=\"zone-choice\" name=\"zone_id\"><option value=\"\">Lepas zona</option>'+d.zones.map(z=>'<option value=\"'+esc(z.id)+'\">'+esc(z.name)+'</option>').join(\"\")+'</select></div><button class=\"button primary\">Simpan penugasan</button></form>'+\n      (d.assignments.length?'<div class=\"section\"><h3>Penugasan aktif</h3>'+d.assignments.map(a=>'<div class=\"row\"><div><span class=\"name\">'+esc((a.brand?a.brand+\" · \":\"\")+(a.product_name||a.sku))+'</span><span class=\"sku\">'+esc(a.sku)+' → '+esc(a.zone_name)+'</span></div><button class=\"button tiny\" data-action=\"unassign-zone\" data-sku=\"'+esc(a.sku)+'\">Lepas</button></div>').join(\"\")+'</div>':'<div class=\"empty\">Belum ada SKU yang dipasangkan ke zona.</div>')+'</section>';\n    }\n    async function history() {\n      const params=new URLSearchParams({sku:state.historySku,status:state.historyStatus,reason:state.historyReason});\n      const d=await api(\"/api/history?\"+params);\n      $(\"content\").innerHTML='<div class=\"card\"><div class=\"toolbar\"><input id=\"history-sku\" placeholder=\"Filter SKU\" value=\"'+esc(state.historySku)+'\"><select id=\"history-status\"><option value=\"\">Semua status</option>'+[\"success\",\"pending\",\"unknown\",\"error\"].map(x=>'<option value=\"'+x+'\" '+(state.historyStatus===x?\"selected\":\"\")+'>'+x+'</option>').join(\"\")+'</select><select id=\"history-reason\"><option value=\"\">Manual + otomatis</option><option value=\"manual\" '+(state.historyReason===\"manual\"?\"selected\":\"\")+'>Manual</option><option value=\"auto\" '+(state.historyReason===\"auto\"?\"selected\":\"\")+'>Otomatis</option></select>'+button(\"Terapkan\",\"filter-history\",\"primary\")+button(\"Reset\",\"reset-history\",\"tiny\")+'</div><p class=\"hint\">Filter diterapkan di backend. Riwayat scan tetap ditampilkan sebagai konteks operasional.</p></div>'+\n      '<div class=\"section grid two\"><section class=\"card\"><h2>Riwayat pemindaian</h2>'+(d.runs.length?d.runs.map(x=>'<div class=\"row\"><div><span class=\"name\">'+fmt(x.started_at)+' · '+esc(x.status)+'</span><span class=\"sku\">'+esc(x.total)+' produk · '+esc(x.issues)+' masalah · '+esc(x.message||\"\")+'</span></div>'+badge(x.status,x.status===\"success\"?\"good\":x.status===\"error\"?\"bad\":\"warn\")+'</div>').join(\"\"):'<div class=\"empty\">Belum ada pemindaian.</div>')+'</section><section class=\"card\"><h2>Perubahan harga</h2>'+(d.prices.length?d.prices.map(x=>'<div class=\"row\"><div><span class=\"name\">'+esc(x.buyer_sku_code)+'</span><span class=\"sku\">'+esc(x.seller_name||\"—\")+' · '+fmt(x.captured_at)+'</span></div><strong>'+rupiah(x.price)+'</strong></div>').join(\"\"):'<div class=\"empty\">Tidak ada perubahan harga sesuai filter.</div>')+'</section></div>'+\n      '<section class=\"section card\"><h2>Perpindahan seller</h2>'+(d.switches.length?d.switches.map(x=>'<div class=\"row\"><div><span class=\"name\">'+esc(x.buyer_sku_code)+'</span><span class=\"sku\">'+esc(x.from_seller||\"—\")+' → '+esc(x.to_seller||\"—\")+' · '+fmt(x.created_at)+'</span></div><div class=\"controls\">'+badge(x.reason===\"auto\"?\"Otomatis\":\"Manual\",x.reason===\"auto\"?\"\":\"good\")+badge(x.status,x.status===\"success\"?\"good\":x.status===\"error\"?\"bad\":\"warn\")+'</div></div>').join(\"\"):'<div class=\"empty\">Tidak ada perpindahan seller sesuai filter.</div>')+'</section>';\n    }\n    async function logs() {\n      const params=new URLSearchParams({level:state.logLevel,kind:state.logKind,sku:state.logSku,q:state.logQ});\n      const d=await api(\"/api/events?\"+params);\n      $(\"content\").innerHTML='<div class=\"card\"><div class=\"toolbar\"><select id=\"log-level\"><option value=\"\">Semua level</option>'+[\"INFO\",\"WARN\",\"ERROR\"].map(x=>'<option value=\"'+x+'\" '+(state.logLevel===x?\"selected\":\"\")+'>'+x+'</option>').join(\"\")+'</select><select id=\"log-kind\"><option value=\"\">Semua jenis</option>'+d.kinds.map(x=>'<option value=\"'+esc(x)+'\" '+(state.logKind===x?\"selected\":\"\")+'>'+esc(x)+'</option>').join(\"\")+'</select><input id=\"log-sku\" placeholder=\"SKU\" value=\"'+esc(state.logSku)+'\"><input id=\"log-q\" placeholder=\"Cari pesan\" value=\"'+esc(state.logQ)+'\">'+button(\"Terapkan\",\"filter-logs\",\"primary\")+button(\"Reset\",\"reset-logs\",\"tiny\")+'</div><div class=\"section-head\"><h2>Aktivitas sistem</h2>'+button(\"Muat ulang\",\"refresh-logs\",\"tiny\")+'</div>'+feed(d.events)+'</div>';\n    }\n    async function tools() {\n      const d=await api(\"/api/browser-config\"),c=d.config||{};\n      $(\"content\").innerHTML='<div class=\"grid two\"><section class=\"card\"><h2>Auto Seller Browser</h2><p class=\"sub\">Userscript ini hanya membantu saat kamu sedang membuka halaman Digiflazz. <strong>Aturan seller berasal dari dashboard ini</strong>, bukan dari setelan terpisah di userscript.</p><div class=\"row\"><span>Rating minimum</span><strong>'+esc(c.minRating??4)+'</strong></div><div class=\"row\"><span>Ulasan minimum</span><strong>'+esc(c.minReviews??0)+'</strong></div><div class=\"row\"><span>Toleransi harga</span><strong>'+esc(c.priceTolerancePercent??2)+'%</strong></div><div class=\"row\"><span>Seller diblokir</span><strong>'+esc((c.blocked||[]).length)+'</strong></div><p class=\"hint\">Saat halaman tools ini dibuka, userscript v2 menyimpan konfigurasi terbaru ke Violentmonkey. Tidak ada token atau cookie yang disalin.</p><p style=\"margin:16px 0 0\"><a class=\"button primary\" href=\"https://raw.githubusercontent.com/muhammadaldy198/digiflazz-tools/main/extension/digi-select.user.js\" target=\"_blank\" rel=\"noopener noreferrer\">Pasang / perbarui Auto Seller</a></p><p class=\"hint\">Android: Firefox + Violentmonkey. Helper tetap opsional; Auto Switch production berjalan dari Worker meskipun userscript tidak dipasang.</p></section>'+\n      '<section class=\"card\"><h2>SKU otomatis</h2><p class=\"sub\">Pembuatan SKU dilakukan langsung oleh userscript pada form Digiflazz, jadi tidak perlu generator satu-per-satu di dashboard.</p><div class=\"row\"><span>Mobile Legends 5 Diamond</span><strong>ML5</strong></div><div class=\"row\"><span>Free Fire 1000 Diamond</span><strong>FF1000</strong></div><p class=\"hint\">SKU yang sudah kamu isi manual tidak akan ditimpa. Tombol “Isi semua SKU di halaman” tetap tersedia di panel userscript.</p></section></div>'+\n      '<section class=\"section card\"><h2>Max Price</h2><p class=\"sub\">Batas harga tetap <strong>Max Price masing-masing produk Buyer di Digiflazz</strong>. Auto Seller Browser dan Auto Switch Worker tidak menghitung ulang atau mengubah Max Price saat memilih seller.</p><p class=\"hint\">Ubah Max Price dari Produk → Kelola → Max Price Digiflazz.</p></section>';\n    }\n    async function settings() {\n      await bootstrap();\n      const d=await api(\"/api/settings\"),s=d.settings;\n      $(\"content\").innerHTML='<form id=\"settings-form\" class=\"stack\"><div class=\"grid two\"><section class=\"card\"><h2>Monitor & eksekusi</h2><div class=\"fields two\">'+\n        '<div class=\"field\"><label for=\"interval\">Interval scan (menit)</label><input id=\"interval\" name=\"scanIntervalMinutes\" type=\"number\" min=\"60\" max=\"1440\" value=\"'+esc(Math.max(60,Number(s.scanIntervalMinutes)||60))+'\"><span class=\"hint\">Minimum 60 menit. Scan penuh di menit 00; Auto Switch di menit 30 setiap jam agar penggunaan database dan request lebih hemat.</span></div>'+\n        '<div class=\"field\"><label for=\"attention-refresh\">Pembaruan rating/SLA per scan</label><input id=\"attention-refresh\" name=\"attentionRefreshBatchSize\" type=\"number\" min=\"1\" max=\"10\" value=\"'+esc(s.attentionRefreshBatchSize)+'\"><span class=\"hint\">Produk aktif dengan data kandidat seller paling lama diperbarui bergiliran.</span></div>'+\n        '<div class=\"field\"><label for=\"switch-batch\">SKU per batch Auto Switch</label><input id=\"switch-batch\" name=\"autoSwitchBatchSize\" type=\"number\" min=\"1\" max=\"10\" value=\"'+esc(s.autoSwitchBatchSize)+'\"><span class=\"hint\">Maksimal jumlah SKU yang diperiksa pada satu batch otomatis.</span></div>'+\n        '<div class=\"field\"><label for=\"cooldown\">Cooldown perpindahan (jam)</label><input id=\"cooldown\" name=\"cooldownHours\" type=\"number\" min=\"1\" max=\"720\" value=\"'+esc(s.cooldownHours)+'\"><span class=\"hint\">SKU yang baru berhasil pindah tidak dipindahkan otomatis lagi sebelum masa jeda berakhir.</span></div>'+\n        '</div><div class=\"stack\"><label class=\"check\"><input name=\"scanEnabled\" type=\"checkbox\" '+(s.scanEnabled?\"checked\":\"\")+'> Jalankan monitor otomatis</label><label class=\"check\"><input name=\"autoSwitch\" type=\"checkbox\" '+(s.autoSwitch?\"checked\":\"\")+' '+(!state.bootstrap?.liveSwitchAvailable&&!s.autoSwitch?\"disabled\":\"\")+'> Auto Switch live</label><label class=\"check\"><input name=\"dryRun\" type=\"checkbox\" '+(s.dryRun?\"checked\":\"\")+'> Mode Uji — jangan mengubah seller di Digiflazz</label></div></section>'+\n        '<section class=\"card\"><h2>Prioritas Auto Switch</h2><p class=\"sub\"><strong>Tier rating 4,5–5 → Seller Prioritas → SLA tercepat → toleransi harga → rating/review terbaik → harga. Rating 4,0–4,49 hanya fallback bila tier atas kosong.</strong></p>'+\n        '<div class=\"fields two\"><div class=\"field\"><label for=\"minrating\">Rating minimum</label><input id=\"minrating\" name=\"minRating\" type=\"number\" min=\"4\" max=\"5\" step=\".1\" value=\"'+esc(Math.max(4,Number(s.minRating)||4))+'\"><span class=\"hint\">Seller di bawah 4 selalu gugur.</span></div>'+\n        '<div class=\"field\"><label for=\"minreviews\">Ulasan minimal</label><input id=\"minreviews\" name=\"minReviews\" type=\"number\" min=\"0\" value=\"'+esc(s.minReviews)+'\"><span class=\"hint\">0 berarti tidak menetapkan jumlah minimum.</span></div>'+\n        '<div class=\"field\"><label for=\"price-tolerance\">Toleransi harga (%)</label><input id=\"price-tolerance\" name=\"priceTolerancePercent\" type=\"number\" min=\"0\" max=\"20\" step=\".1\" value=\"'+esc(s.priceTolerancePercent)+'\"><span class=\"hint\">Dihitung terhadap seller termurah pada SLA yang sama. Batas harga absolut tetap Max Price produk Digiflazz.</span></div></div>'+\n        '<div class=\"row\"><span>SLA</span><strong>H+0 → H+1 → H+2 → H+3 → tidak diketahui</strong></div><div class=\"row\"><span>Dalam toleransi</span><strong>Rating → ulasan → harga</strong></div><div class=\"row\"><span>Jenis koneksi</span><strong>Tidak memengaruhi ranking</strong></div>'+\n        '<label for=\"save-mode\">Cara simpan panel</label><select id=\"save-mode\" name=\"saveMode\"><option value=\"manual\" '+(s.saveMode===\"manual\"?\"selected\":\"\")+'>Manual (tombol Simpan)</option><option value=\"auto\" '+(s.saveMode===\"auto\"?\"selected\":\"\")+'>Otomatis saat kontrol diubah</option></select><p class=\"hint\">Semua pengaturan aktif di atas disimpan ke D1 dan dipakai Worker production.</p></section></div><div><button class=\"button primary\">Simpan pengaturan</button></div></form>';\n      const form=$(\"settings-form\");\n      form.addEventListener(\"change\",()=>{if($(\"save-mode\").value===\"auto\" && form.checkValidity())form.requestSubmit()});\n    }\n    async function connection() {\n      const d=await api(\"/api/connection/status\");\n      $(\"content\").innerHTML='<div class=\"grid two\"><section class=\"card\"><h2>Status sesi</h2><div class=\"row\"><span>Digiflazz</span>'+badge(d.connected?\"Tersambung\":\"Belum tersambung\",d.connected?\"good\":\"warn\")+'</div><div class=\"row\"><span>Host</span><strong>'+esc(d.sourceHost||\"—\")+'</strong></div><div class=\"row\"><span>Uji terakhir</span><strong>'+(d.lastTestStatus?\"HTTP \"+esc(d.lastTestStatus)+\" · \"+fmt(d.lastTestAt):\"—\")+'</strong></div><div class=\"row\"><span>Diperbarui</span><strong>'+fmt(d.updatedAt)+'</strong></div><div class=\"controls\" style=\"margin-top:16px\">'+button(\"Tes koneksi\",\"test-connection\",\"primary\")+(d.connected?button(\"Putuskan sesi\",\"disconnect-connection\",\"danger\"):\"\")+'</div><p class=\"hint\">Tes koneksi hanya memeriksa sesi GET yang tersimpan dan tidak mengubah produk.</p></section>'+\n      '<section class=\"card\"><h2>'+(d.connected?\"Ganti sesi\":\"Hubungkan Digiflazz\")+'</h2><p class=\"sub\">Tempel cURL GET dari dashboard Digiflazz. Tools akan <strong>menguji cURL lebih dulu</strong>; sesi lama tidak ditimpa bila pengujian gagal.</p><form id=\"connection-form\" class=\"stack\" style=\"margin-top:12px\"><div class=\"field\"><label for=\"curl\">cURL GET Digiflazz</label><textarea id=\"curl\" name=\"curl\" autocomplete=\"off\" spellcheck=\"false\" required placeholder=\"curl &#39;https://member.digiflazz.com/...&#39; ...\"></textarea></div><div><button class=\"button primary\">Uji & simpan sesi</button></div></form><p class=\"hint\">Cookie/token disimpan terenkripsi di D1. Jangan bagikan cURL ke chat atau commit GitHub.</p></section></div>';\n    }\n    async function render(view=state.view) {\n      state.view=view;const [title,sub]=names[view];$(\"title\").textContent=title;$(\"subtitle\").textContent=sub;\n      document.querySelectorAll(\"#nav button\").forEach(x=>x.classList.toggle(\"active\",x.dataset.view===view));\n      message(\"\");loading();\n      try{await ({overview,products,sellers,rules,zones,history,logs,tools,settings,connection})[view]()}catch(e){error(e);$(\"content\").innerHTML='<div class=\"card empty\"><strong>Data belum dapat dimuat</strong>'+esc(e.message)+'</div>'}\n    }\n    async function write(path,body,method=\"POST\") {return api(path,{method,body:method===\"DELETE\"?\"{}\":JSON.stringify(body||{})})}\n    async function action(a,el) {\n      if(a===\"scan-now\"){toast(\"Memindai katalog…\");const d=await write(\"/api/scan\");if(d.skipped){toast(\"Scan lain masih berjalan\"+(d.startedAt?\" sejak \"+fmt(d.startedAt):\"\")+\". Tunggu sampai selesai.\");return render()}toast(d.total+\" produk dipindai; \"+d.issues+\" perlu perhatian; \"+(d.qualityRefreshed||0)+\" rating/SLA diperbarui.\");return render()}\n      if(a===\"manual-test\"){\n        const d=await api(\"/api/products?\"+new URLSearchParams({page:\"1\",q:\"\",status:\"actionable\"}));\n        const first=d.products?.[0];\n        if(!first)throw Error(\"Belum ada SKU dengan kandidat seller yang benar-benar siap dipindahkan. Periksa Masalah seller dan Max Price terlebih dahulu.\");\n        toast(\"Membuka kandidat seller siap pindah untuk \"+first.sku+\"…\");\n        return product(first.sku);\n      }\n      if(a===\"toggle-auto\"){\n        const d=state.bootstrap||await bootstrap();\n        const active=d.settings.autoSwitch&&!d.settings.dryRun;\n        if(!active&&!d.liveSwitchAvailable){\n          toast(\"Lakukan Tes Switch Manual dulu. Saya buka produknya sekarang.\");\n          return action(\"manual-test\",el);\n        }\n        await write(\"/api/settings\",{autoSwitch:!active,dryRun:active,scanEnabled:true});\n        toast(active?\"Auto Switch dimatikan. Mode Uji aktif.\":\"Auto Switch AKTIF. Mode Uji dimatikan.\");\n        return render();\n      }\n      if(a===\"run-auto\"){\n        const d=state.bootstrap||await bootstrap();\n        if(!(d.settings.autoSwitch&&!d.settings.dryRun)){\n          if(!d.liveSwitchAvailable){toast(\"Verifikasi 1x switch manual dulu.\");return action(\"manual-test\",el)}\n          await write(\"/api/settings\",{autoSwitch:true,dryRun:false,scanEnabled:true});\n        }\n        toast(\"Memilih seller terbaik berdasarkan rating, SLA, toleransi harga, dan ulasan…\");\n        const result=await write(\"/api/automation/run\",{});\n        toast(\"Auto Switch: \"+result.switched+\" berhasil, \"+result.noCandidate+\" tanpa kandidat, \"+(result.skipped||0)+\" dilewati, \"+result.failed+\" gagal.\");\n        return render();\n      }\n      if(a===\"monitor\"){const d=state.bootstrap;await write(\"/api/settings\",{scanEnabled:!d.settings.scanEnabled});return render()}\n      if(a===\"goto-issues\"){state.status=\"issues\";state.page=1;return render(\"products\")}\n      if(a===\"goto-actionable\"){state.status=\"actionable\";state.page=1;return render(\"products\")}\n      if(a===\"goto-missing-max\"){state.status=\"missing-max\";state.page=1;return render(\"products\")}\n      if(a.startsWith(\"quick-status:\")){state.status=a.slice(\"quick-status:\".length)||\"all\";state.page=1;return render(\"products\")}\n      if(a.startsWith(\"goto-\"))return render({ \"goto-rules\":\"rules\",\"goto-history\":\"history\",\"goto-logs\":\"logs\" }[a]);\n      if(a===\"search\"){state.q=$(\"search-product\").value;state.status=$(\"filter-product\").value;state.category=$(\"filter-category\").value;state.brand=$(\"filter-brand\").value;state.page=1;return render()}\n      if(a===\"prev\"||a===\"next\"){state.page+=a===\"next\"?1:-1;return render()}\n      if(a===\"product\")return product(el.dataset.sku);\n      if(a===\"switch-seller\"){\n        const p=state.selected;\n        if(!confirm(\"Pindah seller SKU \"+p.sku+\" ke \"+el.dataset.sellerName+\" (\"+rupiah(el.dataset.sellerPrice)+\") di Digiflazz?\"))return;\n        toast(\"Menyimpan dan mengecek seller di Digiflazz…\");\n        const result=await write(\"/api/products/\"+encodeURIComponent(p.sku)+\"/switch\",{sellerId:el.dataset.sellerId});\n        toast(\"Seller \"+result.seller+\" tersimpan dan terkonfirmasi.\");\n        $(\"modal\").hidden=true;return render();\n      }\n      if(a===\"save-sku\"){\n        const p=state.selected,newSku=$(\"product-sku\").value.trim();\n        if(!/^[A-Za-z0-9._-]{1,50}$/.test(newSku))throw Error(\"SKU hanya boleh huruf, angka, titik, garis bawah, atau minus.\");\n        if(newSku===p.sku)return toast(\"SKU tidak berubah.\");\n        if(!confirm(\"Ubah SKU Buyer \"+p.sku+\" menjadi \"+newSku+\" langsung di Digiflazz?\"))return;\n        toast(\"Mengubah SKU di Digiflazz…\");\n        const result=await write(\"/api/products/\"+encodeURIComponent(p.sku)+\"/sku\",{sku:newSku});\n        toast(\"SKU berhasil diubah dan terkonfirmasi: \"+result.sku);\n        $(\"modal\").hidden=true;state.selected=null;return render(\"products\");\n      }\n      if(a===\"toggle-product\"){\n        const sku=el.dataset.sku||state.selected?.sku;\n        if(!sku)throw Error(\"SKU produk tidak ditemukan.\");\n        const currentlyActive=el.dataset.active===\"1\";\n        const next=!currentlyActive;\n        if(!confirm((next?\"Aktifkan\":\"Nonaktifkan\")+\" SKU \"+sku+\" langsung di Digiflazz?\"))return;\n        toast((next?\"Mengaktifkan\":\"Menonaktifkan\")+\" produk di Digiflazz…\");\n        await write(\"/api/products/\"+encodeURIComponent(sku)+\"/status\",{active:next});\n        toast(\"Produk \"+sku+\" sekarang \"+(next?\"ON\":\"OFF\")+\" di Digiflazz.\");\n        if(state.selected?.sku===sku){$(\"modal\").hidden=true;state.selected=null}\n        return render(\"products\");\n      }\n      if(a===\"delete-product\"){\n        const sku=el.dataset.sku||state.selected?.sku,name=el.dataset.name||state.selected?.name||sku;\n        if(!sku)throw Error(\"SKU produk tidak ditemukan.\");\n        if(!confirm('HAPUS \"'+name+'\" ('+sku+') dari Digiflazz?\\n\\nDigiflazz memperingatkan: setelah produk dihapus, cek status transaksi lama menggunakan kode produk ini tidak dapat dilakukan lagi.'))return;\n        if(!confirm(\"Konfirmasi terakhir: benar-benar hapus \"+sku+\" dari daftar produk Buyer Digiflazz?\"))return;\n        toast(\"Menghapus produk dari Digiflazz…\");\n        await write(\"/api/products/\"+encodeURIComponent(sku),{},\"DELETE\");\n        toast(\"Produk \"+sku+\" sudah dihapus dan terkonfirmasi di Digiflazz.\");\n        $(\"modal\").hidden=true;state.selected=null;return render(\"products\");\n      }\n      if(a===\"use-required-max\"){\n        const p=state.selected,amount=Number(p?.required_max_price);\n        if(!Number.isSafeInteger(amount)||amount<1)throw Error(\"Tidak ada kebutuhan Max Price kandidat.\");\n        $(\"product-max\").value=String(amount);\n        return toast(\"Max Price kandidat diisi. Tekan Simpan Max Price untuk mengirim ke Digiflazz.\");\n      }\n      if(a===\"save-max\"){\n        const p=state.selected,amount=Number($(\"product-max\").value);\n        if(!Number.isSafeInteger(amount)||amount<1)throw Error(\"Masukkan harga maksimum yang benar.\");\n        if(!confirm(\"Simpan harga maksimum \"+rupiah(amount)+\" untuk SKU \"+p.sku+\" di Digiflazz?\"))return;\n        toast(\"Menyimpan harga maksimum…\");\n        await write(\"/api/products/\"+encodeURIComponent(p.sku)+\"/max-price\",{maxPrice:amount});\n        toast(\"Harga maksimum dikonfirmasi di Digiflazz.\");$(\"modal\").hidden=true;return render();\n      }\n      if(a===\"reconcile\"){\n        const p=state.selected;\n        const result=await write(\"/api/products/\"+encodeURIComponent(p.sku)+\"/reconcile\");\n        toast(result.confirmed?\"Perubahan terkonfirmasi di Digiflazz dan data produk sudah disinkronkan.\":\"Target tidak ditemukan; data terbaru sudah disinkronkan. Periksa sebelum mencoba lagi.\",!result.confirmed);\n        return product(p.sku);\n      }\n      if(a===\"close\"){$(\"modal\").hidden=true;return}\n      if(a===\"lock\"){const p=state.selected,next=!p.locked;const message=next?\"Kunci Auto Switch untuk \"+p.sku+\"? Sistem tidak akan mengganti seller SKU ini secara otomatis. Aksi manual tetap tersedia.\":\"Buka Kunci Auto Switch untuk \"+p.sku+\"? SKU ini akan kembali boleh diproses Auto Switch.\";if(!confirm(message))return;await write(\"/api/products/\"+encodeURIComponent(p.sku)+\"/lock\",{locked:next,reason:\"manual\"});toast(next?\"Auto Switch dikunci untuk \"+p.sku+\".\":\"Kunci Auto Switch dibuka untuk \"+p.sku+\".\");return product(p.sku)}\n      if(a===\"copy-price\"){await navigator.clipboard.writeText(String(state.selected.max_price||state.selected.price));return toast(\"Harga disalin.\")}\n      if(a===\"delete-rule\"){if(!confirm(\"Hapus aturan ini?\"))return;await write(\"/api/rules/\"+el.dataset.id,{},\"DELETE\");return render()}\n      if(a===\"delete-zone\"){if(!confirm(\"Hapus zona dan seluruh penugasannya?\"))return;await write(\"/api/zones/\"+el.dataset.id,{},\"DELETE\");return render()}\n      if(a===\"unassign-zone\"){await write(\"/api/zones/assign\",{sku:el.dataset.sku,zone_id:null});toast(\"Zona dilepas dari \"+el.dataset.sku+\".\");return render()}\n      if(a===\"filter-history\"){state.historySku=$(\"history-sku\").value.trim();state.historyStatus=$(\"history-status\").value;state.historyReason=$(\"history-reason\").value;return render(\"history\")}\n      if(a===\"reset-history\"){state.historySku=\"\";state.historyStatus=\"\";state.historyReason=\"\";return render(\"history\")}\n      if(a===\"filter-logs\"){state.logLevel=$(\"log-level\").value;state.logKind=$(\"log-kind\").value;state.logSku=$(\"log-sku\").value.trim();state.logQ=$(\"log-q\").value.trim();return render(\"logs\")}\n      if(a===\"reset-logs\"){state.logLevel=\"\";state.logKind=\"\";state.logSku=\"\";state.logQ=\"\";return render(\"logs\")}\n      if(a===\"refresh-logs\")return render(\"logs\");\n      if(a===\"test-connection\"){const d=await write(\"/api/connection/test\");toast(\"Uji sesi: HTTP \"+d.httpStatus+(d.connected?\" · tersambung\":\" · gagal\"),!d.connected);return render(\"connection\")}\n      if(a===\"disconnect-connection\"){if(!confirm(\"Putuskan sesi Digiflazz dari tools? Auto scan dan Auto Switch berhenti sampai sesi baru disimpan.\"))return;await write(\"/api/connection\",{},\"DELETE\");toast(\"Sesi Digiflazz diputus.\");return render(\"connection\")}\n    }\n    $(\"nav\").addEventListener(\"click\",e=>{const b=e.target.closest(\"button[data-view]\");if(b)render(b.dataset.view)});\n    $(\"refresh\").addEventListener(\"click\",()=>render());\n    $(\"scan\").addEventListener(\"click\",async()=>{try{await action(\"scan-now\")}catch(e){error(e)}});\n    document.addEventListener(\"click\",async e=>{const b=e.target.closest(\"button[data-action]\");if(!b)return;try{b.disabled=true;await action(b.dataset.action,b)}catch(err){error(err)}finally{if(b.isConnected)b.disabled=false}});\n    document.addEventListener(\"change\",async e=>{\n      if(e.target.matches(\".seller-mode\")){try{await write(\"/api/sellers/\"+encodeURIComponent(e.target.dataset.key)+\"/preference\",{mode:e.target.value,name:e.target.dataset.label});e.target.closest(\"tr\")?.setAttribute(\"data-mode\",e.target.value);toast(\"Pilihan seller tersimpan.\");filterSellerRows()}catch(err){error(err)}}\n      if(e.target.id===\"seller-filter\")return filterSellerRows();\n      if(e.target.id===\"filter-category\"){state.category=e.target.value;state.brand=\"\";state.page=1;return render(\"products\")}\n      if(e.target.id===\"rule-scope\"){syncRuleTarget(e.target.value)}\n    });\n    document.addEventListener(\"input\",e=>{if(e.target.id===\"seller-search\")filterSellerRows()});\n    document.addEventListener(\"submit\",async e=>{\n      if(![\"rule-form\",\"zone-form\",\"assign-form\",\"settings-form\",\"connection-form\"].includes(e.target.id))return;\n      e.preventDefault();const f=e.target,b=new FormData(f),id=f.id;\n      try{\n        if(id===\"rule-form\")await write(\"/api/rules\",{scope_type:b.get(\"scope_type\"),scope_value:b.get(\"scope_value\"),min_rating:b.get(\"min_rating\")===\"\"?null:Number(b.get(\"min_rating\"))});\n        if(id===\"zone-form\")await write(\"/api/zones\",Object.fromEntries(b));\n        if(id===\"assign-form\")await write(\"/api/zones/assign\",Object.fromEntries(b));\n        if(id===\"connection-form\"){const d=await write(\"/api/connection\",{curl:b.get(\"curl\")});$(\"curl\").value=\"\";toast(\"Sesi diuji dan disimpan: HTTP \"+d.httpStatus+\".\")}\n        if(id===\"settings-form\"){await write(\"/api/settings\",{scanEnabled:b.has(\"scanEnabled\"),autoSwitch:b.has(\"autoSwitch\"),dryRun:b.has(\"dryRun\"),scanIntervalMinutes:Number(b.get(\"scanIntervalMinutes\")),minRating:Number(b.get(\"minRating\")),minReviews:Number(b.get(\"minReviews\")),attentionRefreshBatchSize:Number(b.get(\"attentionRefreshBatchSize\")),priceTolerancePercent:Number(b.get(\"priceTolerancePercent\")),cooldownHours:Number(b.get(\"cooldownHours\")),autoSwitchBatchSize:Number(b.get(\"autoSwitchBatchSize\")),saveMode:b.get(\"saveMode\")})}\n        toast(\"Tersimpan.\");if(id!==\"settings-form\"||b.get(\"saveMode\")!==\"auto\")await render();\n      }catch(err){error(err)}\n    });\n    render();\n  })();\n  </script>\n</body>\n</html>\n";
const encoder = new TextEncoder();
const decoder = new TextDecoder();
const DEFAULTS = {
  scanEnabled: false, dryRun: true, autoSwitch: false, scanIntervalMinutes: 60,
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
function bool(v) { return v === true || v === 1 || v === "true" || v === "1"; }
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
function accessIssuer(teamDomain) {
  const host=str(teamDomain).replace(/^https?:\/\//i,"").replace(/\/+$/,"");
  return host?"https://"+host:"";
}
function accessClaimsValid(payload,env,nowSec=Math.floor(Date.now()/1000)) {
  const issuer=accessIssuer(env.ACCESS_TEAM_DOMAIN);
  const exp=Number(payload?.exp),nbf=payload?.nbf==null?null:Number(payload.nbf);
  if(!issuer||payload?.iss!==issuer)return false;
  if(!Array.isArray(payload?.aud)||!payload.aud.includes(env.ACCESS_AUD))return false;
  if(!Number.isFinite(exp)||exp<nowSec-60)return false;
  if(nbf!=null&&(!Number.isFinite(nbf)||nbf>nowSec+60))return false;
  return true;
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
    if (!accessClaimsValid(payload,env)) return false;
    const certUrl = accessIssuer(env.ACCESS_TEAM_DOMAIN) + "/cdn-cgi/access/certs";
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
  const headers = {
    ...session.headers,
    accept: htmlRequest ? "text/html,application/xhtml+xml" : "application/json",
    origin:"https://member.digiflazz.com",
    referer:"https://member.digiflazz.com/buyer-area"
  };
  delete headers.host;
  if (htmlRequest) delete headers["x-requested-with"];
  else headers["x-requested-with"] ||= "XMLHttpRequest";
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
function isPersistentPolicyRejection(detail) {
  const text=str(detail).toLowerCase();
  return /\bktp\b|administrasi perpajakan|hubungi admin digiflazz|mewajibkan buyer|verifikasi.{0,40}(?:admin|akun)|(?:admin|akun).{0,40}verifikasi/i.test(text);
}
async function activeSellerRejections(env, sku) {
  const rows=await env.DB.prepare("SELECT seller_id,seller_name,reason,permanent,retry_after FROM seller_rejections WHERE sku=? AND (permanent=1 OR retry_after>CURRENT_TIMESTAMP)").bind(sku).all();
  return rows.results||[];
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
    error.detail=detail;
    error.definitive=res.status>=400&&res.status<500&&![408,409,423,425,429].includes(res.status);
    error.policyBlock=error.definitive&&isPersistentPolicyRejection(detail);
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
    error.detail=detail;
    error.definitive=true;
    error.policyBlock=isPersistentPolicyRejection(detail);
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
function mirrorSeller(x) {
  const sellerId=str(x.seller_id ?? x.id ?? x.company_id ?? x.company?.id);
  const name=str(x.company_name ?? x.seller_name ?? x.name ?? x.company?.name);
  if(!sellerId&&!name)return null;
  return {
    seller_id:sellerId||name,
    name:name||sellerId,
    rating:x.review_avg ?? x.rating ?? x.rating_avg ?? null,
    review_count:x.rating_qty ?? x.review_count ?? x.reviews ?? x.total_review ?? x.total_reviews ?? null,
    product_count:x.product_count ?? x.total_product ?? x.total_products ?? x.product_qty ?? x.products_count ?? null,
    invoice:x.tax_invoice ?? x.invoice ?? x.faktur ?? null,
    raw:x
  };
}
async function sellerDirectoryLive(env) {
  const row=await conn(env);
  if(!row||!env.SESSION_ENCRYPTION_KEY)throw Error("Sesi Digiflazz belum terhubung.");
  const session=await unseal(row,env.SESSION_ENCRYPTION_KEY);
  let path="/api/v1/buyer/seller";
  try {
    const captured=new URL(session.url);
    if(captured.hostname==="member.digiflazz.com"&&captured.pathname.startsWith("/api/v1/buyer/seller")) path=captured.pathname+captured.search;
  } catch {}
  const response=await remoteJson(env,path);
  const list=listOf(response,["data.data","data.sellers","data","sellers","result.data","result"]);
  if(!list)throw Error("Format data seller Digiflazz belum dikenali.");
  const sellers=list.map(mirrorSeller).filter(Boolean);
  if(list.length&&!sellers.length)throw Error("Data seller Digiflazz tidak memiliki identitas seller yang dikenali.");
  return {sellers,endpoint:path};
}
async function cacheSellerDirectory(env,sellers) {
  if(!sellers.length)return;
  const stmts=sellers.map(x=>env.DB.prepare(
    "INSERT INTO sellers(seller_id,name,rating,review_count,product_count,invoice,raw,last_seen) VALUES(?,?,?,?,?,?,?,CURRENT_TIMESTAMP) "+
    "ON CONFLICT(seller_id) DO UPDATE SET name=excluded.name,rating=excluded.rating,review_count=excluded.review_count,product_count=excluded.product_count,invoice=excluded.invoice,raw=excluded.raw,last_seen=CURRENT_TIMESTAMP"
  ).bind(
    x.seller_id,x.name,
    x.rating==null?null:x.rating,
    x.review_count==null?null:x.review_count,
    x.product_count==null?null:x.product_count,
    x.invoice==null?null:(bool(x.invoice)?1:0),
    JSON.stringify(x.raw).slice(0,20000)
  ));
  for(let i=0;i<stmts.length;i+=80)await env.DB.batch(stmts.slice(i,i+80));
  await env.DB.prepare("INSERT INTO app_settings(key,value) VALUES('seller_directory_count',?) ON CONFLICT(key) DO UPDATE SET value=excluded.value,updated_at=CURRENT_TIMESTAMP")
    .bind(JSON.stringify(sellers.length)).run();
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
  // Legacy databases may still contain the old 5-minute value. Clamp it in memory
  // so production immediately respects the new hourly minimum without a migration write.
  values.scanIntervalMinutes=Math.max(60,Number(values.scanIntervalMinutes)||60);
  return values;
}
function validateSettings(input, current) {
  const next = { ...current };
  for (const [key, value] of Object.entries(input)) {
    if (!(key in DEFAULTS)) continue;
    if (["scanEnabled","dryRun","autoSwitch"].includes(key)) next[key] = bool(value);
    else if (["minRating","minReviews","scanIntervalMinutes","cooldownHours","autoSwitchBatchSize","attentionRefreshBatchSize","priceTolerancePercent"].includes(key)) {
      const limits = {
        minRating:[4,5],minReviews:[0,100000],scanIntervalMinutes:[60,1440],
        cooldownHours:[1,720],autoSwitchBatchSize:[1,10],attentionRefreshBatchSize:[1,10],priceTolerancePercent:[0,20]
      };
      next[key] = bounded(value, ...limits[key], current[key]);
    } else if (key === "saveMode" && ["manual","auto"].includes(value)) next[key] = value;
  }
  return next;
}
function ensureScanBudget(deadlineMs) {
  if(Date.now()>=deadlineMs) throw Error("Scan melewati budget waktu aman 90 detik; dihentikan agar tidak menumpuk.");
}
async function acquireScanRun(env) {
  await env.DB.prepare("UPDATE scan_runs SET status='error',finished_at=CURRENT_TIMESTAMP,message='Scan lama dianggap berhenti sebelum selesai.' WHERE status='running' AND started_at < datetime('now','-5 minutes')").run();
  const active=await env.DB.prepare("SELECT id,started_at FROM scan_runs WHERE status='running' ORDER BY id DESC LIMIT 1").first();
  if(active)return {runId:null,active};
  try {
    const created=await env.DB.prepare("INSERT INTO scan_runs(status) VALUES('running')").run();
    return {runId:created.meta.last_row_id,active:null};
  } catch(error) {
    if(/constraint|unique/i.test(String(error?.message||""))) {
      const current=await env.DB.prepare("SELECT id,started_at FROM scan_runs WHERE status='running' ORDER BY id DESC LIMIT 1").first();
      return {runId:null,active:current||null};
    }
    throw error;
  }
}
async function scan(env, reason = "manual") {
  const acquired=await acquireScanRun(env);
  if(!acquired.runId)return {ok:true,skipped:true,reason:"already_running",activeRunId:acquired.active?.id||null,startedAt:acquired.active?.started_at||null};
  const runId=acquired.runId;
  const deadlineMs=Date.now()+90000;
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
    const categoryTargets=categories.map(category=>({category,id:entityId(category)})).filter(x=>x.id&&/^[a-zA-Z0-9_-]{1,80}$/.test(x.id));
    ensureScanBudget(deadlineMs);
    const categoryPayloads=await Promise.all(categoryTargets.map(async ({category,id})=>{
      const response=await remoteJson(env,"/api/v1/buyer/product/category/"+encodeURIComponent(id)+"/");
      return {category,id,response};
    }));
    const items=[];
    for(const {category,id,response} of categoryPayloads) {
      const members=listOf(response,["data","data.data","products"]);
      if(!members)throw Error("Format produk kategori "+id+" belum dikenali.");
      const categoryName=entityName(category)||metadata.categories.get(id)||id;
      for(const member of members)items.push({member,categoryName});
    }
    const products = items.map(x=>normalizeProduct(x.member,{...metadata,categoryName:x.categoryName})).filter(Boolean);
    if (items.length && !products.length) throw Error("Data produk tidak memiliki SKU yang dikenali.");
    let issues = 0;
    for (let i=0;i<products.length;i+=75) {
      ensureScanBudget(deadlineMs);
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
    const stale=await env.DB.prepare("SELECT p.sku FROM products p WHERE p.last_seen < (SELECT started_at FROM scan_runs WHERE id=?) AND NOT EXISTS (SELECT 1 FROM switch_operations op WHERE op.sku=p.sku AND op.status IN ('pending','unknown'))").bind(runId).all();
    if(stale.results.length) {
      for(let i=0;i<stale.results.length;i+=75) {
        const skus=stale.results.slice(i,i+75).map(x=>x.sku);
        const marks=skus.map(()=>"?").join(",");
        await env.DB.batch([
          env.DB.prepare("DELETE FROM product_attention WHERE sku IN ("+marks+")").bind(...skus),
          env.DB.prepare("DELETE FROM quality_refresh_state WHERE sku IN ("+marks+")").bind(...skus),
          env.DB.prepare("DELETE FROM seller_rejections WHERE sku IN ("+marks+")").bind(...skus),
          env.DB.prepare("DELETE FROM seller_options WHERE sku IN ("+marks+")").bind(...skus),
          env.DB.prepare("DELETE FROM product_locks WHERE buyer_sku_code IN ("+marks+")").bind(...skus),
          env.DB.prepare("DELETE FROM zone_assignments WHERE sku IN ("+marks+")").bind(...skus),
          env.DB.prepare("DELETE FROM switch_operations WHERE sku IN ("+marks+")").bind(...skus),
          env.DB.prepare("DELETE FROM seller_rules WHERE scope_type='product' AND scope_value IN ("+marks+")").bind(...skus),
          env.DB.prepare("DELETE FROM products WHERE sku IN ("+marks+")").bind(...skus)
        ]);
      }
      await log(env,"INFO","catalog-cleanup",stale.results.length+" produk lama dihapus karena tidak ada lagi di katalog Digiflazz.");
    }
    ensureScanBudget(deadlineMs);
    const sellerRetry=await env.DB.prepare("SELECT value FROM app_settings WHERE key='seller_directory_retry_after'").first();
    if((!sellerRetry || Date.now()>=Date.parse(sellerRetry.value))&&Date.now()+22000<deadlineMs) {
      try {
        const directory=await sellerDirectoryLive(env);
        await cacheSellerDirectory(env,directory.sellers);
        await env.DB.prepare("DELETE FROM app_settings WHERE key='seller_directory_retry_after'").run();
      } catch (error) {
        if(error?.status===403) {
          const retryAt=new Date(Date.now()+24*3600000).toISOString();
          await env.DB.prepare("INSERT INTO app_settings(key,value) VALUES('seller_directory_retry_after',?) ON CONFLICT(key) DO UPDATE SET value=excluded.value").bind(retryAt).run();
          await log(env,"WARN","sellers","Endpoint direktori seller Digiflazz ditolak HTTP 403; scan produk tetap berjalan. Dicoba lagi setelah 24 jam.");
        } else await log(env,"WARN","sellers",error.message);
      }
    }
    const cfg=await settings(env);
    const qualityRefresh=await refreshAttentionCoverage(env,cfg.attentionRefreshBatchSize,deadlineMs);
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
function effectiveMinRating(rule,config) {
  const configured=Number(rule?.min_rating ?? config?.minRating ?? 4);
  return Math.max(4,Math.min(5,Number.isFinite(configured)?configured:4));
}
function rank(product, rows, prefs, rule, config, zone) {
  const blocked = new Set(prefs.filter(p=>p.mode==="blocked").map(p=>str(p.seller_name).toLowerCase()));
  const preferred = new Set(prefs.filter(p=>p.mode==="preferred").map(p=>str(p.seller_name).toLowerCase()));
  const max = Number(product.max_price)>0 ? Number(product.max_price) : Infinity;
  const minRating=effectiveMinRating(rule,config);
  const preferredRatingFloor=Math.max(4.5,minRating);
  const tolerance=bounded(config.priceTolerancePercent,0,20,2);
  const mapped=rows.map(x => {
    const reasons = [];
    const name = str(x.seller_name).toLowerCase();
    const accountKey = str(x.seller_account_id) ? ("sid:"+str(x.seller_account_id)).toLowerCase() : "";
    const nameKey = name ? "name:"+name : "";
    const isBlocked = (accountKey&&blocked.has(accountKey)) || blocked.has(name) || (nameKey&&blocked.has(nameKey));
    const isPreferred = (accountKey&&preferred.has(accountKey)) || preferred.has(name) || (nameKey&&preferred.has(nameKey));
    if (isBlocked) reasons.push("Seller diblokir");
    if (!x.price || (x.seller_status != null && Number(x.seller_status) !== 1)) reasons.push("Seller tidak aktif");
    if (x.price > max) reasons.push("Harga di atas batas");
    if (minRating > 0 && (x.rating == null || Number(x.rating) < minRating)) reasons.push("Rating kurang atau tidak tersedia");
    const reviews=reviewValue(x.review_count),reviewText=str(x.review_count);
    if (config.minReviews > 0 && (reviewText.startsWith("<") || reviews < config.minReviews)) reasons.push("Ulasan kurang atau tidak tersedia");
    if (x.stock != null && !x.unlimited_stock && !(x.stock > 0)) reasons.push("Stok habis");
    if (inCutoffWindow(x.start_cut_off,x.end_cut_off)) reasons.push("Sedang cut-off");
    if (zone && !zone.patterns.every(p=>String(x.description||"").toLowerCase().includes(p.toLowerCase()))) reasons.push("Zona tidak cocok");
    const sla_days=slaDays(x.sla);
    const rating=Number(x.rating);
    return {
      ...x,
      eligible:!reasons.length,
      reasons,
      sla_days,
      review_value:reviews,
      preferred:isPreferred,
      preference_key:accountKey||nameKey||name,
      rating_tier:Number.isFinite(rating)&&rating>=preferredRatingFloor?1:0
    };
  });
  const activeRatingTier=mapped.some(x=>x.eligible&&x.rating_tier===1)?1:0;
  const cheapestBySla=new Map();
  for(const x of mapped) if(x.eligible&&x.rating_tier===activeRatingTier) {
    const previous=cheapestBySla.get(x.sla_days);
    if(previous==null||Number(x.price)<previous)cheapestBySla.set(x.sla_days,Number(x.price));
  }
  for(const x of mapped) {
    const reference=x.rating_tier===activeRatingTier?cheapestBySla.get(x.sla_days):null;
    x.reference_price=reference??null;
    x.within_price_tolerance=!!x.eligible&&x.rating_tier===activeRatingTier&&reference!=null&&Number(x.price)<=reference*(1+tolerance/100)+1e-9;
    x.price_tolerance_percent=tolerance;
    x.active_rating_tier=activeRatingTier;
  }
  return mapped.sort((a,b)=>{
    const eligibility=Number(b.eligible)-Number(a.eligible);
    if(eligibility)return eligibility;
    if(a.eligible&&b.eligible) {
      const tier=Number(b.rating_tier)-Number(a.rating_tier);
      if(tier)return tier;
      const priority=Number(b.preferred)-Number(a.preferred);
      if(priority)return priority;
    }
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
function maxPriceBlockedReplacement(ranked,currentSellerId) {
  const candidates=(ranked||[])
    .filter(x=>String(x.seller_id)!==String(currentSellerId)&&Array.isArray(x.reasons)&&x.reasons.length===1&&x.reasons[0]==="Harga di atas batas");
  if(!candidates.length)return null;
  const cheapestBySla=new Map();
  for(const x of candidates) {
    const sla=Number(x.sla_days);
    const previous=cheapestBySla.get(sla);
    if(previous==null||Number(x.price)<previous)cheapestBySla.set(sla,Number(x.price));
  }
  const withinTolerance=x=>{
    const reference=cheapestBySla.get(Number(x.sla_days));
    const tolerance=bounded(x.price_tolerance_percent,0,20,2);
    return reference!=null&&Number(x.price)<=reference*(1+tolerance/100)+1e-9;
  };
  return candidates.sort((a,b)=>{
    const sla=Number(a.sla_days)-Number(b.sla_days);
    if(sla)return sla;
    const band=Number(withinTolerance(b))-Number(withinTolerance(a));
    if(band)return band;
    if(withinTolerance(a)&&withinTolerance(b)) {
      return Number(b.rating||0)-Number(a.rating||0) ||
        Number(b.review_value||0)-Number(a.review_value||0) ||
        Number(a.price)-Number(b.price) ||
        str(a.seller_name).localeCompare(str(b.seller_name),"id-ID",{sensitivity:"base",numeric:true});
    }
    return Number(a.price)-Number(b.price) ||
      Number(b.rating||0)-Number(a.rating||0) ||
      Number(b.review_value||0)-Number(a.review_value||0) ||
      str(a.seller_name).localeCompare(str(b.seller_name),"id-ID",{sensitivity:"base",numeric:true});
  })[0]||null;
}
const CURRENT_SELLER_ISSUE_REASONS=[
  "Seller belum dipilih",
  "Seller OFF",
  "Seller saat ini tidak ada di kandidat terbaru",
  "Rating tidak tersedia",
  "Stok habis",
  "Sedang cut-off"
];
const CURRENT_SELLER_ISSUE_SQL="(a.reasons_json LIKE '%Seller belum dipilih%' OR a.reasons_json LIKE '%Seller OFF%' OR a.reasons_json LIKE '%Seller saat ini tidak ada di kandidat terbaru%' OR a.reasons_json LIKE '%Rating tidak tersedia%' OR a.reasons_json LIKE '%Rating < %' OR a.reasons_json LIKE '%Stok habis%' OR a.reasons_json LIKE '%Sedang cut-off%')";
const EMERGENCY_SWITCH_SQL="(a.reasons_json LIKE '%Seller belum dipilih%' OR a.reasons_json LIKE '%Seller OFF%' OR a.reasons_json LIKE '%Seller saat ini tidak ada di kandidat terbaru%' OR a.reasons_json LIKE '%Harga di atas max price%' OR a.reasons_json LIKE '%Rating < %' OR a.reasons_json LIKE '%Stok habis%' OR a.reasons_json LIKE '%Sedang cut-off%')";
function hasCurrentSellerIssue(reasons) {
  return (reasons||[]).some(reason=>CURRENT_SELLER_ISSUE_REASONS.includes(reason)||/^Rating < /i.test(reason));
}
function requiredMaxPriceFromReasons(reasons) {
  for(const reason of reasons||[]) {
    const match=String(reason).match(/Kandidat lolos aturan tetapi di atas Max Price \((\d+)\)/i);
    if(match) {
      const value=Number(match[1]);
      if(Number.isSafeInteger(value)&&value>0)return value;
    }
  }
  return null;
}
function hasEmergencySwitchReason(reasons) {
  return (reasons||[]).some(reason=>
    ["Seller belum dipilih","Seller OFF","Seller saat ini tidak ada di kandidat terbaru","Harga di atas max price","Stok habis","Sedang cut-off"].includes(reason)
    || /^Rating < /i.test(reason)
  );
}
function attentionActionState(row,config) {
  if(Boolean(row.attention_dirty))return "evaluating";
  if(!Boolean(row.needs_attention))return "ok";
  if(["pending","unknown"].includes(str(row.operation_status)))return "pending";
  if(Boolean(row.locked))return "locked";
  const reasons=Array.isArray(row.attention_reasons)?row.attention_reasons:[];
  const lastMs=row.last_success_switch_at?Date.parse(String(row.last_success_switch_at).replace(" ","T")+"Z"):0;
  const cooldownMs=(Number(config?.cooldownHours)||24)*3600000;
  if(row.best_candidate_seller&&lastMs&&Date.now()-lastMs<cooldownMs&&!hasEmergencySwitchReason(reasons))return "cooldown";
  if(row.best_candidate_seller)return "actionable";
  if(hasCurrentSellerIssue(reasons))return "current-seller";
  if(reasons.some(x=>/Kandidat lolos aturan tetapi di atas Max Price/i.test(x)))return "max-price";
  return "no-candidate";
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
      const minRating=Math.max(4,Math.min(5,Number(context?.minRating ?? config.minRating)||4));
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
      json_extract(cur.raw,'$.rating_qty') AS current_review_count
    FROM products p
    LEFT JOIN product_locks l ON l.buyer_sku_code=p.sku
    LEFT JOIN switch_operations op ON op.sku=p.sku
    LEFT JOIN seller_options cur ON cur.sku=p.sku AND cur.seller_id=json_extract(p.raw,'$.seller_sku_id')
    `+where
  ).bind(...args).all();
  if(!rows.results.length)return [];
  const skus=rows.results.map(x=>x.sku);
  const chunks=[];
  for(let i=0;i<skus.length;i+=75)chunks.push(skus.slice(i,i+75));
  const optionStatements=chunks.map(chunk=>{
    const placeholders=chunk.map(()=>"?").join(",");
    return env.DB.prepare(`SELECT sku,seller_id,seller_name,price,rating,stock,unlimited_stock,connection,sla,description,
      json_extract(raw,'$.seller_id') AS seller_account_id,
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
  const rejectionStatements=chunks.map(chunk=>{
    const placeholders=chunk.map(()=>"?").join(",");
    return env.DB.prepare("SELECT sku,seller_id,seller_name,reason FROM seller_rejections WHERE sku IN ("+placeholders+") AND (permanent=1 OR retry_after>CURRENT_TIMESTAMP)").bind(...chunk);
  });
  const batch=await env.DB.batch([
    ...optionStatements,
    ...zoneStatements,
    ...rejectionStatements,
    env.DB.prepare("SELECT seller_name,mode FROM seller_preferences"),
    env.DB.prepare("SELECT * FROM seller_rules WHERE is_active=1")
  ]);
  const optionRows=batch.slice(0,optionStatements.length).flatMap(result=>result.results||[]);
  const zoneOffset=optionStatements.length;
  const zoneRows=batch.slice(zoneOffset,zoneOffset+zoneStatements.length).flatMap(result=>result.results||[]);
  const rejectionOffset=zoneOffset+zoneStatements.length;
  const rejectionRows=batch.slice(rejectionOffset,rejectionOffset+rejectionStatements.length).flatMap(result=>result.results||[]);
  const preferences=batch[rejectionOffset+rejectionStatements.length]?.results||[];
  const rules=batch[rejectionOffset+rejectionStatements.length+1]?.results||[];
  const optionsBySku=new Map();
  for(const option of optionRows) {
    if(!optionsBySku.has(option.sku))optionsBySku.set(option.sku,[]);
    optionsBySku.get(option.sku).push(option);
  }
  const zoneBySku=new Map();
  for(const row of zoneRows) {
    try { zoneBySku.set(row.sku,{patterns:JSON.parse(row.patterns)}); } catch {}
  }
  const rejectedBySku=new Map();
  for(const rejection of rejectionRows) {
    if(!rejectedBySku.has(rejection.sku))rejectedBySku.set(rejection.sku,new Map());
    rejectedBySku.get(rejection.sku).set(String(rejection.seller_id),rejection);
  }
  return rows.results.map(row=>{
    const options=optionsBySku.get(row.sku)||[];
    const hydratedRow={...row,option_count:options.length};
    const rejectedAt=hydratedRow.operation_status==="error"&&hydratedRow.operation_started_at
      ?Date.parse(String(hydratedRow.operation_started_at).replace(" ","T")+"Z")
      :0;
    const rejectedId=rejectedAt&&Date.now()-rejectedAt<24*3600000?str(hydratedRow.operation_target_seller_id):"";
    const persistentRejected=rejectedBySku.get(hydratedRow.sku)||new Map();
    const policyOptions=options.filter(x=>(!rejectedId||String(x.seller_id)!==rejectedId)&&!persistentRejected.has(String(x.seller_id)));
    const rule=matchingRuleForProduct(hydratedRow,rules);
    const ranked=rank(hydratedRow,policyOptions,preferences,rule,config,zoneBySku.get(hydratedRow.sku)||null);
    const current=ranked.find(x=>String(x.seller_id)===String(hydratedRow.current_seller_sku_id))||null;
    const best=ranked.find(x=>x.eligible)||null;
    const replacement=ranked.find(x=>x.eligible&&String(x.seller_id)!==String(hydratedRow.current_seller_sku_id))||null;
    const maxPriceBlocked=!replacement?maxPriceBlockedReplacement(ranked,hydratedRow.current_seller_sku_id):null;
    const attention_reasons=attentionReasons(hydratedRow,config,new Date(),{ranked,current,best,minRating:effectiveMinRating(rule,config)});
    if(persistentRejected.size&&attention_reasons.length)attention_reasons.push("Kandidat tertentu diblokir Auto Switch setelah ditolak Digiflazz");
    if(maxPriceBlocked&&attention_reasons.length)attention_reasons.push("Kandidat lolos aturan tetapi di atas Max Price ("+Math.round(Number(maxPriceBlocked.price)||0)+")");
    return {
      ...hydratedRow,
      nominal_value:productNominalValue(hydratedRow),
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
    AND (
      ${EMERGENCY_SWITCH_SQL}
      OR NOT EXISTS (
        SELECT 1 FROM switch_history sh
        WHERE sh.buyer_sku_code=p.sku AND sh.status='success' AND sh.created_at>?
      )
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
  const maxBlockPattern='%Kandidat lolos aturan tetapi di atas Max Price%';
  const [summary,autoReady,states]=await Promise.all([
    env.DB.prepare(`SELECT
      count(*) products,
      sum(CASE WHEN p.active=1 THEN 1 ELSE 0 END) activeProducts,
      sum(CASE WHEN p.active=1 AND p.max_price<=0 THEN 1 ELSE 0 END) missingMaxPrice,
      sum(CASE WHEN p.active=1 AND a.dirty=0 AND a.option_count>0 THEN 1 ELSE 0 END) qualityKnown,
      sum(CASE WHEN a.dirty=0 AND a.needs_attention=1 THEN 1 ELSE 0 END) issues,
      sum(CASE WHEN a.dirty=0 AND a.operational_issue=1 THEN 1 ELSE 0 END) operational,
      sum(CASE WHEN a.dirty=0 AND a.quality_issue=1 THEN 1 ELSE 0 END) quality,
      sum(CASE WHEN a.dirty=0 AND a.price_issue=1 THEN 1 ELSE 0 END) price,
      sum(CASE WHEN a.dirty=0 AND a.pending_issue=1 THEN 1 ELSE 0 END) pendingIssues,
      sum(CASE WHEN a.sku IS NULL OR a.dirty=1 THEN 1 ELSE 0 END) attentionPending,
      sum(CASE WHEN a.dirty=0 THEN 1 ELSE 0 END) attentionFresh
    FROM products p LEFT JOIN product_attention a ON a.sku=p.sku`).first(),
    actionableAttentionCount(env,config),
    env.DB.prepare(`SELECT
      sum(CASE WHEN a.dirty=0 AND a.needs_attention=1 AND a.best_candidate_seller IS NULL AND a.reasons_json LIKE ? AND NOT ${CURRENT_SELLER_ISSUE_SQL} THEN 1 ELSE 0 END) maxPriceBlocked,
      sum(CASE WHEN a.dirty=0 AND a.needs_attention=1 AND a.best_candidate_seller IS NULL AND ${CURRENT_SELLER_ISSUE_SQL} THEN 1 ELSE 0 END) currentSellerIssue,
      sum(CASE WHEN a.dirty=0 AND a.needs_attention=1 AND a.best_candidate_seller IS NULL AND a.reasons_json NOT LIKE ? AND NOT ${CURRENT_SELLER_ISSUE_SQL} THEN 1 ELSE 0 END) noCandidate,
      sum(CASE WHEN a.dirty=0 AND a.needs_attention=1 AND a.best_candidate_seller IS NOT NULL
        AND NOT ${EMERGENCY_SWITCH_SQL}
        AND EXISTS(SELECT 1 FROM switch_history sh WHERE sh.buyer_sku_code=a.sku AND sh.status='success' AND sh.created_at>?)
        THEN 1 ELSE 0 END) cooldown
      FROM product_attention a JOIN products p ON p.sku=a.sku WHERE p.active=1`)
      .bind(maxBlockPattern,maxBlockPattern,autoSwitchCooldownCutoff(config)).first()
  ]);
  return {
    products:Number(summary?.products)||0,
    activeProducts:Number(summary?.activeProducts)||0,
    missingMaxPrice:Number(summary?.missingMaxPrice)||0,
    issues:Number(summary?.issues)||0,
    autoSwitchReady:autoReady,
    qualityKnown:Number(summary?.qualityKnown)||0,
    attentionFresh:Number(summary?.attentionFresh)||0,
    attentionPending:Number(summary?.attentionPending)||0,
    attentionStateBreakdown:{
      siap:autoReady,
      cooldown:Number(states?.cooldown)||0,
      maxPrice:Number(states?.maxPriceBlocked)||0,
      currentSeller:Number(states?.currentSellerIssue)||0,
      tanpaKandidat:Number(states?.noCandidate)||0
    },
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
async function refreshAttentionCoverage(env, requestedLimit=5, deadlineMs=0) {
  const limit=Math.trunc(bounded(requestedLimit,1,10,5));
  const rows=await env.DB.prepare(`
    SELECT p.sku,p.product_id,q.next_retry_at,q.last_attempt
    FROM products p
    LEFT JOIN quality_refresh_state q ON q.sku=p.sku
    WHERE p.active=1
      AND (q.next_retry_at IS NULL OR q.next_retry_at<=CURRENT_TIMESTAMP)
    ORDER BY CASE WHEN q.last_attempt IS NULL THEN 0 ELSE 1 END ASC,
      COALESCE(q.last_attempt,'1970-01-01 00:00:00') ASC,
      p.sku ASC
    LIMIT ?
  `).bind(limit).all();
  let refreshed=0,empty=0,failed=0,deferred=0,lastError=null;
  const refreshedSkus=[];
  for(let index=0;index<rows.results.length;index++) {
    const row=rows.results[index];
    if(deadlineMs&&Date.now()+22000>=deadlineMs) {
      deferred=rows.results.length-index;
      break;
    }
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
  if(deferred) await log(env,"INFO","attention-refresh",deferred+" produk ditunda karena budget waktu scan hampir habis.");
  if(refreshed) await log(env,"INFO","attention-refresh",refreshed+" produk diperbarui data rating/SLA-nya.");
  return {refreshed,empty,failed,deferred,skus:refreshedSkus};
}
async function rankedOptions(env, sku, refresh = true) {
  const entry = await env.DB.prepare("SELECT product_id FROM products WHERE sku=?").bind(sku).first();
  if (!entry) throw Error("Produk tidak ditemukan.");
  if (refresh) await refreshOptions(env, sku, entry.product_id);
  const [product, options, preferences, rule, zone, config] = await Promise.all([
    env.DB.prepare("SELECT p.*,l.buyer_sku_code IS NOT NULL AS locked FROM products p LEFT JOIN product_locks l ON l.buyer_sku_code=p.sku WHERE p.sku=?").bind(sku).first(),
    env.DB.prepare("SELECT sku,seller_id,seller_name,price,rating,stock,unlimited_stock,connection,sla,description,json_extract(raw,'$.seller_id') AS seller_account_id,json_extract(raw,'$.rating_qty') AS review_count,json_extract(raw,'$.status_sellerSku') AS seller_status,json_extract(raw,'$.start_cut_off') AS start_cut_off,json_extract(raw,'$.end_cut_off') AS end_cut_off,raw FROM seller_options WHERE sku=?").bind(sku).all(),
    env.DB.prepare("SELECT seller_name,mode FROM seller_preferences").all(),
    env.DB.prepare("SELECT * FROM seller_rules WHERE is_active=1 AND (scope_type='global' OR (scope_type='product' AND scope_value=?) OR (scope_type='brand' AND scope_value=(SELECT brand FROM products WHERE sku=?)) OR (scope_type='category' AND scope_value=(SELECT category FROM products WHERE sku=?)) OR (scope_type='type' AND scope_value=(SELECT product_type FROM products WHERE sku=?))) ORDER BY CASE scope_type WHEN 'product' THEN 0 WHEN 'type' THEN 1 WHEN 'brand' THEN 2 WHEN 'category' THEN 3 ELSE 4 END,id DESC LIMIT 1").bind(sku,sku,sku,sku).first(),
    env.DB.prepare("SELECT z.patterns FROM zones z JOIN zone_assignments a ON a.zone_id=z.id WHERE a.sku=?").bind(sku).first(),settings(env)
  ]);
  return { product, config, minRating:effectiveMinRating(rule,config), options:rank(product, options.results, preferences.results, rule, config, zone?{patterns:JSON.parse(zone.patterns)}:null) };
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
  const rejectionRows=await env.DB.prepare("SELECT seller_id,seller_name,reason,rejected_at,retry_after,permanent FROM seller_rejections WHERE sku=?").bind(oldSku).all();
  await remoteSave(env,{...current,code:newSku,change:true});
  const verified=await findProductBySku(env,newSku);
  if(!verified||String(verified.id)!==String(current.id))throw Error("Perubahan SKU belum terkonfirmasi di Digiflazz. Jangan ulangi sebelum memeriksa produk.");
  const normalized=normalizeProduct(verified);
  await env.DB.batch([
    // Delete FK children before changing the parent primary key. Quality state is intentionally reset.
    env.DB.prepare("DELETE FROM product_attention WHERE sku=?").bind(oldSku),
    env.DB.prepare("DELETE FROM quality_refresh_state WHERE sku=?").bind(oldSku),
    env.DB.prepare("DELETE FROM seller_rejections WHERE sku=?").bind(oldSku),
    env.DB.prepare("UPDATE products SET sku=?,product_id=?,name=?,category=?,brand=?,product_type=?,seller_id=?,seller_name=?,price=?,max_price=?,active=?,seller_active=?,stock=?,unlimited_stock=?,end_cut_off=?,raw=?,nominal_value=?,last_seen=CURRENT_TIMESTAMP WHERE sku=?").bind(
      newSku,normalized.product_id,normalized.name,normalized.category,normalized.brand,normalized.product_type,normalized.seller_id,normalized.seller_name,
      normalized.price,normalized.max_price,normalized.active,normalized.seller_active,normalized.stock,normalized.unlimited_stock,normalized.end_cut_off,
      JSON.stringify(verified),Number.isFinite(productNominalValue(normalized))?productNominalValue(normalized):null,oldSku
    ),
    env.DB.prepare("UPDATE seller_options SET sku=? WHERE sku=?").bind(newSku,oldSku),
    env.DB.prepare("UPDATE product_locks SET buyer_sku_code=? WHERE buyer_sku_code=?").bind(newSku,oldSku),
    env.DB.prepare("UPDATE zone_assignments SET sku=? WHERE sku=?").bind(newSku,oldSku),
    env.DB.prepare("UPDATE switch_operations SET sku=? WHERE sku=?").bind(newSku,oldSku),
    env.DB.prepare("UPDATE seller_rules SET scope_value=? WHERE scope_type='product' AND scope_value=?").bind(newSku,oldSku),
    ...rejectionRows.results.map(r=>env.DB.prepare("INSERT INTO seller_rejections(sku,seller_id,seller_name,reason,rejected_at,retry_after,permanent) VALUES(?,?,?,?,?,?,?)").bind(newSku,r.seller_id,r.seller_name,r.reason,r.rejected_at,r.retry_after,r.permanent)),
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
  await env.DB.prepare("UPDATE products SET product_id=?,name=?,category=?,brand=?,product_type=?,seller_id=?,seller_name=?,price=?,max_price=?,active=?,seller_active=?,stock=?,unlimited_stock=?,end_cut_off=?,raw=?,nominal_value=?,last_seen=CURRENT_TIMESTAMP WHERE sku=?").bind(
    normalized.product_id,normalized.name,normalized.category,normalized.brand,normalized.product_type,normalized.seller_id,normalized.seller_name,
    normalized.price,normalized.max_price,normalized.active,normalized.seller_active,normalized.stock,normalized.unlimited_stock,normalized.end_cut_off,
    JSON.stringify(verified),Number.isFinite(productNominalValue(normalized))?productNominalValue(normalized):null,sku
  ).run();
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
    env.DB.prepare("DELETE FROM quality_refresh_state WHERE sku=?").bind(sku),
    env.DB.prepare("DELETE FROM seller_rejections WHERE sku=?").bind(sku),
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
  const [recent,attentionRow]=await Promise.all([
    env.DB.prepare("SELECT created_at FROM switch_history WHERE buyer_sku_code=? AND status='success' ORDER BY id DESC LIMIT 1").bind(sku).first(),
    reason==="auto"?env.DB.prepare("SELECT reasons_json FROM product_attention WHERE sku=?").bind(sku).first():Promise.resolve(null)
  ]);
  let emergency=false;
  if(attentionRow?.reasons_json) {
    try { emergency=hasEmergencySwitchReason(JSON.parse(attentionRow.reasons_json)); } catch {}
  }
  if (reason==="auto" && !emergency && recent && Date.now()-Date.parse(recent.created_at.replace(" ","T")+"Z") < config.cooldownHours*3600000) throw Error("Produk masih dalam masa jeda perpindahan.");
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
      env.DB.prepare("DELETE FROM seller_rejections WHERE sku=? AND seller_id=?").bind(sku,sellerId),
      env.DB.prepare("UPDATE products SET seller_id=?,seller_name=?,price=?,max_price=?,seller_active=?,stock=?,unlimited_stock=?,raw=?,last_seen=CURRENT_TIMESTAMP WHERE sku=?").bind(
        normalizedVerified.seller_id,normalizedVerified.seller_name,normalizedVerified.price,normalizedVerified.max_price,normalizedVerified.seller_active,normalizedVerified.stock,normalizedVerified.unlimited_stock,JSON.stringify(verified),sku
      )
    ]);
    await markAttentionDirty(env,[sku]);
    await log(env,"INFO","switch","Seller dipindahkan dan dikonfirmasi di Digiflazz: "+candidate.seller_name,sku);
    return {ok:true,sku,seller:candidate.seller_name,price:candidate.price,verified:true};
  } catch(error) {
    const status=error?.definitive===true?"error":sent?"unknown":"error";
    const statements=[
      env.DB.prepare("UPDATE switch_history SET status=? WHERE id=?").bind(status,record.meta.last_row_id),
      env.DB.prepare("UPDATE switch_operations SET status=? WHERE sku=?").bind(status,sku)
    ];
    if(error?.policyBlock===true) {
      statements.push(env.DB.prepare("INSERT INTO seller_rejections(sku,seller_id,seller_name,reason,permanent,retry_after,rejected_at) VALUES(?,?,?,?,1,NULL,CURRENT_TIMESTAMP) ON CONFLICT(sku,seller_id) DO UPDATE SET seller_name=excluded.seller_name,reason=excluded.reason,permanent=1,retry_after=NULL,rejected_at=CURRENT_TIMESTAMP").bind(sku,sellerId,candidate.seller_name,str(error.detail||error.message).slice(0,300)));
    }
    await env.DB.batch(statements);
    await markAttentionDirty(env,[sku]);
    await log(env,"ERROR","switch",error.message+(error?.policyBlock===true?" Seller ini diblokir dari Auto Switch sampai berhasil dicoba manual setelah persyaratan akun dibereskan.":status==="error"?" Target ditandai gagal; Auto Switch tidak mengulang seller ini selama 24 jam.":" Hasil belum pasti; tidak diulang otomatis."),sku);
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
      const [rejected,persistent]=await Promise.all([
        env.DB.prepare("SELECT target_seller_id FROM switch_operations WHERE sku=? AND status='error' AND started_at > datetime('now','-24 hours')").bind(sku).first(),
        activeSellerRejections(env,sku)
      ]);
      const rejectedId=str(rejected?.target_seller_id),persistentIds=new Set(persistent.map(x=>String(x.seller_id)));
      const eligibleOptions=selection.options.filter(o=>o.eligible&&(!rejectedId||String(o.seller_id)!==rejectedId)&&!persistentIds.has(String(o.seller_id)));
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
  const startedAt=Date.parse(String(op.started_at||"").replace(" ","T")+"Z");
  if(Number.isFinite(startedAt)&&Date.now()-startedAt<120000) throw Error("Hasil perubahan belum aman disimpulkan. Tunggu dua menit sebelum memeriksa ulang.");
  const fresh=await freshProduct(env,sku);
  const maxOperation=op.target_seller_id.startsWith("max:");
  const confirmed=maxOperation
    ? Number(fresh.max_price)===Number(op.target_seller_id.slice(4))
    : String(fresh.seller_sku_id)===op.target_seller_id;
  const status=confirmed?"success":"error";
  const normalized=normalizeProduct(fresh);
  if(!normalized)throw Error("Data produk terbaru Digiflazz tidak dapat dinormalisasi.");
  const statements=[
    env.DB.prepare("UPDATE switch_operations SET status=? WHERE sku=?").bind(status,sku),
    env.DB.prepare("UPDATE products SET seller_id=?,seller_name=?,price=?,max_price=?,active=?,seller_active=?,stock=?,unlimited_stock=?,raw=?,nominal_value=?,last_seen=CURRENT_TIMESTAMP WHERE sku=?").bind(
      normalized.seller_id,normalized.seller_name,normalized.price,normalized.max_price,normalized.active,normalized.seller_active,
      normalized.stock,normalized.unlimited_stock,JSON.stringify(fresh),Number.isFinite(productNominalValue(normalized))?productNominalValue(normalized):null,sku
    )
  ];
  if(!maxOperation) {
    statements.push(env.DB.prepare("UPDATE switch_history SET status=? WHERE id=(SELECT id FROM switch_history WHERE buyer_sku_code=? AND status IN ('pending','unknown') ORDER BY id DESC LIMIT 1)").bind(status,sku));
    if(confirmed)statements.push(env.DB.prepare("DELETE FROM seller_rejections WHERE sku=? AND seller_id=?").bind(sku,op.target_seller_id));
  }
  await env.DB.batch(statements);
  await markAttentionDirty(env,[sku]);
  await log(env,confirmed?"INFO":"WARN","reconcile",confirmed?"Perubahan terkonfirmasi di Digiflazz dan cache produk disinkronkan.":"Target tidak ditemukan pada data terbaru; cache produk disinkronkan sebelum percobaan berikutnya.",sku);
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
        env.DB.prepare("SELECT value FROM app_settings WHERE key='seller_directory_count'").first(),
        env.DB.prepare("SELECT * FROM scan_runs ORDER BY id DESC LIMIT 1").first(),
        env.DB.prepare("SELECT id,level,kind,sku,message,created_at FROM events ORDER BY id DESC LIMIT 8").all(),
        env.DB.prepare("SELECT id FROM switch_history WHERE status='success' AND reason='manual' LIMIT 1").first()
      ]);
      let sellers=0;
      try{sellers=Math.max(0,Number(JSON.parse(sellerCount?.value??"0"))||0)}catch{}
      return reply({ok:true,connection:{connected:!!c,lastTestStatus:c?.last_test_status,lastTestAt:c?.last_test_at},settings:cfg,counts:{...counts,sellers},lastScan:last,events:events.results,liveSwitchAvailable:!!verified});
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
      const cfg=await settings(env);
      const cooldownCutoff=autoSwitchCooldownCutoff(cfg);
      const maxBlockPattern='%Kandidat lolos aturan tetapi di atas Max Price%';
      let where="WHERE (p.sku LIKE ? OR p.name LIKE ? OR p.brand LIKE ? OR p.category LIKE ?)";
      const args=[q,q,q,q];
      if(category){where+=" AND p.category=?";args.push(category)}
      if(brand){where+=" AND p.brand=?";args.push(brand)}
      if(status==="issues")where+=" AND a.dirty=0 AND a.needs_attention=1";
      else if(status==="actionable"){
        where+=" AND a.dirty=0 AND a.needs_attention=1 AND p.active=1 AND p.max_price>0 AND a.best_candidate_seller IS NOT NULL AND l.buyer_sku_code IS NULL AND COALESCE(op.status,'') NOT IN ('pending','unknown') AND ("+EMERGENCY_SWITCH_SQL+" OR NOT EXISTS (SELECT 1 FROM switch_history sh WHERE sh.buyer_sku_code=p.sku AND sh.status='success' AND sh.created_at>?))";
        args.push(cooldownCutoff);
      }
      else if(status==="cooldown"){
        where+=" AND a.dirty=0 AND a.needs_attention=1 AND a.best_candidate_seller IS NOT NULL AND NOT "+EMERGENCY_SWITCH_SQL+" AND EXISTS (SELECT 1 FROM switch_history sh WHERE sh.buyer_sku_code=p.sku AND sh.status='success' AND sh.created_at>?)";
        args.push(cooldownCutoff);
      }
      else if(status==="blocked-max"){
        where+=" AND a.dirty=0 AND a.needs_attention=1 AND a.best_candidate_seller IS NULL AND a.reasons_json LIKE ? AND NOT "+CURRENT_SELLER_ISSUE_SQL;
        args.push(maxBlockPattern);
      }
      else if(status==="current-issue"){
        where+=" AND a.dirty=0 AND a.needs_attention=1 AND a.best_candidate_seller IS NULL AND "+CURRENT_SELLER_ISSUE_SQL;
      }
      else if(status==="no-candidate"){
        where+=" AND a.dirty=0 AND a.needs_attention=1 AND a.best_candidate_seller IS NULL AND a.reasons_json NOT LIKE ? AND NOT "+CURRENT_SELLER_ISSUE_SQL;
        args.push(maxBlockPattern);
      }
      else if(status==="missing-max")where+=" AND p.active=1 AND p.max_price<=0";
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
          a.option_count,a.operation_status,
          (SELECT sh.created_at FROM switch_history sh WHERE sh.buyer_sku_code=p.sku AND sh.status='success' ORDER BY sh.created_at DESC LIMIT 1) AS last_success_switch_at
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
        const product={...row,attention_reasons,needs_attention:Boolean(row.needs_attention),attention_dirty:Boolean(row.attention_dirty),locked:Boolean(row.locked)};
        return {...product,required_max_price:requiredMaxPriceFromReasons(attention_reasons),attention_state:attentionActionState(product,cfg)};
      });
      return reply({ok:true,total:Number(count?.total)||0,page,products,categories:categories.results.map(x=>x.category),brands:brands.results.map(x=>x.brand)});
    }
    const opt=path.match(/^\/api\/products\/([^/]+)\/options$/);
    if (method==="GET" && opt) {
      const sku=decodeURIComponent(opt[1]);
      const shape=async(d,connectorReady)=>{
        const [op,lastSuccess,persistent]=await Promise.all([
          env.DB.prepare("SELECT status,target_seller_id,started_at FROM switch_operations WHERE sku=?").bind(sku).first(),
          env.DB.prepare("SELECT max(created_at) last_success_switch_at FROM switch_history WHERE buyer_sku_code=? AND status='success'").bind(sku).first(),
          activeSellerRejections(env,sku)
        ]);
        const raw=JSON.parse(d.product.raw),currentId=String(raw.seller_sku_id??"");
        const rejectedAt=op?.status==="error"&&op?.started_at?Date.parse(String(op.started_at).replace(" ","T")+"Z"):0;
        const rejectedId=rejectedAt&&Date.now()-rejectedAt<24*3600000?str(op?.target_seller_id):"";
        const persistentMap=new Map(persistent.map(x=>[String(x.seller_id),x]));
        const policyOptions=d.options.filter(x=>(!rejectedId||String(x.seller_id)!==rejectedId)&&!persistentMap.has(String(x.seller_id)));
        const current=policyOptions.find(x=>String(x.seller_id)===currentId)||null;
        const best=policyOptions.find(x=>x.eligible)||null;
        const replacement=policyOptions.find(x=>x.eligible&&String(x.seller_id)!==currentId)||null;
        const maxPriceBlocked=!replacement?maxPriceBlockedReplacement(policyOptions,currentId):null;
        const attention=attentionReasons({...d.product,operation_status:op?.status,start_cut_off:raw.start_cut_off,end_cut_off:raw.end_cut_off,option_count:policyOptions.length,current_option_seller_id:current?.seller_id,current_rating:current?.rating,current_sla:current?.sla},d.config,new Date(),{ranked:policyOptions,current,best,minRating:d.minRating});
        if(persistentMap.size&&attention.length)attention.push("Kandidat tertentu diblokir Auto Switch setelah ditolak Digiflazz");
        if(maxPriceBlocked&&attention.length)attention.push("Kandidat lolos aturan tetapi di atas Max Price ("+Math.round(Number(maxPriceBlocked.price)||0)+")");
        const cached={...d.product,operation_status:op?.status,current_rating:current?.rating??null,current_sla:current?.sla??null,option_count:policyOptions.length,attention_reasons:attention,needs_attention:attention.length>0,nominal_value:productNominalValue(d.product),best_candidate_seller:replacement?.seller_name||null,best_candidate_price:replacement?.price??null,best_candidate_rating:replacement?.rating??null,best_candidate_sla:replacement?.sla_days??null,last_success_switch_at:lastSuccess?.last_success_switch_at||null};
        const product={...cached,raw:undefined,current_seller_sku_id:currentId,attention_dirty:false,locked:Boolean(d.product.locked),required_max_price:requiredMaxPriceFromReasons(attention)};
        product.attention_state=attentionActionState(product,d.config);
        await persistAttentionRows(env,[cached]);
        return {ok:true,product,operation:op,options:d.options.map(({raw,...option})=>({...option,auto_block_reason:persistentMap.get(String(option.seller_id))?.reason||null})),connectorReady};
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
      let source="live",warning=null,endpoint="/api/v1/buyer/seller",rows=[];
      try {
        const directory=await sellerDirectoryLive(env);
        rows=directory.sellers;
        endpoint=directory.endpoint;
        await cacheSellerDirectory(env,rows);
      } catch(error) {
        const cached=await env.DB.prepare("SELECT seller_id,name,rating,review_count,product_count,invoice,raw,last_seen FROM sellers WHERE raw<>'{}' ORDER BY name COLLATE NOCASE").all();
        if(!cached.results.length)throw error;
        source="cache";
        warning="Data seller live Digiflazz tidak dapat dimuat ("+error.message+"). Menampilkan salinan terakhir yang sebelumnya diterima langsung dari Digiflazz.";
        rows=cached.results.map(x=>({
          seller_id:x.seller_id,
          name:x.name,
          rating:x.rating,
          review_count:x.review_count,
          product_count:x.product_count,
          invoice:x.invoice,
          raw:JSON.parse(x.raw||"{}"),
          last_seen:x.last_seen
        }));
      }
      const preferences=await env.DB.prepare("SELECT seller_name,mode FROM seller_preferences").all();
      const prefMap=new Map((preferences.results||[]).map(x=>[str(x.seller_name).toLowerCase(),x.mode]));
      const sellers=rows.map(x=>{
        const key=str(x.seller_id)?"sid:"+str(x.seller_id):"name:"+str(x.name).toLowerCase();
        return {
          seller_id:x.seller_id,
          preference_key:key,
          name:x.name,
          rating:x.rating,
          review_count:x.review_count,
          product_count:x.product_count,
          invoice:x.invoice,
          mode:prefMap.get(key.toLowerCase())||prefMap.get(str(x.name).toLowerCase())||null
        };
      });
      return reply({
        ok:true,
        source,
        endpoint,
        warning,
        sellers,
        summary:{total:sellers.length},
        fetchedAt:new Date().toISOString()
      });
    }
    const pref=path.match(/^\/api\/sellers\/([^/]+)\/preference$/);
    if(method==="POST"&&pref) {
      const body=await getJson(req), key=decodeURIComponent(pref[1]),label=str(body.name);
      if(!["preferred","blocked","none"].includes(body.mode))throw Error("Pilihan tidak valid.");
      if(!key||key.length>180)throw Error("Identitas seller tidak valid.");
      const deleteKeys=[key];
      if(label&&label.length<=160)deleteKeys.push(label);
      await env.DB.prepare("DELETE FROM seller_preferences WHERE lower(seller_name) IN ("+deleteKeys.map(()=>"?").join(",")+")").bind(...deleteKeys.map(x=>x.toLowerCase())).run();
      if(body.mode!=="none") await env.DB.prepare("INSERT INTO seller_preferences(seller_name,mode) VALUES(?,?)").bind(key,body.mode).run();
      await markAttentionDirty(env);
      return reply({ok:true,mode:body.mode,key});
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
          preferred:prefs.results.filter(x=>x.mode==="preferred").map(x=>x.seller_name),
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
export { rank, normalizeProduct, validateSettings, changedProduct, inCutoffWindow, slaDays, validBuyerSku, reviewValue, attentionReasons, parseNominalToken, productNominalValue, productSortCompare, matchingRuleForProduct, maxPriceBlockedReplacement, effectiveMinRating, accessIssuer, accessClaimsValid };
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
      await env.DB.prepare("UPDATE scan_runs SET status='error',finished_at=CURRENT_TIMESTAMP,message='Scan lama dianggap berhenti sebelum selesai.' WHERE status='running' AND started_at < datetime('now','-5 minutes')").run();
      const cfg=await settings(env);

      // Minute 00: full catalog scan. The configurable interval now has a hard 60-minute minimum.
      if(event?.cron==="0 * * * *") {
        if(!cfg.scanEnabled)return;
        const last=await env.DB.prepare("SELECT finished_at FROM scan_runs WHERE status='success' ORDER BY id DESC LIMIT 1").first();
        const lastMs=last?.finished_at?Date.parse(last.finished_at.replace(" ","T")+"Z"):0;
        const age=lastMs?Date.now()-lastMs:Infinity;
        const scanCadence=Math.max(60,Number(cfg.scanIntervalMinutes)||60)*60000;
        if(age>=scanCadence)await scan(env,"cron");
        return;
      }

      // Minute 30: one Auto Switch batch per hour. Keep it separate from the full scan
      // so Cloudflare/Digiflazz subrequests stay bounded and database work is predictable.
      if(event?.cron==="30 * * * *") {
        const liveAuto=cfg.autoSwitch&&!cfg.dryRun;
        if(!liveAuto)return;
        await refreshAttentionCache(env,cfg,null,100);
        try {
          const summary=await autoSwitchBatch(env,cfg.autoSwitchBatchSize);
          if(summary.examined) await log(env,"INFO","auto-switch","Batch otomatis per jam: "+summary.switched+" pindah, "+summary.noCandidate+" tanpa kandidat, "+summary.skipped+" dilewati, "+summary.failed+" gagal.");
        } catch(error) { await log(env,"WARN","auto-switch",error.message); }
        return;
      }
    } catch(error) { try { await log(env,"ERROR","cron",error.message); } catch {} }
  }};
