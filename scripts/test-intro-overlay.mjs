import { readFile } from "node:fs/promises";
import assert from "node:assert/strict";

const [indexSource, styleSource, introSource] = await Promise.all([
  readFile(new URL("../index.html", import.meta.url), "utf8"),
  readFile(new URL("../src/styles.css", import.meta.url), "utf8"),
  readFile(new URL("../src/intro-scene.js", import.meta.url), "utf8").catch(() => ""),
]);

assert.match(
  indexSource,
  /<script type="module" src="src\/intro-scene\.js"><\/script>/,
  "Expected index.html to load the intro overlay module."
);

assert.match(
  introSource,
  /const showIntro = true;/,
  "Expected the intro to appear on every refresh during development."
);

assert.match(
  introSource,
  /sessionStorage can be added here later/,
  "Expected a clear comment showing where sessionStorage can be added later."
);

assert.match(
  introSource,
  /aria-label="Enter website"/,
  "Expected the clickable 3D sphere canvas to have an accessible label."
);

assert.match(
  introSource,
  /data-future-core-canvas/,
  "Expected the intro module to expose a dedicated 3D sphere canvas."
);

assert.match(
  introSource,
  /addEventListener\("click", enterWebsite\)/,
  "Expected clicking directly on the 3D sphere canvas to enter the website."
);

assert.match(
  introSource,
  /INITIALIZING FUTURE CORE/,
  "Expected short decorative boot text for the sci-fi intro."
);

assert.match(
  introSource,
  /role="button"[\s\S]*tabindex="0"/,
  "Expected the 3D sphere canvas to expose keyboard-accessible click affordance."
);

assert.match(
  introSource,
  /data-intro-enter[\s\S]*Khám phá hành trình/,
  "Expected an overlaid journey button inside the 3D sphere stage."
);

assert.match(
  introSource,
  /enterButton\.addEventListener\("click", enterWebsite\)/,
  "Expected the journey button to enter the website."
);

assert.match(
  styleSource,
  /\.intro-journey-button\s*\{[\s\S]*position:\s*absolute;[\s\S]*z-index:\s*3;/,
  "Expected the journey button to sit above the 3D sphere canvas."
);

assert.match(
  introSource,
  /const philosophicalPalette = \{/,
  "Expected the intro sphere to define a darker philosophical futuristic palette."
);

assert.match(
  introSource,
  /charcoal:[\s\S]*darkNavy:[\s\S]*deepPurple:[\s\S]*smokyGray/,
  "Expected the main sphere palette to include charcoal, dark navy, deep purple, and smoky gray."
);

assert.match(
  introSource,
  /createOrbitingEnergySpheres/,
  "Expected the intro to create small orbiting energy spheres around the main sphere."
);

assert.match(
  introSource,
  /orbitingEnergySpheres[\s\S]*radius:[\s\S]*speed:[\s\S]*phase:/,
  "Expected orbiting energy spheres to have different radii, speeds, and phases."
);

assert.doesNotMatch(
  introSource,
  /preserveDrawingBuffer:\s*true/,
  "Expected intro WebGL rendering to avoid preserveDrawingBuffer for smoother animation."
);

assert.match(
  styleSource,
  /\.intro-overlay\s*\{[\s\S]*position:\s*fixed;[\s\S]*z-index:\s*1200;/,
  "Expected the intro overlay to cover the viewport above the existing website."
);

assert.match(
  styleSource,
  /\.intro-overlay\.is-exiting/,
  "Expected an exit animation class for the intro overlay."
);

assert.match(
  styleSource,
  /\.intro-core-canvas\s*\{[\s\S]*cursor:\s*pointer;/,
  "Expected the 3D core canvas to make the click target clear."
);

assert.match(
  styleSource,
  /@media \(max-width: 640px\)[\s\S]*\.intro-core-stage/,
  "Expected mobile-specific sizing for the 3D intro stage."
);

assert.match(
  styleSource,
  /@media \(prefers-reduced-motion: reduce\)[\s\S]*\.intro-overlay/,
  "Expected the intro overlay to respect reduced motion preferences."
);

console.log("intro-overlay: structure checks passed");
