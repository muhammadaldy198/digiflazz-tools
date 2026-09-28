import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";

const source=readFileSync(new URL("../extension/digi-select.user.js",import.meta.url),"utf8");
const module={exports:{}};
runInNewContext(source,{module,setTimeout});
const {chooseSeller,patch,serviceCode,slaDays,reviewValue,inCutoffWindow}=module.exports;
const product={id:123,seller_sku_id:"current",max_price:12000};
const candidate=(id,seller,price,rating=4.8,review="40+",sla="H+0",connectionType="ip")=>({id,seller,price,reviewAvg:rating,rating_qty:review,stock:10,unlimited_stock:0,status_sellerSku:1,connectionType,seller_details:{sla}});

test("keeps the current seller when it is already the best eligible choice",()=>{
  const options=[candidate("current","Existing",8900),candidate("high","High",13000),candidate("low","Low",9900),candidate("bad","Bad",9800,3.0)];
  assert.equal(chooseSeller(options,product,{minRating:4}).id,"current");
});

test("picks a replacement when another eligible seller ranks higher",()=>{
  const options=[candidate("current","Existing",9900,4.1,"40+","H+1"),candidate("better","Better",10000,4.8,"100+","H+0")];
  assert.equal(chooseSeller(options,product,{minRating:4}).id,"better");
});

test("rejects blocked, inactive, unrated, and under reviewed alternatives",()=>{
  const inactive=candidate("inactive","Inactive",8000);inactive.status_sellerSku=0;
  const options=[inactive,candidate("blocked","Blocked",8100),candidate("unrated","Unrated",8200,null),candidate("few","Few",8300,4.8,"<10"),candidate("okay","Okay",9000,4.8,"40+")];
  assert.equal(chooseSeller(options,product,{minRating:4,minReviews:20,blocked:"Blocked"}).id,"okay");
});

test("never selects an expensive or out of stock seller",()=>{
  const empty=candidate("empty","Empty",9000);empty.stock=0;
  assert.equal(chooseSeller([empty,candidate("expensive","Expensive",12500)],product,{minRating:4}),null);
  assert.equal(chooseSeller([candidate("over","Over",12100)],product,{minRating:4}),null);
});

test("browser helper rejects sellers during Digiflazz cutoff windows",()=>{
  const now="2026-09-28T03:30:00Z"; // 10:30 Asia/Jakarta
  assert.equal(inCutoffWindow("10:00","11:00",new Date(now)),true);
  assert.equal(inCutoffWindow("11:00","12:00",new Date(now)),false);
  const cutoff=candidate("cutoff","Cutoff",8000,5,"100+","H+0");
  cutoff.start_cut_off="10:00";cutoff.end_cut_off="11:00";
  const healthy=candidate("healthy","Healthy",9000,4.5,"100+","H+0");
  assert.equal(chooseSeller([cutoff,healthy],{...product,seller_sku_id:"none"},{minRating:4,now}).id,"healthy");
});

test("browser helper accepts seller status when Digiflazz omits status_sellerSku",()=>{
  const option=candidate("nostatus","No Status",9000,4.8,"100+","H+0");
  delete option.status_sellerSku;
  assert.equal(chooseSeller([option],{...product,seller_sku_id:"none"},{minRating:4}).id,"nostatus");
});

test("seller rating tier 4.5-5 is preferred before fallback 4.0-4.49",()=>{
  const options=[
    candidate("bad","Bad",8000,3.99,"1000+","H+0","ip"),
    candidate("cheap-h1","Cheap H1",9000,4.9,"100+","SLA H+1, maks komplain H+7","ip"),
    candidate("h0-expensive","H0 Expensive",11000,4.2,"100+","SLA H+0, maks komplain H+7","api"),
    candidate("h0-cheap","H0 Cheap",10000,4.0,"100+","Max penyelesaian komplain H+0, max penerimaan komplain H+7","unknown")
  ];
  assert.equal(chooseSeller(options,product,{minRating:0}).id,"cheap-h1");
});

test("connection type never outranks SLA or price",()=>{
  const options=[
    candidate("api","API",10000,4.5,"100+","H+0","api"),
    candidate("ip","IP",10010,4.5,"100+","H+0","ip")
  ];
  assert.equal(chooseSeller(options,product,{minRating:4}).id,"api");
});

test("userscript SLA parser uses resolution SLA, not complaint horizon",()=>{
  assert.equal(slaDays("SLA H+0, maks penerimaan komplain H+7"),0);
  assert.equal(slaDays("Max penyelesaian komplen H+1, Max terima komplen H+7"),1);
});

test("codes use game initials and denomination without random characters",()=>{
  assert.equal(serviceCode("Mobile Legends","5 Diamond"),"ML5");
  assert.equal(serviceCode("Free Fire","1000DIAMOND"),"FF1000");
  assert.equal(serviceCode("","Free Fire 1000DIAMOND"),"FF1000");
  assert.equal(serviceCode("Point Blank","1.000 Cash"),"PB1000");
  assert.equal(serviceCode("Mobile Legends","Weekly Pass"),null);
});

test("observes Digiflazz seller dialog without replacing its native button handler",()=>{
  const selected=candidate("better","Better",9500);
  let called=null,saved=false;
  const component={sellers:[],fetchingSellers:false,dialogSeller:false,currentEditted:null,
    fetchSellers(row){this.sellers=[selected];this.currentEditted=row;this.dialogSeller=true},
    selectSeller(choice){called=choice;this.currentEditted.seller_sku_id=choice.id;this.dialogSeller=false},
    editProduct(){saved=true}
  };
  const nativeFetch=component.fetchSellers;
  const row={...product};
  component.fetchSellers(row);
  assert.equal(component.fetchSellers,nativeFetch);
  assert.equal(patch(component),undefined);
  assert.equal(component.fetchSellers,nativeFetch);
  assert.equal(called?.id,"better");
  assert.equal(saved,false);
  assert.equal(component.autoUpdateMaxPrice,false);
  assert.equal(component.currentEditted.max_price,12000);
});

test("Firefox Android userscript uses forced content-context injection and visible panel",()=>{
  assert.match(source,/\/\/ @inject-into\s+content/);
  assert.match(source,/\/\/ @run-at\s+document-end/);
  assert.match(source,/Auto Seller v2\.0\.1 aktif/);
  assert.match(source,/wrappedJSObject/);
});


test("batch SKU UI replaces one-by-one generator",()=>{
  assert.match(source,/Isi SKU otomatis/);
  assert.match(source,/Isi semua SKU di halaman/);
  assert.doesNotMatch(source,/id="code-game"/);
  assert.doesNotMatch(source,/id="code-product"/);
});

test("never monkeypatches fetchSellers",()=>{
  assert.doesNotMatch(source,/vm\.fetchSellers\s*=/);
  assert.doesNotMatch(source,/original\.apply/);
  assert.match(source,/never replace Digiflazz's fetchSellers\/click handler/);
});


test("userscript uses unknown SLA only as a last-resort fallback",()=>{
  const options=[
    candidate("unknown","Unknown",7000,5,"100+","maks penerimaan komplain H+7","api"),
    candidate("known","Known",9000,4.8,"100+","SLA H+2, maks komplain H+7","ip")
  ];
  assert.equal(chooseSeller(options,product,{minRating:4}).id,"known");
});

test("userscript chooses cheapest when every eligible SLA is unknown",()=>{
  const options=[
    candidate("u2","Unknown 2",9000,4.5,"100+","","ip"),
    candidate("u1","Unknown 1",8000,4.6,"100+","maks penerimaan komplain H+7","api")
  ];
  assert.equal(chooseSeller(options,product,{minRating:4}).id,"u1");
});


test("userscript applies the same 2 percent price tolerance ranking",()=>{
  const options=[
    candidate("h0","H0",1432,4.75,"10+","H+0","ip"),
    candidate("ga","GA",1437,5,"10+","H+0","api"),
    candidate("ne","NE",1445,5,"<10","H+0","h2h"),
    candidate("outside","Outside",1465,5,"5000+","H+0","ip")
  ];
  assert.equal(chooseSeller(options,product,{minRating:4,priceTolerancePercent:2}).id,"ga");
});

test("userscript review tie-break understands approximate counts",()=>{
  assert.equal(reviewValue("10+"),10);
  assert.equal(reviewValue("<10"),9);
  assert.equal(reviewValue("30+"),30);
});

test("userscript syncs seller policy from authenticated tools dashboard",()=>{
  assert.match(source,/https:\/\/tools\.lfamiliastore\.my\.id\/\*/);
  assert.match(source,/GM_getValue/);
  assert.match(source,/GM_setValue/);
  assert.match(source,/\/api\/browser-config/);
  assert.match(source,/setInterval\(syncFromTools,15000\)/);
  assert.doesNotMatch(source,/id="rating"/);
  assert.doesNotMatch(source,/id="reviews"/);
  assert.doesNotMatch(source,/id="tolerance"/);
  assert.doesNotMatch(source,/id="preferred"/);
  assert.doesNotMatch(source,/id="blocked"/);
});

test("userscript has no global Max Price controls or calculation",()=>{
  assert.doesNotMatch(source,/autoFillMaxPrice|maxPriceOffset|maxPriceForSeller/);
  assert.doesNotMatch(source,/id="fill"|id="offset"/);
  assert.match(source,/Max Price tidak diubah/);
});


test("userscript uses only per-product Max Price as seller price ceiling",()=>{
  assert.doesNotMatch(source,/priceCap/);
  assert.doesNotMatch(source,/id="cap"/);
  assert.match(source,/const cap=Number\(product\?\.max_price\)>0\?Number\(product\.max_price\):Infinity/);
  assert.match(source,/Batas harga absolut tetap Max Price produk Digiflazz/);
});


test("synced blocked seller list accepts arrays from backend",()=>{
  const options=[
    candidate("blocked","Blocked Seller",8900,5,"100+","H+0"),
    candidate("alpha","Alpha Seller",9000,5,"100+","H+0"),
    candidate("other","Other Seller",9000,5,"100+","H+0")
  ];
  assert.equal(chooseSeller(options,product,{blocked:["Blocked Seller"]}).id,"alpha");
});

test("old local ranking controls are no longer persisted by browser settings",()=>{
  assert.match(source,/const browser=\{enabled:get\("enabled"\)\.checked,saveMode:get\("mode"\)\.value,autoServiceCode:get\("code"\)\.checked\}/);
  assert.match(source,/Aturan seller tetap mengikuti dashboard/);
});


test("userscript syncs preferred sellers without adding a local ranking control",()=>{
  assert.match(source,/preferred:\[\]/);
  assert.match(source,/settings\.preferred/);
  assert.match(source,/cfg\.preferred/);
  assert.doesNotMatch(source,/id="preferred"/);
});

test("userscript applies Seller Prioritas inside the active rating tier",()=>{
  const options=[
    candidate("fallback-priority","Fallback Priority",8000,4.2,"100+","H+0"),
    candidate("high-normal","High Normal",9000,4.9,"100+","H+0"),
    candidate("high-priority","High Priority",10000,4.6,"100+","H+1")
  ];
  assert.equal(chooseSeller(options,product,{minRating:4,preferred:["Fallback Priority","High Priority"],priceTolerancePercent:20}).id,"high-priority");
});

test("userscript falls back to rating 4.0-4.49 when no 4.5+ candidate survives",()=>{
  const over=candidate("high-over","High Over",13000,4.9,"100+","H+0");
  const fallback=candidate("fallback","Fallback",9000,4.2,"100+","H+0");
  assert.equal(chooseSeller([over,fallback],product,{minRating:4}).id,"fallback");
});
