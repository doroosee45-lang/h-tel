#!/usr/bin/env bash
# Génère smart-hotel-360.zip (backend + frontend + mobile + docs), sans node_modules, .env ni builds.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
OUT="${1:-smart-hotel-360.zip}"
case "$OUT" in /*) ;; *) OUT="$ROOT/$OUT" ;; esac
rm -f "$OUT"
zip -r "$OUT" backend frontend mobile README.md .gitignore scripts .github \
  -x "*/node_modules/*" "*/.env" "*/.env.local" "*/dist/*" "*/.expo/*" "*/uploads/*" "*.zip" "*.log"
echo "Archive créée: $OUT"
