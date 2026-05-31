# Theory Left Visual Design

## Goal

Add `05.png` as a left-side editorial visual for the theory timeline section so the section feels deeper and more visually balanced, while keeping the timeline and its cards as the primary reading focus.

## Approved Direction

- Use approach `L2`.
- Desktop: place `05.png` in the unused space to the left of the timeline.
- Tablet: move the image above the timeline block and reduce its size.
- Mobile: hide the image completely.

## Constraints

- Do not change any existing website text.
- Do not change font families or overall typography style.
- Do not change the order of timeline items.
- Do not move or distort the current vertical timeline structure.
- Do not let the image overlap the numbered timeline markers or the content cards.
- Do not introduce new text labels, captions, or fake content.

## Layout

### Desktop

- Keep the section heading at the top as it is now.
- Wrap the timeline portion in a dedicated layout container.
- Reserve a left column for the `05.png` visual.
- Keep the timeline and its content in a main column to the right, preserving the current reading flow.
- Size the left visual so it reads as supporting scenery, not a competing feature.
- Align the image roughly around the vertical band spanning timeline items `01` to `02`, so it visually anchors the start of the historical progression.

### Tablet

- Collapse the timeline area to a vertical stack.
- Move the image above the timeline content.
- Reduce the image width and height so the timeline remains dominant.

### Mobile

- Hide the image entirely.
- Preserve the existing mobile-first readability of the timeline and cards.

## Visual Treatment

- Render `05.png` as an editorial side visual, not as a hero-style card.
- Use a soft dark overlay to reduce the intensity of the red palette.
- Add a subtle edge mask or gradient fade so the image blends into the dark grid background.
- Use `object-fit: cover` unless the real render shows meaningful subject loss; if so, switch to `contain` only if it still feels integrated.
- Use a very light shadow and, at most, a subtle border radius.
- Keep the image visually quieter than both the hero image and the timeline cards.

## Motion

- Reuse the existing reveal system for fade-in on scroll.
- Allow only a light translate/opacity entrance.
- Do not add parallax or any strong independent animation.

## Implementation Notes

- Update the theory section markup in `src/app.js`.
- Add a dedicated theory layout wrapper and left-visual block in `src/styles.css`.
- Reuse the current section tone, spacing rhythm, and reveal behavior.
- Verify the final result at desktop, tablet, and mobile breakpoints.

## Verification

- Desktop: `05.png` is visible to the left of the timeline and does not overlap markers or cards.
- Tablet: `05.png` moves above the timeline and remains secondary.
- Mobile: `05.png` is hidden.
- All original text remains unchanged.
- The timeline order and structure remain unchanged.
- The section still feels calm, readable, and visually balanced.
