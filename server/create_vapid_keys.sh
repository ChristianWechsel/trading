#!/bin/bash

# Skript zur Erstellung von VAPID-Schlüsseln für Web Push
# Voraussetzung: Node.js und das Paket 'web-push' müssen installiert sein

# VAPID-Schlüssel generieren
VAPID_OUTPUT=$(npx web-push generate-vapid-keys 2>/dev/null)
if [ $? -ne 0 ]; then
    echo "Fehler: Konnte VAPID-Schlüssel nicht generieren. Ist 'web-push' installiert? (npm install web-push)"
    exit 1
fi

# Schlüssel extrahieren
PUBLIC_KEY=$(echo "$VAPID_OUTPUT" | grep -A1 'Public Key' | tail -n1)
PRIVATE_KEY=$(echo "$VAPID_OUTPUT" | grep -A1 'Private Key' | tail -n1)

# Ausgabe
cat <<EOF
--- VAPID-Schlüssel generiert ---

Füge folgende Zeilen in deine .env-Datei ein:

VAPID_PUBLIC_KEY=$PUBLIC_KEY
VAPID_PRIVATE_KEY=$PRIVATE_KEY
EOF
