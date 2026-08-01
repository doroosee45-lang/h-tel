#!/bin/bash
# Restauration d'une sauvegarde MongoDB créée par backup.sh
# Usage: bash scripts/restore.sh ./backups/backup_20260729_020000.tar.gz

set -e

if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

MONGO_URI="${MONGO_URI:-mongodb://127.0.0.1:27017/smart_hotel}"
ARCHIVE="$1"

if [ -z "$ARCHIVE" ]; then
  echo "Usage: bash scripts/restore.sh <chemin_vers_archive.tar.gz>"
  exit 1
fi

TMP_DIR=$(mktemp -d)
tar -xzf "$ARCHIVE" -C "$TMP_DIR"
FOLDER=$(find "$TMP_DIR" -mindepth 1 -maxdepth 1 -type d)

echo "⚠️  Cette opération va écraser la base actuelle ($MONGO_URI)."
read -p "Continuer ? (o/N) " confirm
if [ "$confirm" != "o" ]; then
  echo "Annulé."
  exit 0
fi

mongorestore --uri="$MONGO_URI" --drop "$FOLDER"
rm -rf "$TMP_DIR"
echo "✅ Restauration terminée"
