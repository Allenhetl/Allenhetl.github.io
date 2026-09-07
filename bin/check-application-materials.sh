#!/usr/bin/env bash
set -euo pipefail

readonly documents=(
  "Tianlun_He_CV.pdf"
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

grep -Fx "Disallow: /assets/pdf/application-materials/" robots.txt >/dev/null
