import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const source = readFileSync(new URL("../src/worker.js", import.meta.url), "utf8").replace("const HTML = __HTML__;", "const HTML = '';");
const { rank, normalizeProduct, validateSettings, changedProduct, serviceCode } = await import("data:text/javascript," + encodeURIComponent(source));

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
