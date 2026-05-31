import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(".");
const output = resolve(root, "public");

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

async function writeProductionHtml(fileName) {
  const html = await readFile(resolve(root, fileName), "utf8");
  const productionHtml = html.replaceAll("src/", "assets/");
  await writeFile(resolve(output, fileName), productionHtml);
}

await writeProductionHtml("index.html");
await writeProductionHtml("game.html");
await cp(resolve(root, "src"), resolve(output, "assets"), { recursive: true });
await cp(resolve(root, "img"), resolve(output, "img"), { recursive: true });
await cp(resolve(root, "video"), resolve(output, "video"), { recursive: true });

console.log("Static site built to public/");
