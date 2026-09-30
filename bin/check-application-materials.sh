#!/usr/bin/env bash
set -euo pipefail

readonly documents=(
  "Tianlun_He_Research_Proposal.pdf"
  "Tianlun_He_Research_Proposal_Chinese.pdf"
  "Tianlun_He_Agentic_Robot_Control_Proposal.pdf"
  "Tianlun_He_Agentic_Robot_Control_Proposal_Chinese.pdf"
  "Tianlun_He_Reference_Letter_RS.pdf"
)
readonly document_dir="assets/pdf/application-materials"

for document in "${documents[@]}"; do
  path="${document_dir}/${document}"
  test -s "${path}"
  file --brief --mime-type "${path}" | grep -Fx "application/pdf" >/dev/null
done

# The CV is intentionally private. Keep this check close to the public
# application-material checks so a future update cannot silently republish it.
test ! -e "assets/pdf/cv-he-tianlun.pdf"
test ! -e "${document_dir}/Tianlun_He_CV.pdf"
test ! -e "_pages/cv.md"
test ! -e "_data/cv.yml"

grep -Fx "Allow: /" robots.txt >/dev/null
! grep -q '^Sitemap:' robots.txt
grep -Fx "  X-Robots-Tag: noindex, nofollow, noarchive, nosnippet" _headers >/dev/null
grep -Fx '<meta name="robots" content="noindex, nofollow, noarchive, nosnippet">' _includes/metadata.liquid >/dev/null
