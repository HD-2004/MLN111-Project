# AI Agent Context - Philosophy Learning Web

## Project Goal

Build an interactive learning website for students studying Marxist-Leninist philosophy, focused on the relationship between matter, consciousness, and AI.

The website should not feel like a normal textbook page. It should feel like a digital philosophy museum: classical, academic, mysterious, and futuristic.

Core learning goals:

1. Explain matter according to Marxist-Leninist philosophy.
2. Explain the natural and social origins of consciousness.
3. Apply the theory to the modern question: does AI truly have consciousness?
4. Help students remember the lesson through visual storytelling, interaction, quiz, and a scripted debate chatbot.

## Current User Idea

The user wants a single-page interactive experience with these chapters:

1. Landing page: dark screen, code background, neon/wireframe Socrates or Lenin statue, typewriter question about AI and thinking.
2. Theory map: timeline from primitive matter to advanced consciousness.
3. Matter definition: Lenin definition shown through 3 flip cards.
4. Origin of consciousness: brain, labor tools, and language symbols.
5. AI analysis: compare human brain/consciousness with AI as simulated matter.
6. Philosophical Turing Test: quiz mini-game with explanatory popups.
7. Socrates AI Bot and conclusion: scripted chatbot plus final message about humans mastering technology.

## UI References

The user placed reference images in:

`C:\MLN111\reference\UI`

Observed files:

- `23c1f05460903b61a941ff7b37a0c94b.jpg`
- `40e2e184d714feccbff3258973c7f9fd.jpg`
- `6092b0c6ef9dbf9c0bb4426b596444ab.jpg`
- `9e4962f8662c2551c56d93da151d2771.jpg`

Design DNA extracted from references:

- Dark classical museum mood.
- Large serif typography.
- Ancient statues, mythological/art-history imagery.
- Thin grid lines, delicate borders, small labels.
- Gold/bronze accents with off-white text.
- Occasional neon/cyan accents for the AI/technology sections.
- Editorial layouts with strong hierarchy.
- Avoid generic modern SaaS cards.
- Prefer framed panels, timeline labels, artifact-style layouts, and exhibition-like composition.

## Visual Direction

Main concept:

`A digital philosophy museum about Matter, Consciousness, and AI.`

Suggested names:

- `Ý Thức Trong Kỷ Nguyên Máy Móc`
- `Matter, Mind & Machine`

Tone:

- Serious but engaging.
- Academic but not boring.
- Classical in the first half, technological in the AI section.
- Dramatic enough for classroom presentation.

Color system:

- Background: near black, blue-black, charcoal.
- Text: ivory/off-white.
- Accent 1: antique gold/bronze.
- Accent 2: cyan/neon blue for AI.
- Accent 3: ember/orange for "fire of knowledge" or Prometheus-like symbolism.

Typography:

- Display headings: serif, high contrast, classical.
- Body text: clean sans-serif for readability.
- Labels/captions: small uppercase, letter-spaced lightly, but do not overdo negative tracking.

## UX Rules

- Build the actual learning experience first, not a marketing landing page.
- Keep content scannable. Philosophy text must be broken into small digestible sections.
- Each chapter should have one clear learning purpose.
- Use scroll-driven storytelling.
- Use animation to clarify ideas, not to distract.
- Avoid too many large paragraphs on screen at once.
- Avoid nested cards or overly rounded UI.
- Preserve responsive behavior for desktop and mobile.
- On mobile, tables should become stacked comparison blocks.
- Text must not overflow or overlap.
- All visible content should support the lesson.

## MVP Scope

Build first:

1. React/Vite single-page app.
2. Dark classical landing with typewriter text.
3. Vertical progress/chapter navigation.
4. Timeline section for theory map.
5. Three flip cards for matter definition.
6. Consciousness origin diagram.
7. AI vs human comparison section.
8. Philosophical Turing Test quiz.
9. Scripted Socrates AI chatbot.
10. Responsive desktop/mobile layout.

Enhance later:

- 3D/wireframe statue.
- Canvas/Three.js neural network.
- More complex particle/code background.
- Real AI chatbot API.
- More polished assets and sound/microinteractions.

## Suggested Tech Stack

- React
- Vite
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide React
- React Three Fiber or Three.js only if needed after MVP

Chatbot should start as a scripted local component using predefined responses. This keeps the philosophical content controlled and avoids API cost.

## Suggested File Structure

```txt
src/
  components/
    HeroLanding.tsx
    TypewriterText.tsx
    ProgressNav.tsx
    TimelineSection.tsx
    FlipCard.tsx
    ConsciousnessDiagram.tsx
    AIComparison.tsx
    TuringQuiz.tsx
    SocratesChatbot.tsx
  data/
    chapters.ts
    quizQuestions.ts
    chatbotResponses.ts
  styles/
    globals.css
  App.tsx
```

## Content Rules

- Keep official/academic philosophical claims clear and accurate.
- Avoid saying AI "has consciousness".
- Frame AI as matter, tool, and simulation of intelligent behavior.
- Key conclusion:

`AI is still matter. It reflects and recombines human knowledge but does not have lived social experience, labor, emotion, or consciousness in the philosophical sense.`

Vietnamese learning tone should be clear, student-friendly, and presentation-ready.

## Work Completed So Far

- Discussed and refined the full website concept with the user.
- Reviewed the user-provided chapter ideas.
- Tried to access Google Drive references, but Drive required Google sign-in and was blocked.
- User moved UI references into `C:\MLN111\reference\UI`.
- Reviewed 4 local UI reference images.
- Extracted the visual direction:
  - dark classical museum,
  - large serif titles,
  - statue/artifact-based layout,
  - thin framed panels,
  - gold/bronze academic tone,
  - neon/cyan transition for AI sections.
- Confirmed with the user that the proposed direction is acceptable.
- Created this context file to preserve decisions for future work.
- Created `ARCHITECTURE.md` as the main developer-friendly architecture document.
- Chose a dependency-free static MVP because the workspace has a bundled `node.exe` but no package manager available.
- Built the first static MVP structure:
  - `index.html`
  - `server.mjs`
  - `src/data.js`
  - `src/app.js`
  - `src/styles.css`
- Implemented:
  - dark classical landing page,
  - typewriter question,
  - vertical chapter navigation,
  - theory timeline,
  - flip cards for matter definition,
  - consciousness origin diagram,
  - AI comparison section,
  - philosophical Turing Test quiz,
  - scripted Socrates AI Bot,
  - responsive CSS rules.
- Verified JavaScript syntax with the bundled Node runtime.
- Served the app locally at `http://127.0.0.1:4173/` through a temporary static server for browser QA.
- Verified in browser DOM that all sections render.
- Verified quiz feedback and chatbot scripted response behavior.
- Reworked the MVP content to match the user's new 5-chapter script:
  - Chapter 1: The Portal
  - Chapter 2: Bản đồ lý thuyết
  - Chapter 3: Bản chất của AI
  - Chapter 4: The Dialogue
  - Chapter 5: The Manifesto
- Replaced the old 7-section render flow with a 5-section render flow.
- Added native accordion/details blocks for long theory content so the page stays usable during presentation.
- Added structured AI analysis cards, contrast panels, future-perspective panel, and manifesto cards.
- Updated chatbot prompts and scripted answers to match the new chapter 4 content.
- Verified the browser DOM contains all 5 new chapter headings.
- Changed project typography to Arial/Helvetica for both headings and body to avoid local font rendering issues.
- Updated `server.mjs` so local preview no longer crashes on `EADDRINUSE`; it now tries the next available port from 4173 up to 4193.
- Added `package.json` with `dev` and `start` scripts for cleaner local usage.
- Restored `src/data.js` after it was accidentally reduced to invalid content and added a guard in `src/app.js` so missing/invalid app data shows a clear error.
- Added no-store headers in `server.mjs` so local browser refreshes do not keep stale JavaScript during development.
- Fixed the left progress navigation logic: active chapter is now calculated from scroll position and updates immediately on chapter clicks.
- Reduced expensive always-running background animations in `src/styles.css` to improve scroll smoothness while preserving the dark museum/cyber visual direction.
- Added an inline favicon in `index.html` so local preview no longer reports a missing `favicon.ico`.
- Fixed Vercel static deployment setup:
  - Added `npm run build` via `scripts/build.mjs`.
  - Build output is now `dist/`, containing `index.html` and `src/` assets.
  - Added `vercel.json` with `buildCommand`, `outputDirectory`, and SPA rewrite fallback.
  - Updated `server.mjs` to support `STATIC_ROOT=dist` for production-like local preview.
- After Vercel still tried to run the app as a serverless function, moved the local preview server from root `server.mjs` to `scripts/dev-server.mjs`.
- Updated `vercel.json` to an explicit static build/routes config using `@vercel/static` for `index.html` and `src/**`, so Vercel should not invoke any Node server runtime.
- Vercel logs later showed `ReferenceError: window is not defined at /var/task/src/app.js`, meaning browser code from `src/app.js` was still being invoked as server runtime code.
- Final Vercel deployment direction: keep `src/` as local source, but build production assets into `public/assets/`; `vercel.json` now uses `buildCommand: npm run build`, `outputDirectory: public`, and a simple SPA rewrite to `/index.html`.
- Added GitHub Actions workflow `.github/workflows/deploy-vercel.yml` to deploy production to Vercel on pushes to `main` or manual `workflow_dispatch`.
- The workflow expects GitHub repository secrets: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID`.
- Verified server fallback while ports 4173 and 4174 were busy; it successfully started on `http://127.0.0.1:4175/`.
- Fixed a white-screen runtime issue caused by `src/data.js` being corrupted to a single `r`, which threw `ReferenceError: r is not defined` and prevented `window.APP_DATA` from loading.
- Added a runtime guard in `src/app.js` so missing/invalid `APP_DATA` shows a clear error message instead of a blank page.
- Added `Cache-Control: no-store` to `server.mjs` to reduce stale local JS caching during development.

## Next Recommended Step

Continue visual QA and polish the MVP interface:

1. Ask the user to review the first visual draft at `http://127.0.0.1:4173/` while the local server is running.
2. Tune proportions, section density, and typography based on feedback.
3. Add stronger visual assets if needed.
4. Improve mobile polish.
5. Move to React/Vite only when package tooling is available or explicitly requested.

## Important Collaboration Note

The user is concerned about UI proportions and whether the implementation will match their intent.

Therefore:

- Build in small visible milestones.
- Verify with screenshots.
- Keep UI close to references.
- Ask for feedback after the first full visual draft.
- Do not over-invent a different style.
- Favor faithful implementation over experimental redesign.
