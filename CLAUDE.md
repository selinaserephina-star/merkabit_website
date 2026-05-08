# CLAUDE.md — conventions for the Merkabit site

This file tells Claude Code (and any human collaborator) how this codebase is structured and the rules to follow when editing it.

## What this is

A small, hand-written static site — pure HTML/CSS/JS, no build step, no framework, no dependencies beyond Google Fonts. It is intentionally low-tech so any non-developer can reason about it and so it deploys to GitHub Pages with zero ceremony.

The site has a strong design system. **Match what is already there before inventing new patterns.**

## Palette (Option A — deep contemplative)

All colors live as CSS variables in `styles/site.css`. **Do not hard-code hex values in HTML or new CSS. Reference the variable.**

| Token | Hex / Value | Use |
|---|---|---|
| `--bg` | `#0A0F1F` | page background |
| `--bg-elev-1` | `#11172C` | cards, panels |
| `--bg-elev-2` | `#161D34` | nested panels, code blocks |
| `--ink` | `#F5F0E6` | primary text |
| `--ink-mid` | rgba(F5F0E6, 0.78) | secondary text |
| `--ink-dim` | rgba(F5F0E6, 0.55) | tertiary text, captions |
| `--ink-faint` | rgba(F5F0E6, 0.35) | dividers, ghosted text |
| `--gold` | `#D4AF37` | accent, links, geometry strokes |
| `--gold-soft` | `#C8A24A` | softer accent |
| `--copper` | `#B87333` | warm secondary accent |
| `--teal` | `#2C5F66` | cool accent (Quantum section) |
| `--line` | rgba(F5F0E6, 0.08) | hairline borders |
| `--line-strong` | rgba(F5F0E6, 0.16) | stronger borders |
| `--line-gold` | rgba(D4AF37, 0.32) | gold-tinted borders |
| `--status-open` | `#D4AF37` | falsifiability — open prediction |
| `--status-confirmed` | `#6FB78A` | falsifiability — confirmed |
| `--status-refuted` | `#C56B5C` | falsifiability — refuted |

## Typography

Three families, loaded once via Google Fonts at the top of every HTML file. Reference via tokens — never `font-family: Georgia` etc.

- `--font-display` — **EB Garamond**. All headings (`h1`–`h4`), pull quotes.
- `--font-body` — **Source Serif 4**. All body text, paragraphs, descriptions.
- `--font-mono` — **JetBrains Mono**. Eyebrows, captions, labels, code, status pills, paper IDs.

Heading sizes are fluid (`clamp()`). Body is 17px / 1.6 line-height. Eyebrow style: 11px mono, `letter-spacing: 0.16em`, `text-transform: uppercase`, gold.

`text-wrap: balance` is on by default for headings; `text-wrap: pretty` for paragraphs and list items.

## The four registers

The site speaks in four distinct voices. **Do not bleed copy across registers.**

| Register | Pages | Voice |
|---|---|---|
| **Science** | `science.html`, `papers.html`, `falsifiability.html`, `constants.html`, `five-faces.html`, `hardware.html`, `genesis.html` | Disciplined, terse, mathematical. No interpretive content. Predictions are pre-registered, signed, dated. |
| **Quantum** | `quantum.html` | Engineering register. Concrete primitives, gate counts, platform comparisons. Slightly cooler accent. |
| **Journey** | `journey.html` | First-person, contemplative, narrative. The book lives here. |
| **Services / About** | `services.html`, `about.html` | Plain professional. Five service paths; one founder. No "we" — the company is one person. |

The homepage (`index.html`) is the only place all four registers sit alongside each other, deliberately.

## File map

```
index.html              homepage (hero + four cards + latest)
about.html              founder bio + contacts + compact timeline
constants.html          15-constants wall
falsifiability.html     prediction tracker (status pills)
five-faces.html         PSL(2,7) interactive
genesis.html            Genesis Sequence — static ladder + animated engine
genesis-v1.html         older static-only Genesis (kept for reference; not in nav)
hardware.html           IBM Eagle r3 results
journey.html            personal/contemplative arc + book + timeline
papers.html             papers index
quantum.html            quantum stack (architecture, primitives, roadmap)
science.html            science register landing
services.html           five service paths

scripts/chrome.js       shared header + footer — every page mounts this
scripts/geometry.js     MerkabitGeo SVG library — single source of truth for figures
scripts/timeline.js     shared timeline component + data — index, about, journey
scripts/genesis-engine.js  17-rung animated Genesis (the cinematic version)
scripts/genesis-ladder.js  11-rung static reference ladder

styles/site.css         tokens, typography, primitives, components
styles/timeline.css     timeline component styles
```

## Page anatomy

Every page is the same skeleton:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>… · Merkabit</title>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
  <link href="https://fonts.googleapis.com/css2?family=EB+Garamond…" rel="stylesheet"/>
  <link rel="stylesheet" href="styles/site.css"/>
  <style>/* page-local styles only */</style>
</head>
<body>
  <div id="site-header"></div>
  <main>
    <!-- page content -->
  </main>
  <div id="site-footer"></div>
  <script src="scripts/geometry.js"></script>
  <script src="scripts/chrome.js"></script>
  <!-- any page-specific scripts last -->
</body>
</html>
```

The header and footer come from `scripts/chrome.js`. **Do not duplicate nav markup in pages.** To change the nav on every page at once, edit `chrome.js`.

## Geometry

All geometric figures (merkaba, Fano plane, pentachoron, 24-cell, etc.) come from `scripts/geometry.js` via the `MerkabitGeo` global:

```js
document.getElementById('hero-geo').innerHTML = MerkabitGeo.merkabit3D({ size: 200 });
```

**Do not draw geometry inline as one-off SVG**. If you need a new figure, add it to `MerkabitGeo` and reference it. Existing figures: `merkabit3D`, `fano`, `pentachoron`, `cell24`, plus a few smaller helpers. Stroke color is always `var(--gold)` unless the figure semantically calls for something else.

## Layout primitives

In `styles/site.css`:

- `.wrap` — content width container (default ~960px)
- `.wrap--wide` — wider container (~1200px)
- `.row` / `.row.gap-sm` / `.row.gap-md` — flex rows with gap
- `.btn`, `.btn--solid`, `.btn--ghost` — button variants (gold solid, gold-bordered ghost)
- `.pill` — small rounded label
- `.eyebrow` — 11px mono uppercase gold
- `.body`, `.lede`, `.txt-mid`, `.txt-dim`, `.txt-faint` — text-color/weight modifiers
- `.meta` — mono caption
- `.section` — vertical rhythm wrapper

Spacing scale: rely on `clamp(72px, 9vw, 132px)` for section vertical rhythm via `--section-y`. Inline gaps follow an 8/12/16/24/32/48/72 ladder. Border radii are tight: `--r-1: 2px`, `--r-2: 4px`. **No rounded-corner-with-gradient cards.** No bubbly UI. The aesthetic is editorial.

## Rules

1. **Use tokens, not values.** `var(--gold)`, not `#D4AF37`. `var(--font-display)`, not `"EB Garamond"`.
2. **Geometry through `MerkabitGeo`.** New figures get added to the library, not inlined.
3. **Header/footer through `chrome.js`.** Never duplicate nav markup in pages.
4. **One register per page.** Don't mix Science copy into Journey or vice versa.
5. **No frameworks.** No React, no Tailwind, no build step. If you reach for one, you're solving the wrong problem.
6. **No emoji.** Geometry, mono labels, and type carry meaning.
7. **No filler.** If a section feels empty, fix the layout. Don't invent content to fill it.
8. **No bubbly gradients or rounded-corner-with-left-border-accent cards.** The design is editorial; geometry is the visual language.
9. **Match what's there.** Before adding a new component pattern, check if a near-equivalent already exists.
10. **Pre-registered claims are dated, signed, and unchangeable in spirit.** Do not soften the falsifiability page.

## Working with the timeline

`scripts/timeline.js` exports `MerkabitTimeline` with the data array and three render modes:

```js
MerkabitTimeline.render({ target: '#timeline', mode: 'full' });    // alternating cards
MerkabitTimeline.render({ target: '#timeline', mode: 'compact' }); // stacked
MerkabitTimeline.render({ target: '#timeline', mode: 'highlights', limit: 4 }); // strip
```

To add a new event, edit the `EVENTS` array at the top of `timeline.js` and re-deploy. Each event has a stable hash anchor (`#2026-papers`, `#2025-burnout`).

## Performance & accessibility notes

- Images are minimal — site is mostly type + SVG.
- Geometry SVGs are lightweight and don't animate by default; `genesis-engine.js` does its own animation loop.
- Color contrast: `--ink` on `--bg` is ~13:1. `--ink-mid` is ~10:1. `--ink-dim` (0.55) drops to ~5:1 — keep at 14px+ when used for body.
- Honor `prefers-reduced-motion` for any new animations. The Merkaba hero rotation is gentle on purpose.

## Tests

There are none. This is a static site. Verification is "open it in a browser and look." Before pushing a substantial change, click through every page in the nav.
