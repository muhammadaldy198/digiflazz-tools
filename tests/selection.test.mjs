import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const source = readFileSync(new URL("../src/worker.js", import.meta.url), "utf8").replace("const HTML = __HTML__;", "const HTML = '';");
const { rank, normalizeProduct, validateSettings, changedProduct, serviceCode, inCutoffWindow, slaDays, validBuyerSku, reviewValue, attentionReasons, parseNominalToken, productNominalValue, productSortCompare, matchingRuleForProduct } = await import("data:text/javascript," + encodeURIComponent(source));

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

test("settings validate opt-in live switching", () => {
  const current = { autoSwitch: false, dryRun: true };
  assert.deepEqual([validateSettings({ autoSwitch: true, dryRun: false }, current).autoSwitch,validateSettings({ autoSwitch: true, dryRun: false }, current).dryRun],[true,false]);
  assert.equal(validateSettings({maxPriceOffset:1000},current).maxPriceOffset,1000);
  assert.throws(()=>validateSettings({maxPriceOffset:1000.5},current),/bulat/);
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
  const result=changedProduct(current,candidate,true);
  assert.equal(result.note,"keep");
  assert.equal(result.seller_sku_id,"sku42");
  assert.equal(result.seller_sku_id_int,42);
  assert.equal(result.max_price,19000);
  assert.equal(result.multi,false);
  assert.equal(changedProduct(current,candidate,false).max_price,17000);
  assert.equal(changedProduct(current,candidate,false,1000).max_price,18000);
  assert.equal(current.seller_sku_id,"old");
});

test("service codes are deterministic and use game initials",()=>{
  assert.equal(serviceCode("Mobile Legends","5 Diamond"),"ML5");
  assert.equal(serviceCode("Free Fire","1000DIAMOND"),"FF1000");
  assert.equal(serviceCode("","Free Fire 1000DIAMOND"),"FF1000");
  assert.equal(serviceCode("Mobile Legends","Weekly Pass"),null);
});


test("unhealthy products can choose a replacement above the stale product max price and tolerate unknown optional fields",()=>{
  const product={seller_name:"Old",seller_active:0,price:10000,max_price:10100,stock:1,unlimited_stock:0};
  const config={minRating:0,minReviews:0,priceCap:0,weights:{price:40,connection:30,sla:20,stock:10}};
  const rows=[{seller_name:"Replacement",seller_id:"new",price:10200,rating:4.8,stock:null,seller_status:null,connection:"IP",sla:"H+0"}];
  const result=rank(product,rows,[],null,config,null);
  assert.equal(result[0].eligible,true);
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
  const result = rank(product, rows, [{seller_name:"H0 Expensive",mode:"preferred"}], null, config, null);
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

test("overview product filter and auto-switch share the unified attention source",()=>{
  assert.match(source,/async function loadAttentionRows/);
  assert.match(source,/const attention=await loadAttentionRows\(env,cfg,"WHERE p\.active=1"\)/);
  assert.match(source,/if\(status==="issues"\)filtered=filtered\.filter\(x=>x\.needs_attention\)/);
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

test("full scans rotate the oldest rating and SLA coverage without mixing it into auto-switch",()=>{
  assert.match(source,/async function refreshAttentionCoverage/);
  assert.match(source,/ORDER BY CASE WHEN max\(o\.last_seen\) IS NULL THEN 0 ELSE 1 END ASC,max\(o\.last_seen\) ASC/);
  assert.match(source,/const qualityRefresh=await refreshAttentionCoverage\(env,cfg\.attentionRefreshBatchSize\)/);
  assert.match(source,/qualityKnown=attention\.filter/);
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

test("product-specific rule wins over broader rule for attention ranking",()=>{
  const product={sku:"ml5",product_type:"Umum",brand:"MOBILE LEGENDS",category:"Games"};
  const rules=[
    {id:1,is_active:1,scope_type:"global",scope_value:"",min_rating:4},
    {id:2,is_active:1,scope_type:"brand",scope_value:"MOBILE LEGENDS",min_rating:4.5},
    {id:3,is_active:1,scope_type:"product",scope_value:"ml5",min_rating:4.8}
  ];
  assert.equal(matchingRuleForProduct(product,rules).id,3);
});

test("product API sorts before pagination and supports active inactive filters",()=>{
  assert.match(source,/filtered=\[\.\.\.filtered\]\.sort\(productSortCompare\)/);
  assert.match(source,/status==="active"/);
  assert.match(source,/status==="inactive"/);
});


test("attention queries chunk large SKU lists below D1 SQL variable limits",()=>{
  assert.match(source,/for\(let i=0;i<skus\.length;i\+=75\)chunks\.push\(skus\.slice\(i,i\+75\)\)/);
  assert.match(source,/const batch=await env\.DB\.batch\(/);
  assert.doesNotMatch(source,/const placeholders=skus\.map\(\(\)=>"\?"\)\.join\(","\)/);
});
