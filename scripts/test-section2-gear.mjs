import { readFile } from "node:fs/promises";
import assert from "node:assert/strict";

const [indexSource, appSource, styleSource] = await Promise.all([
  readFile(new URL("../index.html", import.meta.url), "utf8"),
  readFile(new URL("../src/app.js", import.meta.url), "utf8"),
  readFile(new URL("../src/styles.css", import.meta.url), "utf8"),
]);

const contentSource = await readFile(new URL("../src/section2-content.js", import.meta.url), "utf8");
const gearSource = await readFile(new URL("../src/section2-gear.js", import.meta.url), "utf8");

assert.match(
  indexSource,
  /src\/section2-content\.js/,
  "Expected index.html to load the Section 2 content helper."
);

assert.match(
  indexSource,
  /src\/section2-gear\.js/,
  "Expected index.html to load the Section 2 gear scene module."
);

assert.match(
  contentSource,
  /Section2ContentData/,
  "Expected Section 2 content mapping to live in a separate helper."
);

assert.match(
  contentSource,
  /childNodes/,
  "Expected Section 2 content data to support smaller child nodes inside each major node."
);

assert.doesNotMatch(
  contentSource,
  /Node nhỏ/,
  "Expected default child nodes to avoid visible 'Node nhỏ' labels."
);

assert.match(
  appSource,
  /renderSection2GearPhilosophy/,
  "Expected app.js to render Section2GearPhilosophy."
);

assert.match(
  appSource,
  /data-section2-subnode-button/,
  "Expected Section 2 panel to render selectable smaller nodes."
);

assert.match(
  appSource,
  /data-section2-subpanel/,
  "Expected Section 2 panel to render child-node content panels."
);

assert.match(
  appSource,
  /is-switching/,
  "Expected Section 2 panel switching to toggle an animation state."
);

assert.match(
  appSource,
  /is-sub-switching/,
  "Expected Section 2 subnode switching to toggle a focused animation state."
);

assert.match(
  appSource,
  /data-section2-gear/,
  "Expected Section 2 to expose a 3D gear mount point."
);

assert.match(
  gearSource,
  /initSection2GearPhilosophy/,
  "Expected Section 2 gear scene initializer."
);

assert.match(
  gearSource,
  /TorusGeometry/,
  "Expected the gear sphere to use torus-like gear rings."
);

assert.match(
  styleSource,
  /\.section2-gear-philosophy\s*\{/,
  "Expected dedicated Section 2 layout styles."
);

assert.match(
  styleSource,
  /\.section2-subnode-list\s*\{/,
  "Expected dedicated styles for smaller Section 2 nodes."
);

assert.match(
  styleSource,
  /\.section2-panel-shell\.is-switching::after/,
  "Expected Section 2 panel shell scan-line animation."
);

assert.match(
  styleSource,
  /\.section2-node-panel\.section2-panel-enter/,
  "Expected Section 2 panel cascade animation hooks."
);

assert.match(
  styleSource,
  /@media \(prefers-reduced-motion: reduce\)[\s\S]*section2PanelScan/,
  "Expected Section 2 effects to respect reduced motion."
);

assert.match(
  styleSource,
  /@media \(max-width: 760px\)[\s\S]*\.section2-gear-layout/,
  "Expected mobile-specific Section 2 layout rules."
);

assert.match(
  styleSource,
  /\.section2-panel-stack\s*\{[\s\S]*min-height:\s*420px;/,
  "Expected Section 2 panel stack to stay compact."
);

assert.match(
  styleSource,
  /\.section2-gear-canvas\s*\{[\s\S]*height:\s*420px;[\s\S]*min-height:\s*360px;/,
  "Expected desktop gear canvas to use compact dimensions."
);

assert.match(
  styleSource,
  /@media \(max-width: 760px\)[\s\S]*\.section2-gear-canvas\s*\{[\s\S]*height:\s*240px;[\s\S]*min-height:\s*240px;/,
  "Expected mobile gear canvas to use compact dimensions."
);

console.log("section2-gear: structure checks passed");
