import { readFile } from "node:fs/promises";
import assert from "node:assert/strict";

const [appSource, styleSource] = await Promise.all([
  readFile(new URL("../src/app.js", import.meta.url), "utf8"),
  readFile(new URL("../src/styles.css", import.meta.url), "utf8"),
]);

assert.match(
  appSource,
  /function renderGameShortcut\(\)\s*\{[\s\S]*INTERACTIVE QUEST[\s\S]*Trò Chơi Tư Duy[\s\S]*Khám phá các câu hỏi về AI, ý thức và thế giới khách quan\.[\s\S]*Bắt đầu[\s\S]*→/u,
  "Expected renderGameShortcut() to render the new interactive game card content."
);

assert.match(
  appSource,
  /function renderTransitionVisual\(\)\s*\{[\s\S]*<div class="transition-layout reveal">[\s\S]*\$\{renderGameShortcut\(\)\}[\s\S]*<figure class="transition-card">[\s\S]*src="img\/04\.jpg"/,
  "Expected the game shortcut to be rendered beside the 04.jpg transition image."
);

assert.doesNotMatch(
  appSource,
  /renderNav\(\)\s*\n\s*\$\{renderGameShortcut\(\)\}\s*\n\s*<main>/,
  "Expected renderApp() to stop rendering the game shortcut as a global fixed element."
);

assert.match(
  styleSource,
  /\.transition-layout\s*\{[\s\S]*grid-template-columns:\s*minmax\(220px,\s*280px\)\s+minmax\(0,\s*1fr\)/,
  "Expected .transition-layout to place the game card left of the 04.jpg visual."
);

assert.match(
  styleSource,
  /\.game-shortcut\s*\{[\s\S]*position:\s*relative;[\s\S]*align-self:\s*center;[\s\S]*backdrop-filter:\s*blur\(/,
  "Expected desktop styles to render the game card as a left-side transition companion."
);

assert.match(
  styleSource,
  /\.game-shortcut__cta-arrow\s*\{[\s\S]*transition:\s*transform/,
  "Expected the CTA arrow to animate smoothly on hover."
);

assert.match(
  styleSource,
  /\.game-shortcut:hover[\s\S]*\.game-shortcut__cta-arrow\s*\{[\s\S]*transform:\s*translateX\(/,
  "Expected hover styles to nudge the CTA arrow."
);

assert.match(
  styleSource,
  /@media \(max-width: 980px\)[\s\S]*\.transition-layout\s*\{[\s\S]*grid-template-columns:\s*1fr;[\s\S]*\.game-shortcut\s*\{[\s\S]*order:\s*2;[\s\S]*width:\s*min\(100%,\s*420px\)/,
  "Expected tablet/mobile styles to stack the game card with the transition image."
);

console.log("game-shortcut-card: structure checks passed");
