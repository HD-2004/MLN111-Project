# Theory Left Visual Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `img/05.png` as a left-side editorial visual in the theory timeline section without changing text, font, timeline order, or the dominant reading flow.

**Architecture:** Keep the existing theory heading intact, then wrap the timeline area in a dedicated layout container that can host a left-side visual block plus the existing timeline column. Implement the visual as a subdued decorative image with dark overlays and reveal motion, then collapse it above the timeline on tablet and hide it entirely on mobile.

**Tech Stack:** Plain HTML template strings in `src/app.js`, CSS in `src/styles.css`, Node.js verification script in `scripts/test-theory-left-visual.mjs`, static build via `npm run build`, browser verification via local preview.

---

## File Structure

- `src/app.js`
  - Responsibility: add the left-visual markup inside `renderTheory()` without changing existing text content or timeline item order.
- `src/styles.css`
  - Responsibility: add the two-column theory layout, subdued image styling, reveal-friendly visual treatment, tablet stacking, and mobile hide behavior.
- `scripts/test-theory-left-visual.mjs`
  - Responsibility: regression-check the presence of the new theory visual markup and the required CSS hooks before and after implementation.

### Task 1: Add Theory Visual Markup and Base Layout

**Files:**
- Create: `scripts/test-theory-left-visual.mjs`
- Modify: `src/app.js`
- Modify: `src/styles.css`
- Test: `scripts/test-theory-left-visual.mjs`

- [ ] **Step 1: Write the failing test**

Create `scripts/test-theory-left-visual.mjs` with this content:

```js
import { readFile } from "node:fs/promises";
import assert from "node:assert/strict";

const [appSource, styleSource] = await Promise.all([
  readFile(new URL("../src/app.js", import.meta.url), "utf8"),
  readFile(new URL("../src/styles.css", import.meta.url), "utf8"),
]);

assert.match(
  appSource,
  /<div class="theory-layout">/,
  "Expected renderTheory() to include a .theory-layout wrapper."
);

assert.match(
  appSource,
  /<aside class="theory-side-visual reveal"[\s\S]*src="img\/05\.png"/,
  "Expected renderTheory() to include the 05.png left visual block."
);

assert.match(
  appSource,
  /<div class="timeline">/,
  "Expected the timeline markup to remain present."
);

assert.match(
  styleSource,
  /\.theory-layout\s*\{/,
  "Expected styles for .theory-layout."
);

assert.match(
  styleSource,
  /\.theory-side-visual\s*\{/,
  "Expected styles for .theory-side-visual."
);

assert.match(
  styleSource,
  /\.theory-visual-frame\s*\{/,
  "Expected styles for .theory-visual-frame."
);

assert.match(
  styleSource,
  /\.theory-visual-image\s*\{/,
  "Expected styles for .theory-visual-image."
);

console.log("theory-left-visual: structure checks passed");
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node scripts/test-theory-left-visual.mjs`

Expected: `AssertionError` complaining that `.theory-layout` or the `05.png` block is missing.

- [ ] **Step 3: Write minimal implementation**

Update the theory markup inside `src/app.js` so the heading stays unchanged and only the timeline area gets wrapped:

```js
  function renderTheory() {
    return `
      <section class="section" id="theory" data-chapter="theory">
        <div class="section-heading">
          <p class="eyebrow">${data.theory.eyebrow}</p>
          <h2>${data.theory.title}</h2>
          <p>${data.theory.lead}</p>
        </div>
        <div class="theory-layout">
          <aside class="theory-side-visual reveal" aria-hidden="true">
            <div class="theory-visual-frame">
              <img
                class="theory-visual-image"
                src="img/05.png"
                alt=""
                loading="lazy"
                decoding="async"
              />
            </div>
          </aside>
          <div class="theory-main">
            <div class="timeline">
              ${data.theory.timeline
                .map(
                  (item) => `
                    <article class="timeline-item reveal">
                      <span class="timeline-number">${item.number}</span>
                      <div>
                        <small>${item.label}</small>
                        <h3>${item.title}</h3>
                        <p>${item.text}</p>
                      </div>
                    </article>
                  `
                )
                .join("")}
            </div>
            <div class="accordion-stack">
              ${data.theory.sections
                .map(
                  (section, index) => `
                    <details class="theory-detail reveal" ${index === 0 ? "open" : ""}>
                      <summary>
                        <span>${String(index + 1).padStart(2, "0")}</span>
                        <strong>${section.title}</strong>
                      </summary>
                      <div class="detail-body">
                        ${section.blocks.map(renderContentBlock).join("")}
                      </div>
                    </details>
                  `
                )
                .join("")}
            </div>
          </div>
        </div>
      </section>
    `;
  }
```

Add the base layout and image treatment to `src/styles.css` near the theory/timeline styles:

```css
.theory-layout {
  display: grid;
  grid-template-columns: minmax(220px, 0.72fr) minmax(0, 1.28fr);
  gap: clamp(28px, 4vw, 56px);
  align-items: start;
}

.theory-main {
  min-width: 0;
}

.theory-side-visual {
  position: sticky;
  top: 112px;
  align-self: start;
  padding-top: 84px;
}

.theory-visual-frame {
  position: relative;
  overflow: hidden;
  aspect-ratio: 4 / 5;
  border-radius: 10px;
  border: 1px solid rgba(243, 234, 216, 0.1);
  background:
    linear-gradient(180deg, rgba(4, 7, 12, 0.14), rgba(4, 7, 12, 0.5)),
    rgba(5, 7, 12, 0.72);
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.24),
    inset 0 1px 0 rgba(243, 234, 216, 0.05);
}

.theory-visual-frame::before,
.theory-visual-frame::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.theory-visual-frame::before {
  z-index: 2;
  background:
    linear-gradient(180deg, rgba(4, 7, 12, 0.08) 0%, rgba(4, 7, 12, 0.34) 64%, rgba(4, 7, 12, 0.62) 100%),
    radial-gradient(circle at 18% 18%, rgba(212, 168, 79, 0.08), transparent 28%);
}

.theory-visual-frame::after {
  z-index: 3;
  inset: 16px;
  border: 1px solid rgba(243, 234, 216, 0.08);
  border-radius: 7px;
}

.theory-visual-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 18%;
  filter: saturate(0.72) brightness(0.72) contrast(1.02);
  opacity: 0.72;
  transform: scale(1.02);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node scripts/test-theory-left-visual.mjs`

Expected: `theory-left-visual: structure checks passed`

- [ ] **Step 5: Commit**

```bash
git add scripts/test-theory-left-visual.mjs src/app.js src/styles.css
git commit -m "feat: add theory left-side editorial visual"
```

### Task 2: Add Tablet Stack and Mobile Hide Rules

**Files:**
- Modify: `scripts/test-theory-left-visual.mjs`
- Modify: `src/styles.css`
- Test: `scripts/test-theory-left-visual.mjs`

- [ ] **Step 1: Write the failing test**

Extend `scripts/test-theory-left-visual.mjs` with these assertions before `console.log(...)`:

```js
assert.match(
  styleSource,
  /@media \(max-width: 980px\)[\s\S]*\.theory-layout\s*\{[\s\S]*grid-template-columns:\s*1fr;/,
  "Expected tablet styles to collapse .theory-layout to one column."
);

assert.match(
  styleSource,
  /@media \(max-width: 980px\)[\s\S]*\.theory-side-visual\s*\{[\s\S]*position:\s*relative;/,
  "Expected tablet styles to release the sticky side visual."
);

assert.match(
  styleSource,
  /@media \(max-width: 640px\)[\s\S]*\.theory-side-visual\s*\{[\s\S]*display:\s*none;/,
  "Expected mobile styles to hide the left visual."
);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node scripts/test-theory-left-visual.mjs`

Expected: `AssertionError` complaining about the missing responsive rules.

- [ ] **Step 3: Write minimal implementation**

Add these responsive rules to `src/styles.css` inside the existing breakpoint sections:

```css
@media (max-width: 980px) {
  .theory-layout {
    grid-template-columns: 1fr;
    gap: 28px;
  }

  .theory-side-visual {
    position: relative;
    top: auto;
    width: min(100%, 320px);
    margin: 0 auto;
    padding-top: 0;
  }

  .theory-visual-frame {
    aspect-ratio: 16 / 10;
  }
}

@media (max-width: 640px) {
  .theory-side-visual {
    display: none;
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node scripts/test-theory-left-visual.mjs`

Expected: `theory-left-visual: structure checks passed`

- [ ] **Step 5: Commit**

```bash
git add scripts/test-theory-left-visual.mjs src/styles.css
git commit -m "feat: add responsive rules for theory left visual"
```

### Task 3: Verify Build and Real Layout Behavior

**Files:**
- Modify: `src/styles.css`
- Test: `scripts/test-theory-left-visual.mjs`

- [ ] **Step 1: Write the failing visual verification note**

Create a temporary checklist in your scratchpad before editing:

```text
FAIL until all are true:
- Desktop: 05.png sits left of timeline and does not cover numbers or cards
- Tablet: 05.png moves above timeline and stays secondary
- Mobile: 05.png is hidden
- Theory heading, timeline order, and text stay unchanged
```

- [ ] **Step 2: Run automated checks before polish**

Run:

```bash
node scripts/test-theory-left-visual.mjs
npm run build
```

Expected:
- `theory-left-visual: structure checks passed`
- `Static site built to public/`

- [ ] **Step 3: Apply minimal polish only if visual verification shows a real issue**

If the left visual is too strong, use this exact CSS adjustment block and nothing broader:

```css
.theory-side-visual {
  opacity: 0.92;
}

.theory-visual-frame::before {
  background:
    linear-gradient(180deg, rgba(4, 7, 12, 0.14) 0%, rgba(4, 7, 12, 0.4) 64%, rgba(4, 7, 12, 0.68) 100%),
    radial-gradient(circle at 18% 18%, rgba(212, 168, 79, 0.06), transparent 28%);
}

.theory-visual-image {
  opacity: 0.66;
}
```

- [ ] **Step 4: Re-run verification after the final CSS state**

Run:

```bash
node scripts/test-theory-left-visual.mjs
npm run build
```

Then verify in the local browser preview:

```bash
npm run dev
```

Expected:
- Desktop viewport: image is visible on the left and timeline remains dominant
- Tablet viewport: image is above timeline
- Mobile viewport: image is hidden
- No text, font, or item order changes

- [ ] **Step 5: Commit**

```bash
git add src/styles.css scripts/test-theory-left-visual.mjs
git commit -m "style: polish theory timeline side visual"
```
