import { readFileSync, writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync } from "node:child_process";

const html = readFileSync(new URL("../src/ui.html", import.meta.url), "utf8");
if (html.includes("Perbaiki harga produk sehat")) throw Error("Unused reoptimize control must not be shown");
for (const forbidden of ["Batas kandidat seller global", "Batas kandidat seller (Rp)", "name=\"priceCap\"", "Product ID Digiflazz", "Pantau kandidat harga lebih baik", "Hemat minimal (%)", "name=\"proactiveScan\"", "name=\"minSavingsPercent\"", "Kode layanan dari nama game", "Temukan jalur API", "/api/service-code"]) {
  if (html.includes(forbidden)) throw Error("Removed control must not be shown: " + forbidden);
}
for (const phrase of ["Max Price per produk Digiflazz adalah satu-satunya batas harga seller", "Target diambil langsung dari katalog", "Pasangkan produk ke zona", "Cooldown perpindahan (jam)", "SKU per batch Auto Switch", "Auto Seller Browser", "Uji & simpan sesi", "Putuskan sesi"]) {
  if (!html.includes(phrase)) throw Error("Missing UI clarification: " + phrase);
}
const script = html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
if (!script) throw Error("Inline dashboard script missing");
const dir = mkdtempSync(join(tmpdir(), "digiflazz-ui-"));
try {
  const path = join(dir, "dashboard.js");
  writeFileSync(path, script);
  execFileSync(process.execPath, ["--check", path], { stdio: "inherit" });
} finally { rmSync(dir, { recursive: true, force: true }); }
