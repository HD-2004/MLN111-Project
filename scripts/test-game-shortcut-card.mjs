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
  /function renderApp\(\)\s*\{[\s\S]*\$\{renderNav\(\)\}[\s\S]*<main>[\s\S]*<\/main>[\s\S]*\$\{renderGameShortcut\(\)\}[\s\S]*`;/,
  "Expected renderApp() to render the game shortcut outside the main content flow."
);

assert.match(
  appSource,
  /function renderTransitionVisual\(\)\s*\{(?:(?!\$\{renderGameShortcut\(\)\})[\s\S])*`;\s*\}/,
  "Expected renderTransitionVisual() to stop rendering the game shortcut inside the transition layout."
);

assert.match(
  styleSource,
  /\.game-shortcut\s*\{[\s\S]*position:\s*fixed;[\s\S]*right:\s*32px;[\s\S]*bottom:\s*32px;[\s\S]*z-index:\s*(50|100);[\s\S]*min-height:\s*44px;[\s\S]*border-radius:\s*999px;/,
  "Expected desktop styles to anchor the game shortcut as a floating fixed pill."
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
  "Expected hover styles to lift the floating shortcut subtly."
);

assert.match(
  styleSource,
  /@media \(max-width: 980px\)[\s\S]*\.game-shortcut\s*\{[\s\S]*right:\s*24px;[\s\S]*bottom:\s*24px;/,
  "Expected tablet styles to move the floating shortcut inward."
);

assert.match(
  styleSource,
  /@media \(max-width: 640px\)[\s\S]*\.game-shortcut\s*\{[\s\S]*right:\s*16px;[\s\S]*bottom:\s*16px;[\s\S]*min-height:\s*44px;/,
  "Expected mobile styles to keep the floating shortcut reachable with a 44px touch target."
);

console.log("game-shortcut-card: floating structure checks passed");
