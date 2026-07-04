# web-standards v2 — layered core + profiles

**Status:** approved (design) · **Date:** 2026-07-04 · **Owner:** Allenhetl ·
**Builds on:** [2026-07-04-web-standards-design.md](2026-07-04-web-standards-design.md),
[2026-07-04-web-standards-hardening-design.md](2026-07-04-web-standards-hardening-design.md)

## Problem

`web-standards` v1 was extracted from the public al-folio personal site, so
it silently assumes **every** consumer is a public Jekyll site: Ruby build,
public robots + sitemap, CDN-friendly CSP, JS+Ruby CodeQL. Allen's second
site — `phd-advisor-db` — is the near-exact opposite (pure Node build,
private + `noindex` + Cloudflare Access, zero third-party resources,
`default-src 'none'` CSP, security headers **generated** by `build.mjs`).
Naively onboarding it wouldn't make it "conformant" — it would **downgrade a
site that is already more secure than the standard.**

Allen wants a **flowable site-building system**: create various kinds of
sites easily, share a common brand, and manage them well. v2 restructures
`web-standards` so it genuinely supports _multiple site types_ instead of
assuming one, and documents the process end to end.

Confirmed direction: **layered architecture (core + profiles)**, planned for
the future (more site types will come).

## Goals

1. **Separate the truly-universal from the site-type-specific.** Universal
   logic (CI mechanics, formatting) lives in `core/` and is parameterized;
   per-type differences (build command, robots, CSP posture, CodeQL
   languages) live in `profiles/`.
2. **Support N site types by adding a profile directory**, not by copying
   workflows or adding branching. Adding a profile must not touch `core/`.
3. **Never downgrade a site.** The private site keeps its stricter posture;
   the standard learns from it (it becomes the `node-private` profile
   template).
4. **Assertion-based validation for generated configs.** For sites that
   _generate_ `_headers`/`robots.txt` (like the Node site), the standard
   ships _reference requirements_ and CI asserts the generated output
   _satisfies_ them — it does not overwrite the generated files or demand
   byte-equality.
5. **A cross-profile baseline for build / CSP / robots — NOT a free-for-all.**
   build, CSP, and robots differ per site type, but they are **not** left
   entirely to each profile's discretion. The standard defines a **minimum
   requirement floor** every profile must satisfy, enforced by assertion:
   - **CSP floor** (all profiles): `object-src 'none'`, `base-uri` restricted
     (`'self'`/`'none'`), `frame-ancestors` restricted, no `unsafe-eval`,
     `default-src` declared. A profile may be stricter (node-private goes to
     `default-src 'none'`), never looser.
   - **robots floor** (all profiles): must declare a deliberate, coherent
     policy — either public-with-sitemap **or** noindex+`Disallow: /` — never
     absent, contradictory, or accidentally indexable-when-private.
   - **build floor** (all profiles): the build must pass the standard's
     build+validate gate (build succeeds, `site-dir` output is produced,
     required security headers are present in the output).
     The floor is a shared baseline; the profile is where a site goes beyond it.
6. **Document the flow** so future-Allen (or an agent) can pick a profile and
   stand up a new site without re-deriving any of this.

## Non-goals

- Not unifying layout or content across sites (correctly site-specific).
- Not unifying build tools (Jekyll vs Node is fine and expected).
- Not the visual **design system** (shared brand tokens) — Allen wants this
  ("统一风格") and it IS planned, but as a **separate follow-up project after
  v2** (call it the "brand-system" project). v2 is about standards/CI/security
  only. The brand system will likely become another shared layer the profiles
  reference; the layered v2 architecture is deliberately built so it can slot
  in later without rework.
- Not migrating the private site's build to static `_headers` (that would
  downgrade it).

## Architecture

```
web-standards/  (v2; published as tag @v2. @v1 stays alive untouched so the
                 personal site is unaffected until it deliberately migrates.)
│
├── core/                       # universal — every site, every profile
│   ├── (reusable workflows live in .github/workflows/, see note)
│   ├── baseline-requirements.yml  # the CSP/robots/build FLOOR every profile
│   │                              # must meet (Goal 5); profiles tighten it
│   └── formatting/
│       ├── .editorconfig
│       ├── .prettierrc
│       └── .prettierignore     # generic base (node_modules, standards/, …)
│
├── .github/workflows/          # reusable workflows (workflow_call).
│   │                           # GitHub REQUIRES these here, not under core/.
│   ├── build.yml               # NEW: parameterized build+serve
│   │                           #   inputs: build-cmd, site-dir, runtime
│   ├── accessibility.yml        #   inputs: build-cmd, site-dir, url
│   ├── lighthouse.yml           #   inputs: build-cmd, site-dir, thresholds
│   ├── broken-links.yml         #   inputs: build-cmd, site-dir
│   ├── format-check.yml         #   (already generic) prettier-packages input
│   ├── codeql.yml               #   input: languages
│   ├── standards-drift.yml      #   static-root-file drift (jekyll-public)
│   └── headers-assert.yml       # NEW: assertion check for generated headers
│
├── profiles/
│   ├── jekyll-public/           # = today's v1 behavior, repackaged
│   │   ├── profile.yml          # manifest: build-cmd, site-dir, langs, …
│   │   ├── caller-workflows/    # thin stubs wired with this profile's inputs
│   │   ├── root-files/          # public _headers (CDN allowlist), robots+sitemap
│   │   └── README.md            # what this profile is for
│   │
│   └── node-private/            # derived from phd-advisor-db's STANDARDS.md
│       ├── profile.yml          # build-cmd: npm run build, site-dir: site, langs:[js]
│       ├── caller-workflows/    # stubs using build.yml + headers-assert.yml
│       ├── headers-requirements.yml  # required CSP directives & security headers
│       │                             # (default-src 'none', connect-src 'none',
│       │                             #  X-Robots-Tag: noindex, …) for assertion
│       └── README.md
│
├── bin/
│   ├── onboard.sh --profile <name>   # profile-aware onboarding
│   ├── sync-standards.sh             # (jekyll-public root-file sync; unchanged)
│   └── check-drift.sh
│
├── docs/
│   ├── BUILDING-A-SITE.md      # THE decision guide: which profile for which site
│   ├── creating-a-profile.md   # how to add profile #3, #4 (future-facing)
│   └── security-notes.md
│
├── CHANGELOG.md   SECURITY.md   README.md   ENGINEERING.baseline.md
```

> **GitHub constraint:** `workflow_call` workflows MUST live in
> `.github/workflows/`, not under `core/`. So "core logic" is _conceptually_
> in core but _physically_ in `.github/workflows/`; `core/` holds the
> non-workflow universal assets (formatting configs). Profiles reference the
> workflows by passing their `profile.yml` values as inputs.

### The key abstraction: logic is parameterized, profiles are config

A reusable workflow contains the logic **once**. A profile is a small set of
**values + differing files**, never a second copy of the logic:

```yaml
# profiles/node-private/profile.yml  (illustrative)
name: node-private
build-cmd: "npm run build"
site-dir: "site"
codeql-languages: '[{"language":"javascript-typescript","build-mode":"none"}]'
headers: generated # site generates _headers; assert, don't sync
robots: generated
```

```yaml
# profiles/jekyll-public/profile.yml
name: jekyll-public
build-cmd: "bundle exec jekyll build"
site-dir: "_site"
codeql-languages: '[{"language":"javascript-typescript",...},{"language":"ruby",...}]'
headers: static # _headers is a synced root file
robots: static
```

`build.yml` (new, parameterized) takes `build-cmd`/`site-dir`/`runtime` and
does the right thing for either stack. The Jekyll-specific steps
(ImageMagick, PurgeCSS, `_config.yml` patching) move behind a
`runtime: jekyll` conditional so a Node build skips them.

### Generated-config validation (the private-site case)

The private site generates `_headers` via `build.mjs`. v2 does **not**
overwrite it. Instead:

- `profiles/node-private/headers-requirements.yml` lists the security
  guarantees that must hold (e.g. `connect-src` must be `'none'`,
  `X-Robots-Tag` must contain `noindex`, `default-src` must be `'none'`).
- `headers-assert.yml` (reusable) runs after the site's build, reads the
  generated `site/_headers`, and **asserts each requirement is present**.
  It fails CI if the site's generated headers ever drop below the bar.

This gives the same guarantee as jekyll-public's byte-drift check
("security config can't silently degrade") but by **assertion**, respecting
that the file is generated. This assertion mechanism is a general v2
capability, usable by any future profile with generated configs.

### The cross-profile baseline floor (Goal 5)

Two layers of check, so build/CSP/robots are governed even though they
differ per profile:

1. **`core/baseline-requirements.yml`** — the floor EVERY profile must meet
   (CSP: `object-src 'none'`, restricted `base-uri` + `frame-ancestors`, no
   `unsafe-eval`, `default-src` present; robots: a coherent public-or-noindex
   policy declared; build: gate passes and produces `site-dir`).
2. **`profiles/<name>/headers-requirements.yml`** — the profile's own,
   _stricter-or-equal_ requirements (node-private adds `default-src 'none'`,
   `connect-src 'none'`, `X-Robots-Tag: noindex`).

`headers-assert.yml` checks the effective headers against **baseline ∪
profile** requirements. jekyll-public's static `_headers` is checked against
the baseline too (not just byte-drift) so even the public site can't drop
below the floor. A profile can only _tighten_ the baseline, never loosen it —
the assertion enforces this because it's the union, and the plan includes a
test that a profile requirement contradicting the baseline is rejected.

## Versioning & migration safety

- v2 ships as tag **`@v2`** + moving `v2`. **`@v1` and its moving tag stay
  untouched** — the personal site keeps working on `@v1` until Phase 1
  explicitly migrates and verifies it.
- CHANGELOG documents the `@v1 → @v2` migration (breaking: caller stubs now
  carry profile inputs).
- Rollback at every phase: if `@v2` misbehaves, a consumer flips back to
  `@v1` (one line) and is fine.

## Rollout — 3 phases, each independently verifiable

### Phase 1 — build core + repackage v1 as `jekyll-public`

- Add `build.yml` (parameterized) + move Jekyll steps behind `runtime`.
- Parameterize accessibility/lighthouse/broken-links with build-cmd/site-dir.
- Create `profiles/jekyll-public/` reproducing today's exact behavior.
- Publish `@v2`. Migrate **the personal site** `@v1 → @v2` on a branch,
  open PR, confirm **all CI green** (this proves the refactor is behavior-
  preserving). `@v1` remains as fallback.
- **Exit criteria:** personal site CI identical-green on `@v2`.

### Phase 2 — author `node-private` + onboard the private site

- Derive `profiles/node-private/` from `phd-advisor-db`'s real
  `STANDARDS.md` + `build.mjs` output (already read: `default-src 'none'`,
  `connect-src 'none'`, 3-layer noindex, `npm run build` → `site/`).
- Add `headers-assert.yml` + `headers-requirements.yml`.
- Onboard `phd-advisor-db` on a branch: add the **universal** pieces it
  lacks (prettier/editorconfig, format-check CI, Dependabot, CodeQL-JS) and
  the `headers-assert` CI — **without** touching its build, CSP, or robots.
  Open PR, confirm green, confirm the site is **not downgraded**.
- **Exit criteria:** private site gains CI + formatting + header-assertion,
  keeps its stricter posture; PR green.

### Phase 3 — the flow documentation

- `docs/BUILDING-A-SITE.md`: a decision guide — "starting a new site? pick a
  profile: public showcase → jekyll-public; private data app → node-private;
  neither fits → see creating-a-profile.md." Includes the exact onboard
  command per profile and the human checklist.
- `docs/creating-a-profile.md`: how to add profile #3+ (copy an existing
  profile dir, edit `profile.yml`, list differing root files / header
  requirements, no core changes).
- Update README/CHANGELOG.
- **Exit criteria:** Allen (or an agent) can stand up a new site of either
  existing type by following the doc, with no re-derivation.

## Risks & mitigations

- **Refactor breaks the personal site.** → Phase 1 keeps `@v1` alive and
  only migrates behind a PR that must be green; instant rollback.
- **build.yml parameterization is leaky** (a Jekyll step runs on a Node
  build). → gate every stack-specific step behind `runtime`; Phase 1 exit
  criteria (identical-green personal CI) catches leaks.
- **node-private assertion too weak/strong.** → derive requirements directly
  from the private site's _current_ generated `_headers` (already captured),
  so it starts exactly at today's posture, then can only tighten.
- **Scope creep into the design system.** → explicitly out of scope; v2 is
  standards/CI/security only. The brand/token system is a later project.
- **Over-engineering for 2 sites.** → accepted deliberately: Allen confirmed
  more site types are coming; the layered design is the planned foundation,
  and Phase 3 makes adding the _next_ type cheap.

## Open questions

None blocking. Profile manifest format (`profile.yml` keys) will be
finalized in the implementation plan; the set above is sufficient for the
two known profiles and extensible.
