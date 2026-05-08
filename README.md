# Merkabit — public site

Static HTML/CSS/JS. No build step, no framework, no dependencies. Open `index.html` in a browser and it works.

## Local preview

From inside this folder:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

(Or any other static server — `npx serve`, VS Code Live Server, etc. The site uses Google Fonts via CDN, so you need internet on first load.)

## Deploy to GitHub Pages

1. Create a new GitHub repo (public or private — Pages works on both with a paid plan; public is free).
2. From this folder:
   ```bash
   git init
   git add .
   git commit -m "Initial commit — Merkabit v1"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```
3. On GitHub: **Settings → Pages → Build and deployment**
   - Source: **Deploy from a branch**
   - Branch: **main** / **/ (root)**
   - Save. First deploy takes ~1 minute.
4. Site appears at `https://<your-username>.github.io/<repo-name>/`.
5. Custom domain (optional): add a `CNAME` file at the root containing just `merkabit.com` (or your domain), then point your DNS at GitHub Pages per [their docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site).

The empty `.nojekyll` file in this folder tells GitHub Pages **not** to run the Jekyll build — important, because Jekyll ignores files starting with `_` and would silently break things.

## Folder layout

```
merkabit-site/
├── index.html              homepage
├── about.html              ·
├── constants.html          15-constants wall
├── falsifiability.html     prediction tracker
├── five-faces.html         PSL(2,7) interactive
├── genesis.html            Genesis Sequence (animated engine + static ladder)
├── genesis-v1.html         older static-only version (kept for reference)
├── hardware.html           IBM Eagle r3 results
├── journey.html            personal/contemplative register
├── papers.html             papers index
├── quantum.html            quantum stack landing
├── science.html            science register landing
├── services.html           talks · workshops · advisory · book · audit
├── scripts/
│   ├── chrome.js           shared header + footer (loaded on every page)
│   ├── geometry.js         MerkabitGeo SVG library — all geometric figures
│   ├── timeline.js         shared timeline component + data
│   ├── genesis-engine.js   the cinematic 17-rung Genesis animation
│   └── genesis-ladder.js   the static reference ladder on the Genesis page
├── styles/
│   ├── site.css            tokens, typography, primitives
│   └── timeline.css        timeline component styles
├── README.md               this file
├── CLAUDE.md               conventions for Claude Code (or any human dev)
├── HANDOFF.md              status: what's done, what's stubbed, what's queued
└── .nojekyll               tells GitHub Pages: do not run Jekyll
```

## Editing

This is intentionally a small, hand-written site — no React, no build, no router. Edit an HTML file, refresh the browser, see the change. The shared header/footer is rendered into `<div id="site-header">` / `<div id="site-footer">` by `scripts/chrome.js`; edit it there to change the nav on every page at once.

See `CLAUDE.md` for conventions (palette tokens, type tokens, the geometry library, the register split) before making substantive changes.

See `HANDOFF.md` for the punch list of stubbed and queued items.
