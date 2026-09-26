import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";

const source=readFileSync(new URL("../extension/digi-select.user.js",import.meta.url),"utf8");
const module={exports:{}};
runInNewContext(source,{module,setTimeout});
const {chooseSeller,patch,serviceCode,maxPriceForSeller}=module.exports;
const product={id:123,seller_sku_id:"current",max_price:12000};
const candidate=(id,seller,price,rating=4.8,review="40+")=>({id,seller,price,reviewAvg:rating,rating_qty:review,stock:10,unlimited_stock:0,status_sellerSku:1,connectionType:"ip",seller_details:{sla:"H+0"}});

test("picks an eligible seller directly for the selected Digiflazz product",()=>{
  const options=[candidate("current","Existing",8900),candidate("high","High",13000),candidate("low","Low",9900),candidate("bad","Bad",9800,3.0)];
  assert.equal(chooseSeller(options,product,{minRating:4}).id,"low");
});

test("rejects blocked, inactive, unrated, and under reviewed alternatives",()=>{
  const inactive=candidate("inactive","Inactive",8000);inactive.status_sellerSku=0;
  const options=[inactive,candidate("blocked","Blocked",8100),candidate("unrated","Unrated",8200,null),candidate("few","Few",8300,4.8,"<10"),candidate("okay","Okay",9000,4.8,"40+")];
  assert.equal(chooseSeller(options,product,{minRating:4,minReviews:20,blocked:"Blocked"}).id,"okay");
});

test("never selects an expensive or out of stock seller",()=>{
  const empty=candidate("empty","Empty",9000);empty.stock=0;
  assert.equal(chooseSeller([empty,candidate("expensive","Expensive",12500)],product,{minRating:4}),null);
  assert.equal(chooseSeller([candidate("over","Over",11000)],product,{minRating:4,priceCap:10000}),null);
});

test("preferred seller bonus is applied after price and quality checks",()=>{
  const options=[candidate("cheap","Cheap",10000),candidate("preferred","Preferred",10400)];
  assert.equal(chooseSeller(options,product,{minRating:4,preferred:"Preferred"}).id,"preferred");
});

test("codes use game initials and denomination without random characters",()=>{
  assert.equal(serviceCode("Mobile Legends","5 Diamond"),"ML5");
  assert.equal(serviceCode("Free Fire","1000DIAMOND"),"FF1000");
  assert.equal(serviceCode("","Free Fire 1000DIAMOND"),"FF1000");
  assert.equal(serviceCode("Point Blank","1.000 Cash"),"PB1000");
  assert.equal(serviceCode("Mobile Legends","Weekly Pass"),null);
});

test("one global rupiah addition is applied to any seller price",()=>{
  assert.equal(maxPriceForSeller(15000,1000),16000);
  assert.equal(maxPriceForSeller(40000,1000),41000);
  assert.equal(maxPriceForSeller(15000,-1),null);
});

test("hooks Digiflazz Vue choice after loading the selected product's sellers",async()=>{
  const selected=candidate("better","Better",9500);
  let called=null,saved=false;
  const component={sellers:[],fetchingSellers:false,dialogSeller:false,currentEditted:null,
    fetchSellers(row){this.sellers=[selected];this.currentEditted=row;this.dialogSeller=true},
    selectSeller(choice){called=choice;this.currentEditted.seller_sku_id=choice.id;this.dialogSeller=false},
    editProduct(){saved=true}
  };
  assert.equal(patch(component),undefined);
  component.fetchSellers({...product});
  await new Promise(resolve=>setTimeout(resolve,180));
  assert.equal(called?.id,"better");
  assert.equal(saved,false);
  assert.equal(component.autoUpdateMaxPrice,false);
  assert.equal(component.currentEditted.max_price,9500);
});

test("Firefox Android userscript uses forced content-context injection and visible panel",()=>{
  assert.match(source,/\/\/ @inject-into\s+content/);
  assert.match(source,/\/\/ @run-at\s+document-end/);
  assert.match(source,/Auto Seller v1\.4 aktif/);
  assert.match(source,/wrappedJSObject/);
});


test("batch SKU UI replaces one-by-one generator",()=>{
  assert.match(source,/Buat SKU otomatis untuk semua produk/);
  assert.match(source,/Isi semua SKU di halaman/);
  assert.doesNotMatch(source,/id="code-game"/);
  assert.doesNotMatch(source,/id="code-product"/);
});
