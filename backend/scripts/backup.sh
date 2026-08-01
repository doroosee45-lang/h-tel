#!/bin/bash
# Sauvegarde automatique de la base MongoDB (cahier des charges §15: "Sauvegardes automatiques")
#
# Usage manuel:   bash scripts/backup.sh
# Usage cron (ex. tous les jours à 2h du matin), à ajouter avec `crontab -e` :
#   0 2 * * * cd /chemin/vers/smart-hotel-backend && bash scripts/backup.sh >> logs/backup.log 2>&1
#
# Nécessite mongodump (fourni par MongoDB Database Tools) installé sur le serveur.

set -e

# Charge les variables depuis .env si présent
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

MONGO_URI="${MONGO_URI:-mongodb://127.0.0.1:27017/smart_hotel}"
BACKUP_DIR="./backups"
RETENTION_DAYS=14
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
DEST="$BACKUP_DIR/backup_$TIMESTAMP"

mkdir -p "$BACKUP_DIR"

echo "🔄 Sauvegarde MongoDB démarrée: $TIMESTAMP"
mongodump --uri="$MONGO_URI" --out="$DEST"

# Compression
tar -czf "$DEST.tar.gz" -C "$BACKUP_DIR" "backup_$TIMESTAMP"
rm -rf "$DEST"

echo "✅ Sauvegarde terminée: $DEST.tar.gz"

# Purge des sauvegardes de plus de RETENTION_DAYS jours
find "$BACKUP_DIR" -name "backup_*.tar.gz" -mtime +$RETENTION_DAYS -delete
echo "🧹 Anciennes sauvegardes (> $RETENTION_DAYS jours) supprimées"
