import { readFile } from "node:fs/promises";
import assert from "node:assert/strict";

const [indexHtml, gameHtml, styleSource, transitionSource] = await Promise.all([
  readFile(new URL("../index.html", import.meta.url), "utf8"),
  readFile(new URL("../game.html", import.meta.url), "utf8"),
  readFile(new URL("../src/styles.css", import.meta.url), "utf8"),
  readFile(new URL("../src/page-transition.js", import.meta.url), "utf8").catch(() => ""),
]);

assert.match(
  indexHtml,
  /page-transition-bootstrap[\s\S]*<script src="src\/page-transition\.js" defer><\/script>/,
  "Expected index.html to include the page transition bootstrap and shared script."
);

assert.match(
  gameHtml,
  /page-transition-bootstrap[\s\S]*<script src="src\/page-transition\.js" defer><\/script>/,
  "Expected game.html to include the page transition bootstrap and shared script."
);

assert.match(
  transitionSource,
  /const TRANSITION_KEY = "mln-page-transition";[\s\S]*page-transition-exiting[\s\S]*page-transition-entering[\s\S]*window\.location\.href = href;/,
  "Expected src/page-transition.js to persist transition state and navigate after the exit animation."
);

assert.match(
  transitionSource,
  /closest\("a\[href\]"\)/,
  "Expected src/page-transition.js to locate anchor clicks for interception."
);

assert.match(
  transitionSource,
  /url\.pathname\.endsWith\("\.html"\)/,
  "Expected src/page-transition.js to limit interception to same-site HTML page links."
);

assert.match(
  styleSource,
  /html\.page-transition-enabled body::after[\s\S]*linear-gradient\(90deg,\s*transparent 0%,\s*rgba\(99,\s*215,\s*255,\s*0\.24\)/,
  "Expected shared styles for the dark overlay with cyan trace."
);

assert.match(
  styleSource,
  /html\.page-transition-exiting body::after[\s\S]*animation:\s*pageTransitionExit[\s\S]*html\.page-transition-entering body::after[\s\S]*animation:\s*pageTransitionEnter/,
  "Expected separate enter and exit overlay animations."
);

assert.match(
  styleSource,
  /html\.page-transition-exiting #app > main,\s*html\.page-transition-exiting #app > \.doc-shortcut[\s\S]*transform:\s*translateY\(14px\) scale\(0\.996\)/,
  "Expected the exit transition to softly move the page content without touching the fixed sidebar nav."
);

console.log("page-transition: structure checks passed");
