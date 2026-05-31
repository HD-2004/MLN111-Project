import { readFile } from "node:fs/promises";
import assert from "node:assert/strict";

const [appSource, styleSource] = await Promise.all([
  readFile(new URL("../src/app.js", import.meta.url), "utf8"),
  readFile(new URL("../src/styles.css", import.meta.url), "utf8"),
]);

assert.match(
  appSource,
  /function renderNav\(\)\s*\{[\s\S]*sidebarChapters = data\.chapters\.filter\(\(chapter\) => chapter\.id !== "game"\);[\s\S]*<aside class="progress-nav" aria-label="Điều hướng chương">/,
  "Expected renderNav() to keep the original sidebar structure while hiding the non-sidebar game chapter."
);

assert.match(
  styleSource,
  /\.progress-nav\s*\{[\s\S]*position:\s*fixed;[\s\S]*top:\s*50%;[\s\S]*left:\s*28px;[\s\S]*gap:\s*18px;[\s\S]*transform:\s*translateY\(-50%\);/,
  "Expected .progress-nav to keep its original fixed position and spacing."
);

assert.match(
  styleSource,
  /\.progress-link\s*\{[\s\S]*grid-template-columns:\s*32px 1fr;[\s\S]*gap:\s*8px;[\s\S]*font-size:\s*0\.7rem;[\s\S]*text-transform:\s*uppercase;/,
  "Expected .progress-link to preserve its original number/text layout."
);

assert.match(
  styleSource,
  /\.progress-link strong\s*\{[\s\S]*opacity:\s*0;[\s\S]*transition:\s*opacity 0\.2s ease, color 0\.2s ease;/,
  "Expected nav labels to keep their original hidden-until-active behavior."
);

assert.match(
  styleSource,
  /\.transition-layout\s*\{[\s\S]*width:\s*min\(100%,\s*1048px\);[\s\S]*margin-left:\s*auto;/,
  "Expected the transition layout to stay clear of the left nav lane."
);

assert.match(
  styleSource,
  /@media \(max-width: 980px\)[\s\S]*\.progress-nav\s*\{[\s\S]*display:\s*none;/,
  "Expected the original mobile breakpoint to keep hiding the sidebar nav."
);

console.log("nav-sidebar-restore: structure checks passed");
