import { readFile } from "node:fs/promises";
import assert from "node:assert/strict";

const [introSource, heroSource, gearSource] = await Promise.all([
  readFile(new URL("../src/intro-scene.js", import.meta.url), "utf8"),
  readFile(new URL("../src/hero-3d.js", import.meta.url), "utf8"),
  readFile(new URL("../src/section2-gear.js", import.meta.url), "utf8"),
]);

for (const [name, source] of [
  ["intro scene", introSource],
  ["hero scene", heroSource],
  ["section 2 gear scene", gearSource],
]) {
  assert.doesNotMatch(
    source,
    /preserveDrawingBuffer:\s*true/,
    `Expected ${name} to avoid preserveDrawingBuffer for smoother WebGL rendering.`
  );
}

assert.match(
  heroSource,
  /function isIntroBlocking\(\)[\s\S]*intro-is-open/,
  "Expected hero 3D rendering to pause while the intro overlay is open."
);

assert.match(
  gearSource,
  /function isIntroBlocking\(\)[\s\S]*intro-is-open/,
  "Expected Section 2 gear rendering to pause while the intro overlay is open."
);

assert.match(
  heroSource,
  /const particleCount = 360;/,
  "Expected hero particles to be reduced for smoother page performance."
);

assert.match(
  gearSource,
  /const particleCount = 240;/,
  "Expected Section 2 gear particles to be reduced for smoother page performance."
);

console.log("3d-performance: structure checks passed");
