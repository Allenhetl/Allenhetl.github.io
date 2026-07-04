# web-standards hardening & versioning (round 2)

**Status:** approved · **Date:** 2026-07-04 · **Owner:** Allenhetl ·
**Builds on:** [2026-07-04-web-standards-design.md](2026-07-04-web-standards-design.md)

## Problem

Round 1 stood up `web-standards` and onboarded the personal site, but it
took several "push and see what breaks" iterations because consumers
reference reusable workflows at `@main` — every change to the standard hit
all sites instantly, with no version pinning and no rollback. Round 2 makes
the system **disciplined**: versioned, supply-chain-hardened, least-
privilege, and documented, following 2025/2026 best practice (GitHub
Actions security hardening guide, OpenSSF).

## Scope (5 upgrades, approved)

1. **Versioning.** Publish semver tags on `web-standards` and maintain a
   moving `v1` major tag. Consumers reference `@v1` instead of `@main`.
2. **Supply-chain: SHA-pin third-party actions + Dependabot.** Pin every
   non-GitHub action inside the reusable workflows to a full commit SHA
   (with a `# vX.Y.Z` comment), and add `dependabot.yml` covering the
   `github-actions` and `gitsubmodule` ecosystems to auto-bump them.
3. **Least privilege.** Add a top-level `permissions: contents: read` to
   every reusable workflow (raising per-job only where needed, e.g. CodeQL
   `security-events: write`), and set `persist-credentials: false` on every
   `actions/checkout`.
4. **CSP tightening.** In `_headers`, replace wildcard `img-src … https:`,
   `connect-src 'self' https:`, and the `frame-src`/`media-src`/`font-src`
   breadth with explicit host allowlists of what the sites actually use.
   **Keep** `script-src`/`style-src 'unsafe-inline'` as a documented risk
   acceptance — nonce/hash migration is deferred (needs a Cloudflare edge
   function; separate round).
5. **harden-runner + docs.** Add `step-security/harden-runner`
   (`egress-policy: audit`) as the first step of each reusable job. Add
   `CHANGELOG.md`, `SECURITY.md`, and this spec to `web-standards`.

## Non-goals (deliberately deferred — low leverage at 2-3 repos)

- CSP nonce/`strict-dynamic` via Cloudflare `_middleware` (high value, high
  risk of whole-site breakage → its own round).
- Full elimination of inline styles from CSP (`style-src`).
- OpenSSF Allstar / org-wide policy enforcement (built for large orgs).
- OpenSSF Scorecard badge — optional, can add later; not core.

## Design

### 1. Versioning & release flow

- Tag the current tip of `web-standards` `main` as `v1.0.0`, and create a
  lightweight moving tag `v1` pointing at it.
- Consumer caller stubs (in `templates/workflows/` and each onboarded site)
  change `@main` → `@v1`.
- **Release procedure** (documented in `CHANGELOG.md` and `README.md`):
  when shipping a change, commit to `main`, tag `vX.Y.Z`, then force-move
  `v1` to it: `git tag -f v1 vX.Y.Z && git push -f origin v1`. Non-breaking
  changes stay under `v1`; a breaking change starts `v2` and consumers move
  deliberately.
- `onboard.sh` updated to write `@v1` in the stubs it installs.
- **Migration ordering (critical):** publish the `v1` tag on the standards
  repo FIRST, then flip consumers to `@v1`. A consumer referencing `@v1`
  before the tag exists fails to resolve the workflow.

### 2. SHA-pinning + Dependabot

Third-party actions to pin (GitHub-owned `actions/*` and
`github/codeql-action` may stay at `@vN`):

| Action                                    | Was        | Pin to             |
| ----------------------------------------- | ---------- | ------------------ |
| `browser-actions/setup-chrome`            | `@v1`      | `@<sha>  # v1.x`   |
| `fjogeleit/yaml-update-action`            | `@main` ⚠️ | `@<sha>  # vX`     |
| `lycheeverse/lychee-action`               | `@v2.0.2`  | `@<sha>  # v2.0.2` |
| `ruby/setup-ruby`                         | `@v1`      | `@<sha>  # v1.x`   |
| `thollander/actions-comment-pull-request` | `@v2`      | `@<sha>  # v2.x`   |
| `treosh/lighthouse-ci-action`             | `@v12`     | `@<sha>  # v12.x`  |
| `step-security/harden-runner` (new)       | —          | `@<sha>  # v2.x`   |

`fjogeleit/yaml-update-action@main` is the worst offender (floating ref to a
third party) and must be pinned.

`.github/dependabot.yml` in `web-standards`:

```yaml
version: 2
updates:
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule: { interval: "weekly" }
    groups:
      actions: { patterns: ["*"] }
```

Onboarded sites also get a `dependabot.yml` (via `onboard.sh` /
`templates/`) covering `github-actions` **and** `gitsubmodule` (to bump the
`standards` submodule pointer):

```yaml
version: 2
updates:
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule: { interval: "weekly" }
    groups: { actions: { patterns: ["*"] } }
  - package-ecosystem: "gitsubmodule"
    directory: "/"
    schedule: { interval: "weekly" }
```

### 3. Least privilege

Every reusable workflow gets top-level:

```yaml
permissions:
  contents: read
```

Jobs that need more request it explicitly (CodeQL already declares
`security-events: write`). Every `actions/checkout` gets
`with: { persist-credentials: false }` — none of the reusable workflows push
with the token (the site's own `deploy.yml`, which does push, is
site-specific and out of scope here).

### 4. CSP tightening

Rewrite the `_headers` CSP to replace wildcards with explicit hosts derived
from what al-folio actually loads (Google Fonts, unpkg model-viewer, giscus,
Dimensions/Altmetric badges, jsdelivr/cdnjs, GitHub avatars/stats). Keep
`script-src`/`style-src 'unsafe-inline'`; annotate the risk acceptance in
`docs/security-notes.md`. Because `_headers` is a managed root file, the
change is made once in `web-standards/root-files/_headers` and syncs to all
sites; the site's `standards-drift` check verifies conformance.

**Verification:** after deploy, load the site and confirm zero CSP
violations in the browser console (fonts, giscus, badges, images all load).

### 5. harden-runner + docs

- First step of each reusable job:
  ```yaml
  - uses: step-security/harden-runner@<sha> # v2.x
    with: { egress-policy: audit }
  ```
  Audit mode only (learns egress; never blocks) — zero risk, gives runtime
  visibility. Can graduate to `block` later once a baseline exists.
- `CHANGELOG.md`: start at `v1.0.0`, document this round.
- `SECURITY.md`: how to report an issue, the pinning/permissions policy.

## Rollout (branch discipline)

Both repos on feature branches; nothing lands on `main` without a green PR.

1. `web-standards` branch `upgrade/hardening-v1`: SHA-pin, permissions,
   harden-runner, CSP, dependabot, docs. Push branch, open PR, self-review.
2. Merge to `main`, then tag `v1.0.0` + moving `v1`, push tags.
3. `Allenhetl.github.io` branch `upgrade/adopt-v1`: bump submodule, flip
   caller stubs `@main`→`@v1`, add site `dependabot.yml`, re-sync
   `_headers`. Push branch, open PR (CI runs the new pinned workflows),
   confirm green, merge.

## Risks

- **CSP over-tightening** → broken embed. Mitigation: enumerate real hosts
  from the current CSP + a build grep; verify in-browser post-deploy;
  `_headers` is easy to revert.
- **SHA resolves to a yanked/wrong commit.** Mitigation: resolve each SHA
  from the official tag via the GitHub API at pin time; record the version
  in a trailing comment.
- **`@v1` flip before tag exists** → unresolvable workflow. Mitigation: the
  rollout order above (tag first, flip second).
