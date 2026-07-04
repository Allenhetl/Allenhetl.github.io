# web-standards v2 · Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure `web-standards` into a layered `core/` + `profiles/`
form, repackage today's v1 behavior as the `jekyll-public` profile, publish
it as tag `@v2`, and migrate the personal site from `@v1` to `@v2` — proving
the refactor is behavior-preserving (CI stays green).

**Architecture:** Reusable workflows stay in `.github/workflows/` (GitHub
requires this) but become **parameterized** (`build-cmd`, `site-dir`,
`runtime`, `codeql-languages`) so any stack can call them. A `profile.yml`
per site type holds the values; caller stubs pass them. `@v1` is left
untouched as a rollback path.

**Tech Stack:** GitHub Actions (`workflow_call`), bash, YAML, Jekyll (the
personal site under test), `gh` CLI.

## Global Constraints

- Repo: `web-standards` at `C:\Users\Allen\Desktop\Embodied AI\web-standards`.
  Consumer under test: `Allenhetl.github.io` at
  `C:\Users\Allen\Desktop\Embodied AI\CV\Allenhetl.github.io`.
- **`@v1` and its moving tag MUST remain unchanged** throughout Phase 1.
- All third-party actions stay **SHA-pinned** with `# vX.Y.Z` comments;
  `actions/*` and `github/codeql-action` may stay `@vN`. (Carry over exact
  pins from v1: `step-security/harden-runner@9af89fc71515a100421586dfdb3dc9c984fbf411 # v2.19.4`,
  `ruby/setup-ruby@d45b1a4e94b71acab930e56e79c6aa188764e7f9 # v1.316.0`,
  `fjogeleit/yaml-update-action@dffe9a5223d84653c13374032382f6bb5de8e5ef # v0.17.0`,
  `browser-actions/setup-chrome@c785b87e244131f27c9f19c1a33e2ead956ab7ce # v1`,
  `lycheeverse/lychee-action@7cd0af4c74a61395d455af97419279d86aafaede # v2.0.2`,
  `treosh/lighthouse-ci-action@3e7e23fb74242897f95c0ba9cabad3d0227b9b18 # v12`,
  `thollander/actions-comment-pull-request@fabd468d3a1a0b97feee5f6b9e499eab0dd903f6 # v2`).
- Every reusable workflow keeps top-level `permissions: contents: read`
  (jobs elevate only what they need), `persist-credentials: false` on
  checkout, and `step-security/harden-runner` (`egress-policy: audit`) as
  the first step.
- Work on branch `v2/phase1-core-and-jekyll-profile` in `web-standards`; do
  NOT push to `main` except via merged PR. Commit messages end with
  `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`.
- YAML validated via the Docker Ruby one-liner (host has no yaml lib):
  `MSYS_NO_PATHCONV=1 docker run --rm -v "$(pwd):/ws" -w /ws ruby:3.3-slim sh -c 'ruby -ryaml -e "YAML.load_file(ARGV[0])" <file>'`.

---

## File Structure

- `web-standards/core/formatting/{.editorconfig,.prettierrc,.prettierignore}`
  — moved from `root-files/` (they are truly universal). Responsibility:
  the formatting configs shared by all profiles.
- `web-standards/core/baseline-requirements.yml` — the CSP/robots/build
  floor every profile must meet. Consumed by `headers-assert` logic (built
  in Phase 2; in Phase 1 the file is authored + validated only).
- `web-standards/.github/workflows/build.yml` — NEW parameterized
  build+serve reusable workflow. Responsibility: run a site's build for
  either runtime and expose the output dir.
- `web-standards/.github/workflows/{accessibility,lighthouse,broken-links}.yml`
  — parameterized to accept `build-cmd`/`site-dir`/`runtime`.
- `web-standards/profiles/jekyll-public/{profile.yml,README.md}` and
  `profiles/jekyll-public/root-files/*` and
  `profiles/jekyll-public/caller-workflows/*` — the repackaged v1 behavior.
- `web-standards/CHANGELOG.md` — document v2.0.0.
- Personal site `.github/workflows/*.yml` — caller stubs flipped `@v1`→`@v2`
  with profile inputs.

---

### Task 1: Move formatting configs into `core/formatting/`

**Files:**

- Create: `web-standards/core/formatting/.editorconfig` (from `root-files/.editorconfig`)
- Create: `web-standards/core/formatting/.prettierrc` (from `root-files/.prettierrc`)
- Create: `web-standards/core/formatting/.prettierignore` (from `root-files/.prettierignore`)
- Modify: `web-standards/bin/sync-standards.sh` — source formatting files from `core/formatting/`, keep the security/robots root files sourced from the profile (wired in Task 5).

**Interfaces:**

- Produces: `core/formatting/` as the canonical home of the three formatting
  files. `sync-standards.sh` still copies them to a site root identically.

- [ ] **Step 1: Create the branch**

Run:

```bash
cd "C:/Users/Allen/Desktop/Embodied AI/web-standards"
git checkout main && git pull --ff-only
git checkout -b v2/phase1-core-and-jekyll-profile
```

- [ ] **Step 2: Move the three formatting files**

Run:

```bash
mkdir -p core/formatting
git mv root-files/.editorconfig core/formatting/.editorconfig
git mv root-files/.prettierrc core/formatting/.prettierrc
git mv root-files/.prettierignore core/formatting/.prettierignore
```

- [ ] **Step 3: Point sync-standards.sh at the new location**

In `bin/sync-standards.sh`, the loop currently syncs from `$SRC` (=
`root-files`). Change the formatting files to come from `core/formatting`.
Find the sync list and split it. Replace the block that reads:

```bash
SRC="$STD_ROOT/root-files"
```

Add below it:

```bash
FMT="$STD_ROOT/core/formatting"
```

Then in the file loop, source `.editorconfig`/`.prettierrc` from `$FMT` and
`_headers`/`robots.txt`/`.pre-commit-config.yaml` from `$SRC`, and in
`sync_prettierignore` set `src="$FMT/.prettierignore"`.

- [ ] **Step 4: Sandbox-test the sync still works**

Run:

```bash
SAND=/tmp/v2t; rm -rf "$SAND"; mkdir -p "$SAND/site"; cd "$SAND/site"
git init -q; git config user.email t@t.com; git config user.name t
cp -r "C:/Users/Allen/Desktop/Embodied AI/web-standards" standards
bash standards/bin/sync-standards.sh
ls -a | grep -E '.editorconfig|.prettierrc|.prettierignore|_headers|robots'
bash standards/bin/check-drift.sh
```

Expected: all files synced; `check-drift.sh` prints "No drift".
(Note: `check-drift.sh` root-file paths are updated in Task 2 if needed.)

- [ ] **Step 5: Commit**

```bash
cd "C:/Users/Allen/Desktop/Embodied AI/web-standards"
git add -A
git commit -m "v2: move formatting configs to core/formatting/

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: Update `check-drift.sh` + `sync` to know formatting vs profile roots

**Files:**

- Modify: `web-standards/bin/check-drift.sh` — same split as sync: formatting
  files compared against `core/formatting/`, security/robots against the
  active profile's `root-files/` (Task 5 provides the profile path; for now
  keep `root-files/` as the jekyll-public source until Task 5 moves it).

**Interfaces:**

- Consumes: `core/formatting/*` (Task 1).
- Produces: a drift check that reads formatting from `core/formatting/` and
  security/robots from a profile-resolved dir.

- [ ] **Step 1: Add a failing sandbox assertion**

Run (should FAIL because check-drift still points only at root-files):

```bash
SAND=/tmp/v2t2; rm -rf "$SAND"; mkdir -p "$SAND/site"; cd "$SAND/site"
git init -q; git config user.email t@t.com; git config user.name t
cp -r "C:/Users/Allen/Desktop/Embodied AI/web-standards" standards
bash standards/bin/sync-standards.sh >/dev/null
bash standards/bin/check-drift.sh
```

Expected before fix: error/`missing` for the moved formatting files.

- [ ] **Step 2: Mirror the sync split into check-drift.sh**

In `bin/check-drift.sh` add `FMT="$STD_ROOT/core/formatting"` next to `SRC`,
and source `.editorconfig`/`.prettierrc` (and `.prettierignore` managed
section) from `$FMT`, `_headers`/`robots.txt`/`.pre-commit-config.yaml` from
`$SRC`.

- [ ] **Step 3: Re-run the sandbox — now passes**

Run the same block as Step 1.
Expected: "No drift. Root files conform to web-standards."

- [ ] **Step 4: Commit**

```bash
git add bin/check-drift.sh
git commit -m "v2: check-drift reads formatting from core/formatting/

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: Add the parameterized `build.yml` reusable workflow

**Files:**

- Create: `web-standards/.github/workflows/build.yml`

**Interfaces:**

- Produces: reusable workflow callable as
  `uses: Allenhetl/web-standards/.github/workflows/build.yml@v2` with inputs
  `runtime` (`jekyll`|`node`), `build-cmd` (string), `site-dir` (string),
  `ruby-version` (string, default `3.3.5`), `node-version` (string, default
  `20`). It builds the site and (for reuse by other workflows in the same
  job) is primarily a **template** other workflows copy the build steps
  from; standalone it just verifies the build succeeds and `site-dir` exists.

- [ ] **Step 1: Write build.yml**

Create `web-standards/.github/workflows/build.yml`:

```yaml
# Reusable, parameterized build. Supports Jekyll (Ruby) and Node runtimes.
# Verifies the site builds and produces its output directory.
name: Build (reusable)

on:
  workflow_call:
    inputs:
      runtime:
        description: "jekyll | node"
        type: string
        required: true
      build-cmd:
        description: "Build command (e.g. 'bundle exec jekyll build' or 'npm run build')"
        type: string
        required: true
      site-dir:
        description: "Output directory the build produces (e.g. _site or site)"
        type: string
        required: true
      ruby-version:
        type: string
        required: false
        default: "3.3.5"
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
      - name: Setup Ruby 💎
        if: inputs.runtime == 'jekyll'
        uses: ruby/setup-ruby@d45b1a4e94b71acab930e56e79c6aa188764e7f9 # v1.316.0
        with:
          ruby-version: ${{ inputs.ruby-version }}
          bundler-cache: true
      - name: Setup Node ⚙️
        if: inputs.runtime == 'node'
        uses: actions/setup-node@v4
        with:
          node-version: ${{ inputs.node-version }}
      - name: Jekyll prep ⚙️
        if: inputs.runtime == 'jekyll'
        uses: fjogeleit/yaml-update-action@dffe9a5223d84653c13374032382f6bb5de8e5ef # v0.17.0
        with:
          commitChange: false
          valueFile: "_config.yml"
          changes: |
            {
              "giscus.repo": "${{ github.repository }}",
              "baseurl": ""
            }
      - name: Jekyll build deps 🔧
        if: inputs.runtime == 'jekyll'
        run: |
          sudo apt-get update && sudo apt-get install -y imagemagick
          pip3 install --upgrade jupyter
      - name: Node install 🔧
        if: inputs.runtime == 'node'
        run: npm ci || npm install
      - name: Build 🏗️
        run: |
          export JEKYLL_ENV=production
          ${{ inputs.build-cmd }}
      - name: Jekyll PurgeCSS 🧹
        if: inputs.runtime == 'jekyll'
        run: |
          npm install -g purgecss
          purgecss -c purgecss.config.js
      - name: Verify output dir ✅
        run: |
          test -d "${{ inputs.site-dir }}" || { echo "::error::site-dir '${{ inputs.site-dir }}' not produced"; exit 1; }
          echo "Built ${{ inputs.site-dir }} ($(find "${{ inputs.site-dir }}" -type f | wc -l) files)"
```

- [ ] **Step 2: Validate YAML**

Run:

```bash
cd "C:/Users/Allen/Desktop/Embodied AI/web-standards"
MSYS_NO_PATHCONV=1 docker run --rm -v "$(pwd):/ws" -w /ws ruby:3.3-slim \
  sh -c 'ruby -ryaml -e "YAML.load_file(ARGV[0])" .github/workflows/build.yml && echo OK'
```

Expected: `OK`.

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/build.yml
git commit -m "v2: add parameterized build.yml (jekyll + node runtimes)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: Parameterize accessibility / lighthouse / broken-links

**Files:**

- Modify: `web-standards/.github/workflows/accessibility.yml`
- Modify: `web-standards/.github/workflows/broken-links.yml`
- Modify: `web-standards/.github/workflows/lighthouse.yml`

**Interfaces:**

- Consumes: nothing new (self-contained build steps, gated by `runtime`).
- Produces: each workflow now accepts `runtime`, `build-cmd`, `site-dir`
  inputs (defaults preserve today's Jekyll behavior:
  `runtime: jekyll`, `build-cmd: bundle exec jekyll build`,
  `site-dir: _site`) so the personal site's existing callers keep working
  and Node sites can override.

- [ ] **Step 1: Add inputs to accessibility.yml**

In `accessibility.yml`, under `workflow_call.inputs`, add alongside `url`:

```yaml
runtime:
  type: string
  required: false
  default: "jekyll"
build-cmd:
  type: string
  required: false
  default: "bundle exec jekyll build"
site-dir:
  type: string
  required: false
  default: "_site"
```

Then gate the Jekyll-specific steps (`Setup Ruby`, `Update _config.yml`,
`Install and Build`, `Purge unused CSS`) with `if: inputs.runtime == 'jekyll'`,
add a Node path (`actions/setup-node@v4` + `npm ci` + build) with
`if: inputs.runtime == 'node'`, replace the hardcoded `bundle exec jekyll build`
with `${{ inputs.build-cmd }}` in a shared Build step, and replace `_site/`
in the `http-server` line with `${{ inputs.site-dir }}/`.

- [ ] **Step 2: Same parameterization for broken-links.yml**

Add the same three inputs. Gate Jekyll steps by `runtime`. Replace the
hardcoded build with `${{ inputs.build-cmd }}`. The lychee args reference
`_site/**/*.html` — replace `_site` with `${{ inputs.site-dir }}`.

- [ ] **Step 3: Same parameterization for lighthouse.yml**

Add the three inputs. Gate Jekyll steps by `runtime`. Replace build with
`${{ inputs.build-cmd }}`. Replace the `http-server _site/` and any `_site`
references with `${{ inputs.site-dir }}`.

- [ ] **Step 4: Validate all three YAML files**

Run:

```bash
cd "C:/Users/Allen/Desktop/Embodied AI/web-standards"
MSYS_NO_PATHCONV=1 docker run --rm -v "$(pwd):/ws" -w /ws ruby:3.3-slim sh -c '
  for f in accessibility broken-links lighthouse; do
    ruby -ryaml -e "YAML.load_file(ARGV[0])" .github/workflows/$f.yml && echo "OK $f"
  done'
```

Expected: `OK accessibility`, `OK broken-links`, `OK lighthouse`.

- [ ] **Step 5: Commit**

```bash
git add .github/workflows/accessibility.yml .github/workflows/broken-links.yml .github/workflows/lighthouse.yml
git commit -m "v2: parameterize a11y/lighthouse/broken-links (runtime, build-cmd, site-dir)

Defaults preserve today's Jekyll behavior so existing callers are unaffected.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 5: Create the `jekyll-public` profile

**Files:**

- Create: `web-standards/profiles/jekyll-public/profile.yml`
- Create: `web-standards/profiles/jekyll-public/README.md`
- Move: `web-standards/root-files/_headers` → `profiles/jekyll-public/root-files/_headers`
- Move: `web-standards/root-files/robots.txt` → `profiles/jekyll-public/root-files/robots.txt`
- Keep: `web-standards/root-files/.pre-commit-config.yaml` stays in `root-files/` (universal — used by all profiles)
- Copy: existing `templates/workflows/*.yml` → `profiles/jekyll-public/caller-workflows/*.yml`
- Modify: `bin/sync-standards.sh` + `bin/check-drift.sh` — resolve the
  profile's `root-files/` via a `.standards-profile` marker file in the site
  (default `jekyll-public` if absent, for backward compat).

**Interfaces:**

- Consumes: `core/formatting/` (Task 1), parameterized workflows (Tasks 3-4).
- Produces: `profiles/jekyll-public/profile.yml` with keys `name`,
  `runtime`, `build-cmd`, `site-dir`, `codeql-languages`, `headers`,
  `robots`. A site declares its profile in a root `.standards-profile` file
  containing just the profile name.

- [ ] **Step 1: Author profile.yml**

Create `profiles/jekyll-public/profile.yml`:

```yaml
name: jekyll-public
runtime: jekyll
build-cmd: "bundle exec jekyll build"
site-dir: "_site"
codeql-languages: '[{"language":"javascript-typescript","build-mode":"none"},{"language":"ruby","build-mode":"none"}]'
headers: static # _headers is a synced root file
robots: static # robots.txt is a synced root file (Liquid sitemap)
```

- [ ] **Step 2: Move the profile-specific root files**

```bash
cd "C:/Users/Allen/Desktop/Embodied AI/web-standards"
mkdir -p profiles/jekyll-public/root-files profiles/jekyll-public/caller-workflows
git mv root-files/_headers profiles/jekyll-public/root-files/_headers
git mv root-files/robots.txt profiles/jekyll-public/root-files/robots.txt
cp templates/workflows/*.yml profiles/jekyll-public/caller-workflows/
```

- [ ] **Step 3: Make sync/check resolve the profile**

In BOTH `bin/sync-standards.sh` and `bin/check-drift.sh`, after computing
`SITE_ROOT`, resolve the profile:

```bash
PROFILE="jekyll-public"
[ -f "$SITE_ROOT/.standards-profile" ] && PROFILE="$(tr -d '[:space:]' < "$SITE_ROOT/.standards-profile")"
PROF_ROOT="$STD_ROOT/profiles/$PROFILE/root-files"
```

Source `_headers`/`robots.txt` from `$PROF_ROOT`,
`.pre-commit-config.yaml` from `$SRC` (still `root-files/`), and formatting
from `$FMT`. If `$PROF_ROOT/_headers` doesn't exist (e.g. a profile with
`headers: generated`), skip syncing it (that profile asserts, Phase 2).

- [ ] **Step 4: Write the profile README**

Create `profiles/jekyll-public/README.md`:

```markdown
# Profile: jekyll-public

For public al-folio / Jekyll academic sites (the personal site). Public
robots + Liquid sitemap, CDN-friendly CSP in a static `_headers`, CodeQL
scans JS + Ruby. Root files (`_headers`, `robots.txt`) are synced and
drift-checked byte-for-byte. Build: `bundle exec jekyll build` → `_site`.

Onboard: `bash .../web-standards/bin/onboard.sh --profile jekyll-public`
```

- [ ] **Step 5: Sandbox-test sync+drift with an explicit profile**

```bash
SAND=/tmp/v2t5; rm -rf "$SAND"; mkdir -p "$SAND/site"; cd "$SAND/site"
git init -q; git config user.email t@t.com; git config user.name t
cp -r "C:/Users/Allen/Desktop/Embodied AI/web-standards" standards
echo "jekyll-public" > .standards-profile
bash standards/bin/sync-standards.sh
bash standards/bin/check-drift.sh
```

Expected: `_headers`, `robots.txt`, formatting files all synced; drift check
passes.

- [ ] **Step 6: Commit**

```bash
cd "C:/Users/Allen/Desktop/Embodied AI/web-standards"
git add -A
git commit -m "v2: create jekyll-public profile (repackages v1 behavior)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 6: Author `core/baseline-requirements.yml`

**Files:**

- Create: `web-standards/core/baseline-requirements.yml`

**Interfaces:**

- Produces: the machine-readable floor consumed by the Phase 2
  `headers-assert` logic. Phase 1 only authors + validates it.

- [ ] **Step 1: Write baseline-requirements.yml**

```yaml
# The security/robots/build FLOOR every profile must satisfy.
# A profile's own requirements may be STRICTER, never looser.
# Consumed by the headers-assert logic (Phase 2).
csp:
  require-directives:
    - "object-src 'none'"
    - "frame-ancestors" # must be present and restricted ('self' or 'none')
    - "base-uri" # must be present and restricted
    - "default-src" # must be declared
  forbid-substrings:
    - "'unsafe-eval'"
robots:
  # Must declare a coherent policy: EITHER public (Disallow empty + a Sitemap)
  # OR private (Disallow: / + noindex). Never absent/contradictory.
  require-one-of:
    - "public-with-sitemap"
    - "noindex-disallow-all"
build:
  must-produce-site-dir: true
  must-emit-security-headers: true
```

- [ ] **Step 2: Validate YAML**

```bash
cd "C:/Users/Allen/Desktop/Embodied AI/web-standards"
MSYS_NO_PATHCONV=1 docker run --rm -v "$(pwd):/ws" -w /ws ruby:3.3-slim \
  sh -c 'ruby -ryaml -e "YAML.load_file(ARGV[0])" core/baseline-requirements.yml && echo OK'
```

Expected: `OK`.

- [ ] **Step 3: Commit**

```bash
git add core/baseline-requirements.yml
git commit -m "v2: author cross-profile baseline-requirements floor

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 7: Update onboard.sh for `--profile`, docs, CHANGELOG; open PR; tag @v2

**Files:**

- Modify: `web-standards/bin/onboard.sh` — accept `--profile <name>`, write
  `.standards-profile`, copy that profile's caller-workflows.
- Modify: `web-standards/README.md` — document profiles + `@v2`.
- Modify: `web-standards/CHANGELOG.md` — add `v2.0.0`.

**Interfaces:**

- Consumes: everything above.
- Produces: `onboard.sh --profile <name>` end to end; `@v2` + moving `v2`
  tag after the PR merges.

- [ ] **Step 1: Add --profile parsing to onboard.sh**

Near the top of `bin/onboard.sh` after the existing vars, add:

```bash
PROFILE="jekyll-public"
while [ $# -gt 0 ]; do
  case "$1" in
    --profile) PROFILE="$2"; shift 2 ;;
    *) shift ;;
  esac
done
```

After the submodule is present, write the marker and copy that profile's
caller stubs instead of `templates/workflows/`:

```bash
echo "$PROFILE" > "$SITE_ROOT/.standards-profile"
STUB_DIR="$STD/profiles/$PROFILE/caller-workflows"
```

Replace the loop that copies from `templates/workflows/` with one copying
from `$STUB_DIR`. Add `.standards-profile` to the final `git add`.

- [ ] **Step 2: Update README + CHANGELOG**

In `README.md`, add a "Profiles" section explaining `jekyll-public` (and
`node-private`, "coming in Phase 2"), and that consumers reference `@v2`.
In `CHANGELOG.md`, add a `## v2.0.0` entry: layered core+profiles,
parameterized workflows, baseline floor, `@v1` retained as fallback.

- [ ] **Step 3: Validate the whole repo's YAML + full sandbox onboard**

```bash
cd "C:/Users/Allen/Desktop/Embodied AI/web-standards"
MSYS_NO_PATHCONV=1 docker run --rm -v "$(pwd):/ws" -w /ws ruby:3.3-slim sh -c '
  for f in $(find .github/workflows profiles -name "*.yml"); do
    ruby -ryaml -e "YAML.load_file(ARGV[0])" "$f" >/dev/null 2>&1 && echo "OK $f" || echo "BAD $f"
  done'
```

Expected: every file `OK`.

- [ ] **Step 4: Commit, push, open PR**

```bash
git add -A
git commit -m "v2: profile-aware onboard.sh + docs + CHANGELOG v2.0.0

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
git push -u origin v2/phase1-core-and-jekyll-profile
gh pr create --title "web-standards v2 Phase 1: layered core + jekyll-public profile" \
  --body "Layered core/ + profiles/ restructure. Parameterized workflows (runtime/build-cmd/site-dir). jekyll-public profile repackages v1 behavior. @v1 untouched. Personal-site migration verified in the follow-up (Task 8) before tagging @v2."
```

- [ ] **Step 5: Self-review the PR (correctness)**

Verify: no third-party action lost its SHA pin; every workflow keeps
`permissions: contents: read` + harden-runner first + `persist-credentials:
false`; `@v1` tag and its files on `main` are untouched (this branch only
adds/moves, doesn't retag).

---

### Task 8: Migrate the personal site to `@v2` and prove green

**Files:**

- Modify (personal site): `.github/workflows/{axe,broken-links-site,codeql,prettier,standards-drift}.yml` — flip `@v1`→`@v2`, pass profile inputs where needed.
- Create (personal site): `.standards-profile` containing `jekyll-public`.
- Modify (personal site): submodule pointer bumped to merged v2 `main`.

**Interfaces:**

- Consumes: merged `@v2` tag (created after Task 7 PR merges).
- Produces: personal site running fully on `@v2`, CI green. `@v1` remains a
  one-line rollback.

- [ ] **Step 1: Merge the Task 7 PR and tag @v2**

```bash
cd "C:/Users/Allen/Desktop/Embodied AI/web-standards"
gh pr merge --squash --delete-branch
git checkout main && git pull --ff-only
git tag -a v2.0.0 -m "web-standards v2.0.0 — layered core + profiles"
git tag -f v2 v2.0.0
git push origin v2.0.0 && git push -f origin v2
```

Verify `@v1` still resolves: `git rev-parse v1^{commit}` unchanged from before.

- [ ] **Step 2: Branch the personal site + bump submodule + set profile**

```bash
cd "C:/Users/Allen/Desktop/Embodied AI/CV/Allenhetl.github.io"
git checkout main && git pull --ff-only
git checkout -b v2/adopt
git submodule update --remote standards
echo "jekyll-public" > .standards-profile
```

- [ ] **Step 3: Flip caller stubs @v1 → @v2**

In each of `.github/workflows/{axe,broken-links-site,codeql,prettier,standards-drift}.yml`,
change `web-standards/.github/workflows/<x>.yml@v1` → `@v2`. Leave the
existing per-caller `permissions` blocks intact. Format with prettier.

- [ ] **Step 4: Local verify — build + drift + prettier**

```bash
bash standards/bin/check-drift.sh   # expect: No drift
npx prettier --check .github/workflows/*.yml .standards-profile 2>&1 | tail -2
```

Then a clean Jekyll build:

```bash
docker compose run --rm --user root jekyll sh -c "rm -rf _site .jekyll-cache && bundle exec jekyll build 2>&1 | tail -3"
```

Expected: build completes; drift clean; prettier clean.

- [ ] **Step 5: Commit, push, open PR, confirm CI green**

```bash
git add -A
git commit -m "Adopt web-standards @v2 (jekyll-public profile)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
git push -u origin v2/adopt
gh pr create --title "Adopt web-standards @v2 (jekyll-public)" \
  --body "Bumps submodule to v2, flips caller stubs @v1->@v2, declares .standards-profile=jekyll-public. Behavior-preserving; @v1 remains as rollback."
sleep 90 && gh pr checks
```

Expected: all checks pass (Format check, Standards drift, CodeQL, deploy,
broken-links). **This green PR is Phase 1's exit criterion** — it proves the
refactor preserved behavior.

- [ ] **Step 6: Merge**

```bash
gh pr merge --squash --delete-branch
```

---

## Self-Review

**Spec coverage:**

- Goal 1 (separate universal/specific) → Tasks 1, 5.
- Goal 2 (add profile w/o touching core) → Task 5 establishes the pattern;
  Task 6 baseline is core-level.
- Goal 5 (baseline floor) → Task 6 (authored; enforcement is Phase 2).
- Versioning/rollback safety → Task 8 Step 1 (tag @v2, verify @v1 intact).
- `node-private`, `headers-assert`, onboarding the private site, and the
  `BUILDING-A-SITE.md`/`creating-a-profile.md` docs are **Phase 2/3** — out
  of scope here by design; each gets its own plan.

**Placeholder scan:** none — every step has exact commands/paths/content.

**Type consistency:** `profile.yml` keys (`name`, `runtime`, `build-cmd`,
`site-dir`, `codeql-languages`, `headers`, `robots`) match the spec and the
workflow input names (`runtime`, `build-cmd`, `site-dir`). `.standards-profile`
marker used consistently in Tasks 5, 7, 8.

**Known risk carried forward:** the personal site's `CUSTOMIZE.md` is
already in its `.prettierignore` site-specific section (a CI-only Unicode
divergence documented in round 2); Task 8 doesn't touch it.
