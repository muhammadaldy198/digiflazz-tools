import { readFileSync, writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync } from "node:child_process";

const html = readFileSync(new URL("../src/ui.html", import.meta.url), "utf8");
if (html.includes("Perbaiki harga produk sehat")) throw Error("Unused reoptimize control must not be shown");
for (const phrase of ["Batas kandidat seller", "Ini bukan Max Price produk di Digiflazz"]) {
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
