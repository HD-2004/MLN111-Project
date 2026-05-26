# Architecture - Philosophy Learning Web

## 1. Product Intent

This project is an interactive learning website for Marxist-Leninist philosophy students.

The product should feel like a digital philosophy museum, not a normal textbook website. It combines:

- classical philosophy visuals,
- museum/exhibition-style composition,
- scroll-based learning,
- interactive explanation cards,
- AI-era visual language,
- quiz and scripted chatbot interaction.

Primary learning question:

> Can AI truly have consciousness, or is it still matter simulating intelligent behavior?

## 2. Current Implementation Strategy

The first build uses a dependency-free static frontend:

- `index.html`
- `src/styles.css`
- `src/data.js`
- `src/app.js`
- `server.mjs`

Reason:

- The current workspace has a working bundled `node.exe` but no package manager.
- A static app can run immediately in the browser without installing dependencies.
- The structure remains component-like and can be migrated to React/Vite later.

Future migration target:

- React + Vite + TypeScript
- Tailwind CSS
- Framer Motion
- Lucide React
- Optional Three.js/React Three Fiber for advanced visual scenes

## 3. File Map

```txt
C:\MLN111
  AI-agent.md
  ARCHITECTURE.md
  index.html
  server.mjs
  src/
    app.js
    data.js
    styles.css
  reference/
    UI/
      *.jpg
```

## 4. Responsibilities

### `index.html`

Owns:

- document metadata,
- root app mount,
- font imports,
- stylesheet/script links.

Does not own:

- chapter content,
- section HTML generation,
- interaction logic.

### `src/data.js`

Owns:

- chapter navigation metadata,
- timeline data,
- matter cards,
- consciousness origin data,
- AI comparison rows,
- quiz questions,
- chatbot scripted responses.

Rule:

- Non-developers should be able to edit learning content here without touching rendering logic.

### `src/app.js`

Owns:

- rendering sections from data,
- typewriter effect,
- scroll progress,
- section active-state detection,
- flip-card click support for touch devices,
- quiz state and feedback,
- scripted chatbot behavior.

Rule:

- Keep rendering functions small and named by feature.
- Do not hard-code long learning content in this file.

### `src/styles.css`

Owns:

- visual design system,
- layout,
- responsive behavior,
- animation,
- interaction states.

Rule:

- Preserve the dark classical museum direction.
- Avoid generic SaaS styling.
- Avoid highly rounded cards.

### `server.mjs`

Owns:

- optional local preview server,
- static file serving for `index.html`, CSS, JS, and assets.

Run:

```bash
node server.mjs
```

Then open:

```txt
http://127.0.0.1:4173/
```

## 5. Design System

### Mood

Dark classical museum plus AI-era technology.

### Palette

- `--ink`: near-black background.
- `--ink-soft`: blue-black panels.
- `--ivory`: primary text.
- `--muted`: secondary text.
- `--gold`: antique gold accent.
- `--ember`: warm fire accent.
- `--cyan`: AI/neural accent.

### Typography

- Display headings use a serif font.
- Body copy uses a clean sans-serif font.
- Labels use small uppercase text with restrained letter spacing.

### Shape Language

- Thin borders.
- Framed panels.
- Artifact cards.
- Vertical timeline.
- Minimal radius.
- No nested decorative cards.

## 6. Page Sections

### 01 - Landing

Purpose:

- Create a strong first impression.
- Establish the central problem: AI can generate, but can it think?

UI:

- dark background,
- code rain texture,
- huge serif title,
- statue/wireframe artifact,
- typewriter prompt,
- scroll CTA.

### 02 - Theory Map

Purpose:

- Introduce the philosophical path from matter to consciousness.

UI:

- vertical timeline,
- numbered stations,
- small museum labels.

### 03 - Matter Definition

Purpose:

- Explain Lenin's definition of matter through three digestible cards.

Cards:

- objective reality,
- knowability,
- primacy of matter.

### 04 - Origin of Consciousness

Purpose:

- Explain natural and social origins of consciousness.

UI:

- central brain artifact,
- labor and language nodes,
- connected lines.

### 05 - AI Analysis

Purpose:

- Compare human consciousness and AI simulation.

UI:

- technology transition,
- comparison matrix,
- verdict panel.

### 06 - Philosophical Turing Test

Purpose:

- Reinforce the lesson through interaction.

UI:

- quiz cards,
- explanatory feedback,
- no harsh right/wrong grading.

### 07 - Socrates AI Bot + Conclusion

Purpose:

- Give the project a memorable creative ending.

UI:

- scripted chatbot,
- suggested prompts,
- final author statement.

## 7. Interaction Rules

- Typewriter runs only on the main landing question.
- Flip cards work on hover and click.
- Quiz always explains the philosophical point after a choice.
- Chatbot is scripted and controlled.
- Scroll progress updates active chapter navigation.
- Animations should clarify structure, not obscure content.

## 8. Responsive Rules

Desktop:

- Use large editorial compositions.
- Keep hero statue and title visually dominant.
- Use multi-column comparison and diagram layouts.

Tablet/mobile:

- Stack sections vertically.
- Keep text readable.
- Convert comparison rows into blocks.
- Reduce decorative density.
- Hide or simplify vertical side navigation if needed.

## 9. Content Rules

- Do not state that AI has consciousness.
- Present AI as a material system that simulates intelligent behavior.
- Keep Marxist-Leninist concepts clear and student-friendly.
- Avoid overly long paragraphs on screen.
- Every section must support the learning objective.

## 10. Verification Checklist

Before considering a build ready:

- Page opens without a build step.
- No console errors.
- Desktop layout is visually coherent.
- Mobile layout has no text overflow.
- Navigation highlights current section.
- Quiz works.
- Chatbot works.
- Reference mood is preserved:
  - dark,
  - classical,
  - serif,
  - framed,
  - gold/bronze,
  - cyan only for AI sections.

## 11. Future React Migration Plan

When package tooling is available:

1. Move `src/data.js` to `src/data/*.ts`.
2. Convert render functions from `app.js` into React components.
3. Move CSS tokens into Tailwind config or CSS variables.
4. Replace manual IntersectionObserver state with component hooks.
5. Add Framer Motion for scroll transitions.
6. Add React Three Fiber only after the static MVP is approved.
