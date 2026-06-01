import { readFile } from "node:fs/promises";
import assert from "node:assert/strict";

const [appSource, styleSource] = await Promise.all([
  readFile(new URL("../src/app.js", import.meta.url), "utf8"),
  readFile(new URL("../src/styles.css", import.meta.url), "utf8"),
]);

assert.match(
  appSource,
  /function renderGameShortcut\(\)\s*\{[\s\S]*>\s*Start game\s*</u,
  "Expected renderGameShortcut() to render the simplified Start game CTA."
);

assert.doesNotMatch(
  appSource,
  /INTERACTIVE QUEST|Trò Chơi Tư Duy|Khám phá các câu hỏi về AI, ý thức và thế giới khách quan\.|Bắt đầu/u,
  "Expected renderGameShortcut() to remove the longer game card copy."
);

assert.match(
  appSource,
  /function renderManifesto\(\)\s*\{[\s\S]*<section class="section manifesto-section"[\s\S]*manifesto-game-card[\s\S]*img\/hinhthebai\.jpg[\s\S]*\$\{renderGameShortcut\(\)\}[\s\S]*<\/section>[\s\S]*`;\s*\}/,
  "Expected renderManifesto() to render a visual game CTA panel inside the section 5 manifesto flow."
);

assert.match(
  appSource,
  /function renderApp\(\)\s*\{(?:(?!\$\{renderGameShortcut\(\)\})[\s\S])*`;\s*\}/,
  "Expected renderApp() to stop rendering the game shortcut as a page-level floating CTA."
);

assert.match(
  styleSource,
  /\.game-shortcut\s*\{(?:(?!position:\s*fixed)[\s\S])*display:\s*inline-flex;[\s\S]*min-height:\s*44px;[\s\S]*border-radius:\s*999px;/,
  "Expected desktop styles to keep the section 5 game shortcut as an inline pill, not a fixed control."
);

assert.match(
  styleSource,
  /\.game-shortcut\s*\{[\s\S]*border:\s*1px solid rgba\(212,\s*168,\s*79,[\s\S]*background:[\s\S]*box-shadow:[\s\S]*backdrop-filter:\s*blur\(/,
  "Expected the floating shortcut to keep the gold cinematic treatment."
);

assert.match(
  styleSource,
  /\.game-shortcut\s*\{[\s\S]*transition:[\s\S]*220ms|300ms|0\.24s|0\.28s|0\.3s/u,
  "Expected the floating shortcut to use a smooth transition."
);

assert.match(
  styleSource,
  /\.game-shortcut:hover\s*\{[\s\S]*transform:\s*translateY\(-2px\)/,
  "Expected hover styles to lift the section CTA subtly."
);

assert.match(
  styleSource,
  /\.manifesto-game-card\s*\{[\s\S]*display:\s*grid;[\s\S]*grid-template-columns:[\s\S]*\.manifesto-game-visual\s*\{[\s\S]*\.\.\/img\/hinhthebai/u,
  "Expected the manifesto CTA to include a composed visual panel with the game image."
);

assert.match(
  styleSource,
  /@media \(max-width: 640px\)[\s\S]*\.game-shortcut\s*\{[\s\S]*width:\s*100%;[\s\S]*min-height:\s*44px;/,
  "Expected mobile styles to make the section CTA full-width with a 44px touch target."
);

console.log("game-shortcut-card: section 5 structure checks passed");
