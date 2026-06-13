#!/usr/bin/env bash
# ============================================================
# Bilingual-markup leak check
# ------------------------------------------------------------
# The site authors EN/ZH content as inline
#   <span class="lang-en-only">..</span><span class="lang-zh-only">..</span>
# and toggles visibility with CSS. When such a value is fed into an
# HTML *attribute* (a page/project `title:` or `description:` used in
# <title>, <meta>, alt="", JSON-LD, …) the literal markup leaks: the
# inner quotes break the attribute and both languages render as text.
#
# This has bitten us 3×. This script fails the build if ANY leaked
# bilingual markup is found in the generated _site, so it can never
# ship silently again.
#
# Usage:  bash bin/check-bilingual-leaks.sh [site_dir]
# Exit:   0 = clean, 1 = leaks found (prints offending files/lines)
# ============================================================
set -uo pipefail

SITE_DIR="${1:-_site}"

if [ ! -d "$SITE_DIR" ]; then
  echo "✗ check-bilingual-leaks: '$SITE_DIR' not found — build the site first." >&2
  exit 2
fi

fail=0

# --- Check 1: leaked bilingual markup inside <head> metadata --
# When a bilingual value lands in an attribute it breaks out, leaving
# the lang-*-only marker as loose text inside a <meta>/<title>/<link>
# tag. Two observable signatures:
#   (a) a `lang-en-only` / `lang-zh-only` token on the same line as a
#       <meta or <title or <link tag, or
#   (b) the escaped `&lt;span` form inside a <title>/<meta content=.
# We scope to metadata tags so legitimate lang spans in the body
# (which are intentional) are not flagged.
meta_hits=$(grep -rEn '<(meta|title|link)\b[^>]*lang-(en|zh)-only' \
  "$SITE_DIR" --include="*.html" 2>/dev/null)
if [ -n "$meta_hits" ]; then
  echo "✗ Bilingual markup leaked into <head> metadata tags:" >&2
  echo "$meta_hits" | sed 's/^/    /' >&2
  echo "" >&2
  fail=1
fi

# --- Check 2: escaped span markup in <title> or meta content --
escaped_hits=$(grep -rEn '(<title>[^<]*|content="[^"]*)&lt;span' "$SITE_DIR" --include="*.html" 2>/dev/null)
if [ -n "$escaped_hits" ]; then
  echo "✗ Escaped <span> markup leaked into <title>/meta content:" >&2
  echo "$escaped_hits" | sed 's/^/    /' >&2
  echo "" >&2
  fail=1
fi

# --- Check 3: invalid JSON-LD (broken by unescaped quotes) ----
# A leaked bilingual value with raw quotes corrupts the ld+json block;
# the tell-tale is lang-en-only appearing inside a ld+json script.
ldjson_hits=$(grep -rEn 'application/ld\+json' "$SITE_DIR" --include="*.html" -l 2>/dev/null \
  | xargs grep -lE 'lang-(en|zh)-only' 2>/dev/null)
if [ -n "$ldjson_hits" ]; then
  # Only flag if the markup is within ~ the json block; a page may have
  # lang spans in its visible body legitimately. Narrow to the script tag.
  for f in $ldjson_hits; do
    if awk '/application\/ld\+json/{inld=1} inld&&/lang-(en|zh)-only/{print FILENAME": ld+json contains bilingual markup"; bad=1} /<\/script>/{inld=0} END{exit !bad}' "$f" 2>/dev/null; then
      fail=1
    fi
  done
fi

if [ "$fail" -ne 0 ]; then
  echo "✗ check-bilingual-leaks FAILED." >&2
  echo "  Fix: feed bilingual title/description through a strip in _includes/metadata.liquid" >&2
  echo "       (see page_title_clean / page_desc_clean) before putting them in attributes." >&2
  exit 1
fi

echo "✓ check-bilingual-leaks: no bilingual markup leaked into attributes/title/JSON-LD."
exit 0
