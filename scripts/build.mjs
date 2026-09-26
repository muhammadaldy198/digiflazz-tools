import { readFileSync, writeFileSync } from "node:fs";
const worker = readFileSync(new URL("../src/worker.js", import.meta.url), "utf8");
const html = readFileSync(new URL("../src/ui.html", import.meta.url), "utf8");
const marker = "const HTML = __HTML__;";
if (!worker.includes(marker)) throw Error("HTML marker is missing");
writeFileSync(new URL("../src/index.js", import.meta.url), worker.replace(marker, "const HTML = " + JSON.stringify(html) + ";"));
console.log("Built src/index.js (" + html.length + " bytes of UI)");
