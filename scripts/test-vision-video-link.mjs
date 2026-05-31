import { readFile } from "node:fs/promises";
import assert from "node:assert/strict";

const [appSource, dataSource] = await Promise.all([
  readFile(new URL("../src/app.js", import.meta.url), "utf8"),
  readFile(new URL("../src/data.js", import.meta.url), "utf8"),
]);

assert.match(
  dataSource,
  /videoUrl:\s*"https:\/\/www\.youtube\.com\/watch\?v=Ao5rYxLdP8w"/,
  "Expected vision data to keep the requested YouTube watch URL."
);

assert.match(
  appSource,
  /function getYouTubeEmbedUrl\(url\)[\s\S]*youtube\.com\/embed\/\$\{videoId\}/,
  "Expected src/app.js to convert the watch URL into an embed URL."
);

assert.match(
  appSource,
  /src="\$\{getYouTubeEmbedUrl\(data\.vision\.videoUrl\)\}"/,
  "Expected the Vision iframe to use the derived embed URL from data.vision.videoUrl."
);

console.log("vision-video-link: structure checks passed");
