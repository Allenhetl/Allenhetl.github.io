# Engineering & Design Standards

The conventions this site is built and maintained by. Read this before
making non-trivial changes. It complements [AGENTS.md](AGENTS.md) (build
commands) and the per-filetype guides in `.github/instructions/`.

---

## 1. Architecture at a glance

- **Generator:** Jekyll (al-folio theme), built in GitHub Actions.
- **Host:** Cloudflare Pages, serving the prebuilt `gh-pages` branch
  (no Cloudflare-side build). Custom domain: **allenhtl.com**.
- **Deploy chain:** push to `main` → Actions builds `_site` (ImageMagick
  responsive images, nbconvert, PurgeCSS, bilingual-leak check) →
  publishes to `gh-pages` → Cloudflare Pages serves it.
- **You never deploy by hand.** Push to `main`; the pipeline does the rest.

## 2. Design token system

All custom styling lives in `assets/css/main.scss`, after the `@use`
block, as plain CSS. **Never hard-code motion/shape/elevation values** —
use the tokens defined in `:root` (section "1. Design tokens"):

| Concern      | Tokens                                                                                          |
| ------------ | ----------------------------------------------------------------------------------------------- |
| Easing       | `--ease-standard`, `--ease-spring`                                                              |
| Duration     | `--dur-fast` `--dur-quick` `--dur-base` `--dur-med` `--dur-slow` `--dur-slower` `--dur-slowest` |
| Radius       | `--radius-sm` (4px), `--radius-md` (6px), `--radius-lg` (14px)                                  |
| Accent alpha | `--accent-wash`, `--accent-tint`, `--accent-glow`                                               |
| Elevation    | `--shadow-1/2/3` (theme-aware)                                                                  |

Rule of thumb: a new transition should reuse an existing duration tier,
not invent a new number. When snapping an existing value, round to an
**equal-or-faster** tier — never make an interaction slower.

The visual direction is **"Refined Minimal" + technical blueprint**:
light/dark themes, one saturated accent (`#2f4bd8` / `#8da4ff` dark),
distinctive type (Bricolage Grotesque + Hanken Grotesk), quiet motion.
Dark is the default theme. Keep changes within this system.

## 3. Motion & accessibility rules

- Every animation sits behind `@media (prefers-reduced-motion: no-preference)`
  or is disabled under `reduce`.
- Desktop-only flourishes (custom cursor, hero spotlight, coordinate
  readout, heading anchors) are gated `min-width: 768px` and/or
  `(pointer: fine)` so touch devices never run them.
- All interactive elements keep a visible focus state (two-layer ring).
- JS is progressive enhancement: the page must work with scripts off.
  Custom scripts are small, `defer`-loaded, and self-guarding.

## 4. Bilingual content (EN / ZH)

Both languages are authored inline and CSS-toggled — **not** Jekyll i18n.
Wrap content in `<span class="lang-en-only">…</span><span class="lang-zh-only">…</span>`
(or `<div … markdown="1">` blocks). Every content file must include BOTH
languages or one renders blank. CI runs `bin/check-bilingual-leaks.sh`
to ensure markup never leaks into `<title>`, meta, or JSON-LD. Templates
in `_news/_TEMPLATE.md.example` and `_projects/_TEMPLATE.md.example`.

## 5. Security & crawling

- **`_headers`** (Cloudflare Pages): CSP, HSTS, X-Frame-Options,
  X-Content-Type-Options, Referrer-Policy, Permissions-Policy, plus
  cache rules. When adding a new third-party embed, extend the matching
  CSP directive or it will be blocked.
- **`robots.txt`**: search engines allowed; AI training/dataset crawlers
  (GPTBot, ClaudeBot, CCBot, Google-Extended, …) disallowed.
- `_headers` and `_redirects` are copied to the site root via the
  `include:` list in `_config.yml`.

## 6. Code style

- **Prettier** formats everything (`.prettierrc`, printWidth 150). Run
  `npx prettier . --write` before committing; CI enforces it.
- **`.editorconfig`** pins UTF-8 + LF line endings (no more CRLF churn).
- CSS additions are appended as commented, numbered sections
  (`BP*` blueprint layer, `CR*` craft layer). Keep that structure.
- Prefer editing existing sections over scattering one-off rules.

## 7. Performance conventions

- Images: rely on the theme's responsive `figure.liquid` (auto webp at
  480/800/1400) with `loading="lazy"`; the hero photo is `eager`.
- Keep source images reasonable; very large originals (>1 MB) slow the
  build and mobile loads — prefer web-sized exports.
- PurgeCSS (`purgecss.config.js`) strips unused CSS; JS-injected /
  dormant-feature classes must be added to its `safelist`.

## 8. Before you commit — checklist

1. `npx prettier . --write`
2. Clean local build:
   `docker compose run --rm --user root jekyll sh -c "rm -rf _site .jekyll-cache && bundle exec jekyll build"`
3. Verify the change (localhost:8080 or grep the built output).
4. Commit with a clear message; push to `main` to deploy.
