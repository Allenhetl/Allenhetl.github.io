# web-standards v2 · Phase 2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Author the `node-private` profile (derived from `phd-advisor-db`'s
real setup), add assertion-based validation for generated security headers,
and onboard the private site — adding only the universal pieces it lacks
(formatting, format-check CI, Dependabot, header-assertion) **without
touching its build, CSP, or robots** (it is already stricter than the
standard).

**Architecture:** A new profile `profiles/node-private/` declares
`headers: generated` / `robots: generated`, so sync/drift skip those files
(already supported from Phase 1). A new reusable `headers-assert.yml`

- a `core/` assertion script check the _generated_ `site/_headers` against
  the core baseline floor ∪ the profile's `headers-requirements.yml`. The
  private site gets a small CI set (build+validate, format-check,
  header-assert) and formatting configs — no CodeQL (private repo has no
  GitHub Advanced Security), no CSP/robots/build changes.

**Tech Stack:** GitHub Actions (`workflow_call`), bash, Node (the site's
build), YAML, `gh` CLI. Personal-facing repo: `phd-advisor-db`.

## Global Constraints

- web-standards repo: `C:\Users\Allen\Desktop\Embodied AI\web-standards`.
  Private site: `C:\Users\Allen\Desktop\Embodied AI\phd-advisor-db`.
- **`phd-advisor-db` git identity MUST stay** `Allenhetl` /
  `144516284+Allenhetl@users.noreply.github.com` — never let a work email in
  (STANDARDS.md §5). Verify before each commit there.
- **The private site's default branch is `master`** (not `main`).
- **Do NOT modify the private site's build, CSP, robots, or `_headers`
  generation.** It is more secure than the standard; Phase 2 only _adds_.
- **No CodeQL for node-private** — the repo is private with no GitHub
  Advanced Security (`ghas: null`), so CodeQL would fail. Omit it.
- SHA-pin any new third-party action with a `# vX.Y.Z` comment; keep
  `permissions: contents: read` + harden-runner-first + `persist-credentials:
false` on every reusable workflow.
- web-standards work on branch `v2/phase2-node-private`; private-site work on
  branch `v2/adopt-standards`. Both land via green PR, never direct to the
  default branch.
- Commit messages end with
  `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`.
- YAML validated via
  `MSYS_NO_PATHCONV=1 docker run --rm -v "$(pwd):/ws" -w /ws ruby:3.3-slim sh -c 'ruby -ryaml -e "YAML.load_file(ARGV[0])" <file>'`.

## Ground truth (already captured from the private site)

The site's `build.mjs` generates `site/_headers` with this CSP:

```
default-src 'none'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'; object-src 'none'; manifest-src 'self'
```

plus headers `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`,
`Referrer-Policy: no-referrer`, `Permissions-Policy: …`,
`Cross-Origin-Opener-Policy: same-origin`,
`Cross-Origin-Resource-Policy: same-origin`,
`X-Robots-Tag: noindex, nofollow, noarchive, nosnippet, noimageindex`, and
`robots.txt` = `User-agent: * / Disallow: /`. Build: `npm run build` →
`site/`. Zero runtime deps. The `node-private` requirements are derived to
match _exactly this posture_ (so it starts at today's bar and can only
tighten).

---

## File Structure

- `web-standards/profiles/node-private/profile.yml` — manifest (node runtime,
  `npm run build`, `site`, `headers: generated`, `robots: generated`, no
  codeql).
- `web-standards/profiles/node-private/headers-requirements.yml` — required
  CSP directives + security headers the generated output must contain.
- `web-standards/profiles/node-private/caller-workflows/*.yml` — the stubs a
  node-private site installs (build-validate, format-check, header-assert;
  NO codeql, NO lighthouse/axe/broken-links by default — those assume a
  servable public site; node-private opts into build+validate+assert).
- `web-standards/profiles/node-private/README.md`.
- `web-standards/core/assert-headers.sh` — reads a `_headers` file + a
  requirements yaml and asserts each requirement holds.
- `web-standards/.github/workflows/headers-assert.yml` — reusable: build the
  site, run `assert-headers.sh` against baseline ∪ profile requirements.
- `web-standards/.github/workflows/build-validate.yml` — reusable: run the
  site's own `npm run build` + optional validate command.
- Private site: `.standards-profile`, `.github/workflows/*` caller stubs,
  `.github/dependabot.yml`, formatting configs, `.pre-commit-config.yaml`.

---

### Task 1: Author the `node-private` profile manifest + requirements

**Files:**

- Create: `web-standards/profiles/node-private/profile.yml`
- Create: `web-standards/profiles/node-private/headers-requirements.yml`
- Create: `web-standards/profiles/node-private/README.md`

**Interfaces:**

- Produces: `profiles/node-private/` with the same `profile.yml` key set as
  `jekyll-public` (`name`, `runtime`, `build-cmd`, `site-dir`,
  `codeql-languages`, `headers`, `robots`) plus a `validate-cmd` key, and a
  `headers-requirements.yml` consumed by `assert-headers.sh` (Task 2).

- [ ] **Step 1: Create the branch**

```bash
cd "C:/Users/Allen/Desktop/Embodied AI/web-standards"
git checkout main && git pull --ff-only
git checkout -b v2/phase2-node-private
mkdir -p profiles/node-private/caller-workflows
```

- [ ] **Step 2: Write profile.yml**

Create `profiles/node-private/profile.yml`:

```yaml
name: node-private
runtime: node
build-cmd: "npm run build"
validate-cmd: "npm run validate" # headless-browser render gate (needs Chrome)
site-dir: "site"
codeql-languages: "" # empty = no CodeQL (private repo, no GH Advanced Security)
headers: generated # site's build.mjs emits site/_headers — assert, don't sync
robots: generated # build.mjs emits site/robots.txt
```

- [ ] **Step 3: Write headers-requirements.yml (matches today's posture)**

Create `profiles/node-private/headers-requirements.yml`:

```yaml
# Requirements the GENERATED site/_headers must satisfy for node-private.
# Derived from phd-advisor-db's current build.mjs output; the site may be
# stricter, never looser. Checked by core/assert-headers.sh.
file: "site/_headers" # relative to repo root, produced by the build
csp:
  require-directives:
    - "default-src 'none'"
    - "connect-src 'none'"
    - "object-src 'none'"
    - "base-uri 'none'"
    - "frame-ancestors 'none'"
    - "form-action 'none'"
  forbid-substrings:
    - "'unsafe-eval'"
headers:
  require-present:
    - "X-Content-Type-Options: nosniff"
    - "X-Frame-Options: DENY"
    - "Referrer-Policy: no-referrer"
    - "X-Robots-Tag: noindex"
```

- [ ] **Step 4: Write the profile README**

Create `profiles/node-private/README.md`:

```markdown
# Profile: node-private

For **private, offline, `noindex` static sites** built by a Node generator
(e.g. `phd-advisor-db`, served behind Cloudflare Access).

- **Build:** `npm run build` → `site` (+ optional `npm run validate`
  headless-browser render gate)
- **Security headers + robots:** **GENERATED by the site's build**
  (`build.mjs`), not synced. CI **asserts** the generated `site/_headers`
  meets the core baseline ∪ this profile's `headers-requirements.yml`
  (`default-src 'none'`, `connect-src 'none'`, `X-Robots-Tag: noindex`, …).
  The standard never overwrites the site's stricter posture.
- **No CodeQL** (private repos need GitHub Advanced Security).
- **Formatting** (`.editorconfig`, `.prettierrc`, `.prettierignore`) and
  `format-check` CI are shared with all profiles.

Onboard: `bash .../web-standards/bin/onboard.sh --profile node-private`
```

- [ ] **Step 5: Validate YAML**

```bash
cd "C:/Users/Allen/Desktop/Embodied AI/web-standards"
MSYS_NO_PATHCONV=1 docker run --rm -v "$(pwd):/ws" -w /ws ruby:3.3-slim sh -c '
  for f in profiles/node-private/profile.yml profiles/node-private/headers-requirements.yml; do
    ruby -ryaml -e "YAML.load_file(ARGV[0])" "$f" && echo "OK $f"
  done'
```

Expected: both `OK`.

- [ ] **Step 6: Commit**

```bash
git add profiles/node-private/profile.yml profiles/node-private/headers-requirements.yml profiles/node-private/README.md
git commit -m "v2: author node-private profile manifest + header requirements

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: Write `core/assert-headers.sh`

**Files:**

- Create: `web-standards/core/assert-headers.sh`
- Test: sandbox invocation in the step below (no separate test file — it's a
  shell script exercised against real fixtures).

**Interfaces:**

- Consumes: a `_headers` file path + one or more requirements YAML files
  (`core/baseline-requirements.yml` + a profile's
  `headers-requirements.yml`).
- Produces: `assert-headers.sh <headers-file> <req-yaml> [req-yaml...]` —
  exits 0 if every `csp.require-directives`, `csp.forbid-substrings`, and
  `headers.require-present` entry holds against the file; non-zero with
  `::error::` lines otherwise. Parses the simple requirements YAML with grep/
  sed (no YAML lib on the runner is guaranteed) — it only needs to read the
  list items under those three keys.

- [ ] **Step 1: Write assert-headers.sh**

Create `core/assert-headers.sh`:

```bash
#!/usr/bin/env bash
# assert-headers.sh — assert a _headers file satisfies one or more
# requirements YAML files (core baseline ∪ profile). Fails loudly on any
# unmet requirement. Requirements YAML is a simple, fixed shape (lists under
# csp.require-directives / csp.forbid-substrings / headers.require-present),
# parsed with sed/grep so no YAML runtime is needed on the CI runner.
set -uo pipefail

HEADERS_FILE="$1"; shift
if [ ! -f "$HEADERS_FILE" ]; then
  echo "::error::headers file not found: $HEADERS_FILE (did the build run?)"; exit 1
fi
CONTENT="$(cat "$HEADERS_FILE")"
fail=0

# Extract the quoted/less list items under a given `key:` block until the next
# top-level or sibling key. Prints one item per line, unquoted.
list_under() { # <file> <parent-key> <child-key>
  awk -v pk="$2:" -v ck="  $3:" '
    $0 ~ "^"pk"$" {inpk=1; next}
    inpk && $0 ~ /^[a-z]/ {inpk=0}
    inpk && $0 ~ ck"$" {inck=1; next}
    inpk && inck && $0 ~ /^  [a-z]/ {inck=0}
    inck && $0 ~ /^    - / { sub(/^    - /,""); gsub(/^"|"$/,""); print }
  ' "$1"
}

for REQ in "$@"; do
  [ -f "$REQ" ] || { echo "::error::requirements file not found: $REQ"; fail=1; continue; }
  while IFS= read -r d; do
    [ -z "$d" ] && continue
    if printf '%s' "$CONTENT" | grep -qF "$d"; then echo "ok: CSP has [$d]"
    else echo "::error::CSP missing required directive: [$d] ($REQ)"; fail=1; fi
  done < <(list_under "$REQ" "csp" "require-directives")

  while IFS= read -r s; do
    [ -z "$s" ] && continue
    if printf '%s' "$CONTENT" | grep -qF "$s"; then echo "::error::CSP contains forbidden [$s] ($REQ)"; fail=1
    else echo "ok: CSP free of [$s]"; fi
  done < <(list_under "$REQ" "csp" "forbid-substrings")

  while IFS= read -r h; do
    [ -z "$h" ] && continue
    if printf '%s' "$CONTENT" | grep -qF "$h"; then echo "ok: header present [$h]"
    else echo "::error::missing required header: [$h] ($REQ)"; fail=1; fi
  done < <(list_under "$REQ" "headers" "require-present")
done

if [ "$fail" -ne 0 ]; then echo ""; echo "Header assertions FAILED."; exit 1; fi
echo "All header assertions passed."
```

- [ ] **Step 2: Sandbox-test against the REAL generated headers (should pass)**

```bash
cd "C:/Users/Allen/Desktop/Embodied AI/web-standards"
chmod +x core/assert-headers.sh
# use the private site's already-generated headers as the fixture
cp "C:/Users/Allen/Desktop/Embodied AI/phd-advisor-db/site/_headers" /tmp/h_real
bash core/assert-headers.sh /tmp/h_real core/baseline-requirements.yml profiles/node-private/headers-requirements.yml
echo "exit=$?"
```

Expected: all `ok:` lines, `All header assertions passed.`, `exit=0`.

- [ ] **Step 3: Sandbox-test a DEGRADED header fails**

```bash
# weaken connect-src to 'self' — must fail
sed "s/connect-src 'none'/connect-src 'self'/" /tmp/h_real > /tmp/h_bad
bash core/assert-headers.sh /tmp/h_bad core/baseline-requirements.yml profiles/node-private/headers-requirements.yml
echo "exit=$?"
```

Expected: `::error::CSP missing required directive: [connect-src 'none']`,
`exit=1`.

- [ ] **Step 4: Set exec bit in git + commit**

```bash
git add core/assert-headers.sh
git update-index --chmod=+x core/assert-headers.sh
git commit -m "v2: add assert-headers.sh (baseline + profile header assertions)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: Reusable `build-validate.yml` + `headers-assert.yml`

**Files:**

- Create: `web-standards/.github/workflows/build-validate.yml`
- Create: `web-standards/.github/workflows/headers-assert.yml`

**Interfaces:**

- Consumes: `core/assert-headers.sh`, `core/baseline-requirements.yml`, and a
  profile's `headers-requirements.yml` (the calling repo has web-standards as
  the `standards/` submodule, so these are at `standards/...`).
- Produces:
  - `build-validate.yml` inputs: `build-cmd` (default `npm run build`),
    `validate-cmd` (default empty = skip), `node-version` (default `20`).
  - `headers-assert.yml` inputs: `build-cmd`, `headers-file` (default
    `site/_headers`), `profile` (name, to locate the requirements file),
    `node-version`.

- [ ] **Step 1: Write build-validate.yml**

Create `.github/workflows/build-validate.yml`:

```yaml
# Reusable build + optional validate gate for Node-generated sites.
name: Build & validate (reusable)

on:
  workflow_call:
    inputs:
      build-cmd:
        type: string
        required: false
        default: "npm run build"
      validate-cmd:
        description: "Optional headless-browser validate command; empty to skip"
        type: string
        required: false
        default: ""
      node-version:
        type: string
        required: false
        default: "20"

permissions:
  contents: read

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Harden runner 🛡️
        uses: step-security/harden-runner@9af89fc71515a100421586dfdb3dc9c984fbf411 # v2.19.4
        with:
          egress-policy: audit
      - name: Checkout 🛎️
        uses: actions/checkout@v4
        with:
          persist-credentials: false
          submodules: recursive
      - name: Setup Node ⚙️
        uses: actions/setup-node@v4
        with:
          node-version: ${{ inputs.node-version }}
      - name: Install deps 🔧
        run: npm ci || npm install
      - name: Build 🏗️
        run: ${{ inputs.build-cmd }}
      - name: Install Chromium for validate 🌐
        if: inputs.validate-cmd != ''
        run: npx --yes puppeteer browsers install chrome
      - name: Validate 🔎
        if: inputs.validate-cmd != ''
        run: ${{ inputs.validate-cmd }}
```

- [ ] **Step 2: Write headers-assert.yml**

Create `.github/workflows/headers-assert.yml`:

```yaml
# Reusable: build the site, then assert its GENERATED _headers meets the core
# baseline ∪ the profile's requirements. For sites that generate their
# security headers (node-private) instead of syncing a static _headers.
name: Headers assert (reusable)

on:
  workflow_call:
    inputs:
      build-cmd:
        type: string
        required: false
        default: "npm run build"
      headers-file:
        type: string
        required: false
        default: "site/_headers"
      profile:
        description: "Profile name, to locate standards/profiles/<p>/headers-requirements.yml"
        type: string
        required: true
      node-version:
        type: string
        required: false
        default: "20"

permissions:
  contents: read

jobs:
  assert:
    runs-on: ubuntu-latest
    steps:
      - name: Harden runner 🛡️
        uses: step-security/harden-runner@9af89fc71515a100421586dfdb3dc9c984fbf411 # v2.19.4
        with:
          egress-policy: audit
      - name: Checkout 🛎️
        uses: actions/checkout@v4
        with:
          persist-credentials: false
          submodules: recursive
      - name: Setup Node ⚙️
        uses: actions/setup-node@v4
        with:
          node-version: ${{ inputs.node-version }}
      - name: Install deps 🔧
        run: npm ci || npm install
      - name: Build 🏗️
        run: ${{ inputs.build-cmd }}
      - name: Assert headers ✅
        run: |
          bash standards/core/assert-headers.sh \
            "${{ inputs.headers-file }}" \
            standards/core/baseline-requirements.yml \
            "standards/profiles/${{ inputs.profile }}/headers-requirements.yml"
```

- [ ] **Step 3: Validate both YAML files**

```bash
cd "C:/Users/Allen/Desktop/Embodied AI/web-standards"
MSYS_NO_PATHCONV=1 docker run --rm -v "$(pwd):/ws" -w /ws ruby:3.3-slim sh -c '
  for f in build-validate headers-assert; do
    ruby -ryaml -e "YAML.load_file(ARGV[0])" .github/workflows/$f.yml && echo "OK $f"
  done'
```

Expected: both `OK`.

- [ ] **Step 4: Commit**

```bash
git add .github/workflows/build-validate.yml .github/workflows/headers-assert.yml
git commit -m "v2: reusable build-validate + headers-assert workflows

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: node-private caller stubs + wire onboard/README/CHANGELOG; PR; tag

**Files:**

- Create: `web-standards/profiles/node-private/caller-workflows/build-validate.yml`
- Create: `web-standards/profiles/node-private/caller-workflows/headers-assert.yml`
- Create: `web-standards/profiles/node-private/caller-workflows/format-check.yml`
- Create: `web-standards/profiles/node-private/caller-workflows/standards-drift.yml`
- Modify: `web-standards/README.md`, `CHANGELOG.md`.

**Interfaces:**

- Consumes: Tasks 1-3.
- Produces: node-private caller stubs that reference `@v2` and trigger on
  `master` + `main`. No codeql/lighthouse/axe/broken-links stubs (not used
  by this profile).

- [ ] **Step 1: Write the four caller stubs**

`profiles/node-private/caller-workflows/build-validate.yml`:

```yaml
# Caller stub — logic in Allenhetl/web-standards.
name: Build & validate
on:
  push:
    branches: [master, main]
  pull_request:
    branches: [master, main]
jobs:
  build:
    uses: Allenhetl/web-standards/.github/workflows/build-validate.yml@v2
    with:
      build-cmd: "npm run build"
      validate-cmd: "npm run validate"
```

`profiles/node-private/caller-workflows/headers-assert.yml`:

```yaml
# Caller stub — logic in Allenhetl/web-standards.
name: Headers assert
on:
  push:
    branches: [master, main]
  pull_request:
    branches: [master, main]
jobs:
  assert:
    uses: Allenhetl/web-standards/.github/workflows/headers-assert.yml@v2
    with:
      profile: node-private
```

`profiles/node-private/caller-workflows/format-check.yml`:

```yaml
# Caller stub — logic in Allenhetl/web-standards.
name: Format check
on:
  push:
    branches: [master, main]
  pull_request:
    branches: [master, main]
jobs:
  prettier:
    permissions:
      contents: read
      pull-requests: write
    uses: Allenhetl/web-standards/.github/workflows/format-check.yml@v2
```

`profiles/node-private/caller-workflows/standards-drift.yml`:

```yaml
# Caller stub — logic in Allenhetl/web-standards.
name: Standards drift
on:
  push:
    branches: [master, main]
  pull_request:
    branches: [master, main]
jobs:
  drift:
    uses: Allenhetl/web-standards/.github/workflows/standards-drift.yml@v2
```

- [ ] **Step 2: Update README + CHANGELOG**

In `README.md`, add `node-private` to the profiles list (private, generated
headers asserted, no CodeQL). In `CHANGELOG.md`, add a `## v2.1.0` entry:
node-private profile, `assert-headers.sh`, `build-validate.yml` +
`headers-assert.yml`.

- [ ] **Step 3: Validate all new YAML + commit + push + PR**

```bash
cd "C:/Users/Allen/Desktop/Embodied AI/web-standards"
MSYS_NO_PATHCONV=1 docker run --rm -v "$(pwd):/ws" -w /ws ruby:3.3-slim sh -c '
  for f in $(find profiles/node-private -name "*.yml"); do
    ruby -ryaml -e "YAML.load_file(ARGV[0])" "$f" >/dev/null 2>&1 && echo "OK $f" || echo "BAD $f"
  done'
git add -A
git commit -m "v2: node-private caller stubs + docs (v2.1.0)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
git push -u origin v2/phase2-node-private
gh pr create --title "web-standards v2.1: node-private profile + header assertions" \
  --body "Adds the node-private profile (private, Node-generated, noindex sites), assert-headers.sh, and reusable build-validate + headers-assert workflows. No core changes to existing profiles. Assertions verified against phd-advisor-db's real generated _headers (pass) and a degraded copy (fail)."
```

- [ ] **Step 4: Merge + bump the moving `v2` tag**

```bash
gh pr merge --squash --delete-branch
git checkout main && git pull --ff-only
git tag -a v2.1.0 -m "web-standards v2.1.0 — node-private profile + header assertions"
git tag -f v2 v2.1.0
git push origin v2.1.0 && git push -f origin v2
```

---

### Task 5: Onboard the private site (`phd-advisor-db`) — add-only

**Files (in `phd-advisor-db`):**

- Create: `.standards-profile` (= `node-private`)
- Create: `.github/workflows/{build-validate,headers-assert,format-check,standards-drift}.yml`
- Create: `.github/dependabot.yml`
- Create/sync: `.editorconfig`, `.prettierrc`, `.prettierignore`,
  `.pre-commit-config.yaml` (from the standard)
- Add: `standards/` submodule
- **Unchanged:** `scripts/build.mjs`, `site/_headers`, `site/robots.txt`,
  `data/**`, everything about CSP/robots/build.

**Interfaces:**

- Consumes: web-standards `@v2` (with node-private, merged in Task 4).
- Produces: the private site running the node-private CI set, formatting
  configs present, `.standards-profile=node-private`; its security posture
  untouched.

- [ ] **Step 1: Verify git identity, branch off master**

```bash
cd "C:/Users/Allen/Desktop/Embodied AI/phd-advisor-db"
git config user.email   # MUST be 144516284+Allenhetl@users.noreply.github.com
git checkout master && git pull --ff-only
git checkout -b v2/adopt-standards
```

If the email is anything else (e.g. a work email), STOP and set it:
`git config user.email 144516284+Allenhetl@users.noreply.github.com`.

- [ ] **Step 2: Add the submodule + run profile-aware onboard**

```bash
git submodule add https://github.com/Allenhetl/web-standards standards || \
  git submodule update --init --remote standards
bash standards/bin/onboard.sh --profile node-private
```

Expected: writes `.standards-profile=node-private`, copies node-private
caller stubs, syncs formatting + `.pre-commit-config.yaml`, **skips
`_headers`/`robots.txt`** ("skip (not in profile 'node-private')"), stages
changes.

- [ ] **Step 3: Exclude `standards/` from the site build & prettier**

The build cleans/scans `site/` and the repo; ensure the submodule isn't
processed. Add `standards/` to `.prettierignore` site-specific section (the
synced base already ignores it, but confirm) and confirm `build.mjs`'s
`cleanSite()` only touches `site/` (it does — no change needed). If
`validate-data.mjs`/`validate.mjs` scan the repo root, confirm they target
`data/` and `site/` only (they do per STANDARDS.md).

- [ ] **Step 4: Local verify — build, validate, drift, assert, prettier**

```bash
npm run build
bash standards/bin/check-drift.sh          # formatting + pre-commit only; headers skipped
bash standards/core/assert-headers.sh site/_headers \
  standards/core/baseline-requirements.yml \
  standards/profiles/node-private/headers-requirements.yml
npx prettier --check . 2>&1 | tail -5      # note any pre-existing offenders
```

Expected: build ok; drift "No drift"; assertions pass; prettier clean or
only known pre-existing files (add those to `.prettierignore` site section if
they are generated `site/**` — the base ignore should already cover
`site/**`; if not, add it).

- [ ] **Step 5: Commit (identity-checked), push, PR, confirm green**

```bash
git config user.email   # re-verify before committing
git add -A
git commit -m "Adopt web-standards @v2 (node-private profile)

Add-only: standards submodule, node-private CI (build+validate, header
assertion, format-check, drift), formatting configs, Dependabot. Build,
CSP, robots, and generated _headers are unchanged — the site keeps its
stricter posture; CI now asserts the generated headers stay at/above it.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
git push -u origin v2/adopt-standards
gh pr create --title "Adopt web-standards @v2 (node-private)" \
  --body "Add-only onboarding: CI (build+validate, header-assert, format-check, drift), formatting, Dependabot, standards submodule. No change to build/CSP/robots/_headers — header-assert verifies the generated posture stays >= baseline. Git identity preserved (noreply)."
sleep 90 && gh pr checks
```

Expected: all checks pass — Build & validate, Headers assert, Format check,
Standards drift. **This green PR is Phase 2's exit criterion.**

- [ ] **Step 6: Merge**

```bash
gh pr merge --squash --delete-branch
```

---

## Self-Review

**Spec coverage (Phase 2 portion of the v2 spec):**

- node-private profile derived from real site → Tasks 1, 5.
- Assertion-based validation for generated configs (Goal 4) → Tasks 2, 3.
- Baseline floor enforced (Goal 5) → assert-headers checks baseline ∪ profile
  (Task 2 tests the degraded case fails).
- Never downgrade the private site (Goal 3) → Task 5 is add-only; explicit
  "unchanged" list; identity + master-branch constraints honored.
- Adding a profile without touching core → Tasks 1-4 add under `profiles/`
  and two new reusable workflows; existing profiles/workflows untouched.

**Placeholder scan:** none — every step has exact commands/paths/content.

**Type consistency:** `profile.yml` keys extend jekyll-public's set with
`validate-cmd`; `headers: generated`/`robots: generated` are the values the
Phase-1 sync/drift already special-case (skip). `assert-headers.sh` arg order
(`<headers-file> <req...>`) matches its callers in `headers-assert.yml` and
Task 5 Step 4. `profile` input in `headers-assert.yml` locates
`standards/profiles/<profile>/headers-requirements.yml` — path matches Task 1.

**Constraints honored:** no CodeQL stub for node-private (private repo);
caller stubs trigger on `master` + `main`; git-identity check bracketed
around the private-site commit; `@v2` moving tag bumped after merge.

**Known risk:** `npm run validate` needs Chromium; `build-validate.yml`
installs it via `npx puppeteer browsers install chrome` only when
`validate-cmd` is non-empty. If the private site's `validate.mjs` can't find
that Chrome path on CI, Step 4/5 will surface it — fall back to setting
`CHROME` env or skipping validate in CI (build + assert still gate).
