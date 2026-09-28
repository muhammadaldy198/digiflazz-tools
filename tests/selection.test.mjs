import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const source = readFileSync(new URL("../src/worker.js", import.meta.url), "utf8").replace("const HTML = __HTML__;", "const HTML = '';");
const scanMigration = readFileSync(new URL("../migrations/0007_scan_single_flight.sql", import.meta.url), "utf8");
const sellerRejectionMigration = readFileSync(new URL("../migrations/0008_seller_rejections.sql", import.meta.url), "utf8");
const uiSource = readFileSync(new URL("../src/ui.html", import.meta.url), "utf8");
const { rank, normalizeProduct, validateSettings, changedProduct, inCutoffWindow, slaDays, validBuyerSku, reviewValue, attentionReasons, parseNominalToken, productNominalValue, productSortCompare, matchingRuleForProduct } = await import("data:text/javascript," + encodeURIComponent(source));

test("seller filtering rejects blocked, expensive, and out of stock candidates", () => {
  const product = { max_price: 11000 };
  const rows = [
    { seller_name: "Trusted", price: 10000, rating: 4.9, stock: 10, unlimited_stock: 0, connection: "IP", sla: "H+0", description: "sumatra", seller_status:1 },
    { seller_name: "Blocked", price: 9000, rating: 5, stock: 10, unlimited_stock: 0, description: "sumatra", seller_status:1 },
    { seller_name: "Costly", price: 12000, rating: 5, stock: 10, unlimited_stock: 0, description: "sumatra", seller_status:1 },
    { seller_name: "Empty", price: 8000, rating: 5, stock: 0, unlimited_stock: 0, description: "sumatra", seller_status:1 }
  ];
  const config = { minRating: 4, minReviews:0, priceCap: 0, weights: { price: 40, connection: 30, sla: 20, stock: 10 } };
  const result = rank(product, rows, [{ seller_name: "Blocked", mode: "blocked" }], null, config, { patterns: ["sumatra"] });
  assert.equal(result[0].seller_name, "Trusted");
  assert.equal(result.filter(x => x.eligible).length, 1);
  assert.ok(result.find(x => x.seller_name === "Costly").reasons.includes("Harga di atas batas"));
});

test("settings validate opt-in live switching and ignore removed global Max Price keys", () => {
  const current = { autoSwitch: false, dryRun: true };
  const next=validateSettings({ autoSwitch: true, dryRun: false, maxPriceOffset:1000, autoFillMaxPrice:true, preserveMaxPrice:false, priceCap:9999 }, current);
  assert.deepEqual([next.autoSwitch,next.dryRun],[true,false]);
  assert.equal("maxPriceOffset" in next,false);
  assert.equal("autoFillMaxPrice" in next,false);
  assert.equal("preserveMaxPrice" in next,false);
  assert.equal("priceCap" in next,false);
});

test("seller selection requires known rating, review count, and active status", () => {
  const config={minRating:4,minReviews:20,priceCap:11000,weights:{price:40,connection:30,sla:20,stock:10}};
  const rows=[
    {seller_name:"Unknown",price:9000,rating:null,review_count:null,stock:5,seller_status:1},
    {seller_name:"Inactive",price:9000,rating:4.9,review_count:"40+",stock:5,seller_status:0},
    {seller_name:"Ten",price:9000,rating:4.9,review_count:"<10",stock:5,seller_status:1},
    {seller_name:"Trusted",price:9500,rating:4.9,review_count:"40+",stock:5,seller_status:1}
  ];
  const result=rank({max_price:10000},rows,[],null,config,null);
  assert.deepEqual(result.filter(x=>x.eligible).map(x=>x.seller_name),["Trusted"]);
});

test("catalog normalization handles official buyer SKU fields", () => {
  const p = normalizeProduct({ buyer_sku_code: "ML86", product_name: "86 Diamond", seller_name: "Seller A", price: 19000, buyer_product_status: true, seller_product_status: false });
  assert.equal(p.sku, "ML86");
  assert.equal(p.seller_active, 0);
  assert.equal(p.price, 19000);
});

test("switch saves exact Digiflazz seller fields and preserves unrelated product data", () => {
  const current={id:7,code:"ML86",note:"keep",max_price:19000,seller_sku_id:"old"};
  const candidate={id:"sku42",id_int:42,seller:"Shop",connectionType:"jabber",seller_sku_code:"ML86S",deskripsi:"Diamond",price:17000,stock:4,unlimited_stock:0,seller_details:{sla:"H+0"},status_sellerSku:1};
  const result=changedProduct(current,candidate);
  assert.equal(result.note,"keep");
  assert.equal(result.seller_sku_id,"sku42");
  assert.equal(result.seller_sku_id_int,42);
  assert.equal(result.max_price,19000);
  assert.equal(result.multi,false);
  assert.equal(current.seller_sku_id,"old");
});

test("per-product Max Price remains authoritative even when current seller is unhealthy",()=>{
  const product={seller_name:"Old",seller_active:0,price:10000,max_price:10100,stock:1,unlimited_stock:0};
  const config={minRating:0,minReviews:0,priceCap:0,priceTolerancePercent:2,weights:{price:40,connection:30,sla:20,stock:10}};
  const rows=[
    {seller_name:"Over Max",seller_id:"over",price:10200,rating:4.8,stock:null,seller_status:1,connection:"IP",sla:"H+0"},
    {seller_name:"Within Max",seller_id:"ok",price:10050,rating:4.8,stock:null,seller_status:1,connection:"IP",sla:"H+0"}
  ];
  const result=rank(product,rows,[],null,config,null);
  assert.equal(result.find(x=>x.seller_id==="over").eligible,false);
  assert.equal(result.find(x=>x.seller_id==="ok").eligible,true);
});


test("seller cutoff uses start-to-end window including midnight crossover",()=>{
  const at=(iso)=>new Date(iso);
  assert.equal(inCutoffWindow("23:45","00:15",at("2026-09-26T16:50:00Z")),true);
  assert.equal(inCutoffWindow("23:45","00:15",at("2026-09-26T11:30:00Z")),false);
  assert.equal(inCutoffWindow("22:30","23:30",at("2026-09-26T16:00:00Z")),true);
  assert.equal(inCutoffWindow("22:30","23:30",at("2026-09-26T11:30:00Z")),false);
  assert.equal(inCutoffWindow("00:00","00:00",at("2026-09-26T11:30:00Z")),false);
});


test("catalog metadata resolves Digiflazz category, brand, and type IDs to names",()=>{
  const metadata={
    categories:new Map([["cat1","Games"]]),
    brands:new Map([["brand1","Mobile Legends"]]),
    types:new Map([["type1","Game"]]),
    categoryName:"Games"
  };
  const p=normalizeProduct({
    code:"ML5",
    product:"Mobile Legends 5 Diamond",
    product_details:{category:{id:"cat1"},brand:{id:"brand1"},type:{id:"type1"}},
    price:1500,status:true,status_sellerSku:1
  },metadata);
  assert.equal(p.category,"Games");
  assert.equal(p.brand,"Mobile Legends");
  assert.equal(p.product_type,"Game");
  assert.notEqual(p.category,"[object Object]");
  assert.notEqual(p.brand,"[object Object]");
});


test("auto-switch priority is rating 4-5, then SLA, then cheapest price", () => {
  const product = { max_price: 0 };
  const rows = [
    { seller_id:"bad-rating", seller_name:"Bad Rating", price:8000, rating:3.99, review_count:"5000", stock:999, unlimited_stock:1, connection:"IP", sla:"H+0", description:"", seller_status:1 },
    { seller_id:"cheap-h1", seller_name:"Cheap H1", price:9000, rating:4.9, review_count:"100", stock:10, unlimited_stock:0, connection:"IP", sla:"SLA H+1, maks komplain H+7", description:"", seller_status:1 },
    { seller_id:"h0-expensive", seller_name:"H0 Expensive", price:11000, rating:4.1, review_count:"100", stock:10, unlimited_stock:0, connection:"api", sla:"SLA H+0, maks komplain H+7", description:"", seller_status:1 },
    { seller_id:"h0-cheapest", seller_name:"H0 Cheapest", price:10000, rating:4.0, review_count:"100", stock:10, unlimited_stock:0, connection:"unknown", sla:"Max penyelesaian komplain H+0, max penerimaan komplain H+7", description:"", seller_status:1 }
  ];
  const config = { minRating:0, minReviews:0, priceCap:0, weights:{price:0,connection:100,sla:0,stock:0} };
  const result = rank(product, rows, [], null, config, null);
  assert.equal(result.find(x=>x.seller_id==="bad-rating").eligible,false);
  assert.equal(result[0].seller_id,"h0-cheapest");
  assert.equal(result[0].sla_days,0);
  assert.equal(result[1].seller_id,"h0-expensive");
  assert.equal(result[2].seller_id,"cheap-h1");
});

test("SLA parser prefers resolution SLA and ignores complaint acceptance horizon",()=>{
  assert.equal(slaDays("SLA H+0, maks penerimaan komplain H+7"),0);
  assert.equal(slaDays("Max penyelesaian komplain H+1, Max terima komplen H+7"),1);
  assert.equal(slaDays("SLA H+2, maks penerimaan komplain H+7"),2);
});


test("unknown SLA is a last-resort fallback after any known SLA",()=>{
  const product={max_price:0};
  const rows=[
    {seller_id:"unknown-cheap",seller_name:"Unknown Cheap",price:7000,rating:5,review_count:"100",stock:10,unlimited_stock:0,sla:"",seller_status:1},
    {seller_id:"known-h2",seller_name:"Known H2",price:9000,rating:4.2,review_count:"100",stock:10,unlimited_stock:0,sla:"SLA H+2, maks komplain H+7",seller_status:1}
  ];
  const config={minRating:4,minReviews:0,priceCap:0,weights:{price:40,connection:30,sla:20,stock:10}};
  const result=rank(product,rows,[],null,config,null);
  assert.equal(result[0].seller_id,"known-h2");
  assert.equal(result[0].sla_days,2);
  assert.equal(result[1].sla_days,999);
});

test("when all eligible sellers have unknown SLA, choose the cheapest",()=>{
  const product={max_price:0};
  const rows=[
    {seller_id:"u2",seller_name:"Unknown 2",price:9000,rating:4.5,review_count:"100",stock:10,unlimited_stock:0,sla:"maks penerimaan komplain H+7",seller_status:1},
    {seller_id:"u1",seller_name:"Unknown 1",price:8000,rating:4.1,review_count:"100",stock:10,unlimited_stock:0,sla:"",seller_status:1}
  ];
  const config={minRating:4,minReviews:0,priceCap:0,weights:{price:40,connection:30,sla:20,stock:10}};
  const result=rank(product,rows,[],null,config,null);
  assert.equal(result[0].seller_id,"u1");
  assert.equal(result[0].sla_days,999);
});


test("cron separates full scan from live auto-switch and reuses refreshed seller selection",()=>{
  assert.match(source,/if\(cfg\.scanEnabled && age>=scanCadence\)\s*\{\s*await scan\(env,"cron"\);\s*return;/);
  assert.match(source,/switchSeller\(env,sku,best\.seller_id,"auto",selection\)/);
  assert.match(source,/preparedSelection \|\| await rankedOptions\(env,sku\)/);
});

test("Digiflazz seller-directory 403 is backed off instead of treated as a dead session",()=>{
  assert.match(source,/seller_directory_retry_after/);
  assert.match(source,/Endpoint direktori seller Digiflazz ditolak HTTP 403/);
  assert.match(source,/Sesi belum tentu kedaluwarsa/);
});


test("buyer SKU validation accepts practical codes and rejects unsafe values",()=>{
  assert.equal(validBuyerSku("ML5"),true);
  assert.equal(validBuyerSku("ff100.id"),true);
  assert.equal(validBuyerSku("ABC_DEF-1"),true);
  assert.equal(validBuyerSku("ML 5"),false);
  assert.equal(validBuyerSku(""),false);
});

test("direct product controls write to Digiflazz fields and verify destructive actions",()=>{
  assert.match(source,/remoteSave\(env,\{\.\.\.current,code:newSku,change:true\}\)/);
  assert.match(source,/remoteSave\(env,\{\.\.\.current,status:active,change:true\}\)/);
  assert.match(source,/\/api\/v1\/buyer\/product\/delete\//);
  assert.match(source,/const verified=await findProductBySku\(env,newSku\)/);
  assert.match(source,/const after=await findProductBySku\(env,sku\)/);
});

test("product control routes expose SKU status and delete actions",()=>{
  assert.ok(source.includes("const skuEdit=path.match"));
  assert.ok(source.includes("const statusEdit=path.match"));
  assert.ok(source.includes("const productDelete=path.match"));
  assert.match(source,/method==="DELETE"&&productDelete/);
});


test("2 percent price tolerance prefers better rating and reviews over a tiny price difference",()=>{
  const product={max_price:0};
  const rows=[
    {seller_id:"h0",seller_name:"H0",price:1432,rating:4.75,review_count:"10+",stock:10,unlimited_stock:0,sla:"H+0",seller_status:1},
    {seller_id:"ga",seller_name:"GA",price:1437,rating:5,review_count:"10+",stock:10,unlimited_stock:0,sla:"H+0",seller_status:1},
    {seller_id:"ne",seller_name:"NE",price:1445,rating:5,review_count:"<10",stock:10,unlimited_stock:0,sla:"H+0",seller_status:1},
    {seller_id:"outside",seller_name:"Outside",price:1465,rating:5,review_count:"5000+",stock:10,unlimited_stock:0,sla:"H+0",seller_status:1}
  ];
  const result=rank(product,rows,[],null,{minRating:4,minReviews:0,priceCap:0,priceTolerancePercent:2},null);
  assert.equal(result[0].seller_id,"ga");
  assert.equal(result[0].within_price_tolerance,true);
  assert.equal(result[0].reference_price,1432);
  assert.equal(result.find(x=>x.seller_id==="outside").within_price_tolerance,false);
});

test("SLA remains higher priority than the 2 percent price band",()=>{
  const product={max_price:0};
  const rows=[
    {seller_id:"h1-perfect",seller_name:"H1 Perfect",price:9000,rating:5,review_count:"5000+",stock:10,unlimited_stock:0,sla:"H+1",seller_status:1},
    {seller_id:"h0-good",seller_name:"H0 Good",price:10000,rating:4.1,review_count:"10+",stock:10,unlimited_stock:0,sla:"H+0",seller_status:1}
  ];
  const result=rank(product,rows,[],null,{minRating:4,minReviews:0,priceCap:0,priceTolerancePercent:2},null);
  assert.equal(result[0].seller_id,"h0-good");
});

test("review tie-break interprets approximate counts without bypassing eligibility safety",()=>{
  assert.equal(reviewValue("30+"),30);
  assert.equal(reviewValue("10+"),10);
  assert.equal(reviewValue("<10"),9);
  assert.equal(reviewValue(""),0);
  const rows=[
    {seller_id:"few",seller_name:"Few",price:10000,rating:5,review_count:"<10",stock:10,unlimited_stock:0,sla:"H+0",seller_status:1},
    {seller_id:"enough",seller_name:"Enough",price:10010,rating:5,review_count:"20+",stock:10,unlimited_stock:0,sla:"H+0",seller_status:1}
  ];
  const result=rank({max_price:0},rows,[],null,{minRating:4,minReviews:10,priceCap:0,priceTolerancePercent:2},null);
  assert.equal(result.find(x=>x.seller_id==="few").eligible,false);
  assert.equal(result[0].seller_id,"enough");
});

test("price tolerance setting validates and defaults to configurable 2 percent",()=>{
  const current={priceTolerancePercent:2};
  assert.equal(validateSettings({priceTolerancePercent:2},current).priceTolerancePercent,2);
  assert.equal(validateSettings({priceTolerancePercent:50},current).priceTolerancePercent,20);
  assert.match(source,/priceTolerancePercent:\s*2/);
});

test("attention reasons cover hard issues and only flag slow SLA when a faster eligible candidate exists",()=>{
  const row={
    active:1,seller_name:"Current",seller_active:0,price:12000,max_price:11000,stock:0,unlimited_stock:0,
    start_cut_off:"23:00",end_cut_off:"23:59",option_count:2,current_option_seller_id:"x",
    current_rating:3.9,current_sla:"SLA H+1",operation_status:"unknown"
  };
  const current={seller_id:"x",rating:3.9,review_value:10,price:12000,sla_days:1,eligible:false};
  const best={seller_id:"y",rating:4.8,review_value:30,price:10000,sla_days:0,eligible:true};
  const reasons=attentionReasons(row,{minRating:4},new Date("2026-09-27T16:30:00Z"),{current,best});
  assert.ok(reasons.includes("Seller OFF"));
  assert.ok(reasons.includes("Harga di atas max price"));
  assert.ok(reasons.includes("Stok habis"));
  assert.ok(reasons.includes("Sedang cut-off"));
  assert.ok(reasons.includes("Rating < 4"));
  assert.ok(reasons.includes("SLA H+1 · kandidat H+0 tersedia"));
  assert.ok(reasons.includes("Hasil operasi belum pasti"));
});

test("slow SLA alone is not attention when no faster eligible seller exists",()=>{
  const row={active:1,seller_name:"Current",seller_active:1,price:10000,max_price:12000,stock:10,unlimited_stock:0,option_count:2,current_option_seller_id:"x",current_rating:4.8,current_sla:"SLA H+1"};
  const current={seller_id:"x",rating:4.8,review_value:30,price:10000,sla_days:1,eligible:true};
  const best={...current};
  const reasons=attentionReasons(row,{minRating:4},new Date(),{current,best});
  assert.equal(reasons.some(x=>x.startsWith("SLA H+1")),false);
});

test("inactive products are not treated as operational attention unless an operation is unresolved",()=>{
  assert.deepEqual(attentionReasons({active:0,operation_status:null},{minRating:4}),[]);
  assert.deepEqual(attentionReasons({active:0,operation_status:"pending"},{minRating:4}),["Operasi masih pending"]);
});

test("overview product filter and auto-switch share the materialized attention source",()=>{
  assert.match(source,/async function attentionSummary/);
  assert.match(source,/FROM product_attention a\s+JOIN products p ON p\.sku=a\.sku/);
  assert.match(source,/status==="issues"\)where\+=" AND a\.dirty=0 AND a\.needs_attention=1"/);
  assert.doesNotMatch(source,/const attention=await loadAttentionRows\(env,cfg,"WHERE p\.active=1"\)/);
});


test("soft SLA attention cannot force a worse seller switch",()=>{
  assert.match(source,/const hardIssue=target\.attention_reasons\.some/);
  assert.match(source,/Seller saat ini masih kandidat terbaik; tidak dipindahkan/);
  assert.match(source,/const best=top&&String\(top\.seller_id\)!==currentId/);
});

test("attention option coverage uses one grouped count instead of a per-product correlated scan",()=>{
  assert.match(source,/LEFT JOIN \(SELECT sku,count\(\*\) AS option_count FROM seller_options GROUP BY sku\) option_counts/);
  assert.doesNotMatch(source,/SELECT count\(\*\) FROM seller_options all_options WHERE all_options\.sku=p\.sku/);
});


test("attention quality refresh batch is configurable and bounded",()=>{
  const current={attentionRefreshBatchSize:5};
  assert.equal(validateSettings({attentionRefreshBatchSize:7},current).attentionRefreshBatchSize,7);
  assert.equal(validateSettings({attentionRefreshBatchSize:99},current).attentionRefreshBatchSize,10);
  assert.match(source,/attentionRefreshBatchSize:\s*5/);
});

test("full scans rotate rating SLA coverage and update only materialized cache batches",()=>{
  assert.match(source,/async function refreshAttentionCoverage/);
  assert.match(source,/ORDER BY CASE WHEN max\(o\.last_seen\) IS NULL THEN 0 ELSE 1 END ASC/);
  assert.match(source,/COALESCE\(max\(o\.last_seen\),q\.last_attempt,'1970-01-01 00:00:00'\) ASC/);
  assert.match(source,/const qualityRefresh=await refreshAttentionCoverage\(env,cfg\.attentionRefreshBatchSize,deadlineMs\)/);
  assert.match(source,/const cacheRefresh=await refreshAttentionCache\(env,cfg,null,100\)/);
  assert.match(source,/attentionSummary\(env,cfg\)/);
});


test("product nominal parser handles game amounts and Indonesian thousand separators",()=>{
  assert.equal(parseNominalToken("5"),5);
  assert.equal(parseNominalToken("1.000.000"),1000000);
  assert.equal(parseNominalToken("10.000"),10000);
  assert.equal(productNominalValue({name:"Free Fire 5 Diamond",brand:"FREE FIRE",sku:"ff5"}),5);
  assert.equal(productNominalValue({name:"PLN 1.000.000",brand:"PLN",sku:"pln1000"}),1000000);
});

test("product list sorts by brand then nominal instead of seller price",()=>{
  const rows=[
    {name:"Free Fire 100 Diamond",brand:"FREE FIRE",sku:"ff100",price:9000},
    {name:"Free Fire 5 Diamond",brand:"FREE FIRE",sku:"ff5",price:50000},
    {name:"Free Fire 20 Diamond",brand:"FREE FIRE",sku:"ff20",price:1000},
    {name:"Axis 10.000",brand:"AXIS",sku:"ax10",price:100},
    {name:"Axis 5.000",brand:"AXIS",sku:"ax5",price:99999}
  ];
  const sorted=[...rows].sort(productSortCompare);
  assert.deepEqual(sorted.map(x=>x.sku),["ax5","ax10","ff5","ff20","ff100"]);
});

test("same-SLA better quality within ranked rules becomes actionable attention",()=>{
  const row={active:1,seller_name:"Current",seller_active:1,price:1432,max_price:1500,stock:10,unlimited_stock:0,option_count:2,current_option_seller_id:"x",current_rating:4.75,current_sla:"H+0"};
  const current={seller_id:"x",rating:4.75,review_value:10,price:1432,sla_days:0,eligible:true};
  const best={seller_id:"y",rating:5,review_value:10,price:1437,sla_days:0,eligible:true};
  const reasons=attentionReasons(row,{minRating:4},new Date(),{current,best});
  assert.ok(reasons.includes("Rating lebih baik tersedia (5)"));
});

test("product-specific rule wins over broader specific rule for attention ranking",()=>{
  const product={sku:"ml5",product_type:"Umum",brand:"MOBILE LEGENDS",category:"Games"};
  const rules=[
    {id:2,is_active:1,scope_type:"brand",scope_value:"MOBILE LEGENDS",min_rating:4.5},
    {id:3,is_active:1,scope_type:"product",scope_value:"ml5",min_rating:4.8}
  ];
  assert.equal(matchingRuleForProduct(product,rules).id,3);
});

test("product API paginates in SQL by brand and nominal and supports active inactive filters",()=>{
  assert.match(source,/ORDER BY p\.brand COLLATE NOCASE ASC/);
  assert.match(source,/p\.nominal_value ASC/);
  assert.match(source,/LIMIT 50 OFFSET \?/);
  assert.match(source,/status==="active"/);
  assert.match(source,/status==="inactive"/);
  assert.doesNotMatch(source,/filtered=\[\.\.\.filtered\]\.sort\(productSortCompare\)/);
});


test("attention queries chunk large SKU lists below D1 SQL variable limits",()=>{
  assert.match(source,/for\(let i=0;i<skus\.length;i\+=75\)chunks\.push\(skus\.slice\(i,i\+75\)\)/);
  assert.match(source,/const batch=await env\.DB\.batch\(/);
  assert.doesNotMatch(source,/const placeholders=skus\.map\(\(\)=>"\?"\)\.join\(","\)/);
});


test("materialized attention cache avoids full seller fanout on overview",()=>{
  assert.match(source,/CREATE|product_attention/);
  assert.match(source,/async function persistAttentionRows/);
  assert.match(source,/async function markAttentionDirty/);
  assert.match(source,/async function refreshAttentionCache/);
  assert.match(source,/async function attentionSummary/);
  assert.match(source,/conn\(env\),attentionSummary\(env,cfg\)/);
});

test("auto-switch reads only fresh actionable cached attention targets",()=>{
  assert.match(source,/WHERE a\.dirty=0 AND a\.needs_attention=1 AND p\.active=1/);
  assert.match(source,/a\.best_candidate_seller IS NOT NULL/);
  assert.match(source,/COALESCE\(op\.status,''\) NOT IN \('pending','unknown'\)/);
  assert.match(source,/NOT EXISTS \(\s*SELECT 1 FROM switch_history sh/);
  assert.match(source,/sh\.status='success' AND sh\.created_at>\?/);
});

test("rule preference zone and settings changes invalidate materialized attention",()=>{
  assert.ok((source.match(/await markAttentionDirty\(env\);/g)||[]).length>=3);
  assert.match(source,/await markAttentionDirty\(env,\[sku\]\)/);
  assert.match(source,/await markAttentionDirty\(env,assigned\.results\.map\(x=>x\.sku\)\)/);
});

test("product mutations dirty or remove the corresponding attention cache",()=>{
  assert.match(source,/DELETE FROM product_attention WHERE sku=\?/);
  assert.match(source,/INSERT OR REPLACE INTO product_attention\(sku,dirty,updated_at\)/);
  assert.match(source,/await markAttentionDirty\(env,\[sku\]\)/);
});

test("cron drains dirty materialized attention incrementally",()=>{
  assert.match(source,/await refreshAttentionCache\(env,cfg,null,100\)/);
});


test("all D1 SKU IN-list batches stay at or below the verified 75-bind boundary",()=>{
  assert.match(source,/for \(let i=0;i<products\.length;i\+=75\) \{\s*ensureScanBudget\(deadlineMs\);\s*const chunk = products\.slice\(i,i\+75\)/);
  assert.match(source,/for\(let i=0;i<stale\.results\.length;i\+=75\) \{\s*const skus=stale\.results\.slice\(i,i\+75\)/);
  assert.doesNotMatch(source,/products\.length;i\+=100/);
  assert.doesNotMatch(source,/stale\.results\.length;i\+=80/);
});


test("seller switching never recalculates per-product Max Price",()=>{
  assert.match(source,/changedProduct\(current,choice\)/);
  assert.doesNotMatch(source,/config\.autoFillMaxPrice/);
  assert.doesNotMatch(source,/config\.maxPriceOffset/);
  const current={max_price:25000,seller_sku_id:"old"};
  const candidate={id:"new",seller:"Seller",price:15000};
  assert.equal(changedProduct(current,candidate).max_price,25000);
});

test("product detail has no global Max Price policy and lock keeps manual semantics",()=>{
  assert.doesNotMatch(source,/maxPricePolicy:/);
  assert.match(source,/str\(body\.reason\)\|\|"manual"/);
  assert.match(source,/automation-lock/);
});


test("auto-switch refreshes attention cache immediately after a successful switch",()=>{
  assert.match(source,/results\.push\(\{sku,status:"switched",seller:changed\.seller,price:changed\.price\}\);\s*await refreshAttentionCache\(env,cfg,\[sku\],1\)/);
});

test("auto-switch no-candidate path does not dirty unchanged attention cache",()=>{
  const block=source.slice(source.indexOf('if\(!best\) {'),source.indexOf('const changed=await switchSeller',source.indexOf('if\(!best\) {')));
  assert.doesNotMatch(block,/markAttentionDirty/);
});


test("removed global Max Price settings are absent from defaults",()=>{
  const defaultsBlock=source.slice(source.indexOf("const DEFAULTS"),source.indexOf("const secureHeaders"));
  assert.doesNotMatch(defaultsBlock,/maxPriceOffset|autoFillMaxPrice|preserveMaxPrice/);
});


test("missing product Max Price is flagged and excluded from Auto Switch targets",()=>{
  const reasons=attentionReasons({active:1,seller_name:"Current",seller_active:1,price:10000,max_price:0,stock:10,unlimited_stock:0,option_count:0},{minRating:4},new Date());
  assert.ok(reasons.includes("Max Price belum diisi"));
  assert.match(source,/AND p\.max_price>0/);
  assert.match(source,/Harga\|Max Price/);
});


test("overview counts missing per-product Max Price",()=>{
  assert.match(source,/sum\(CASE WHEN p\.max_price<=0 THEN 1 ELSE 0 END\) missingMaxPrice/);
  assert.match(source,/missingMaxPrice:Number\(summary\?\.missingMaxPrice\)\|\|0/);
});

test("product API exposes missing Max Price filter",()=>{
  assert.match(source,/status==="missing-max"\)where\+=" AND p\.max_price<=0"/);
});

test("cooldown is skipped instead of counted as failure",()=>{
  assert.match(source,/let switched=0,noCandidate=0,skipped=0,failed=0/);
  assert.match(source,/error\?\.message==="Produk masih dalam masa jeda perpindahan\."/);
  assert.match(source,/status:"skipped",reason:"cooldown"/);
  assert.match(source,/summary\.skipped/);
  assert.match(source,/dilewati/);
});


test("rank uses only product Max Price as price ceiling",()=>{
  const product={max_price:10000};
  const rows=[
    {seller_name:"Within",seller_id:"a",price:9900,rating:4.8,stock:1,seller_status:1,sla:"H+0"},
    {seller_name:"Over",seller_id:"b",price:10001,rating:5,stock:1,seller_status:1,sla:"H+0"}
  ];
  const result=rank(product,rows,[],{max_price:5000,min_rating:4},{minRating:4,minReviews:0,priceCap:1,priceTolerancePercent:2},null);
  assert.equal(result.find(x=>x.seller_id==="a").eligible,true);
  assert.equal(result.find(x=>x.seller_id==="b").eligible,false);
});

test("rule API only allows specific rating overrides and fixes stock cutoff safety on",()=>{
  assert.match(source,/async function canonicalRuleTarget/);
  assert.match(source,/Target aturan tidak ditemukan di katalog aktif/);
  assert.match(source,/\["category","brand","type","product"\]\.includes\(scope\)/);
  assert.doesNotMatch(source,/\["global","category","brand","type","product"\]/);
  assert.match(source,/require_stock=1,avoid_cutoff=1/);
  assert.match(source,/VALUES\(\?,\?,\?,NULL,1,1\)/);
  assert.match(source,/max_price=NULL/);
  assert.match(source,/SELECT DISTINCT brand value FROM products/);
  assert.doesNotMatch(source,/rule\?\.max_price, product\.max_price/);
});

test("zone API no longer requires Product ID and validates assignments",()=>{
  assert.match(source,/INSERT INTO zones\(name,product_id,patterns\) VALUES\(\?,'',\?\)/);
  assert.match(source,/SKU tidak ditemukan di katalog/);
  assert.match(source,/Zona tidak ditemukan/);
  assert.match(source,/assignment_count/);
});

test("backend defaults no longer contain a global seller price cap",()=>{
  const defaultsBlock=source.slice(source.indexOf("const DEFAULTS"),source.indexOf("const secureHeaders"));
  assert.doesNotMatch(defaultsBlock,/priceCap/);
});


test("event API filters level kind SKU and message server-side",()=>{
  assert.match(source,/url\.searchParams\.get\("level"\)/);
  assert.match(source,/AND level=\?/);
  assert.match(source,/AND kind=\?/);
  assert.match(source,/AND sku LIKE \?/);
  assert.match(source,/AND message LIKE \?/);
  assert.match(source,/SELECT DISTINCT kind FROM events/);
});

test("history API filters seller switches by SKU status and reason",()=>{
  assert.match(source,/url\.searchParams\.get\("reason"\)/);
  assert.match(source,/switchWhere\+=" AND buyer_sku_code LIKE \?"/);
  assert.match(source,/switchWhere\+=" AND status=\?"/);
  assert.match(source,/switchWhere\+=" AND reason=\?"/);
  assert.match(source,/reason,status,created_at FROM switch_history/);
});


test("definitive Digiflazz 4xx rejection is recorded as error, not unknown",()=>{
  assert.match(source,/error\.definitive=res\.status>=400&&res\.status<500/);
  assert.match(source,/const status=error\?\.definitive===true\?"error":sent\?"unknown":"error"/);
  assert.match(source,/Penolakan terkonfirmasi/);
});

test("auto switch temporarily excludes a recently rejected seller target",()=>{
  assert.match(source,/status='error' AND started_at > datetime\('now','-24 hours'\)/);
  assert.match(source,/eligibleOptions=selection\.options\.filter/);
  assert.match(source,/eligibleOptions=selection\.options\.filter/);
  assert.ok(source.includes("String(o.seller_id)!==rejectedId"));
});

test("remote save surfaces a bounded Digiflazz rejection detail",()=>{
  assert.match(source,/detail\.slice\(0,160\)/);
  assert.match(source,/Digiflazz menolak perubahan produk \(HTTP /);
});


test("deprecated price-only monitoring settings are removed from production defaults",()=>{
  const defaultsBlock=source.slice(source.indexOf("const DEFAULTS"),source.indexOf("const secureHeaders"));
  for(const key of ["proactiveScan","minSavingsPercent","reoptimizeHours","weights"]) assert.equal(defaultsBlock.includes(key),false);
});

test("settings validation exposes real batch and cooldown controls",()=>{
  const current={cooldownHours:24,autoSwitchBatchSize:5,scanIntervalMinutes:5,minRating:4,minReviews:0,attentionRefreshBatchSize:5,priceTolerancePercent:2,saveMode:"manual",scanEnabled:true,dryRun:false,autoSwitch:true};
  const next=validateSettings({cooldownHours:12,autoSwitchBatchSize:7,proactiveScan:true,minSavingsPercent:50,reoptimizeHours:4,weights:{price:100}},current);
  assert.equal(next.cooldownHours,12);
  assert.equal(next.autoSwitchBatchSize,7);
  assert.equal("proactiveScan" in next,false);
  assert.equal("minSavingsPercent" in next,false);
  assert.equal("reoptimizeHours" in next,false);
  assert.equal("weights" in next,false);
});

test("scheduled worker no longer runs the redundant price-only proactive monitor",()=>{
  assert.doesNotMatch(source,/if\(cfg\.proactiveScan\)/);
  assert.doesNotMatch(source,/better_seller_available/);
});


test("connection replacement is validated before encrypted session overwrite",()=>{
  const connectionBlock=source.slice(source.indexOf('if (method==="POST" && path==="/api/connection")'),source.indexOf('if (method==="POST" && path==="/api/connection/test")'));
  assert.match(connectionBlock,/await fetch\(target/);
  assert.match(connectionBlock,/cURL tidak disimpan karena sesi Digiflazz gagal diuji/);
  assert.match(connectionBlock,/last_test_status,last_test_at/);
  assert.ok(connectionBlock.indexOf("await fetch(target") < connectionBlock.indexOf("await seal(data"));
});

test("browser helper config is authenticated and mirrors production seller policy",()=>{
  assert.match(source,/path==="\/api\/browser-config"/);
  assert.match(source,/minRating:cfg\.minRating/);
  assert.match(source,/minReviews:cfg\.minReviews/);
  assert.match(source,/priceTolerancePercent:cfg\.priceTolerancePercent/);
  assert.doesNotMatch(source,/mode==="preferred"/);
  assert.match(source,/mode==="blocked"/);
});

test("manual API discovery and one-off service-code API are removed",()=>{
  assert.doesNotMatch(source,/path==="\/api\/discover"/);
  assert.doesNotMatch(source,/\/api\/service-code/);
  assert.doesNotMatch(source,/async function discover\(/);
  assert.doesNotMatch(source,/function serviceCode\(/);
  assert.doesNotMatch(source,/api_discovery/);
});

test("disconnecting a Digiflazz session is explicit and logged",()=>{
  assert.match(source,/method==="DELETE" && path==="\/api\/connection"/);
  assert.match(source,/Sesi Digiflazz diputus dari tools/);
});


test("attention materialization excludes a recently rejected seller target",()=>{
  assert.match(source,/op\.target_seller_id AS operation_target_seller_id/);
  assert.match(source,/op\.started_at AS operation_started_at/);
  assert.match(source,/Date\.now\(\)-rejectedAt<24\*3600000/);
  assert.match(source,/const policyOptions=options\.filter\(x=>\(!rejectedId\|\|String\(x\.seller_id\)!==rejectedId\)&&!persistentRejected\.has\(String\(x\.seller_id\)\)\)/);
});

test("materialized best candidate means an actual replacement seller",()=>{
  assert.match(source,/replacement=ranked\.find\(x=>x\.eligible&&String\(x\.seller_id\)!==String\(row\.current_seller_sku_id\)\)/);
  assert.match(source,/best_candidate_seller:replacement\?\.seller_name/);
  assert.match(source,/best_candidate_price:replacement\?\.price/);
});

test("product detail materialization uses the same rejected-target and replacement policy",()=>{
  assert.match(source,/SELECT status,target_seller_id,started_at FROM switch_operations WHERE sku=\?/);
  assert.match(source,/const policyOptions=d\.options\.filter\(x=>\(!rejectedId\|\|String\(x\.seller_id\)!==rejectedId\)&&!persistentMap\.has\(String\(x\.seller_id\)\)\)/);
  assert.match(source,/const replacement=policyOptions\.find\(x=>x\.eligible&&String\(x\.seller_id\)!==currentId\)/);
});


test("overview actionable count shares the Auto Switch queue predicate",()=>{
  assert.match(source,/const ACTIONABLE_ATTENTION_FROM=/);
  assert.match(source,/async function actionableAttentionCount/);
  assert.match(source,/async function actionableAttentionRows/);
  assert.match(source,/autoSwitchReady:autoReady/);
  assert.match(source,/actionableAttentionCount\(env,config\)/);
  assert.match(source,/actionableAttentionRows\(env,cfg,limit\)/);
});

test("product API exposes the same actionable Auto Switch filter",()=>{
  assert.match(source,/status==="actionable"/);
  assert.match(source,/a\.best_candidate_seller IS NOT NULL/);
  assert.match(source,/autoSwitchCooldownCutoff\(cfg\)/);
  assert.match(source,/LEFT JOIN switch_operations op ON op\.sku=p\.sku/);
});


test("seller preference API supports only normal and blocked modes",()=>{
  assert.match(source,/\["blocked","none"\]\.includes\(body\.mode\)/);
  assert.doesNotMatch(source,/\["preferred","blocked","none"\]/);
  assert.match(source,/p\.mode='blocked'/);
});

test("ranking has no hidden manual preferred-seller tie break",()=>{
  const rankBlock=source.slice(source.indexOf("function rank("),source.indexOf("function parseNominalToken("));
  assert.doesNotMatch(rankBlock,/mode==="preferred"|\.preferred/);
  assert.match(rankBlock,/localeCompare\(str\(b\.seller_name\)/);
});


test("full scan passes settings into actionable attention summary",()=>{
  const scanBlock=source.slice(source.indexOf("async function scan("),source.indexOf("function inCutoffWindow("));
  assert.match(scanBlock,/const cfg=await settings\(env\)/);
  assert.match(scanBlock,/attentionSummary\(env,cfg\)/);
  assert.doesNotMatch(scanBlock,/attentionSummary\(env\)(?!,)/);
});


test("seller rules cannot disable stock or cutoff safety",()=>{
  const product={max_price:20000};
  const nowCutoff="00:00";
  const rows=[
    {seller_id:"empty",seller_name:"Empty",price:10000,rating:5,review_count:"100+",stock:0,unlimited_stock:0,seller_status:1,sla:"H+0",start_cut_off:null,end_cut_off:null},
    {seller_id:"healthy",seller_name:"Healthy",price:11000,rating:4.5,review_count:"100+",stock:10,unlimited_stock:0,seller_status:1,sla:"H+0",start_cut_off:null,end_cut_off:null}
  ];
  const ranked=rank(product,rows,[],{min_rating:4,require_stock:0,avoid_cutoff:0},{minRating:4,minReviews:0,priceTolerancePercent:2},null);
  assert.equal(ranked.find(x=>x.seller_id==="empty").eligible,false);
  assert.ok(ranked.find(x=>x.seller_id==="empty").reasons.includes("Stok habis"));
});

test("legacy global seller rules are ignored",()=>{
  const product={sku:"ml5",product_type:"Game",brand:"MOBILE LEGENDS",category:"Games"};
  const rules=[{id:1,is_active:1,scope_type:"global",scope_value:"",min_rating:5}];
  assert.equal(matchingRuleForProduct(product,rules),null);
});


test("seller option refresh replaces stale cached options for a SKU",()=>{
  const block=source.slice(source.indexOf("async function refreshOptions"),source.indexOf("async function refreshAttentionCoverage"));
  assert.match(block,/DELETE FROM seller_options WHERE sku=\?/);
  assert.ok(block.indexOf("DELETE FROM seller_options WHERE sku=?") < block.indexOf("for (let i=0;i<cmds.length"));
});

test("empty seller-option results back off for six hours",()=>{
  const block=source.slice(source.indexOf("async function refreshAttentionCoverage"),source.indexOf("async function rankedOptions"));
  assert.match(block,/LEFT JOIN quality_refresh_state q ON q\.sku=p\.sku/);
  assert.match(block,/q\.next_retry_at IS NULL OR q\.next_retry_at<=CURRENT_TIMESTAMP/);
  assert.match(block,/last_result='empty'/);
  assert.match(block,/datetime\('now','\+6 hours'\)/);
  assert.match(block,/tidak punya kandidat seller; dicoba lagi setelah 6 jam/);
});

test("seller quality refresh errors receive a short retry backoff",()=>{
  const block=source.slice(source.indexOf("async function refreshAttentionCoverage"),source.indexOf("async function rankedOptions"));
  assert.match(block,/last_result='error'/);
  assert.match(block,/datetime\('now','\+30 minutes'\)/);
});

test("empty seller refreshes still invalidate attention for recalculation",()=>{
  const block=source.slice(source.indexOf("async function refreshAttentionCoverage"),source.indexOf("async function rankedOptions"));
  assert.match(block,/refreshedSkus\.push\(row\.sku\)/);
  assert.match(block,/return \{refreshed,empty,failed,deferred,skus:refreshedSkus\}/);
});


test("API keeps only health public and requires Cloudflare Access for every other route",()=>{
  const apiStart=source.indexOf("async function api(req, env, url)");
  const apiEnd=source.indexOf("export {",apiStart);
  const apiBlock=source.slice(apiStart,apiEnd);
  const healthPos=apiBlock.indexOf('path==="/api/health"');
  const authPos=apiBlock.indexOf('if (!await authorize(req,env))');
  const bootstrapPos=apiBlock.indexOf('path==="/api/bootstrap"');
  assert.ok(healthPos>=0);
  assert.ok(authPos>healthPos);
  assert.ok(bootstrapPos>authPos);
  assert.match(apiBlock,/return failure\("Akses pribadi diperlukan\.",401\)/);
});

test("API mutations require same-origin requests after Access authorization",()=>{
  const apiStart=source.indexOf("async function api(req, env, url)");
  const apiEnd=source.indexOf("export {",apiStart);
  const apiBlock=source.slice(apiStart,apiEnd);
  const authPos=apiBlock.indexOf('if (!await authorize(req,env))');
  const originPos=apiBlock.indexOf('req.headers.get("origin")!==url.origin');
  assert.ok(originPos>authPos);
  assert.match(apiBlock,/method!=="GET" && method!=="HEAD"/);
  assert.match(apiBlock,/return failure\("Asal permintaan tidak sah\.",403\)/);
});

test("top-level fetch never serves dashboard HTML before Access authorization",()=>{
  const fetchStart=source.indexOf("export default {");
  const fetchBlock=source.slice(fetchStart);
  assert.match(fetchBlock,/if\(url\.pathname\.startsWith\("\/api\/"\)\) return api\(req,env,url\)/);
  assert.match(fetchBlock,/if\(!await authorize\(req,env\)\) return failure\("Akses pribadi diperlukan\.",401\)/);
  const authPos=fetchBlock.indexOf('if(!await authorize(req,env))');
  const htmlPos=fetchBlock.indexOf("return new Response(HTML");
  assert.ok(authPos>=0&&htmlPos>authPos);
});


test("attention detects replacement blocked only by per-product Max Price",()=>{
  assert.match(source,/function maxPriceBlockedReplacement/);
  assert.match(source,/x\.reasons\.length===1&&x\.reasons\[0\]==="Harga di atas batas"/);
  assert.match(source,/Kandidat lolos aturan tetapi di atas Max Price/);
});

test("attention action state distinguishes actionable cooldown max-price and no-candidate",()=>{
  assert.match(source,/function attentionActionState/);
  assert.match(source,/return "cooldown"/);
  assert.match(source,/return "actionable"/);
  assert.match(source,/return "max-price"/);
  assert.match(source,/return "no-candidate"/);
});

test("overview attention summary exposes operational action-state counts",()=>{
  const block=source.slice(source.indexOf("async function attentionSummary"),source.indexOf("async function refreshOptions"));
  assert.match(block,/attentionStateBreakdown/);
  assert.match(block,/maxPriceBlocked/);
  assert.match(block,/noCandidate/);
  assert.match(block,/cooldown/);
  assert.match(block,/Kandidat lolos aturan tetapi di atas Max Price/);
});

test("product API filters attention by cooldown max-price and no-candidate",()=>{
  const start=source.indexOf('if (method==="GET" && path==="/api/products")');
  assert.ok(start>=0);
  const block=source.slice(start,source.indexOf("const opt=path.match",start));
  assert.match(block,/status==="cooldown"/);
  assert.match(block,/status==="blocked-max"/);
  assert.match(block,/status==="no-candidate"/);
  assert.match(block,/last_success_switch_at/);
  assert.match(block,/attention_state:attentionActionState/);
});

test("product detail uses same attention state and Max Price blocker semantics",()=>{
  const block=source.slice(source.indexOf("const shape=async(d,connectorReady)=>"),source.indexOf("const lock=path.match",source.indexOf("const shape=async(d,connectorReady)=>")));
  assert.match(block,/maxPriceBlockedReplacement/);
  assert.match(block,/last_success_switch_at/);
  assert.match(block,/attentionActionState/);
});


test("scan migration enforces a single running scan",()=>{
  assert.match(scanMigration,/CREATE UNIQUE INDEX IF NOT EXISTS idx_scan_runs_single_running/);
  assert.match(scanMigration,/ON scan_runs\(status\)/);
  assert.match(scanMigration,/WHERE status='running'/);
});

test("scan acquisition skips overlap and expires stale runs after five minutes",()=>{
  const start=source.indexOf("async function acquireScanRun");
  const block=source.slice(start,source.indexOf("const [catalog",start));
  assert.match(block,/started_at < datetime\('now','-5 minutes'\)/);
  assert.match(block,/WHERE status='running' ORDER BY id DESC LIMIT 1/);
  assert.match(block,/reason:"already_running"/);
});

test("full scan fetches catalog categories concurrently under a time budget",()=>{
  const start=source.indexOf("function ensureScanBudget");
  const block=source.slice(start,source.indexOf("function inCutoffWindow(",start));
  assert.match(block,/const deadlineMs=Date\.now\(\)\+90000/);
  assert.match(block,/Promise\.all\(categoryTargets\.map/);
  assert.match(block,/ensureScanBudget\(deadlineMs\)/);
  assert.match(block,/budget waktu aman 90 detik/);
});

test("quality refresh defers work when scan budget is almost exhausted",()=>{
  const block=source.slice(source.indexOf("async function refreshAttentionCoverage"),source.indexOf("async function rankedOptions"));
  assert.match(block,/deadlineMs&&Date\.now\(\)\+22000>=deadlineMs/);
  assert.match(block,/deferred=rows\.results\.length-index/);
  assert.match(block,/ditunda karena budget waktu scan hampir habis/);
});


test("product UI exposes quick attention filters backed by server status filters",()=>{
  for(const status of ["issues","actionable","cooldown","blocked-max","current-issue","no-candidate"]){
    assert.ok(uiSource.includes("quick-status:"+status));
  }
  assert.ok(uiSource.includes('a.startsWith("quick-status:")'));
  assert.ok(uiSource.includes('state.status=a.slice("quick-status:".length)'));
});


test("attention distinguishes a current seller problem from generic no-candidate",()=>{
  const stateBlock=source.slice(source.indexOf("function attentionActionState"),source.indexOf("function attentionReasons"));
  assert.match(source,/function hasCurrentSellerIssue/);
  assert.match(stateBlock,/return "current-seller"/);
  assert.match(stateBlock,/return "max-price"/);
  assert.ok(stateBlock.indexOf('return "current-seller"') < stateBlock.indexOf('return "max-price"'));
  assert.match(stateBlock,/return "no-candidate"/);
  const apiBlock=source.slice(source.indexOf('if (method==="GET" && path==="/api/products")'),source.indexOf("const opt=path.match"));
  assert.match(apiBlock,/status==="current-issue"/);
  assert.match(apiBlock,/CURRENT_SELLER_ISSUE_SQL/);
  assert.ok(uiSource.includes("Masalah seller saat ini"));
  assert.ok(uiSource.includes("Tidak ada kandidat memenuhi syarat"));
});

test("definitive seller rejection backoff lasts 24 hours",()=>{
  assert.match(source,/Date\.now\(\)-rejectedAt<24\*3600000/);
  assert.match(source,/started_at > datetime\('now','-24 hours'\)/);
});


test("seller policy rejection migration persists SKU and seller blocks",()=>{
  assert.match(sellerRejectionMigration,/CREATE TABLE IF NOT EXISTS seller_rejections/);
  assert.match(sellerRejectionMigration,/PRIMARY KEY \(sku,seller_id\)/);
  assert.match(sellerRejectionMigration,/permanent INTEGER NOT NULL DEFAULT 0/);
});

test("persistent account-policy rejection classifier covers KTP and tax verification",()=>{
  assert.match(source,/function isPersistentPolicyRejection/);
  assert.match(source,/administrasi perpajakan/);
  assert.match(source,/mewajibkan buyer/);
  assert.match(source,/error\.policyBlock=error\.definitive&&isPersistentPolicyRejection\(detail\)/);
});

test("policy rejection is stored permanently and excluded from Auto Switch",()=>{
  assert.match(source,/INSERT INTO seller_rejections\(sku,seller_id,seller_name,reason,permanent,retry_after,rejected_at\)/);
  assert.match(source,/permanent=1,retry_after=NULL/);
  assert.match(source,/async function activeSellerRejections/);
  assert.match(source,/persistentIds=new Set\(persistent\.map/);
  assert.match(source,/!persistentIds\.has\(String\(o\.seller_id\)\)/);
});

test("materialized attention and product detail exclude persistent rejected sellers",()=>{
  const attention=source.slice(source.indexOf("async function loadAttentionRows"),source.indexOf("function attentionBreakdown"));
  assert.match(attention,/FROM seller_rejections WHERE sku IN/);
  assert.match(attention,/!persistentRejected\.has\(String\(x\.seller_id\)\)/);
  const start=source.indexOf("const shape=async(d,connectorReady)=>");
  const detail=source.slice(start,source.indexOf("const lock=path.match",start));
  assert.match(detail,/activeSellerRejections\(env,sku\)/);
  assert.match(detail,/auto_block_reason/);
});

test("successful manual retry clears persistent seller rejection",()=>{
  const block=source.slice(source.indexOf("async function switchSeller"),source.indexOf("async function autoSwitchBatch"));
  assert.match(block,/DELETE FROM seller_rejections WHERE sku=\? AND seller_id=\?/);
});

test("24-hour ordinary rejection backoff remains alongside persistent policy blocks",()=>{
  assert.match(source,/started_at > datetime\('now','-24 hours'\)/);
  assert.match(source,/Date\.now\(\)-rejectedAt<24\*3600000/);
});


test("hard seller failures bypass cooldown while optimization changes still wait",()=>{
  const stateBlock=source.slice(source.indexOf("function attentionActionState"),source.indexOf("function attentionReasons"));
  assert.match(source,/function hasEmergencySwitchReason/);
  assert.match(source,/const EMERGENCY_SWITCH_SQL=/);
  assert.match(stateBlock,/!hasEmergencySwitchReason\(reasons\)/);
  const queue=source.slice(source.indexOf("const ACTIONABLE_ATTENTION_FROM"),source.indexOf("async function actionableAttentionCount"));
  assert.match(queue,/EMERGENCY_SWITCH_SQL/);
  assert.match(queue,/OR NOT EXISTS/);
});

test("auto switch runtime bypasses cooldown only for cached hard failures",()=>{
  const block=source.slice(source.indexOf("async function switchSeller"),source.indexOf("async function autoSwitchBatch"));
  assert.match(block,/SELECT reasons_json FROM product_attention WHERE sku=\?/);
  assert.match(block,/emergency=hasEmergencySwitchReason/);
  assert.match(block,/reason==="auto" && !emergency && recent/);
});

test("cooldown UI explains emergency seller failures",()=>{
  assert.ok(uiSource.includes("Cooldown hanya menahan optimasi biasa"));
  assert.ok(uiSource.includes("Seller OFF, stok habis, cut-off"));
});
