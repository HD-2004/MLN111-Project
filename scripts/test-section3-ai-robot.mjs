import { readFile } from "node:fs/promises";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import vm from "node:vm";

const [dataSource, appSource, styleSource] = await Promise.all([
  readFile(new URL("../src/data.js", import.meta.url), "utf8"),
  readFile(new URL("../src/app.js", import.meta.url), "utf8"),
  readFile(new URL("../src/styles.css", import.meta.url), "utf8"),
]);

const context = { window: {} };
vm.createContext(context);
vm.runInContext(dataSource, context);

const ai = context.window.APP_DATA.ai;
const visibleSection3Text = [
  ai.eyebrow,
  ai.lead,
  ai.objective.heading,
  ai.objective.lead,
  ...ai.objective.cards.flatMap((card, index) => [String(index + 1).padStart(2, "0"), card.title, card.text]),
  ai.objective.verdict,
  ai.contrast.heading,
  ai.contrast.lead,
  ...ai.contrast.items.flatMap((item, index) => [
    String(index + 1).padStart(2, "0"),
    item.title,
    ...(index === 0 ? [item.ai, item.human] : [item.human, item.ai]),
  ]),
  ai.future.heading,
  ai.future.lead,
  ...ai.future.perspectives.flatMap((item) => [item.title, item.text]),
  ai.conclusion.heading,
  ...ai.conclusion.paragraphs,
];

assert.equal(visibleSection3Text.length, 40, "Expected the Section 3 visible text inventory to remain complete without the removed future model diagram.");
assert.equal(
  crypto.createHash("sha256").update(JSON.stringify(visibleSection3Text)).digest("hex"),
  "b749719830f6cce8cf32f079cb3fb9d82d3cd155d8a6179021dd2178680be9ff",
  "Expected all original Section 3 text strings to remain unchanged."
);

assert.match(appSource, /renderAIRobotAnalysisVisual/, "Expected Section 3 to render an AI robot analysis visual.");
assert.match(
  appSource,
  /aiObjectiveTopics = \["physical", "mathematical", "limitation"\]/,
  "Expected Section 3 to define the three synchronized analysis topics."
);
assert.match(appSource, /data-ai-topic="\$\{topic\}"/, "Expected hotspots/cards to render topic attributes.");
assert.match(appSource, /setupAIAnalysisInteraction/, "Expected Section 3 hotspots and cards to share interaction state.");
assert.match(
  appSource,
  /aria-expanded="false"[\s\S]*Xem luận điểm/,
  "Expected long existing card text to be available through an expandable UI control."
);
assert.doesNotMatch(
  appSource,
  /data-ai-panel|ai-analysis-panel|data-ai-panel-text/,
  "Expected selected topic content to render only inside expandable cards, without a duplicate detail panel."
);
assert.match(
  appSource,
  /renderAIRobotAnalysisVisual\(data\.ai\.objective\.cards\)[\s\S]*data\.ai\.objective\.verdict/,
  "Expected the objective conclusion to appear below the robot/card interaction area."
);
assert.match(styleSource, /\.ai-robot-visual/, "Expected robot visual styles to be isolated to Section 3.");
assert.match(styleSource, /\.ai-analysis-card\.is-active/, "Expected active card styles for synchronized state.");
assert.doesNotMatch(styleSource, /\.ai-analysis-panel/, "Expected duplicate selected-topic panel styles to be removed.");
assert.doesNotMatch(appSource, /data\.ai\.future\.model|future-model/, "Expected the future model diagram block to be removed from Section 3 rendering.");
assert.doesNotMatch(styleSource, /\.future-model/, "Expected obsolete future model diagram styles to be removed.");

console.log("section3-ai-robot: structure and preservation checks passed");
