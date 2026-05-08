# HANDOFF.md — punch list

Status of the site at handoff. Use this as a starting backlog.

## Done

- All thirteen pages built and wired into the shared nav (`scripts/chrome.js`).
- Palette tokenised, typography system locked, geometry library (`MerkabitGeo`).
- Genesis page: animated 17-rung engine + static reference ladder.
- Five Faces of PSL(2,7): interactive selector with five views.
- Falsifiability: live status board (open / confirmed / refuted).
- 15 Constants wall.
- Animated Merkaba on the homepage hero.
- Timeline component in three variants (full / compact / highlights), shared across home, about, journey.
- Footer: GitHub, Zenodo, LinkedIn, contact email.
- Quantum landing page: cell hero, architecture stack, gate primitives, comparison table, roadmap.
- About page: founder bio, four contact cards, compact timeline.
- Services page: five tiers, all with "Enquire within" cards (no public pricing).

## Stubbed — needs real wiring

These work as visual placeholders but the underlying integration isn't there.

- **Buy on Amazon** buttons in `services.html` and `journey.html` — currently `href="#"`. Drop in the live ASIN URL when ready.
- **Read sample chapter** button on `journey.html` — needs a PDF link or modal.
- **IngramSpark** button on `journey.html` — needs the live URL.
- **Papers** entries on `papers.html` — titles and summaries are populated, but each "Read paper" link points at `#`. Hook each up to its Zenodo DOI when the paper is uploaded.
- **Contact / enquiry** on `services.html` and `about.html` — currently `mailto:selina@exoreaction.com`. Fine for v1; if volume grows, swap to a form (Formspree, Basin, or self-hosted).
- **Audit intake** on `services.html` Coherence Audit tier — currently the same mailto. Long-term this wants a structured form with payment, but that's out of scope for the static site.

## Queued — copy/content edits the user mentioned

- **Scaling Buddha — first edition, forthcoming.** The book is currently described as "second edition" in five places. Update to first edition + "forthcoming." Replace the bio with the user-supplied copy:

  > Most of us grow up believing life is something we push through. *Scaling Buddha* offers a different orientation: we are not moving through life as isolated agents but living inside a coherence system that responds to how aligned we are with its rhythms.
  >
  > This book is the human translation of the Merkabit framework — a body of work proposing that coherence governs whether complex systems persist or collapse, derived from geometry and confirmed in physics, biology, and quantum hardware. The chapters move from phase space into lived experience, exploring how humans undergo phase transitions, how families transmit coherence, how AI is becoming a real partner in coherence work, and how the descent from octonions to matter places consciousness back inside the geometry — not as metaphor but as architecture.
  >
  > The next leap for humanity is learning how to remain coherent while operating systems of unprecedented complexity.

  Locations to update:
  - `services.html` (h2, body paragraph, editions panel)
  - `journey.html` (h2, two narrative paragraphs, book-cover overlay text)
  - `index.html` (the "Latest" entry currently says "v2 — second edition published")
  - `scripts/timeline.js` (the 2026-Q1 event mentions "second edition")
  - `about.html` (the timeline event mentions "second edition")

- **Thor Henning Hetland section.** The user wants to add a section acknowledging Thor Henning Hetland (https://wiki.totto.org/about/) for hardware testing, the Claude Code setup, and access to his ExoCortex rig. Most natural home is the About page collaborator block, possibly mirrored on the Hardware page (he's the operator behind the IBM Eagle r3 verification work). Pull biographical details from his wiki — keep it short (3–4 sentences) and link out.

## Nice-to-have

- **Custom domain.** Add a `CNAME` file with `merkabit.com` (or chosen domain). DNS instructions in README.
- **OG / Twitter cards.** None are set. Add `<meta property="og:*">` tags per page — site name, page title, a 1200×630 OG image (the Merkaba on the deep-indigo background works).
- **Favicon.** Currently none. A small Merkaba glyph (16/32/180px) would suit.
- **Sitemap.xml + robots.txt.** Trivial to add for a static site this size.
- **`prefers-reduced-motion` audit.** The hero Merkaba rotation and Genesis engine should ramp down for users who request it. The engine has manual play/pause but auto-play should respect the media query.
- **Mobile review.** Designed-for-desktop mostly; quick sweep of every page at iPhone widths before launch.
- **Print stylesheet for the falsifiability tracker.** It would make a useful one-pager.

## Out of scope (do not build without asking)

- A community / forum / comments.
- A blog or CMS.
- Sign-in or accounts.
- E-commerce. The numbered edition of the book is sold "by arrangement" — that line is deliberate.
- Any AI chatbot or "ask the framework" widget.
- Newsletter signup. Selina explicitly does not want to harvest emails for marketing.

## Deployment

GitHub Pages, root of the `main` branch. See `README.md` for the one-time setup. The site has no secrets, no env vars, no API keys, no server-side code.
