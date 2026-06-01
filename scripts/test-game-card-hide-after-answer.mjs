import { readFile } from "node:fs/promises";
import assert from "node:assert/strict";

const gameSource = await readFile(new URL("../src/game.js", import.meta.url), "utf8");

const hiddenCompletedCardMatches = gameSource.match(/if \(isDone\) return '';/g) || [];

assert.equal(
  hiddenCompletedCardMatches.length,
  2,
  "Expected completed cards in both card-deck games to stop rendering after the answer is finished."
);

assert.doesNotMatch(
  gameSource,
  /answered flipped/,
  "Expected answered cards to disappear instead of staying visible as flipped cards."
);

assert.match(
  gameSource,
  /completed\.add\(pos\);[\s\S]*document\.querySelector\('#backToDeckBtn'\)\.addEventListener\('click', \(\) => renderDeck\(\)\);/,
  "Expected the quick quiz to return to the deck after answering, where completed cards should be hidden."
);

assert.match(
  gameSource,
  /completed\.add\(pos\);[\s\S]*document\.querySelector\('#aiBackBtn'\)\.addEventListener\('click', \(\) => renderDeck\(\)\);/,
  "Expected the AI consciousness quiz to return to the deck after answering, where completed cards should be hidden."
);

console.log("game-card-hide-after-answer: completed cards disappear checks passed");
