import { readFile } from "node:fs/promises";
import assert from "node:assert/strict";

const styleSource = await readFile(new URL("../src/styles.css", import.meta.url), "utf8");

assert.match(
  styleSource,
  /\.quiz-card-front\s*\{[\s\S]*url\('\.\.\/img\/card-bg\.jpg'\);/,
  "Expected .quiz-card-front to use the shared ../img/card-bg.jpg background image."
);

assert.match(
  styleSource,
  /\.quiz-card-back\s*\{[\s\S]*url\('\.\.\/img\/card-bg\.jpg'\);/,
  "Expected .quiz-card-back to use the shared ../img/card-bg.jpg background image."
);

assert.match(
  styleSource,
  /\.quiz-mini-card\.answered \.quiz-card-front\s*\{[\s\S]*url\('\.\.\/img\/card-bg\.jpg'\);/,
  "Expected answered quiz mini cards to use the shared ../img/card-bg.jpg background image."
);

assert.match(
  styleSource,
  /\.ai-scenario-card\s*\{[\s\S]*url\('\.\.\/img\/card-bg\.jpg'\);/,
  "Expected the AI scenario card to use the shared ../img/card-bg.jpg background image."
);

assert.match(
  styleSource,
  /\.quiz-scenario-card\s*\{[\s\S]*url\('\.\.\/img\/card-bg\.jpg'\);/,
  "Expected the quiz scenario card to use the shared ../img/card-bg.jpg background image."
);

assert.doesNotMatch(
  styleSource,
  /url\('card-bg\.jpg'\)|url\('\/(?:img|assets)\/card-bg\.jpg'\)/,
  "Expected card background references to avoid local-sibling or absolute paths."
);

console.log("game-card-background: structure checks passed");
