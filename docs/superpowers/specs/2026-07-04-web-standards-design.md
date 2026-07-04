# web-standards — a single source of truth for personal/academic sites

**Status:** approved · **Date:** 2026-07-04 · **Owner:** Allenhetl

## Problem

Allen maintains multiple static sites (this personal site `allenhtl.com`,
a forthcoming PhD site, likely more later). Each has accumulated — or will
accumulate — its own security headers, CI, formatting rules, and
engineering conventions. Without a shared standard, every site drifts into
its own inconsistent configuration. We want one authoritative place that
defines the baseline, and a mechanism that makes every site **conform on
onboarding, stay in sync on upgrade, and fail loudly on drift.**

Scope of the standard (all four confirmed in scope):

1. **Security baseline** — headers/CSP, robots, dependency/code scanning.
2. **Engineering / code conventions** — formatting, editorconfig, pre-commit,
   commit hygiene.
3. **CI / deploy** — accessibility, broken-link, Lighthouse, format, CodeQL.
4. **Design / content conventions** — design-token baseline, SEO, a11y,
   bilingual content structure (documented, not enforced by tooling).

## Non-goals

- **Not** a Jekyll theme or content template. Sites keep their own themes.
  The standard is language-/framework-neutral where it can be, and
  Jekyll-specific only where a file genuinely is (e.g. the deploy workflow).
- **Not** i18n tooling. Bilingual content stays inline + CSS-toggled per the
  existing convention; the standard only documents it.
- **Not** a monorepo. Sites remain independent repos.

## Chosen approach — "C, pragmatic form"

A dedicated **`web-standards` repository** is the single source of truth.
Sites consume it through **four mechanisms**, each solving a distinct drift
problem. This is the most engineered, lowest-drift form that still works on
static sites and on a Windows dev machine.

| Layer                      | Mechanism                                                | Covers                                                                                         | Drift protection                                                |
| -------------------------- | -------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| 1. CI                      | Reusable workflows (`workflow_call`)                     | axe, broken-links, Lighthouse, prettier, CodeQL                                                | Fully automatic — change once, every site picks it up next run  |
| 2. Shared read-only assets | Git submodule `standards/`                               | engineering baseline, `bin/` scripts, templates, CSP notes                                     | Submodule pointer; `git submodule update --remote` pulls latest |
| 3. Root-required files     | Authoritative copies in submodule + auto-sync + CI check | `_headers`, `robots.txt`, `.editorconfig`, `.prettierrc`, `.prettierignore`, pre-commit config | pre-commit regenerates from source; CI fails on mismatch        |
| 4. Onboarding              | `bin/onboard.sh`                                         | wires all of the above into a site in one run                                                  | "Onboarded" == "conformant"                                     |

### Why not the simpler options

- **A (docs + manual copy):** relies on discipline; drifts.
- **B (docs + sync script):** better, but no enforcement.
- **C** adds the two enforcement teeth — reusable workflows (zero-touch CI)
  and a CI drift check (hard contract on root files) — which is what
  "not chaotic" actually requires.

## Repository structure

```
web-standards/
├── README.md                       # what this is, how to onboard a site
├── CHECKLIST.md                    # step-by-step onboarding (human-facing)
├── ENGINEERING.baseline.md         # language-neutral engineering baseline
│
├── .github/workflows/              # LAYER 1 — reusable workflows
│   ├── accessibility.yml           #   on: workflow_call  (axe)
│   ├── broken-links.yml            #   on: workflow_call  (lychee)
│   ├── lighthouse.yml              #   on: workflow_call
│   ├── format-check.yml            #   on: workflow_call  (prettier --check)
│   ├── codeql.yml                  #   on: workflow_call
│   └── standards-drift.yml         #   on: workflow_call  (LAYER 3 check)
│
├── root-files/                     # LAYER 3 — authoritative root-file copies
│   ├── _headers
│   ├── robots.txt
│   ├── .editorconfig
│   ├── .prettierrc
│   ├── .prettierignore
│   └── .pre-commit-config.yaml
│
├── templates/
│   └── workflows/                  # thin "caller" workflow stubs sites copy in
│       ├── accessibility.yml
│       ├── broken-links.yml
│       ├── lighthouse.yml
│       ├── format-check.yml
│       ├── codeql.yml
│       └── standards-drift.yml
│
├── bin/
│   ├── onboard.sh                  # LAYER 4 — one-shot site onboarding
│   ├── sync-standards.sh           # copy root-files/* into a site root
│   └── check-drift.sh              # assert site root files == root-files/
│
└── docs/
    └── security-notes.md           # CSP directives explained; how to add embeds
```

> **GitHub constraint (not a preference):** a workflow referenced by
> `workflow_call` MUST live under the standards repo's `.github/workflows/`.
> It cannot live in an arbitrary `ci/` directory. Hence layer 1 lives there.

## Mechanism detail

### Layer 1 — reusable workflows

Each `.github/workflows/*.yml` in the standards repo starts with
`on: workflow_call` and contains the real CI logic. A consuming site's
workflow shrinks to a caller stub:

```yaml
# site: .github/workflows/accessibility.yml
name: Accessibility
on: [push, pull_request]
jobs:
  axe:
    uses: Allenhetl/web-standards/.github/workflows/accessibility.yml@main
```

Editing an axe rule = one edit in the standards repo → every site's next CI
run uses it. Zero manual sync. Reusable workflows accept `inputs`/`secrets`
so per-site knobs (e.g. build command, URL) are passed by the caller.

Ruby/Jekyll build steps that several workflows share are parameterised via
`workflow_call` inputs (e.g. `ruby-version`, `build-command`) with defaults
matching this site, so a non-Jekyll site can override them.

### Layer 2 — submodule

```bash
git submodule add https://github.com/Allenhetl/web-standards standards
```

Adds `standards/` + `.gitmodules`. The site reads `ENGINEERING.baseline.md`,
`bin/`, templates, and CSP notes from there. `git submodule update --remote
standards` pulls the latest standard; the recorded commit pins a site to a
known standard version until deliberately upgraded.

### Layer 3 — root files: source + auto-derive + CI contract

Root-required files (Cloudflare/Prettier/EditorConfig all demand them at the
repo root, where a submodule subdirectory can't satisfy) are **derived
products** of `standards/root-files/`, never hand-edited. Three nested
mechanisms:

1. **Marked source.** Comment-capable files (`_headers`, `robots.txt`,
   `.editorconfig`) carry a generated-from banner. Comment-less files
   (`.prettierrc`) are identified by hash in the drift check, not by banner.
2. **pre-commit auto-sync (removes the manual step).** A local hook in the
   site's `.pre-commit-config.yaml` runs `standards/bin/sync-standards.sh`
   before each commit, refreshing root files from the authoritative copies
   and `git add`-ing them. After `git submodule update --remote`, the next
   commit propagates the new root files automatically.
3. **CI drift check (backstop).** The `standards-drift` reusable workflow
   runs `check-drift.sh` on push/PR, comparing each site root file to
   `standards/root-files/`. Any mismatch → red CI with a diff. A per-site
   `.standards-allow` file lists explicit, deliberate exemptions — deviation
   must be declared, never silent.

**Accepted cost:** onboarding installs the pre-commit hook once
(`pre-commit install`); after that, sync is automatic. If a commit bypasses
hooks (`--no-verify`) or a machine lacks the hook, CI catches the drift.

### Layer 4 — onboarding (onboarded == conformant)

`bin/onboard.sh`, run once in a site's repo root:

1. `git submodule add …/web-standards standards`
2. Copy caller stubs from `standards/templates/workflows/` → site
   `.github/workflows/`
3. Run `sync-standards.sh` to populate root files
4. Merge the auto-sync hook into the site's `.pre-commit-config.yaml`
5. `pre-commit install`
6. Print the remaining human items from `CHECKLIST.md` (fill `_config.yml`
   url/baseurl, confirm CSP allowances for that site's embeds, etc.)

## The seed content

`web-standards` is seeded from this repo's already-hardened files, so the
standard is an extraction of a working, polished configuration rather than a
fresh guess:

- `root-files/_headers` ← this repo's `_headers` (full CSP/HSTS/etc.)
- `root-files/robots.txt` ← this repo's `robots.txt` (AI-crawler blocklist).
  NOTE: the sitemap line uses Liquid; the authoritative copy keeps it, and
  the drift check compares the file as-committed (Liquid intact) — sites
  that aren't Jekyll list robots.txt in `.standards-allow` or ship a static
  variant.
- `root-files/.editorconfig`, `.prettierrc`, `.prettierignore`,
  `.pre-commit-config.yaml` ← this repo's equivalents
- reusable workflows ← generalised from `axe.yml`, `broken-links-site.yml`,
  `codeql.yml`, `prettier.yml`
- `ENGINEERING.baseline.md` ← the language-neutral subset of `ENGINEERING.md`
  (design tokens, motion/a11y rules, security & crawling, code style,
  pre-commit checklist), with site-specific specifics (allenhtl.com,
  al-folio) removed.

## Rollout

1. Build `web-standards` locally, seeded from this repo (this task).
2. Commit locally; user reviews; **then** push to
   `github.com/Allenhetl/web-standards` (user-gated).
3. In a later session, onboard the two sites (this one and the PhD site) by
   running `onboard.sh` in each — out of scope for this spec, which only
   creates the standards repo.

## Open questions

None. `.prettierignore` in the seed contains al-folio-specific paths
(`assets/js/distillpub/…`, `_posts/2015-…`); the authoritative copy keeps a
**generic** ignore set, and site-specific ignores are appended locally and
declared in `.standards-allow`. Resolved: the standard ships a minimal
generic `.prettierignore`; sites extend it.
