// Compiled into index.js with the interface from ui.html. Never store credentials here.
const HTML = "<!doctype html>\n<html lang=\"id\">\n<head>\n  <meta charset=\"utf-8\">\n  <meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">\n  <meta name=\"theme-color\" content=\"#07111e\">\n  <title>Digi Tools · Seller Control</title>\n  <style>\n    :root{color-scheme:dark;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,\"Segoe UI\",sans-serif;font-size:16px;background:#07111e;color:#eaf1fa}\n    *{box-sizing:border-box}body{margin:0;min-height:100vh;background:radial-gradient(circle at 92% -15%,#17486b 0,transparent 35%),#07111e}\n    button,input,select,textarea{font:inherit}button{cursor:pointer}button:disabled{cursor:not-allowed;opacity:.48}\n    :focus-visible{outline:2px solid #5bcbe8;outline-offset:2px}\n    .shell{display:grid;grid-template-columns:222px minmax(0,1fr);min-height:100vh}\n    aside{border-right:1px solid #23364b;background:#0a1929;position:sticky;top:0;height:100vh;display:flex;flex-direction:column;padding:20px 12px}\n    .brand{display:flex;align-items:center;gap:10px;font-size:1rem;font-weight:800;letter-spacing:.02em;margin:1px 10px 24px}\n    .brand-mark{display:grid;place-items:center;width:32px;height:32px;border-radius:9px;background:#30afd1;color:#07111e;font-weight:900}\n    nav{display:grid;gap:3px;overflow:auto}nav button{border:0;background:transparent;color:#9db3c8;text-align:left;padding:10px 12px;border-radius:9px;min-height:40px;font-size:.92rem}\n    nav button:hover,nav button.active{color:#f4fbff;background:#163149}nav button.active{box-shadow:inset 3px 0 #4cc7e8}\n    .aside-foot{margin-top:auto;padding:16px 10px 3px;border-top:1px solid #26394c;color:#91a9bc;font-size:.8rem;line-height:1.5}\n    .dot{display:inline-block;width:8px;height:8px;border-radius:50%;background:#697b90;margin-right:7px}.dot.good{background:#43d6ab}.dot.warn{background:#f6bd65}\n    main{min-width:0;width:min(1390px,100%);padding:27px clamp(16px,3.4vw,46px) 65px;margin:0 auto}\n    header{display:flex;align-items:flex-start;justify-content:space-between;gap:20px;margin-bottom:24px}\n    h1{font-size:1.65rem;letter-spacing:-.035em;line-height:1.2;margin:0 0 5px}h2{font-size:1.08rem;margin:0 0 14px;letter-spacing:-.015em}h3{font-size:1rem;margin:0 0 8px}\n    .sub,.muted,small{color:#91a9bc}.sub{font-size:.88rem;line-height:1.5;margin:0}\n    .top-actions{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}\n    .button{border:1px solid #334c61;background:#132c42;color:#eaf5ff;padding:9px 13px;border-radius:9px;min-height:40px;font-size:.88rem;font-weight:650}\n    .button:hover{background:#1c405b}.button.primary{background:#27a7c7;border-color:#27a7c7;color:#031723}.button.primary:hover{background:#56c6df}.button.danger{color:#ffbac2;border-color:#734451;background:#35232f}\n    .button.tiny{min-height:32px;padding:5px 9px;font-size:.8rem}\n    .button.plain{background:transparent;border-color:transparent;color:#91d7ec;padding-left:4px;padding-right:4px}\n    .grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}.grid.two{grid-template-columns:repeat(2,minmax(0,1fr))}\n    .card{border:1px solid #274058;background:#0e2133;border-radius:13px;padding:17px;min-width:0}\n    .metric{font-size:1.45rem;font-weight:740;letter-spacing:-.03em;margin:9px 0 3px}.metric-label{color:#9fb3c7;font-size:.84rem}\n    .section{margin-top:16px}.section-head{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:12px}.section-head h2{margin:0}\n    .badge{display:inline-flex;align-items:center;border:1px solid #3b5a70;border-radius:99px;padding:3px 8px;font-size:.75rem;color:#bbd3e3;white-space:nowrap}\n    .badge.good{border-color:#245f58;color:#65e0b7}.badge.warn{border-color:#73512f;color:#ffd18b}.badge.bad{border-color:#78404a;color:#ffadb6}\n    .banner{padding:13px 15px;border:1px solid #70502e;background:#342b23;border-radius:10px;color:#ffe0aa;margin-bottom:16px;font-size:.9rem;line-height:1.5}\n    .banner.error{border-color:#78404a;background:#34232b;color:#ffbfc5}.banner.ok{border-color:#245f58;background:#15342f;color:#9cf0d0}\n    .controls,.toolbar{display:flex;gap:8px;flex-wrap:wrap;align-items:center}.controls{margin-bottom:14px}.toolbar{margin-bottom:15px}\n    label{display:block;color:#c8d8e6;font-size:.86rem;font-weight:600;margin-bottom:7px}\n    input,select,textarea{width:100%;padding:9px 10px;min-height:40px;border:1px solid #35516a;border-radius:8px;color:#eaf3f9;background:#0a1b2b;outline:none}\n    input:focus,select:focus,textarea:focus{border-color:#4cc7e8}textarea{resize:vertical;min-height:130px;line-height:1.45}\n    input[type=checkbox]{width:17px;height:17px;min-height:auto;accent-color:#31b6d6;margin:0}\n    .check{display:flex;align-items:center;gap:9px;font-weight:500;font-size:.9rem;margin:0}\n    .field{min-width:0}.fields{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin:14px 0}.fields.two{grid-template-columns:repeat(2,minmax(0,1fr))}\n    .toolbar input{max-width:320px}.toolbar select{max-width:180px}\n    .table-wrap{overflow-x:auto;border:1px solid #284058;border-radius:11px}\n    table{width:100%;border-collapse:collapse;font-size:.88rem}th,td{text-align:left;padding:11px 12px;border-bottom:1px solid #253b50;vertical-align:middle}th{font-size:.78rem;letter-spacing:.02em;color:#96adbf;font-weight:700;background:#132b3d;white-space:nowrap}tr:last-child td{border-bottom:0}tbody tr:hover{background:#13283a}\n    .name{font-weight:650;color:#ecf6fb}.sku{color:#97b1c7;font-size:.77rem;display:block;margin-top:3px;word-break:break-all}.nowrap{white-space:nowrap}\n    .empty{padding:27px 16px;text-align:center;color:#9cb2c7;line-height:1.6}.empty strong{display:block;color:#dceaf5;margin-bottom:4px}\n    .row{display:flex;justify-content:space-between;gap:10px;align-items:center;padding:12px 0;border-bottom:1px solid #253b50}.row:last-child{border:0}\n    .stack{display:grid;gap:12px}.right{text-align:right}.spread{display:flex;justify-content:space-between;gap:12px;align-items:center}\n    .feed{display:grid;max-height:470px;overflow:auto}.feed-line{display:flex;gap:11px;padding:10px 0;border-bottom:1px solid #253b50;font-size:.84rem;line-height:1.45}.feed-line:last-child{border:0}\n    .feed-time{flex:0 0 128px;color:#87a1b5;font-variant-numeric:tabular-nums}.feed-msg{overflow-wrap:anywhere}\n    .pill{font-size:.7rem;border-radius:5px;padding:2px 5px;margin-right:6px;background:#1d3a50;color:#8cddf2}.pill.ERROR{background:#5c303a;color:#ffbdc4}.pill.WARN{background:#5b452f;color:#ffdc9b}\n    .pagination{display:flex;gap:8px;align-items:center;justify-content:flex-end;margin-top:12px;font-size:.84rem;color:#abc3d4}\n    .hint{font-size:.81rem;color:#93a9bc;line-height:1.55;margin:9px 0 0}.hint strong{color:#d7eaf4}\n    .modal-shell{position:fixed;inset:0;z-index:10;background:#03101ecc;display:grid;place-items:center;padding:15px}\n    .modal{width:min(680px,100%);max-height:90vh;overflow:auto;background:#10263a;border:1px solid #41617b;border-radius:15px;padding:20px}\n    .modal-top{display:flex;justify-content:space-between;align-items:start;gap:15px;margin-bottom:12px}\n    .code{font-family:ui-monospace,SFMono-Regular,Consolas,monospace;font-size:.91rem;letter-spacing:.07em;color:#8ee6ea}\n    #toast{position:fixed;bottom:20px;right:20px;max-width:min(440px,calc(100vw - 32px));padding:12px 15px;background:#1b4052;border:1px solid #56b9cc;border-radius:10px;z-index:20;box-shadow:0 15px 45px #0008;font-size:.88rem}\n    #toast[hidden],#modal[hidden]{display:none}\n    @media(max-width:900px){.shell{grid-template-columns:1fr}aside{height:auto;z-index:3;position:sticky;top:0;padding:8px 12px 0;border-right:0;border-bottom:1px solid #294157}.brand{margin:1px 0 7px;font-size:.91rem}.brand-mark{width:27px;height:27px}nav{display:flex;overflow-x:auto;gap:3px;scrollbar-width:none;margin:0 -2px}nav::-webkit-scrollbar{display:none}nav button{white-space:nowrap;padding:8px 11px;font-size:.82rem;min-height:38px}nav button.active{box-shadow:inset 0 -2px #4cc7e8}.aside-foot{display:none}main{padding:19px 14px 60px}.grid{grid-template-columns:repeat(2,minmax(0,1fr))}}\n    @media(max-width:560px){header{display:block;margin-bottom:16px}h1{font-size:1.35rem}.top-actions{justify-content:flex-start;margin-top:13px}.grid,.grid.two{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.card{padding:13px}.metric{font-size:1.2rem}.fields,.fields.two{grid-template-columns:1fr}.feed-time{flex-basis:85px;font-size:.74rem}.toolbar input,.toolbar select{max-width:none}.toolbar>*{flex:1 1 145px}.section{margin-top:12px}.table-wrap{margin:0 -2px}}\n  </style>\n</head>\n<body>\n  <div class=\"shell\">\n    <aside>\n      <div class=\"brand\"><span class=\"brand-mark\">D</span><span>Digi Tools</span></div>\n      <nav aria-label=\"Menu utama\" id=\"nav\">\n        <button data-view=\"overview\" class=\"active\">Ringkasan</button>\n        <button data-view=\"products\">Produk</button>\n        <button data-view=\"sellers\">Penjual</button>\n        <button data-view=\"rules\">Aturan</button>\n        <button data-view=\"zones\">Grup produk</button>\n        <button data-view=\"history\">Perubahan</button>\n        <button data-view=\"logs\">Log sistem</button>\n        <button data-view=\"tools\">Alat input</button>\n        <button data-view=\"settings\">Pengaturan</button>\n        <button data-view=\"connection\">Koneksi</button>\n      </nav>\n      <div class=\"aside-foot\"><span class=\"dot\" id=\"sidebar-dot\"></span><span id=\"sidebar-status\">Memuat status…</span><br>Penggunaan pribadi · dilindungi Access</div>\n    </aside>\n    <main>\n      <header>\n        <div><h1 id=\"title\">Ringkasan</h1><p class=\"sub\" id=\"subtitle\">Pantau katalog dan seller Digiflazz.</p></div>\n        <div class=\"top-actions\"><button class=\"button\" id=\"refresh\">↻ Muat ulang</button><button class=\"button primary\" id=\"scan\">Pindai sekarang</button></div>\n      </header>\n      <div id=\"alert\" role=\"status\"></div>\n      <div id=\"content\" aria-live=\"polite\"></div>\n    </main>\n  </div>\n  <div id=\"modal\" hidden></div><div id=\"toast\" role=\"status\" hidden></div>\n  <script>\n  (() => {\n    const $=id=>document.getElementById(id);\n    const esc=value=>String(value??\"\").replace(/[&<>\"']/g,c=>({\"&\":\"&amp;\",\"<\":\"&lt;\",\">\":\"&gt;\",'\"':\"&quot;\",\"'\":\"&#39;\"}[c]));\n    const rupiah=n=>\"Rp\"+Number(n||0).toLocaleString(\"id-ID\");\n    const fmt=s=>s?new Date(String(s).replace(\" \",\"T\")+\"Z\").toLocaleString(\"id-ID\",{dateStyle:\"short\",timeStyle:\"short\"}):\"—\";\n    const state={view:\"overview\",bootstrap:null,page:1,q:\"\",status:\"all\",category:\"\",brand:\"\",selected:null,toastTimer:null};\n    const names={overview:[\"Ringkasan\",\"Pantau katalog dan seller Digiflazz.\"],products:[\"Produk\",\"Daftar SKU buyer dan status seller.\"],sellers:[\"Penjual\",\"Pilih seller favorit, prioritas, atau blokir.\"],rules:[\"Aturan\",\"Kriteria pemilihan seller untuk kategori, brand, dan produk.\"],zones:[\"Grup produk\",\"Pisahkan supplier dengan aturan zona.\"],history:[\"Perubahan\",\"Riwayat scan, harga, dan perpindahan seller.\"],logs:[\"Log sistem\",\"Aktivitas terbaru dari pemindaian dan koneksi.\"],tools:[\"Alat input\",\"Harga maksimum dan kode dari inisial game.\"],settings:[\"Pengaturan\",\"Atur pemindaian, penilaian, dan penyimpanan.\"],connection:[\"Koneksi\",\"Periksa sesi Digiflazz yang sudah tersimpan.\"]};\n    async function api(path,options={}) {\n      const res=await fetch(path,{...options,headers:{\"content-type\":\"application/json\",...(options.headers||{})}});\n      const data=await res.json().catch(()=>({}));\n      if(!res.ok)throw Error(data.error||\"Permintaan gagal (HTTP \"+res.status+\")\");\n      return data;\n    }\n    function toast(text,bad=false) {\n      clearTimeout(state.toastTimer);\n      $(\"toast\").textContent=text;$(\"toast\").style.borderColor=bad?\"#d8747d\":\"#56b9cc\";$(\"toast\").hidden=false;\n      state.toastTimer=setTimeout(()=>$(\"toast\").hidden=true,4500);\n    }\n    function message(text,type=\"warn\"){$(\"alert\").innerHTML=text?'<div class=\"banner '+type+'\">'+esc(text)+'</div>':\"\"}\n    function loading(){$(\"content\").innerHTML='<div class=\"card empty\">Memuat data…</div>'}\n    function badge(text,type=\"\") {return '<span class=\"badge '+type+'\">'+esc(text)+'</span>'}\n    function error(e){message(e.message,\"error\");toast(e.message,true)}\n    function button(label,action,extra=\"\"){return '<button class=\"button '+extra+'\" data-action=\"'+esc(action)+'\">'+label+'</button>'}\n    async function bootstrap() {\n      const d=await api(\"/api/bootstrap\");state.bootstrap=d;\n      $(\"sidebar-dot\").className=\"dot \"+(d.connection.connected?\"good\":\"warn\");\n      $(\"sidebar-status\").textContent=d.connection.connected?\"Digiflazz terhubung\":\"Digiflazz belum terhubung\";\n      if(!d.connection.connected)message(\"Sesi Digiflazz belum tersimpan. Buka Koneksi untuk menghubungkannya.\");\n      else if(d.lastScan?.status===\"error\")message(\"Scan terakhir gagal: \"+d.lastScan.message);\n      else if(d.counts.issues)message(d.counts.issues+\" produk perlu perhatian. Periksa daftar Produk.\",\"warn\");\n      else message(\"\");\n      return d;\n    }\n    function feed(rows) {return rows?.length?'<div class=\"feed\">'+rows.map(x=>'<div class=\"feed-line\"><span class=\"feed-time\">'+fmt(x.created_at)+'</span><span class=\"feed-msg\"><b class=\"pill '+esc(x.level)+'\">'+esc(x.level)+'</b>'+esc(x.sku?x.sku+\" · \":\"\")+esc(x.message)+'</span></div>').join(\"\")+'</div>':'<div class=\"empty\">Belum ada aktivitas.</div>'}\n    async function overview() {\n      const d=await bootstrap(),scan=d.lastScan,issues=d.counts.issues;\n      $(\"content\").innerHTML=\n        '<div class=\"grid\">'+\n          metric(\"Koneksi\",d.connection.connected?\"Aktif\":\"Belum aktif\",d.connection.lastTestStatus?\"HTTP \"+d.connection.lastTestStatus:\"Sesi terenkripsi di D1\")+\n          metric(\"Produk\",d.counts.products,\"SKU hasil scan\")+\n          metric(\"Perlu perhatian\",issues,(issues?(\"Operasional \"+(d.counts.attentionBreakdown?.operasional||0)+\" · Kualitas \"+(d.counts.attentionBreakdown?.kualitas||0)+\" · Harga \"+(d.counts.attentionBreakdown?.harga||0)+\" · Tertunda \"+(d.counts.attentionBreakdown?.tertunda||0)):\"Tidak ada yang terdeteksi\")+(d.counts.attentionPending?\" · \"+d.counts.attentionPending+\" menunggu evaluasi\":\"\"),\"goto-issues\")+\n          metric(\"Seller\",d.counts.sellers,\"Terdata di katalog\")+\n        '</div>'+\n        '<section class=\"section grid two\">'+\n          '<div class=\"card\"><div class=\"section-head\"><h2>Monitor</h2>'+badge(d.settings.scanEnabled?\"Aktif\":\"Berhenti\",d.settings.scanEnabled?\"good\":\"\")+'</div>'+\n            '<p class=\"sub\">Pemindaian berjalan lewat Cloudflare Cron saat diaktifkan. Interval '+esc(d.settings.scanIntervalMinutes)+' menit.</p>'+\n            '<div class=\"controls\" style=\"margin-top:16px\">'+button(d.settings.scanEnabled?\"Hentikan monitor\":\"Mulai monitor\",\"monitor\",\"primary\")+button(\"Pindai sekali\",\"scan-now\")+'</div>'+\n            '<p class=\"hint\">Scan terakhir: '+(scan?fmt(scan.finished_at)+\" · \"+esc(scan.status)+\" · \"+esc(scan.total)+\" produk\":\"belum pernah\")+'</p>'+\n            '<p class=\"hint\">Cakupan rating/SLA: <strong>'+esc(d.counts.qualityKnown)+' / '+esc(d.counts.activeProducts)+'</strong> produk aktif sudah punya data kandidat seller.</p>'+\n            '<p class=\"hint\">Cache perhatian: <strong>'+esc(d.counts.attentionFresh)+' / '+esc(d.counts.products)+'</strong> siap'+(d.counts.attentionPending?' · '+esc(d.counts.attentionPending)+' menunggu evaluasi':\"\")+'. Ringkasan membaca cache ini, bukan seluruh kandidat seller setiap kali halaman dibuka.</p>'+\n          '</div>'+\n          '<div class=\"card\"><div class=\"section-head\"><h2>Auto Switch</h2>'+badge(d.settings.autoSwitch&&!d.settings.dryRun?\"AKTIF\":d.liveSwitchAvailable?\"SIAP DIAKTIFKAN\":\"BELUM DIVERIFIKASI\",d.settings.autoSwitch&&!d.settings.dryRun?\"good\":\"warn\")+'</div>'+\n            '<p class=\"sub\">'+(d.liveSwitchAvailable?\"Switch manual sudah terverifikasi. Auto Switch dapat dinyalakan langsung.\":\"Lakukan 1x switch manual untuk memastikan Digiflazz menerima perubahan seller. Setelah berhasil, Auto Switch bisa dinyalakan.\")+'</p>'+\n            '<div class=\"controls\" style=\"margin-top:16px\">'+\n              button(\"1. Tes Switch Manual\",\"manual-test\",d.liveSwitchAvailable?\"\":\"primary\")+\n              button(d.settings.autoSwitch&&!d.settings.dryRun?\"Matikan Auto Switch\":\"2. Aktifkan Auto Switch\",\"toggle-auto\",d.liveSwitchAvailable?\"primary\":\"\")+\n              button(\"3. Jalankan Auto Switch Sekarang\",\"run-auto\",d.settings.autoSwitch&&!d.settings.dryRun?\"primary\":\"\")+\n            '</div>'+\n            '<p class=\"hint\"><strong>Prioritas Auto Switch: rating minimal 4 → SLA tercepat → kelompok harga maksimal '+esc(d.settings.priceTolerancePercent)+'% dari termurah → rating tertinggi → ulasan terbanyak → harga termurah.</strong> Jenis koneksi IP/API/H2H tidak ikut menentukan.</p>'+\n          '</div>'+\n        '</section>'+\n        '<section class=\"section card\"><div class=\"section-head\"><h2>Aktivitas terbaru</h2>'+button(\"Semua log\",\"goto-logs\",\"tiny\")+'</div>'+feed(d.events)+'</section>';\n    }\n    function metric(label,value,detail,action){return '<div class=\"card\"><div class=\"metric-label\">'+esc(label)+'</div><div class=\"metric\">'+esc(value)+'</div><div class=\"sub\">'+esc(detail)+'</div>'+(action?'<div class=\"controls\" style=\"margin-top:12px\">'+button(\"Lihat produk\",action,\"tiny\")+'</div>':\"\")+'</div>'}\n    function problem(p){return !p.attention_dirty&&!!p.needs_attention}\n    function attentionText(p){return Array.isArray(p.attention_reasons)&&p.attention_reasons.length?p.attention_reasons.join(\" · \"):\"\"}\n    async function products() {\n      const params=new URLSearchParams({page:state.page,q:state.q,status:state.status,category:state.category,brand:state.brand});\n      const d=await api(\"/api/products?\"+params);\n      $(\"content\").innerHTML='<div class=\"card\">'+\n        '<div class=\"toolbar\"><input id=\"search-product\" aria-label=\"Cari produk\" placeholder=\"Cari nama, SKU, brand, kategori\" value=\"'+esc(state.q)+'\">'+\n        '<select id=\"filter-category\" aria-label=\"Kategori\"><option value=\"\">Semua kategori</option>'+d.categories.map(x=>'<option value=\"'+esc(x)+'\" '+(state.category===x?\"selected\":\"\")+'>'+esc(x)+'</option>').join(\"\")+'</select>'+\n        '<select id=\"filter-brand\" aria-label=\"Brand\"><option value=\"\">Semua brand</option>'+d.brands.map(x=>'<option value=\"'+esc(x)+'\" '+(state.brand===x?\"selected\":\"\")+'>'+esc(x)+'</option>').join(\"\")+'</select>'+\n        '<select id=\"filter-product\" aria-label=\"Status produk\"><option value=\"all\">Semua status</option><option value=\"active\" '+(state.status===\"active\"?\"selected\":\"\")+'>Aktif</option><option value=\"inactive\" '+(state.status===\"inactive\"?\"selected\":\"\")+'>Nonaktif</option><option value=\"issues\" '+(state.status===\"issues\"?\"selected\":\"\")+'>Perlu perhatian</option><option value=\"locked\" '+(state.status===\"locked\"?\"selected\":\"\")+'>Terkunci</option></select>'+button(\"Terapkan\",\"search\",\"primary\")+'</div>'+\n        '<p class=\"hint\" style=\"margin:-4px 0 12px\"><strong>Urutan:</strong> brand/game A–Z → nominal terkecil → terbesar. Harga seller tidak menentukan posisi produk.</p>'+\n        '<div class=\"table-wrap\"><table><thead><tr><th>Produk</th><th>Kategori</th><th>Brand</th><th>Seller</th><th>Harga</th><th>Max</th><th>Status</th><th>Aksi Digiflazz</th></tr></thead><tbody>'+\n        (d.products.length?d.products.map(p=>'<tr><td><span class=\"name\">'+esc(p.name)+'</span><span class=\"sku\">'+esc(p.sku)+(Number.isFinite(Number(p.nominal_value))&&Number(p.nominal_value)<1e99?' · nominal '+esc(p.nominal_value):\"\")+'</span></td><td>'+esc(p.category||\"—\")+'</td><td>'+esc(p.brand||\"—\")+'</td><td><span class=\"name\">'+esc(p.seller_name||\"—\")+'</span><span class=\"sku\">'+(p.current_rating!=null?'Rating '+esc(p.current_rating):'Rating —')+' · '+(p.current_sla?('SLA '+esc((String(p.current_sla).match(/H\\s*\\+\\s*\\d+/i)||[\"—\"])[0])):'SLA —')+'</span></td><td class=\"nowrap\"><strong>'+rupiah(p.price)+'</strong></td><td class=\"nowrap\">'+(p.max_price?rupiah(p.max_price):\"—\")+'</td><td>'+badge(p.locked?\"Terkunci\":p.attention_dirty?\"Menunggu evaluasi\":problem(p)?\"Perlu perhatian\":p.active?\"Aktif\":\"Nonaktif\",p.locked?\"\":p.attention_dirty?\"warn\":problem(p)?\"bad\":p.active?\"good\":\"warn\")+(p.attention_dirty?'<span class=\"sku\">Cache perhatian sedang dihitung ulang</span>':attentionText(p)?'<span class=\"sku\">'+esc(attentionText(p))+'</span>':\"\")+'</td><td><div class=\"controls\"><button class=\"button tiny\" data-action=\"product\" data-sku=\"'+esc(p.sku)+'\">Kelola</button><button class=\"button tiny '+(p.active?\"warn\":\"primary\")+'\" data-action=\"toggle-product\" data-sku=\"'+esc(p.sku)+'\" data-active=\"'+(p.active?1:0)+'\">'+(p.active?\"OFF\":\"ON\")+'</button><button class=\"button tiny danger\" data-action=\"delete-product\" data-sku=\"'+esc(p.sku)+'\" data-name=\"'+esc(p.name)+'\">Hapus</button></div></td></tr>').join(\"\"):'<tr><td colspan=\"8\" class=\"empty\">Tidak ada produk sesuai filter.</td></tr>')+\n        '</tbody></table></div>'+\n        '<div class=\"pagination\"><span>'+esc(d.total)+' produk · halaman '+esc(d.page)+'</span><button class=\"button tiny\" data-action=\"prev\" '+(state.page<=1?\"disabled\":\"\")+'>Sebelumnya</button><button class=\"button tiny\" data-action=\"next\" '+(d.page*50>=d.total?\"disabled\":\"\")+'>Berikutnya</button></div>'+\n      '</div>';\n    }\n    async function product(sku) {\n      const d=await api(\"/api/products/\"+encodeURIComponent(sku)+\"/options\"),p=d.product;\n      state.selected=p;\n      $(\"modal\").hidden=false;\n      $(\"modal\").innerHTML='<div class=\"modal-shell\"><div class=\"modal\" role=\"dialog\" aria-modal=\"true\" aria-labelledby=\"modal-title\"><div class=\"modal-top\"><div><h2 id=\"modal-title\">'+esc(p.name)+'</h2><span class=\"sku\">'+esc(p.sku)+'</span></div><button class=\"button tiny\" data-action=\"close\">Tutup</button></div>'+\n        '<div class=\"grid two\"><div class=\"card\"><div class=\"metric-label\">Seller sekarang</div><div class=\"name\">'+esc(p.seller_name||\"—\")+'</div><div class=\"hint\">'+rupiah(p.price)+(p.current_rating!=null?' · rating '+esc(p.current_rating):\"\")+'</div></div><div class=\"card\"><div class=\"metric-label\">Kandidat terbaik</div><div class=\"name\">'+esc(p.best_candidate_seller||\"—\")+'</div><div class=\"hint\">'+(p.best_candidate_price!=null?rupiah(p.best_candidate_price):\"—\")+(p.best_candidate_rating!=null?' · rating '+esc(p.best_candidate_rating):\"\")+(p.best_candidate_sla!=null&&p.best_candidate_sla<999?' · H+'+esc(p.best_candidate_sla):\"\")+'</div></div><div class=\"card\"><div class=\"metric-label\">Max Price Digiflazz</div><div class=\"name\">'+(p.max_price?rupiah(p.max_price):\"—\")+'</div><div class=\"hint\">'+(d.maxPricePolicy?.autoFill?('Auto: harga seller + '+rupiah(d.maxPricePolicy.offset||0)):'Auto isi OFF · nilai dipertahankan saat ganti seller')+' · '+(problem(p)?\"perlu perhatian: \"+esc(attentionText(p)):\"terpantau\")+'</div></div><div class=\"card\"><div class=\"metric-label\">Nominal</div><div class=\"name\">'+(Number.isFinite(Number(p.nominal_value))&&Number(p.nominal_value)<1e99?esc(p.nominal_value):\"—\")+'</div><div class=\"hint\">Urutan produk mengikuti nominal, bukan harga seller.</div></div></div>'+\n        '<div class=\"controls\" style=\"margin-top:14px\"><button class=\"button tiny '+(p.locked?\"warn\":\"\")+'\" data-action=\"lock\" data-sku=\"'+esc(p.sku)+'\">'+(p.locked?\"Buka Kunci Auto Switch\":\"Kunci Auto Switch\")+'</button><button class=\"button tiny\" data-action=\"copy-price\">Salin Max Price</button><button class=\"button tiny '+(p.active?\"warn\":\"primary\")+'\" data-action=\"toggle-product\" data-sku=\"'+esc(p.sku)+'\" data-active=\"'+(p.active?1:0)+'\">'+(p.active?\"OFF Produk\":\"ON Produk\")+'</button><button class=\"button tiny danger\" data-action=\"delete-product\" data-sku=\"'+esc(p.sku)+'\" data-name=\"'+esc(p.name)+'\">Hapus dari Digiflazz</button></div>'+\n        '<p class=\"hint\">'+(p.locked?'<strong>Auto Switch terkunci:</strong> sistem tidak akan mengganti seller SKU ini. Pindah seller manual, edit Max Price, SKU, dan ON/OFF tetap bisa digunakan.':'Auto Switch boleh mengelola seller SKU ini sesuai aturan yang aktif.')+'</p>'+\n        '<div class=\"controls\" style=\"margin-top:12px\"><label for=\"product-sku\" style=\"margin:0\">SKU Buyer</label><input id=\"product-sku\" type=\"text\" maxlength=\"50\" autocomplete=\"off\" style=\"max-width:180px\" value=\"'+esc(p.sku)+'\"><button class=\"button tiny primary\" data-action=\"save-sku\">Simpan SKU</button></div>'+\n        '<p class=\"hint\">Edit SKU, ON/OFF, dan Hapus di halaman ini menulis langsung ke produk Buyer Digiflazz lalu diverifikasi ulang.</p>'+\n        '<div class=\"controls\" style=\"margin-top:12px\"><label for=\"product-max\" style=\"margin:0\">Max Price Digiflazz</label><input id=\"product-max\" type=\"number\" min=\"1\" inputmode=\"numeric\" style=\"max-width:180px\" value=\"'+esc(p.max_price||\"\")+'\"><button class=\"button tiny\" data-action=\"save-max\">Simpan Max Price</button></div>'+\n        '<p class=\"hint\">Perubahan manual menulis langsung ke Max Price produk Buyer Digiflazz. Saat Auto Fill aktif, perpindahan seller berikutnya akan menghitung ulang menjadi harga seller baru + tambahan global.</p>'+\n        (d.operation&&[\"pending\",\"unknown\"].includes(d.operation.status)?'<div class=\"banner\" style=\"margin-top:12px\">Ada perubahan yang hasilnya belum pasti. <button class=\"button tiny\" data-action=\"reconcile\">Periksa ulang di Digiflazz</button></div>':\"\")+\n        '<h3 style=\"margin-top:20px\">Kandidat seller · Rating → SLA → toleransi harga '+esc(d.options?.[0]?.price_tolerance_percent??2)+'%</h3>'+\n        (d.options.length?'<div class=\"table-wrap\"><table><thead><tr><th>Seller</th><th>Rating</th><th>SLA</th><th>Harga</th><th>Max jika dipilih</th><th>Aturan</th><th>Tindakan</th></tr></thead><tbody>'+d.options.map((o,i)=>'<tr><td class=\"name\">'+(o.eligible&&i===0?'<span class=\"badge good\">Pilihan Auto Switch</span> ':'')+esc(o.seller_name)+'</td><td><strong>'+esc(o.rating??\"—\")+'</strong> <small>('+esc(o.review_count||\"—\")+')</small></td><td>'+(o.sla_days<999?'<strong>H+'+esc(o.sla_days)+'</strong>':'<span class=\"badge warn\">Fallback SLA</span>')+'<span class=\"sku\">'+esc(o.sla||\"SLA tidak tersedia\")+'</span></td><td><strong>'+rupiah(o.price)+'</strong>'+(o.within_price_tolerance?'<span class=\"sku\">Dalam toleransi '+esc(o.price_tolerance_percent)+'% · acuan '+rupiah(o.reference_price)+'</span>':\"\")+'</td><td><strong>'+(d.maxPricePolicy?.autoFill?rupiah(Number(o.price)+(Number(d.maxPricePolicy.offset)||0)):(p.max_price?rupiah(p.max_price):\"—\"))+'</strong><span class=\"sku\">'+(d.maxPricePolicy?.autoFill?'harga + tambahan global':'dipertahankan')+'</span></td><td>'+badge(o.eligible?\"Lolos\":o.reasons.join(\", \"),o.eligible?\"good\":\"bad\")+'</td><td><button class=\"button tiny '+(o.eligible&&d.connectorReady&&String(p.current_seller_sku_id)!==o.seller_id?\"primary\":\"\")+'\" data-action=\"switch-seller\" data-seller-id=\"'+esc(o.seller_id)+'\" data-seller-name=\"'+esc(o.seller_name)+'\" data-seller-price=\"'+esc(o.price)+'\" '+(!o.eligible||!d.connectorReady||String(p.current_seller_sku_id)===o.seller_id?\"disabled\":\"\")+'>Pindah ke seller ini</button></td></tr>').join(\"\")+'</tbody></table></div>':'<div class=\"empty\">Data alternatif seller belum tersedia dari respons Digiflazz.</div>')+\n        '<p class=\"hint\"><strong>Urutan: rating minimal 4 → SLA tercepat → kandidat dalam '+esc(d.options?.[0]?.price_tolerance_percent??2)+'% dari harga termurah → rating tertinggi → ulasan terbanyak → harga termurah.</strong> “Perlu perhatian” untuk SLA hanya muncul jika ada kandidat SLA lebih cepat yang benar-benar lolos aturan. IP/API/H2H tidak memengaruhi pilihan.</p></div></div>';\n    }\n    async function sellers() {\n      const d=await api(\"/api/sellers\");\n      $(\"content\").innerHTML='<div class=\"card\"><div class=\"table-wrap\"><table><thead><tr><th>Penjual</th><th>Rating</th><th>Ulasan</th><th>Produk</th><th>Pilihan</th></tr></thead><tbody>'+\n      (d.sellers.length?d.sellers.map(s=>'<tr><td class=\"name\">'+esc(s.name)+'</td><td>'+esc(s.rating??\"—\")+'</td><td>'+esc(s.review_count??\"—\")+'</td><td>'+esc(s.product_count??\"—\")+'</td><td><select class=\"seller-mode\" data-name=\"'+esc(s.name)+'\" aria-label=\"Pilihan untuk '+esc(s.name)+'\"><option value=\"none\">Biasa</option><option value=\"preferred\" '+(s.mode===\"preferred\"?\"selected\":\"\")+'>Prioritas</option><option value=\"blocked\" '+(s.mode===\"blocked\"?\"selected\":\"\")+'>Blokir</option></select></td></tr>').join(\"\"):'<tr><td colspan=\"5\" class=\"empty\">Belum ada penjual. Jalankan Pindai sekarang.</td></tr>')+'</tbody></table></div><p class=\"hint\">Blokir selalu menggugurkan seller. Seller Prioritas hanya menjadi pemecah seri jika SLA, harga, dan rating sama; tidak boleh mengalahkan urutan Rating → SLA → Harga.</p></div>';\n    }\n    async function rules() {\n      const d=await api(\"/api/rules\");\n      $(\"content\").innerHTML='<div class=\"grid two\"><section class=\"card\"><h2>Buat aturan</h2><form id=\"rule-form\"><div class=\"fields two\"><div class=\"field\"><label for=\"rule-scope\">Berlaku untuk</label><select id=\"rule-scope\" name=\"scope_type\"><option value=\"global\">Semua produk</option><option value=\"category\">Kategori</option><option value=\"brand\">Brand</option><option value=\"type\">Tipe</option><option value=\"product\">Satu SKU</option></select></div><div class=\"field\"><label for=\"rule-target\">Target (kosong jika global)</label><input id=\"rule-target\" name=\"scope_value\" placeholder=\"Mis. MOBILE LEGENDS\"></div><div class=\"field\"><label for=\"rule-rating\">Rating minimal</label><input id=\"rule-rating\" name=\"min_rating\" type=\"number\" min=\"4\" max=\"5\" step=\".1\" placeholder=\"Minimal 4.0\"></div><div class=\"field\"><label for=\"rule-price\">Batas harga (Rp)</label><input id=\"rule-price\" name=\"max_price\" type=\"number\" min=\"0\" placeholder=\"Ikut max produk\"></div></div><div class=\"controls\"><label class=\"check\"><input type=\"checkbox\" name=\"require_stock\" checked> Wajib stok</label><label class=\"check\"><input type=\"checkbox\" name=\"avoid_cutoff\" checked> Hindari cut-off</label></div><div style=\"margin-top:16px\"><button class=\"button primary\">Simpan aturan</button></div></form></section>'+\n      '<section class=\"card\"><h2>Aturan tersimpan</h2>'+(d.rules.length?d.rules.map(r=>'<div class=\"row\"><div><span class=\"name\">'+esc(r.scope_type==='global'?\"Semua produk\":r.scope_value)+'</span><span class=\"sku\">Rating ≥ '+esc(r.min_rating??\"—\")+' · '+(r.max_price?rupiah(r.max_price):\"ikuti batas produk\")+'</span></div><button class=\"button tiny danger\" data-action=\"delete-rule\" data-id=\"'+esc(r.id)+'\">Hapus</button></div>').join(\"\"):'<div class=\"empty\">Belum ada aturan. Pengaturan global tetap berlaku.</div>')+'</section></div>';\n    }\n    async function zones() {\n      const d=await api(\"/api/zones\");\n      $(\"content\").innerHTML='<div class=\"grid two\"><section class=\"card\"><h2>Buat grup zona</h2><form id=\"zone-form\"><div class=\"fields two\"><div class=\"field\"><label for=\"zone-name\">Nama grup</label><input id=\"zone-name\" name=\"name\" required placeholder=\"ML Zona Sumatra\"></div><div class=\"field\"><label for=\"zone-id\">Product ID Digiflazz</label><input id=\"zone-id\" name=\"product_id\" required></div></div><div class=\"field\"><label for=\"zone-pattern\">Pola deskripsi seller (pisahkan koma)</label><input id=\"zone-pattern\" name=\"patterns\" required placeholder=\"sumatra, all region\"></div><p class=\"hint\">Semua pola harus ditemukan dalam deskripsi kandidat (aturan AND).</p><div style=\"margin-top:16px\"><button class=\"button primary\">Simpan zona</button></div></form></section>'+\n      '<section class=\"card\"><h2>Grup tersimpan</h2>'+(d.zones.length?d.zones.map(z=>'<div class=\"row\"><div><span class=\"name\">'+esc(z.name)+'</span><span class=\"sku\">ID '+esc(z.product_id)+' · '+esc(z.patterns)+' · '+esc(z.assignments)+' SKU</span></div><button class=\"button tiny danger\" data-action=\"delete-zone\" data-id=\"'+esc(z.id)+'\">Hapus</button></div>').join(\"\"):'<div class=\"empty\">Belum ada grup zona.</div>')+'</section></div>'+\n      '<section class=\"section card\"><h2>Pasangkan SKU ke zona</h2><form id=\"assign-form\" class=\"fields two\"><div class=\"field\"><label for=\"zone-sku\">SKU buyer</label><input id=\"zone-sku\" name=\"sku\" required placeholder=\"Kode SKU\"></div><div class=\"field\"><label for=\"zone-choice\">Zona</label><select id=\"zone-choice\" name=\"zone_id\"><option value=\"\">Lepas zona</option>'+d.zones.map(z=>'<option value=\"'+esc(z.id)+'\">'+esc(z.name)+'</option>').join(\"\")+'</select></div><button class=\"button primary\">Simpan penugasan</button></form></section>';\n    }\n    async function history() {\n      const d=await api(\"/api/history\");\n      $(\"content\").innerHTML='<div class=\"grid two\"><section class=\"card\"><h2>Riwayat pemindaian</h2>'+(d.runs.length?d.runs.map(x=>'<div class=\"row\"><div><span class=\"name\">'+fmt(x.started_at)+' · '+esc(x.status)+'</span><span class=\"sku\">'+esc(x.total)+' produk · '+esc(x.issues)+' masalah · '+esc(x.message||\"\")+'</span></div></div>').join(\"\"):'<div class=\"empty\">Belum ada pemindaian.</div>')+'</section><section class=\"card\"><h2>Perubahan harga</h2>'+(d.prices.length?d.prices.map(x=>'<div class=\"row\"><div><span class=\"name\">'+esc(x.buyer_sku_code)+'</span><span class=\"sku\">'+esc(x.seller_name||\"—\")+' · '+fmt(x.captured_at)+'</span></div><strong>'+rupiah(x.price)+'</strong></div>').join(\"\"):'<div class=\"empty\">Belum ada perubahan harga.</div>')+'</section></div><section class=\"section card\"><h2>Perpindahan seller</h2>'+(d.switches.length?d.switches.map(x=>'<div class=\"row\"><div><span class=\"name\">'+esc(x.buyer_sku_code)+'</span><span class=\"sku\">'+esc(x.from_seller)+' → '+esc(x.to_seller)+' · '+fmt(x.created_at)+'</span></div>'+badge(x.status)+'</div>').join(\"\"):'<div class=\"empty\">Belum ada perpindahan seller.</div>')+'</section>';\n    }\n    async function logs() {\n      const d=await api(\"/api/events\");\n      $(\"content\").innerHTML='<div class=\"card\"><div class=\"section-head\"><h2>Aktivitas sistem</h2>'+button(\"Muat ulang\",\"refresh-logs\",\"tiny\")+'</div>'+feed(d.events)+'</div>';\n    }\n    async function tools() {\n      const current=await bootstrap();\n      $(\"content\").innerHTML='<div class=\"grid two\"><section class=\"card\"><h2>Max price global</h2><div class=\"fields two\"><div class=\"field\"><label for=\"cost\">Harga seller (Rp)</label><input id=\"cost\" type=\"number\" min=\"0\" inputmode=\"numeric\" placeholder=\"15000\"></div><div class=\"field\"><label for=\"addon\">Tambahan global (Rp)</label><input id=\"addon\" type=\"number\" min=\"0\" inputmode=\"numeric\" value=\"'+esc(current.settings.maxPriceOffset)+'\"></div></div><div class=\"spread\"><span class=\"muted\">Max price hasil hitung</span><strong id=\"price-result\" class=\"metric\">—</strong></div><div class=\"controls\" style=\"margin-top:15px\">'+button(\"Simpan tambahan global\",\"save-offset\",\"primary\")+button(\"Salin max price\",\"copy-result\")+'</div><p class=\"hint\">Contoh Rp15.000 + Rp1.000 = Rp16.000. Nilai global disimpan untuk switch seller melalui dashboard.</p></section>'+\n      '<section class=\"card\"><h2>Kode layanan dari nama game</h2><div class=\"fields two\"><div class=\"field\"><label for=\"code-game\">Nama game</label><input id=\"code-game\" placeholder=\"Mobile Legends\"></div><div class=\"field\"><label for=\"code-product\">Produk / nominal</label><input id=\"code-product\" placeholder=\"5 Diamond\"></div></div><div class=\"spread\"><span id=\"code-result\" class=\"code\">—</span>'+button(\"Buat kode\",\"generate\",\"primary\")+'</div><div class=\"controls\" style=\"margin-top:16px\">'+button(\"Salin kode\",\"copy-code\")+'</div><p class=\"hint\">Contoh Mobile Legends 5 Diamond → ML5; Free Fire 1000 Diamond → FF1000. Kode yang sudah dipakai tidak dibuat ulang.</p></section></div>'+\n      '<section class=\"section card\"><h2>Auto Seller di halaman Digiflazz</h2><p class=\"sub\">Saat kamu membuka pilihan seller suatu produk di Digiflazz, skrip pendamping memilih kandidat sesuai rating, harga, stok, dan daftar blokir. Mode awal hanya memilih; tekan Simpan di Digiflazz. Kamu bisa mengubahnya ke Simpan otomatis melalui panel ⚡ Auto Seller di halaman Digiflazz.</p><p style=\"margin:16px 0 0\"><a class=\"button primary\" href=\"https://raw.githubusercontent.com/muhammadaldy198/digiflazz-tools/main/extension/digi-select.user.js\" target=\"_blank\" rel=\"noopener noreferrer\">Pasang skrip Auto Seller</a></p><p class=\"hint\">Di HP gunakan Firefox Android dengan add-on Violentmonkey; Chrome Android tidak memasang ekstensi.</p></section>';\n    }\n    async function settings() {\n      await bootstrap();\n      const d=await api(\"/api/settings\"),s=d.settings;\n      $(\"content\").innerHTML='<form id=\"settings-form\" class=\"stack\"><div class=\"grid two\"><section class=\"card\"><h2>Monitor</h2><div class=\"fields two\"><div class=\"field\"><label for=\"interval\">Interval scan (menit)</label><input id=\"interval\" name=\"scanIntervalMinutes\" type=\"number\" min=\"5\" max=\"1440\" value=\"'+esc(s.scanIntervalMinutes)+'\"></div><div class=\"field\"><label for=\"minrating\">Rating minimum Auto Switch</label><input id=\"minrating\" name=\"minRating\" type=\"number\" min=\"4\" max=\"5\" step=\".1\" value=\"'+esc(Math.max(4,Number(s.minRating)||4))+'\"><span class=\"hint\">Seller di bawah rating 4 otomatis gugur.</span></div><div class=\"field\"><label for=\"minreviews\">Jumlah ulasan minimal</label><input id=\"minreviews\" name=\"minReviews\" type=\"number\" min=\"0\" value=\"'+esc(s.minReviews)+'\"></div><div class=\"field\"><label for=\"pricecap\">Batas harga global (Rp)</label><input id=\"pricecap\" name=\"priceCap\" type=\"number\" min=\"0\" value=\"'+esc(s.priceCap)+'\"></div><div class=\"field\"><label for=\"max-offset\">Tambahan max price global (Rp)</label><input id=\"max-offset\" name=\"maxPriceOffset\" type=\"number\" min=\"0\" value=\"'+esc(s.maxPriceOffset)+'\"></div><div class=\"field\"><label for=\"attention-refresh\">Pembaruan rating/SLA per scan</label><input id=\"attention-refresh\" name=\"attentionRefreshBatchSize\" type=\"number\" min=\"1\" max=\"10\" value=\"'+esc(s.attentionRefreshBatchSize)+'\"><span class=\"hint\">Produk aktif dengan data kualitas paling lama diperbarui bergiliran.</span></div></div><div class=\"stack\"><label class=\"check\"><input name=\"scanEnabled\" type=\"checkbox\" '+(s.scanEnabled?\"checked\":\"\")+'> Jalankan monitor otomatis</label><label class=\"check\"><input name=\"autoSwitch\" type=\"checkbox\" '+(s.autoSwitch?\"checked\":\"\")+' '+(!state.bootstrap?.liveSwitchAvailable&&!s.autoSwitch?\"disabled\":\"\")+'> Auto-switch (tersedia setelah satu switch manual sukses)</label><label class=\"check\"><input name=\"dryRun\" type=\"checkbox\" '+(s.dryRun?\"checked\":\"\")+'> Mode Uji — jangan mengubah seller di Digiflazz</label><label class=\"check\"><input name=\"autoFillMaxPrice\" type=\"checkbox\" '+(s.autoFillMaxPrice?\"checked\":\"\")+'> Isi max price otomatis saat berganti seller (harga + tambahan global)</label><label class=\"check\"><input name=\"proactiveScan\" type=\"checkbox\" '+(s.proactiveScan?\"checked\":\"\")+'> Pantau kandidat harga lebih baik</label></div></section>'+\n      '<section class=\"card\"><h2>Prioritas Auto Switch</h2><p class=\"sub\"><strong>1. Rating minimal 4 → 2. SLA tercepat → 3. Toleransi harga → 4. Rating/review terbaik.</strong></p><div class=\"row\"><span>Rating awal</span><strong>Minimal 4.0</strong></div><div class=\"row\"><span>SLA</span><strong>H+0 → H+1 → H+2 → H+3 → tidak diketahui</strong></div><div class=\"row\"><span>Harga</span><strong>Kandidat maksimal '+esc(s.priceTolerancePercent)+'% dari harga termurah</strong></div><div class=\"row\"><span>Di dalam toleransi</span><strong>Rating tertinggi → ulasan terbanyak → harga termurah</strong></div><p class=\"hint\">Contoh harga termurah Rp1.432 dan toleransi 2%: seller sampai sekitar Rp1.460 masih satu kelompok. Di kelompok itu rating dan jumlah ulasan menentukan pilihan. IP/API/H2H hanya informasi dan tidak ikut menentukan.</p><div class=\"fields two\"><div class=\"field\"><label for=\"price-tolerance\">Toleransi harga Auto Switch (%)</label><input id=\"price-tolerance\" name=\"priceTolerancePercent\" type=\"number\" min=\"0\" max=\"20\" step=\".1\" value=\"'+esc(s.priceTolerancePercent)+'\"></div><div class=\"field\"><label for=\"savings\">Hemat minimal (%)</label><input id=\"savings\" name=\"minSavingsPercent\" type=\"number\" min=\"0\" max=\"100\" step=\".1\" value=\"'+esc(s.minSavingsPercent)+'\"></div><div class=\"field\"><label for=\"reoptimize\">Perbaiki harga produk sehat (jam, 0=off)</label><input id=\"reoptimize\" name=\"reoptimizeHours\" type=\"number\" min=\"0\" max=\"720\" value=\"'+esc(s.reoptimizeHours)+'\"></div></div><label for=\"save-mode\">Simpan pengaturan</label><select id=\"save-mode\" name=\"saveMode\"><option value=\"manual\" '+(s.saveMode===\"manual\"?\"selected\":\"\")+'>Manual (tombol Simpan)</option><option value=\"auto\" '+(s.saveMode===\"auto\"?\"selected\":\"\")+'>Otomatis saat diubah</option></select><p class=\"hint\">Perubahan pada dashboard disimpan ke D1. OtoSwitch tidak terhubung ke pengaturan alat ini.</p></section></div><div><button class=\"button primary\">Simpan pengaturan</button></div></form>';\n      const form=$(\"settings-form\");form.dataset.auto=s.saveMode;\n      form.addEventListener(\"change\",()=>{if($(\"save-mode\").value===\"auto\" && form.checkValidity())form.requestSubmit()});\n    }\n    async function connection() {\n      const d=await api(\"/api/connection/status\");\n      $(\"content\").innerHTML='<div class=\"grid two\"><section class=\"card\"><h2>Status sesi</h2><div class=\"row\"><span>Digiflazz</span>'+badge(d.connected?\"Tersimpan\":\"Belum tersimpan\",d.connected?\"good\":\"warn\")+'</div><div class=\"row\"><span>Host</span><strong>'+esc(d.sourceHost||\"—\")+'</strong></div><div class=\"row\"><span>Uji terakhir</span><strong>'+(d.lastTestStatus?\"HTTP \"+esc(d.lastTestStatus)+\" · \"+fmt(d.lastTestAt):\"—\")+'</strong></div><div class=\"controls\" style=\"margin-top:16px\">'+button(\"Tes koneksi\",\"test-connection\",\"primary\")+button(\"Temukan jalur API\",\"discover\")+'</div></section>'+\n      '<section class=\"card\"><h2>Perbarui sesi</h2><p class=\"sub\">Sesi lama masih tersimpan. Gunakan bagian ini hanya jika sesi kedaluwarsa.</p><form id=\"connection-form\" class=\"stack\" style=\"margin-top:12px\"><div class=\"field\"><label for=\"curl\">cURL GET dari dashboard Digiflazz</label><textarea id=\"curl\" name=\"curl\" autocomplete=\"off\" spellcheck=\"false\" placeholder=\"curl &#39;https://member.digiflazz.com/...&#39; ...\"></textarea></div><div><button class=\"button primary\">Simpan sesi terenkripsi</button></div></form><p class=\"hint\">Jangan bagikan cURL, cookie, atau token ke chat atau GitHub.</p></section></div>';\n    }\n    async function render(view=state.view) {\n      state.view=view;const [title,sub]=names[view];$(\"title\").textContent=title;$(\"subtitle\").textContent=sub;\n      document.querySelectorAll(\"#nav button\").forEach(x=>x.classList.toggle(\"active\",x.dataset.view===view));\n      loading();\n      try{await ({overview,products,sellers,rules,zones,history,logs,tools,settings,connection})[view]()}catch(e){error(e);$(\"content\").innerHTML='<div class=\"card empty\"><strong>Data belum dapat dimuat</strong>'+esc(e.message)+'</div>'}\n    }\n    async function write(path,body,method=\"POST\") {return api(path,{method,body:method===\"DELETE\"?\"{}\":JSON.stringify(body||{})})}\n    async function action(a,el) {\n      if(a===\"scan-now\"){toast(\"Memindai katalog…\");const d=await write(\"/api/scan\");toast(d.total+\" produk dipindai; \"+d.issues+\" perlu perhatian; \"+(d.qualityRefreshed||0)+\" rating/SLA diperbarui.\");return render()}\n      if(a===\"manual-test\"){\n        const d=await api(\"/api/products?\"+new URLSearchParams({page:\"1\",q:\"\",status:\"issues\"}));\n        const first=d.products?.[0];\n        if(!first)throw Error(\"Tidak ada produk bermasalah untuk dites.\");\n        toast(\"Membuka kandidat seller untuk \"+first.sku+\"…\");\n        return product(first.sku);\n      }\n      if(a===\"toggle-auto\"){\n        const d=state.bootstrap||await bootstrap();\n        const active=d.settings.autoSwitch&&!d.settings.dryRun;\n        if(!active&&!d.liveSwitchAvailable){\n          toast(\"Lakukan Tes Switch Manual dulu. Saya buka produknya sekarang.\");\n          return action(\"manual-test\",el);\n        }\n        await write(\"/api/settings\",{autoSwitch:!active,dryRun:active,scanEnabled:true});\n        toast(active?\"Auto Switch dimatikan. Mode Uji aktif.\":\"Auto Switch AKTIF. Mode Uji dimatikan.\");\n        return render();\n      }\n      if(a===\"run-auto\"){\n        const d=state.bootstrap||await bootstrap();\n        if(!(d.settings.autoSwitch&&!d.settings.dryRun)){\n          if(!d.liveSwitchAvailable){toast(\"Verifikasi 1x switch manual dulu.\");return action(\"manual-test\",el)}\n          await write(\"/api/settings\",{autoSwitch:true,dryRun:false,scanEnabled:true});\n        }\n        toast(\"Memilih seller terbaik berdasarkan rating, SLA, toleransi harga, dan ulasan…\");\n        const result=await write(\"/api/automation/run\",{});\n        toast(\"Auto Switch: \"+result.switched+\" berhasil, \"+result.noCandidate+\" tanpa kandidat, \"+result.failed+\" gagal.\");\n        return render();\n      }\n      if(a===\"monitor\"){const d=state.bootstrap;await write(\"/api/settings\",{scanEnabled:!d.settings.scanEnabled});return render()}\n      if(a===\"goto-issues\"){state.status=\"issues\";state.page=1;return render(\"products\")}\n      if(a.startsWith(\"goto-\"))return render({ \"goto-rules\":\"rules\",\"goto-history\":\"history\",\"goto-logs\":\"logs\" }[a]);\n      if(a===\"search\"){state.q=$(\"search-product\").value;state.status=$(\"filter-product\").value;state.category=$(\"filter-category\").value;state.brand=$(\"filter-brand\").value;state.page=1;return render()}\n      if(a===\"prev\"||a===\"next\"){state.page+=a===\"next\"?1:-1;return render()}\n      if(a===\"product\")return product(el.dataset.sku);\n      if(a===\"switch-seller\"){\n        const p=state.selected;\n        if(!confirm(\"Pindah seller SKU \"+p.sku+\" ke \"+el.dataset.sellerName+\" (\"+rupiah(el.dataset.sellerPrice)+\") di Digiflazz?\"))return;\n        toast(\"Menyimpan dan mengecek seller di Digiflazz…\");\n        const result=await write(\"/api/products/\"+encodeURIComponent(p.sku)+\"/switch\",{sellerId:el.dataset.sellerId});\n        toast(\"Seller \"+result.seller+\" tersimpan dan terkonfirmasi.\");\n        $(\"modal\").hidden=true;return render();\n      }\n      if(a===\"save-sku\"){\n        const p=state.selected,newSku=$(\"product-sku\").value.trim();\n        if(!/^[A-Za-z0-9._-]{1,50}$/.test(newSku))throw Error(\"SKU hanya boleh huruf, angka, titik, garis bawah, atau minus.\");\n        if(newSku===p.sku)return toast(\"SKU tidak berubah.\");\n        if(!confirm(\"Ubah SKU Buyer \"+p.sku+\" menjadi \"+newSku+\" langsung di Digiflazz?\"))return;\n        toast(\"Mengubah SKU di Digiflazz…\");\n        const result=await write(\"/api/products/\"+encodeURIComponent(p.sku)+\"/sku\",{sku:newSku});\n        toast(\"SKU berhasil diubah dan terkonfirmasi: \"+result.sku);\n        $(\"modal\").hidden=true;state.selected=null;return render(\"products\");\n      }\n      if(a===\"toggle-product\"){\n        const sku=el.dataset.sku||state.selected?.sku;\n        if(!sku)throw Error(\"SKU produk tidak ditemukan.\");\n        const currentlyActive=el.dataset.active===\"1\";\n        const next=!currentlyActive;\n        if(!confirm((next?\"Aktifkan\":\"Nonaktifkan\")+\" SKU \"+sku+\" langsung di Digiflazz?\"))return;\n        toast((next?\"Mengaktifkan\":\"Menonaktifkan\")+\" produk di Digiflazz…\");\n        await write(\"/api/products/\"+encodeURIComponent(sku)+\"/status\",{active:next});\n        toast(\"Produk \"+sku+\" sekarang \"+(next?\"ON\":\"OFF\")+\" di Digiflazz.\");\n        if(state.selected?.sku===sku){$(\"modal\").hidden=true;state.selected=null}\n        return render(\"products\");\n      }\n      if(a===\"delete-product\"){\n        const sku=el.dataset.sku||state.selected?.sku,name=el.dataset.name||state.selected?.name||sku;\n        if(!sku)throw Error(\"SKU produk tidak ditemukan.\");\n        if(!confirm('HAPUS \"'+name+'\" ('+sku+') dari Digiflazz?\\n\\nDigiflazz memperingatkan: setelah produk dihapus, cek status transaksi lama menggunakan kode produk ini tidak dapat dilakukan lagi.'))return;\n        if(!confirm(\"Konfirmasi terakhir: benar-benar hapus \"+sku+\" dari daftar produk Buyer Digiflazz?\"))return;\n        toast(\"Menghapus produk dari Digiflazz…\");\n        await write(\"/api/products/\"+encodeURIComponent(sku),{},\"DELETE\");\n        toast(\"Produk \"+sku+\" sudah dihapus dan terkonfirmasi di Digiflazz.\");\n        $(\"modal\").hidden=true;state.selected=null;return render(\"products\");\n      }\n      if(a===\"save-max\"){\n        const p=state.selected,amount=Number($(\"product-max\").value);\n        if(!Number.isSafeInteger(amount)||amount<1)throw Error(\"Masukkan harga maksimum yang benar.\");\n        if(!confirm(\"Simpan harga maksimum \"+rupiah(amount)+\" untuk SKU \"+p.sku+\" di Digiflazz?\"))return;\n        toast(\"Menyimpan harga maksimum…\");\n        await write(\"/api/products/\"+encodeURIComponent(p.sku)+\"/max-price\",{maxPrice:amount});\n        toast(\"Harga maksimum dikonfirmasi di Digiflazz.\");$(\"modal\").hidden=true;return render();\n      }\n      if(a===\"reconcile\"){\n        const p=state.selected;\n        const result=await write(\"/api/products/\"+encodeURIComponent(p.sku)+\"/reconcile\");\n        toast(result.confirmed?\"Perubahan terkonfirmasi di Digiflazz.\":\"Target tidak ditemukan. Periksa produk sebelum mencoba lagi.\",!result.confirmed);\n        return product(p.sku);\n      }\n      if(a===\"close\"){$(\"modal\").hidden=true;return}\n      if(a===\"lock\"){const p=state.selected,next=!p.locked;const message=next?\"Kunci Auto Switch untuk \"+p.sku+\"? Sistem tidak akan mengganti seller SKU ini secara otomatis. Aksi manual tetap tersedia.\":\"Buka Kunci Auto Switch untuk \"+p.sku+\"? SKU ini akan kembali boleh diproses Auto Switch.\";if(!confirm(message))return;await write(\"/api/products/\"+encodeURIComponent(p.sku)+\"/lock\",{locked:next,reason:\"manual\"});toast(next?\"Auto Switch dikunci untuk \"+p.sku+\".\":\"Kunci Auto Switch dibuka untuk \"+p.sku+\".\");return product(p.sku)}\n      if(a===\"copy-price\"){await navigator.clipboard.writeText(String(state.selected.max_price||state.selected.price));return toast(\"Harga disalin.\")}\n      if(a===\"delete-rule\"){if(!confirm(\"Hapus aturan ini?\"))return;await write(\"/api/rules/\"+el.dataset.id,{},\"DELETE\");return render()}\n      if(a===\"delete-zone\"){if(!confirm(\"Hapus zona dan seluruh penugasannya?\"))return;await write(\"/api/zones/\"+el.dataset.id,{},\"DELETE\");return render()}\n      if(a===\"refresh-logs\")return render();\n      if(a===\"test-connection\"){const d=await write(\"/api/connection/test\");toast(\"Uji sesi: HTTP \"+d.httpStatus+(d.connected?\" · tersambung\":\" · gagal\"),!d.connected);return render()}\n      if(a===\"discover\"){toast(\"Membaca jalur dashboard Digiflazz…\");const d=await write(\"/api/discover\");toast(d.count+\" jalur API ditemukan untuk pemeriksaan.\");return}\n      if(a===\"generate\"){\n        const d=await write(\"/api/service-code\",{game:$(\"code-game\").value,product:$(\"code-product\").value});\n        $(\"code-result\").textContent=d.code;$(\"code-result\").dataset.available=String(d.available);\n        return toast(d.available?\"Kode \"+d.code+\" siap disalin.\":\"Kode \"+d.code+\" sudah dipakai pada katalog; periksa SKU dahulu.\",!d.available);\n      }\n      if(a===\"copy-code\"){const node=$(\"code-result\"),c=node.textContent;if(!/^[A-Z]{1,5}[0-9]+$/.test(c)||node.dataset.available!==\"true\")throw Error(\"Kode belum siap atau sudah dipakai.\");await navigator.clipboard.writeText(c);return toast(\"Kode disalin.\")}\n      if(a===\"save-offset\"){\n        const value=Number($(\"addon\").value);\n        if(!Number.isSafeInteger(value)||value<0||value>1000000000)throw Error(\"Tambahan max price harus angka rupiah positif.\");\n        await write(\"/api/settings\",{maxPriceOffset:value});toast(\"Tambahan global Rp\"+value.toLocaleString(\"id-ID\")+\" tersimpan.\");\n        return;\n      }\n      if(a===\"copy-result\"){const v=$(\"price-result\").dataset.value;if(!v)throw Error(\"Isi harga modal dulu.\");await navigator.clipboard.writeText(v);return toast(\"Harga disalin.\")}\n    }\n    $(\"nav\").addEventListener(\"click\",e=>{const b=e.target.closest(\"button[data-view]\");if(b)render(b.dataset.view)});\n    $(\"refresh\").addEventListener(\"click\",()=>render());\n    $(\"scan\").addEventListener(\"click\",async()=>{try{await action(\"scan-now\")}catch(e){error(e)}});\n    document.addEventListener(\"click\",async e=>{const b=e.target.closest(\"button[data-action]\");if(!b)return;try{b.disabled=true;await action(b.dataset.action,b)}catch(err){error(err)}finally{if(b.isConnected)b.disabled=false}});\n    document.addEventListener(\"change\",async e=>{\n      if(e.target.matches(\".seller-mode\")){try{await write(\"/api/sellers/\"+encodeURIComponent(e.target.dataset.name)+\"/preference\",{mode:e.target.value});toast(\"Pilihan seller tersimpan.\")}catch(err){error(err)}}\n      if(e.target.id===\"filter-category\"){state.category=e.target.value;state.brand=\"\";state.page=1;return render(\"products\")}\n    });\n    document.addEventListener(\"input\",e=>{if(e.target.id===\"cost\"||e.target.id===\"addon\"){const cost=Number($(\"cost\").value),addition=Number($(\"addon\").value),out=$(\"price-result\");const value=cost+addition;out.textContent=cost>0&&addition>=0?rupiah(value):\"—\";out.dataset.value=cost>0&&addition>=0?String(value):\"\"}});\n    document.addEventListener(\"submit\",async e=>{\n      if(![\"rule-form\",\"zone-form\",\"assign-form\",\"settings-form\",\"connection-form\"].includes(e.target.id))return;\n      e.preventDefault();const f=e.target,b=new FormData(f),id=f.id;\n      try{\n        if(id===\"rule-form\")await write(\"/api/rules\",{scope_type:b.get(\"scope_type\"),scope_value:b.get(\"scope_value\"),min_rating:b.get(\"min_rating\")===\"\"?null:Number(b.get(\"min_rating\")),max_price:b.get(\"max_price\")===\"\"?null:Number(b.get(\"max_price\")),require_stock:b.has(\"require_stock\"),avoid_cutoff:b.has(\"avoid_cutoff\")});\n        if(id===\"zone-form\")await write(\"/api/zones\",Object.fromEntries(b));\n        if(id===\"assign-form\")await write(\"/api/zones/assign\",Object.fromEntries(b));\n        if(id===\"connection-form\"){await write(\"/api/connection\",{curl:b.get(\"curl\")});$(\"curl\").value=\"\"}\n        if(id===\"settings-form\"){await write(\"/api/settings\",{scanEnabled:b.has(\"scanEnabled\"),autoSwitch:b.has(\"autoSwitch\"),dryRun:b.has(\"dryRun\"),autoFillMaxPrice:b.has(\"autoFillMaxPrice\"),proactiveScan:b.has(\"proactiveScan\"),scanIntervalMinutes:Number(b.get(\"scanIntervalMinutes\")),minRating:Number(b.get(\"minRating\")),minReviews:Number(b.get(\"minReviews\")),priceCap:Number(b.get(\"priceCap\")),maxPriceOffset:Number(b.get(\"maxPriceOffset\")),attentionRefreshBatchSize:Number(b.get(\"attentionRefreshBatchSize\")),priceTolerancePercent:Number(b.get(\"priceTolerancePercent\")),minSavingsPercent:Number(b.get(\"minSavingsPercent\")),reoptimizeHours:Number(b.get(\"reoptimizeHours\")),saveMode:b.get(\"saveMode\")})}\n        toast(\"Tersimpan.\");if(id!==\"settings-form\"||b.get(\"saveMode\")!==\"auto\")await render();\n      }catch(err){error(err)}\n    });\n    render();\n  })();\n  </script>\n</body>\n</html>\n";
const encoder = new TextEncoder();
const decoder = new TextDecoder();
const DEFAULTS = {
  scanEnabled: false, dryRun: true, autoSwitch: false, scanIntervalMinutes: 5,
  minRating: 4, minReviews: 0, priceCap: 0, preserveMaxPrice: true,
  saveMode: "manual", autoFillMaxPrice: true, proactiveScan: false,
  reoptimizeHours: 0, minSavingsPercent: 5, cooldownHours: 24, autoSwitchBatchSize: 5, attentionRefreshBatchSize: 5,
  weights: { price: 40, connection: 30, sla: 20, stock: 10 },
  priceTolerancePercent: 2,
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
    if (["scanEnabled","dryRun","autoSwitch","preserveMaxPrice","autoFillMaxPrice","proactiveScan"].includes(key)) next[key] = bool(value);
    else if (key === "maxPriceOffset") {
      if(!Number.isSafeInteger(Number(value))||Number(value)<0||Number(value)>1000000000)throw Error("Tambahan max price harus angka rupiah bulat antara 0 dan 1 miliar.");
      next[key]=Number(value);
    } else if (["minRating","minReviews","priceCap","scanIntervalMinutes","reoptimizeHours","minSavingsPercent","cooldownHours","autoSwitchBatchSize","attentionRefreshBatchSize","priceTolerancePercent"].includes(key)) {
      const limits = {minRating:[4,5],minReviews:[0,100000],priceCap:[0,1000000000],scanIntervalMinutes:[5,1440],reoptimizeHours:[0,720],minSavingsPercent:[0,100],cooldownHours:[1,720],autoSwitchBatchSize:[1,10],attentionRefreshBatchSize:[1,10],priceTolerancePercent:[0,20]};
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
    const summary=await attentionSummary(env);
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
  const preferred = new Set(prefs.filter(p=>p.mode==="preferred").map(p=>p.seller_name.toLowerCase()));
  const hasHealthState = Object.prototype.hasOwnProperty.call(product,"seller_name") || Object.prototype.hasOwnProperty.call(product,"seller_active") || Object.prototype.hasOwnProperty.call(product,"stock");
  const unhealthy = hasHealthState && (!product.seller_name || product.seller_active === 0 || (product.max_price > 0 && product.price > product.max_price) || (!product.unlimited_stock && product.stock === 0));
  const max = Math.min(...[rule?.max_price, unhealthy ? 0 : product.max_price, config.priceCap].filter(x=>Number(x)>0).map(Number), Infinity);
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
    if (rule?.require_stock !== 0 && x.stock != null && !x.unlimited_stock && !(x.stock > 0)) reasons.push("Stok habis");
    if (rule?.avoid_cutoff !== 0 && inCutoffWindow(x.start_cut_off,x.end_cut_off)) reasons.push("Sedang cut-off");
    if (zone && !zone.patterns.every(p=>String(x.description||"").toLowerCase().includes(p.toLowerCase()))) reasons.push("Zona tidak cocok");
    const sla_days=slaDays(x.sla);
    return { ...x, eligible:!reasons.length, reasons, sla_days, review_value:reviews, preferred:preferred.has(name) };
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
          Number(b.preferred)-Number(a.preferred);
      }
    }
    return Number(a.price)-Number(b.price) ||
      Number(b.rating||0)-Number(a.rating||0) ||
      Number(b.review_value||0)-Number(a.review_value||0) ||
      Number(b.preferred)-Number(a.preferred);
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
  const priority={product:0,type:1,brand:2,category:3,global:4};
  return (rules||[]).filter(rule=>{
    if(!Number(rule.is_active))return false;
    if(rule.scope_type==="global")return true;
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
  if(Number(product.max_price)>0&&Number(product.price)>Number(product.max_price))reasons.push("Harga di atas max price");
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
  if(/Harga/i.test(reason))return "harga";
  if(/Rating|SLA/i.test(reason))return "kualitas";
  if(/Operasi|hasil operasi/i.test(reason))return "tertunda";
  return "operasional";
}
async function loadAttentionRows(env, config, where="WHERE 1=1", args=[]) {
  const rows=await env.DB.prepare(`
    SELECT p.sku,p.product_id,p.name,p.category,p.brand,p.product_type,p.seller_name,p.price,p.max_price,p.active,p.seller_active,p.stock,p.unlimited_stock,p.last_seen,
      l.buyer_sku_code IS NOT NULL AS locked,
      op.status AS operation_status,
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
    const rule=matchingRuleForProduct(row,rules);
    const ranked=rank(row,options,preferences,rule,config,zoneBySku.get(row.sku)||null);
    const current=ranked.find(x=>String(x.seller_id)===String(row.current_seller_sku_id))||null;
    const best=ranked.find(x=>x.eligible)||null;
    const attention_reasons=attentionReasons(row,config,new Date(),{ranked,current,best});
    return {
      ...row,
      nominal_value:productNominalValue(row),
      best_candidate_seller:best?.seller_name||null,
      best_candidate_price:best?.price??null,
      best_candidate_rating:best?.rating??null,
      best_candidate_sla:best?.sla_days??null,
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
async function attentionSummary(env) {
  const [summary,quality]=await Promise.all([
    env.DB.prepare(`SELECT
      count(*) products,
      sum(CASE WHEN p.active=1 THEN 1 ELSE 0 END) activeProducts,
      sum(CASE WHEN a.dirty=0 AND a.needs_attention=1 THEN 1 ELSE 0 END) issues,
      sum(CASE WHEN a.dirty=0 AND a.operational_issue=1 THEN 1 ELSE 0 END) operational,
      sum(CASE WHEN a.dirty=0 AND a.quality_issue=1 THEN 1 ELSE 0 END) quality,
      sum(CASE WHEN a.dirty=0 AND a.price_issue=1 THEN 1 ELSE 0 END) price,
      sum(CASE WHEN a.dirty=0 AND a.pending_issue=1 THEN 1 ELSE 0 END) pendingIssues,
      sum(CASE WHEN a.sku IS NULL OR a.dirty=1 THEN 1 ELSE 0 END) attentionPending,
      sum(CASE WHEN a.dirty=0 THEN 1 ELSE 0 END) attentionFresh
    FROM products p LEFT JOIN product_attention a ON a.sku=p.sku`).first(),
    env.DB.prepare("SELECT count(DISTINCT o.sku) total FROM seller_options o JOIN products p ON p.sku=o.sku WHERE p.active=1").first()
  ]);
  return {
    products:Number(summary?.products)||0,
    activeProducts:Number(summary?.activeProducts)||0,
    issues:Number(summary?.issues)||0,
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
  for (let i=0;i<cmds.length;i+=80) await env.DB.batch(cmds.slice(i,i+80));
  return cmds.length;
}
async function refreshAttentionCoverage(env, requestedLimit=5) {
  const limit=Math.trunc(bounded(requestedLimit,1,10,5));
  const rows=await env.DB.prepare(`
    SELECT p.sku,p.product_id,max(o.last_seen) AS quality_last_seen
    FROM products p
    LEFT JOIN seller_options o ON o.sku=p.sku
    WHERE p.active=1
    GROUP BY p.sku,p.product_id
    ORDER BY CASE WHEN max(o.last_seen) IS NULL THEN 0 ELSE 1 END ASC,max(o.last_seen) ASC,p.sku ASC
    LIMIT ?
  `).bind(limit).all();
  let refreshed=0,failed=0,lastError=null;
  const refreshedSkus=[];
  for(const row of rows.results) {
    try {
      await refreshOptions(env,row.sku,row.product_id);
      refreshed++;
      refreshedSkus.push(row.sku);
    } catch(error) {
      failed++;lastError=error;
      if(error?.status===401||error?.status===403)break;
    }
  }
  if(failed) await log(env,"WARN","attention-refresh",failed+" pembaruan rating/SLA gagal"+(lastError?": "+lastError.message:"")+".");
  if(refreshed) await log(env,"INFO","attention-refresh",refreshed+" produk diperbarui data rating/SLA-nya.");
  return {refreshed,failed,skus:refreshedSkus};
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
    await remoteSave(env,changedProduct(current,choice,!config.autoFillMaxPrice,config.maxPriceOffset,false));
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
  const rows=await env.DB.prepare(`SELECT p.sku,p.last_seen,a.reasons_json
    FROM product_attention a
    JOIN products p ON p.sku=a.sku
    LEFT JOIN product_locks l ON l.buyer_sku_code=p.sku
    LEFT JOIN switch_operations op ON op.sku=p.sku
    WHERE a.dirty=0 AND a.needs_attention=1 AND p.active=1
      AND l.buyer_sku_code IS NULL
      AND COALESCE(op.status,'') NOT IN ('pending','unknown')
    ORDER BY p.last_seen ASC,p.sku ASC LIMIT ?`).bind(limit).all();
  const targets=rows.results.map(row=>{
    let attention_reasons=[];
    try { attention_reasons=JSON.parse(row.reasons_json||"[]"); } catch {}
    return {...row,attention_reasons};
  });
  let switched=0,noCandidate=0,failed=0;
  const results=[];
  for(const target of targets) {
    const sku=target.sku;
    try {
      const selection=await rankedOptions(env,sku);
      const current=JSON.parse(selection.product.raw),currentId=String(current.seller_sku_id??"");
      const top=selection.options.find(o=>o.eligible);
      const hardIssue=target.attention_reasons.some(reason=>[
        "Seller belum dipilih","Seller OFF","Harga di atas max price","Stok habis","Sedang cut-off"
      ].includes(reason));
      const best=top&&String(top.seller_id)!==currentId
        ? top
        : hardIssue
          ? selection.options.find(o=>o.eligible&&String(o.seller_id)!==currentId)
          : null;
      if(!best) {
        noCandidate++;
        await log(env,"INFO","auto-switch",top&&String(top.seller_id)===currentId?"Seller saat ini masih kandidat terbaik; tidak dipindahkan.":"Tidak ada kandidat seller yang memenuhi aturan.",sku);
        results.push({sku,status:"no_candidate"});
        await markAttentionDirty(env,[sku]);
        continue;
      }
      const changed=await switchSeller(env,sku,best.seller_id,"auto",selection);
      switched++;
      results.push({sku,status:"switched",seller:changed.seller,price:changed.price});
      await markAttentionDirty(env,[sku]);
    } catch(error) {
      failed++;
      await log(env,"WARN","auto-switch",error.message,sku);
      results.push({sku,status:"error",error:error.message});
      await markAttentionDirty(env,[sku]);
    }
  }
  return {ok:true,examined:targets.length,switched,noCandidate,failed,remainingPossible:targets.length===limit,results};
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
    await env.DB.prepare("UPDATE switch_operations SET status='unknown' WHERE sku=?").bind(sku).run();
    await markAttentionDirty(env,[sku]);
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
  await markAttentionDirty(env,[sku]);
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
      const cfg=await settings(env);
      const [c, counts, sellerCount, last, events, verified]=await Promise.all([
        conn(env),attentionSummary(env),
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
      const page=Math.trunc(bounded(url.searchParams.get("page"),1,100000,1));
      const offset=(page-1)*50;
      const q="%"+str(url.searchParams.get("q")).slice(0,80)+"%";
      const status=str(url.searchParams.get("status"));
      const category=str(url.searchParams.get("category")).slice(0,120);
      const brand=str(url.searchParams.get("brand")).slice(0,120);
      let where="WHERE (p.sku LIKE ? OR p.name LIKE ? OR p.brand LIKE ? OR p.category LIKE ?)";
      const args=[q,q,q,q];
      if(category){where+=" AND p.category=?";args.push(category)}
      if(brand){where+=" AND p.brand=?";args.push(brand)}
      if(status==="issues")where+=" AND a.dirty=0 AND a.needs_attention=1";
      else if(status==="locked")where+=" AND l.buyer_sku_code IS NOT NULL";
      else if(status==="active")where+=" AND p.active=1";
      else if(status==="inactive")where+=" AND p.active=0";
      const from=` FROM products p
        LEFT JOIN product_attention a ON a.sku=p.sku
        LEFT JOIN product_locks l ON l.buyer_sku_code=p.sku `;
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
        const op=await env.DB.prepare("SELECT status,target_seller_id FROM switch_operations WHERE sku=?").bind(sku).first();
        const raw=JSON.parse(d.product.raw),currentId=String(raw.seller_sku_id??"");
        const current=d.options.find(x=>String(x.seller_id)===currentId)||null;
        const best=d.options.find(x=>x.eligible)||null;
        const attention=attentionReasons({...d.product,operation_status:op?.status,start_cut_off:raw.start_cut_off,end_cut_off:raw.end_cut_off,option_count:d.options.length,current_option_seller_id:current?.seller_id,current_rating:current?.rating,current_sla:current?.sla},d.config,new Date(),{ranked:d.options,current,best});
        const cached={...d.product,operation_status:op?.status,current_rating:current?.rating??null,current_sla:current?.sla??null,option_count:d.options.length,attention_reasons:attention,needs_attention:attention.length>0,nominal_value:productNominalValue(d.product),best_candidate_seller:best?.seller_name||null,best_candidate_price:best?.price??null,best_candidate_rating:best?.rating??null,best_candidate_sla:best?.sla_days??null};
        await persistAttentionRows(env,[cached]);
        return {ok:true,product:{...cached,raw:undefined,current_seller_sku_id:currentId},operation:op,options:d.options.map(({raw,...option})=>option),connectorReady,maxPricePolicy:{autoFill:!!d.config.autoFillMaxPrice,offset:Number(d.config.maxPriceOffset)||0}};
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
      const rows=await env.DB.prepare("SELECT s.seller_id,s.name,s.rating,s.review_count,s.product_count,s.invoice,p.mode FROM sellers s LEFT JOIN seller_preferences p ON p.seller_name=s.name ORDER BY s.rating DESC,s.name LIMIT 1000").all();
      return reply({ok:true,sellers:rows.results});
    }
    const pref=path.match(/^\/api\/sellers\/([^/]+)\/preference$/);
    if(method==="POST"&&pref) {
      const body=await getJson(req), name=decodeURIComponent(pref[1]);
      if(!["preferred","blocked","none"].includes(body.mode))throw Error("Pilihan tidak valid.");
      await env.DB.prepare("DELETE FROM seller_preferences WHERE seller_name=?").bind(name).run();
      if(body.mode!=="none") await env.DB.prepare("INSERT INTO seller_preferences(seller_name,mode) VALUES(?,?)").bind(name,body.mode).run();
      await markAttentionDirty(env);
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
      await markAttentionDirty(env);
      return reply({ok:true,id:r.meta.last_row_id});
    }
    const rule=path.match(/^\/api\/rules\/(\d+)$/);
    if(method==="DELETE"&&rule) {
      await env.DB.prepare("DELETE FROM seller_rules WHERE id=?").bind(Number(rule[1])).run();
      await markAttentionDirty(env);
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
      await markAttentionDirty(env);
      return reply({ok:true,id:r.meta.last_row_id});
    }
    const zone=path.match(/^\/api\/zones\/(\d+)$/);
    if(method==="DELETE"&&zone) {
      await env.DB.prepare("DELETE FROM zones WHERE id=?").bind(Number(zone[1])).run();
      await markAttentionDirty(env);
      return reply({ok:true});
    }
    if(method==="POST"&&path==="/api/zones/assign") {
      const b=await getJson(req);
      if(!str(b.sku))throw Error("SKU wajib diisi.");
      if(b.zone_id) await env.DB.prepare("INSERT INTO zone_assignments(sku,zone_id) VALUES(?,?) ON CONFLICT(sku) DO UPDATE SET zone_id=excluded.zone_id").bind(str(b.sku),Number(b.zone_id)).run();
      else await env.DB.prepare("DELETE FROM zone_assignments WHERE sku=?").bind(str(b.sku)).run();
      await markAttentionDirty(env,[str(b.sku)]);
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
      await markAttentionDirty(env);
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
export { rank, normalizeProduct, validateSettings, changedProduct, serviceCode, inCutoffWindow, slaDays, validBuyerSku, reviewValue, attentionReasons, parseNominalToken, productNominalValue, productSortCompare, matchingRuleForProduct };
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
          if(summary.examined) await log(env,"INFO","auto-switch","Batch otomatis: "+summary.switched+" pindah, "+summary.noCandidate+" tanpa kandidat, "+summary.failed+" gagal.");
        } catch(error) { await log(env,"WARN","auto-switch",error.message); }
        return;
      }

      if(cfg.proactiveScan) {
        const sample=await env.DB.prepare("SELECT p.sku FROM products p LEFT JOIN seller_options o ON o.sku=p.sku WHERE p.active=1 AND p.seller_active=1 AND p.price>0 AND (p.stock>0 OR p.unlimited_stock=1) GROUP BY p.sku ORDER BY min(COALESCE(o.last_seen,'1970-01-01')) ASC LIMIT 1").all();
        for(const {sku} of sample.results) {
          try {
            const data=await rankedOptions(env,sku);
            const current=JSON.parse(data.product.raw);
            const best=data.options.find(o=>o.eligible && o.seller_id!==String(current.seller_sku_id) && o.price<data.product.price*(1-cfg.minSavingsPercent/100));
            if(best) {
              const saving=Math.round((1-best.price/data.product.price)*100);
              await log(env,"WARN","better_seller_available",best.seller_name+" lebih murah "+saving+"% (Rp"+best.price+").",sku);
            }
          } catch(error) { await log(env,"WARN","proactive",error.message,sku); }
        }
        return;
      }

      const known=await env.DB.prepare("SELECT count(*) total FROM api_discovery").first();
      const previous=await env.DB.prepare("SELECT value FROM app_settings WHERE key='discovery_last_attempt'").first();
      if(known.total===0&&await conn(env)&&(!previous||Date.now()-Date.parse(previous.value)>86400000)) {
        await env.DB.prepare("INSERT INTO app_settings(key,value) VALUES('discovery_last_attempt',?) ON CONFLICT(key) DO UPDATE SET value=excluded.value").bind(new Date().toISOString()).run();
        await discover(env);
      }
    } catch(error) { try { await log(env,"ERROR","cron",error.message); } catch {} }
  }};
