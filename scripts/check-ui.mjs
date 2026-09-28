import { readFileSync, writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync } from "node:child_process";

const html = readFileSync(new URL("../src/ui.html", import.meta.url), "utf8");
if (html.includes("Perbaiki harga produk sehat")) throw Error("Unused reoptimize control must not be shown");
for (const forbidden of ["Batas kandidat seller global", "Batas kandidat seller (Rp)", "name=\"priceCap\"", "Product ID Digiflazz", "Pantau kandidat harga lebih baik", "Hemat minimal (%)", "name=\"proactiveScan\"", "name=\"minSavingsPercent\"", "Kode layanan dari nama game", "Temukan jalur API", "/api/service-code", 'value="preferred"', "Seller prioritas", 'value="global"', 'name="require_stock"', 'name="avoid_cutoff"']) {
  if (html.includes(forbidden)) throw Error("Removed control must not be shown: " + forbidden);
}
for (const phrase of ["Batas harga tetap Max Price per produk Digiflazz", "Target diambil langsung dari katalog", "Pasangkan produk ke zona", "Cooldown perpindahan (jam)", "SKU per batch Auto Switch", "Auto Seller Browser", "Uji & simpan sesi", "Putuskan sesi", "Siap Auto Switch", "Menunggu cooldown", "Terhalang Max Price", "Tidak ada kandidat layak", "Stok tersedia dan tidak sedang cut-off selalu wajib"]) {
  if (!html.includes(phrase)) throw Error("Missing UI clarification: " + phrase);
}

const productsBlock = html.slice(html.indexOf("async function products()"), html.indexOf("async function product("));
if (productsBlock.includes('data-action="toggle-product"') || productsBlock.includes('data-action="delete-product"')) {
  throw Error("Product list must keep destructive Digiflazz actions inside Kelola modal");
}
if (!productsBlock.includes('data-action="product"')) throw Error("Product list must expose Kelola action");
if (!html.includes("Kandidat pengganti")) throw Error("Replacement candidate badge missing");
if (html.includes("Pilihan Auto Switch")) throw Error("Stale Auto Switch badge wording must not be shown");

const script = html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
if (!script) throw Error("Inline dashboard script missing");
const dir = mkdtempSync(join(tmpdir(), "digiflazz-ui-"));
try {
  const path = join(dir, "dashboard.js");
  writeFileSync(path, script);
  execFileSync(process.execPath, ["--check", path], { stdio: "inherit" });
} finally { rmSync(dir, { recursive: true, force: true }); }

if (!html.includes('value="cooldown"') || !html.includes('value="blocked-max"') || !html.includes('value="no-candidate"')) {
  throw Error("Attention-state product filters are incomplete");
}
if (!html.includes("Status Auto Switch")) throw Error("Product detail must show Auto Switch attention state");

if (!html.includes("Scan lain masih berjalan")) throw Error("Manual scan must explain single-flight skip");
if (!html.includes("d.skipped")) throw Error("Manual scan must handle already-running response");

for (const phrase of ["Diblokir Auto Switch","Penolakan Digiflazz","manual tetap boleh dicoba"]) {
  if (!html.includes(phrase)) throw Error("Missing persistent seller rejection UI: " + phrase);
}
