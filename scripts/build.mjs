import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(".");
const output = resolve(root, "public");

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

const html = await readFile(resolve(root, "index.html"), "utf8");
const productionHtml = html
  .replaceAll("src/styles.css", "assets/styles.css")
  .replaceAll("src/data.js", "assets/data.js")
  .replaceAll("src/app.js", "assets/app.js");

await writeFile(resolve(output, "index.html"), productionHtml);
await cp(resolve(root, "src"), resolve(output, "assets"), { recursive: true });

console.log("Static site built to public/");
