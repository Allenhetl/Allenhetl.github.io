# design-tokens — a shared semantic contract, per-site themes

**Status:** design (awaiting user review) · **Date:** 2026-07-04 ·
**Owner:** Allenhetl · **Lives in:** `web-standards` (new `design-tokens/`
layer) · **Builds on:** the v2 core/profiles philosophy.

## Problem & intent

Allen wants a shared visual **system as an interface**, not a uniform brand:
a common **semantic contract** (token names + meaning) so structure is
unified and anything written against it is portable, while **each site
supplies its own theme** (palette, fonts) so styles stay diverse. This is the
same `core` (interface) + `profiles` (per-site implementation) split the
repo already uses for CI, applied to visual tokens.

Confirmed decisions (brainstorm):

- **Form:** token source + build-time generator (not a shared CSS file, not
  just a naming convention).
- **Depth:** raw tokens **+ a semantic layer** (the semantic layer IS the
  contract). **No shared component layer** — the two sites' build stacks and
  HTML differ too much; tokens/semantics only.
- **Home & timing:** in `web-standards/design-tokens/`; **generated output is
  committed** (sites reference artifacts, zero build-time dependency),
  mirroring the repo's "products in git" approach.

This design was grounded by inventorying the real personal-site tokens and
the private site's constraints, then adversarially gap-checked; the fixes
from that review are folded in below (see "Corrections from review").

## Architecture

```
web-standards/design-tokens/
├── contract/
│   └── contract.mjs        # THE interface: the semantic token list + meta
│                           #   { token, category, dark: "required"|"invariant", purpose }
├── themes/
│   ├── allen-blue.mjs      # personal site: raw palette+fonts + semantic→raw + dark
│   └── (phd theme, Phase 3)
├── build/
│   └── generate.mjs        # zero-dep Node ESM; contract + theme → target files
└── dist/                   # COMMITTED generated artifacts
    ├── allen-blue/_tokens.scss
    └── (phd/tokens.css, Phase 3)
```

**Themes and the contract are `.mjs` modules exporting plain objects**, not
YAML. Rationale (from review): a hand-rolled YAML micro-parser is
unnecessary risk — `.mjs`/JSON is truly zero-dependency, zero-parser, and
lets values hold commas/parens/quotes/colons (font stacks, shadows, rgba)
without escaping gymnastics. `import()` is the parser.

### Two tiers

- **Raw tier** (private to each theme): palette + fonts + scale primitives
  (`blue600: "#2f4bd8"`, `paper: "#fdfcfa"`, `durBase: "0.3s"`, …), plus a
  dark sibling for every dark-varying value. Never referenced by site CSS;
  may differ freely between sites.
- **Semantic tier** (the contract): the only surface site CSS writes
  against. Stable across sites = "structure unified". A theme maps each
  semantic token → one of its raw keys.

## The semantic contract (v1)

29 tokens, derived from the real personal-site inventory. `dark` column:
`req` = a conformant theme must supply a dark value; `inv` = identical in
both modes (fonts, motion, shape).

| Token                        | dark | Purpose (allen-blue example)                                                                                                                                                                              |
| ---------------------------- | ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--accent`                   | req  | Brand/emphasis: links, active nav, focus, badges (`#2f4bd8` / `#8da4ff`). Absorbs the redundant `--global-highlight-color` (grep-confirmed always equal).                                                 |
| `--accent-hover`             | req  | Hover/active accent (`#1f37b0` / `#aab8ff`).                                                                                                                                                              |
| `--text-on-accent`           | req  | Readable foreground **on** accent fills (active nav text, hover pills). = white today; a real slot so dark accent stays legible. **(added in review)**                                                    |
| `--bg`                       | req  | Page canvas (`#fdfcfa` light).                                                                                                                                                                            |
| `--surface`                  | req  | Raised card/panel fill (`#ffffff` light).                                                                                                                                                                 |
| `--surface-code`             | req  | Code/`pre`/`.highlight` block fill. **Value = the site's current `--global-code-bg-color` (`$code-bg-color`, a purple tint), NOT accent-blue** — preserving today's appearance. **(corrected in review)** |
| `--text-primary`             | req  | Body + heading ink (`#18191d` light).                                                                                                                                                                     |
| `--text-muted`               | req  | Secondary text: meta, captions (`#5c5e68` light).                                                                                                                                                         |
| `--border`                   | req  | Hairline borders/dividers/rules (`#e9e7e1` light).                                                                                                                                                        |
| `--accent-wash`              | req  | Faintest accent alpha (0.05 / 0.06 dark).                                                                                                                                                                 |
| `--accent-tint`              | req  | Light accent alpha (0.09 / 0.10 dark).                                                                                                                                                                    |
| `--accent-glow`              | req  | Strong accent alpha for glows (0.40 / 0.45 dark).                                                                                                                                                         |
| `--font-display`             | inv  | Heading/display stack (Bricolage → Hanken → system).                                                                                                                                                      |
| `--font-body`                | inv  | Reading stack (Hanken → system, incl. CJK).                                                                                                                                                               |
| `--font-mono`                | inv  | Mono stack (JetBrains Mono → system).                                                                                                                                                                     |
| `--ease-standard`            | inv  | House glide `cubic-bezier(0.2,0.7,0.2,1)`.                                                                                                                                                                |
| `--ease-spring`              | inv  | Rare spring `cubic-bezier(0.34,1.56,0.64,1)`.                                                                                                                                                             |
| `--dur-fast … --dur-slowest` | inv  | Motion duration scale (7 rungs: 0.18/0.22/0.3/0.4/0.55/0.7/0.85s). Kept whole for parity with the current site; the offline site simply uses fewer.                                                       |
| `--radius-sm/md/lg`          | inv  | Shape scale (4/6/14px).                                                                                                                                                                                   |
| `--shadow-1/2/3`             | req  | Elevation scale (dark variants differ).                                                                                                                                                                   |

**Deferred, documented (not in v1):** a `--space-*` scale (spacing stays
ad-hoc on both sites today; adding it later is a contract **minor** version
bump, and both themes must then implement it). `--bp-grid-color` (a 4th
accent-alpha at 0.045, hero-blueprint-specific) stays a personal-site-local
token, not contract. A `--focus-ring` composite is deferred; focus uses
`--accent` + `--accent-glow` for now.

## Generator (`build/generate.mjs`)

Zero-dep Node ESM: `fs` + dynamic `import()` of the contract and theme
modules + hand-written string emitters. No Style Dictionary, js-yaml,
PostCSS.

- **CLI:** `node build/generate.mjs --theme themes/allen-blue.mjs --target scss --out dist/allen-blue/` and `--all` (all themes × their targets), `--check` (conformance, no write).
- **Resolve:** for each contract token, `light[token] = raw[ semantic[token] ]`; `dark[token] = raw[ theme.dark[token] ]` where present (others inherit light).
- **Emitters (pure `model → string`):**
  - **SCSS** (Jekyll target): a `_tokens.scss` partial emitting plain CSS custom properties (`:root { --token: value; }` — passthrough for Dart-Sass) **and a dark block** (see cascade fix below). **No `@import` for fonts** — the personal site already loads webfonts via a `<link>` in `_includes/head.liquid` from `_config.yml`; the emitter must not double-load. **(corrected in review)**
  - **inlinable CSS** (Node/offline target, Phase 3): self-contained `:root{}` + `@media (prefers-color-scheme: dark){:root{}}`, no `@import`/external refs, CSP-inline-safe, system-font stacks only.

## The dark-mode cascade fix (highest-risk item, resolved)

**Verified against `_sass/_themes.scss`:** al-folio sets `--global-bg-color`,
`--global-text-color`, `--global-divider-color`, `--global-card-bg-color`
(and ~18 more `--global-*`) inside `html[data-theme="dark"]{}` —
specificity (0,1,1). A `:root`-level alias (`--global-bg-color: var(--bg)`)
is (0,1,0) and **loses in dark mode**. So the personal-site integration is
**not** "replace the `:root` block"; it is:

1. The generated `_tokens.scss` defines the **semantic tokens** in `:root`
   and their dark values in an `html[data-theme="dark"]{}` block (matching
   the site's existing JS toggle).
2. A **hand-written, thin alias bridge** (also in `main.scss`, committed to
   the site — not generated) maps the al-folio `--global-*` names the
   vendored theme/partials rely on to semantic tokens. Crucially, aliases
   that al-folio overrides in dark **must also be emitted inside a
   `html[data-theme="dark"]{}` block** so they win at equal specificity — or
   simply left pointing at `--global-*` where al-folio already themes them
   correctly. The safe rule: **only alias `--global-*` → semantic where it
   changes nothing in either mode**; where al-folio's dark value already
   matches the theme, leave it.
3. **`_themes.scss` survives intact.** It defines ~22 live `--global-*`
   tokens the site uses (footer, newsletter, tip/warning/danger blocks,
   back-to-top, code-bg, …) that are out of contract scope and are **not**
   deleted. The site keeps two token tiers; the contract governs the shared
   visual language, `_themes.scss` keeps al-folio's component specifics.

## Migration scope (personal site) — a pure, bounded rename

- **Codemod only Allen's own custom CSS** (the `BP*`/`CR*` sections of
  `main.scss`) from raw `--global-theme-color`/`--accent-*`/`--shadow-*` to
  the semantic names. **Do NOT rewrite vendored al-folio partials**
  (`_sass/_blog`, `_cv`, `_publications`, `_navbar`, `_distill`,
  `_utilities`, …) — they keep using `--global-*`; rewriting them would make
  every future upstream theme sync a merge conflict for a solo maintainer.
  **(scope fixed in review)**
- Because semantic values resolve identical to today's, computed styles are
  unchanged **by construction** — this is a rename, not a restyle. The one
  intentional exception to double-check is `--surface-code` (kept at the
  current purple tint, not recolored).

## Verification

- **Contract conformance** (`generate.mjs --check`, mirrors the repo's
  headers-assert "stricter never looser"): fails with `::error::` + non-zero
  if a contract token is missing from `theme.semantic`, maps to an absent
  raw key, is `dark:required` but missing a dark ref, or `theme.dark`
  references a non-contract token. Extra site-private tokens are allowed
  (warned).
- **Appearance preservation** (the real guard, scoped correctly per review):
  capture `getComputedStyle(document.documentElement)` for the full token
  set in **both** light and dark from the **rendered** site (not read out of
  `main.scss` — the at-risk dark/code values live in `_themes.scss`), before
  and after migration; assert equality. Plus the site's existing axe +
  Lighthouse + build-diff CI.
- **Regeneration check** (lightweight): a `--all` regen + `git diff
--exit-code dist/` step so committed artifacts can't silently rot or be
  hand-edited. Run locally / in the existing format-check job — **no new
  per-repo governance apparatus** (see below).

## Deliberately NOT doing (YAGNI, from review)

- **No custom YAML parser** — themes are `.mjs`/JSON (parser-free).
- **No new semver/tag governance or dedicated caller-workflow just for
  tokens.** At two-sites-one-maintainer scale, a `generate` + the existing
  regeneration diff + a local pre-commit regen is proportionate. Token
  removals/renames are coordinated the same way as any web-standards change
  (it's already tagged `@v2`).
- **No permanent `tokens.json` CI-snapshot baseline** as standing overhead —
  the one-time migration uses a before/after `getComputedStyle` diff; that's
  enough. (A JSON emit target can be added later if a downstream tool needs
  it.)
- **No shared component layer**, no spacing scale in v1, no `--focus-ring`
  composite, no accent-alpha color-math validation (a code comment "update
  these together" suffices).
- **One dark strategy per target** (Jekyll: `data-theme`; offline:
  `prefers-color-scheme`), no cross-target opt-ins.

## Phases

1. **Phase 1 — the system.** `contract.mjs`, `generate.mjs` (+ `--check`,
   `--all`), `themes/allen-blue.mjs` (from the captured inventory), the SCSS
   emitter, generated `dist/allen-blue/_tokens.scss`, `docs/DESIGN-TOKENS.md`
   (how to add a theme / target). Conformance + regen checks pass. **No site
   touched yet.**
2. **Phase 2 — personal site adopts (appearance-preserving).** `@use` the
   generated partial, add the thin dark-cascade-aware alias bridge, codemod
   only custom CSS, keep `_themes.scss`. Prove via before/after
   `getComputedStyle` diff (light+dark) + existing CI green.
3. **Phase 3 — private site theme + adopt.** A `phd` theme + the inlinable
   CSS target; wire into `build.mjs`'s generated `<style>`, honoring CSP.
   (Its own spec/plan when reached.)

## Corrections from the adversarial review (folded in above)

1. Dark cascade actually loses for bg/text/border/surface → aliases must be
   dark-block-aware; only alias where it changes nothing (verified in
   `_sass/_themes.scss`).
2. `_themes.scss` defines ~22 live `--global-*` tokens → it survives; the
   migration is not a `:root` replacement.
3. Fonts already load via head `<link>` → no `@import` in the SCSS target.
4. `--surface-code` corrected to the current purple code-bg (was proposed as
   accent-blue — a silent restyle).
5. Added `--text-on-accent` (real slot, ~5 live uses).
6. Codemod scope limited to custom CSS, never vendored al-folio partials
   (upstream-merge safety).
7. Dropped: custom YAML parser (→ `.mjs`), token governance apparatus,
   permanent JSON CI baseline (→ one-time computed-style diff).
8. Usage counts treated as approximate, not encoded as authoritative.

## Risks

- **Dark alias cascade** remains the single highest-risk step — mitigated by
  the dark-block rule + the both-modes computed-style diff.
- **Webfonts don't render on the offline target** (system stacks only), so
  the two sites' display type differs despite sharing `--font-display` — by
  design; stated for clarity.
- **Committed artifacts can rot** if hand-edited — the regen diff catches it
  (add a pre-commit regen hook if it proves necessary).
