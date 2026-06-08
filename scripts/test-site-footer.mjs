import { readFile } from "node:fs/promises";
import assert from "node:assert/strict";

const [appSource, styleSource] = await Promise.all([
  readFile(new URL("../src/app.js", import.meta.url), "utf8"),
  readFile(new URL("../src/styles.css", import.meta.url), "utf8"),
]);

const members = [
  ["Đỗ Hoàng Hiếu", "SE184340"],
  ["Lê Tấn Lực", "SE184288"],
  ["Nguyễn Thị Anh Thư", "SE184907"],
  ["Nguyễn Duy Khang", "SE184145"],
];

assert.match(appSource, /function renderFooter\(\)/, "Expected the site footer renderer to exist.");
assert.match(appSource, /<footer class="site-footer"/, "Expected the app to render a site footer.");
assert.match(appSource, /\$\{renderFooter\(\)\}/, "Expected renderApp to include the footer after main content.");
assert.match(appSource, /Thành viên nhóm/, "Expected the footer to label the group members.");

members.forEach(([name, studentId]) => {
  assert.match(appSource, new RegExp(name), `Expected footer to include ${name}.`);
  assert.match(appSource, new RegExp(studentId), `Expected footer to include student ID ${studentId}.`);
});

assert.match(styleSource, /\.site-footer\s*\{/, "Expected footer styles to exist.");
assert.match(styleSource, /\.site-footer__members\s*\{/, "Expected footer member list styles to exist.");
assert.match(
  styleSource,
  /@media \(max-width: 640px\)[\s\S]*\.site-footer__member/,
  "Expected responsive footer styles for small screens."
);

console.log("site-footer: member content and responsive style checks passed");
