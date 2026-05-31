import { readFile } from "node:fs/promises";
import assert from "node:assert/strict";

const [appSource, styleSource] = await Promise.all([
  readFile(new URL("../src/app.js", import.meta.url), "utf8"),
  readFile(new URL("../src/styles.css", import.meta.url), "utf8"),
]);

assert.match(
  appSource,
  /<div class="theory-layout">/,
  "Expected renderTheory() to include a .theory-layout wrapper."
);

assert.match(
  appSource,
  /<aside class="theory-side-visual reveal"[\s\S]*src="img\/05\.png"/,
  "Expected renderTheory() to include the 05.png left visual block."
);

assert.match(
  appSource,
  /<div class="timeline">/,
  "Expected the timeline markup to remain present."
);

assert.match(
  styleSource,
  /\.theory-layout\s*\{/,
  "Expected styles for .theory-layout."
);

assert.match(
  styleSource,
  /\.theory-side-visual\s*\{/,
  "Expected styles for .theory-side-visual."
);

assert.match(
  styleSource,
  /\.theory-visual-frame\s*\{/,
  "Expected styles for .theory-visual-frame."
);

assert.match(
  styleSource,
  /\.theory-visual-image\s*\{/,
  "Expected styles for .theory-visual-image."
);

assert.match(
  styleSource,
  /@media \(max-width: 980px\)[\s\S]*\.theory-layout\s*\{[\s\S]*grid-template-columns:\s*1fr;/,
  "Expected tablet styles to collapse .theory-layout to one column."
);

assert.match(
  styleSource,
  /@media \(max-width: 980px\)[\s\S]*\.theory-side-visual\s*\{[\s\S]*position:\s*relative;/,
  "Expected tablet styles to release the sticky side visual."
);

assert.match(
  styleSource,
  /@media \(max-width: 640px\)[\s\S]*\.theory-side-visual\s*\{[\s\S]*display:\s*none;/,
  "Expected mobile styles to hide the left visual."
);

console.log("theory-left-visual: structure checks passed");
