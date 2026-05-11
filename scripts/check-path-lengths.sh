#!/usr/bin/env bash
set -euo pipefail

MAX_LENGTH="${1:-180}"

if ! [[ "$MAX_LENGTH" =~ ^[0-9]+$ ]]; then
  echo "Usage: $0 [max_length_integer]" >&2
  exit 2
fi

violations=$(git ls-files | awk -v max="$MAX_LENGTH" 'length($0) > max { printf "%d %s\n", length($0), $0 }')

if [[ -n "$violations" ]]; then
  echo "Found tracked paths longer than ${MAX_LENGTH} chars:" >&2
  echo "$violations" >&2
  exit 1
fi

echo "OK: no tracked paths exceed ${MAX_LENGTH} characters."
