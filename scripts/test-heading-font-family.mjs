import { readFile } from "node:fs/promises";
import assert from "node:assert/strict";

const styleFiles = [
  "../src/styles.css",
  "../public/assets/styles.css",
];

for (const styleFile of styleFiles) {
  const styleSource = await readFile(new URL(styleFile, import.meta.url), "utf8");

  const rules = [...styleSource.matchAll(/([^{}]+)\{([^{}]*)\}/g)].flatMap((match) => {
    const selectorText = match[1].trim();
    const declarations = match[2];

    if (selectorText.startsWith("@")) return [];

    return selectorText.split(",").map((selector) => ({
      selector: selector.trim(),
      declarations,
    }));
  });

  const headingOrTitleSelector = /(^|[\s>+~])h[1-6]\b|title|heading/i;
  const headingTitleBodyOverrides = rules
    .filter(({ selector, declarations }) => headingOrTitleSelector.test(selector)
      && /font-family:\s*var\(--body\)/.test(declarations))
    .map(({ selector }) => selector);

  assert.deepEqual(
    headingTitleBodyOverrides,
    [],
    `Expected heading/title selectors in ${styleFile} to use the shared heading font, not var(--body).`
  );

  assert.match(
    styleSource,
    /h1,\s*h2,\s*h3,\s*h4,\s*h5,\s*h6\s*\{[\s\S]*font-family:\s*var\(--serif\)/,
    `Expected all heading tags in ${styleFile} to share the same font-family.`
  );
}

console.log("heading-font-family: heading/title font checks passed");
