#!/bin/bash

# ####################################################################
# Skript zum Erneuern eines selbstsignierten Zertifikats unter
# Wiederverwendung des existierenden privaten Schlüssels.
# ####################################################################

# Konfiguration
DAYS_VALID=365
SUBJECT="/CN=localhost" # Sollte dem CN des zu erneuernden Zertifikats entsprechen
KEY_FILENAME="localhost.key"
CERT_FILENAME="localhost.cert"

# Ermittle das Verzeichnis, in dem das Skript ausgeführt wird
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
CERT_DIR="${SCRIPT_DIR}/certificates" # Unterordner für Zertifikate

KEY_FILE="${CERT_DIR}/${KEY_FILENAME}"
CERT_FILE="${CERT_DIR}/${CERT_FILENAME}"

echo "--- Zertifikat erneuern ---"
echo "Verwende privaten Schlüssel: ${KEY_FILE}"
echo "Neues Zertifikat wird gespeichert als: ${CERT_FILE}"
echo "Neue Gültigkeit: ${DAYS_VALID} Tage"
echo "Subjekt (CN): ${SUBJECT}"
echo ""

# Prüfen, ob der Zertifikatsordner existiert
if [ ! -d "${CERT_DIR}" ]; then
    echo "FEHLER: Das Verzeichnis für Zertifikate (${CERT_DIR}) wurde nicht gefunden."
    echo "Bitte führe zuerst das Skript zum initialen Erstellen der Zertifikate aus (create_initial_certs.sh)."
    exit 1
fi

# Prüfen, ob der private Schlüssel existiert
if [ ! -f "${KEY_FILE}" ]; then
    echo "FEHLER: Der private Schlüssel (${KEY_FILE}) wurde nicht gefunden."
    echo "Das Zertifikat kann ohne den privaten Schlüssel nicht erneuert werden."
    exit 1
fi

# Optional: Backup des alten Zertifikats erstellen
if [ -f "${CERT_FILE}" ]; then
    BACKUP_CERT_FILE="${CERT_FILE}.bak_$(date +%Y%m%d_%H%M%S)"
    cp "${CERT_FILE}" "${BACKUP_CERT_FILE}"
    echo "Backup des alten Zertifikats erstellt: ${BACKUP_CERT_FILE}"
fi

# Neues selbstsigniertes Zertifikat mit dem existierenden Schlüssel erstellen
echo "Erneuere Zertifikat..."
openssl req -new -x509 -key "${KEY_FILE}" -out "${CERT_FILE}" -days "${DAYS_VALID}" -subj "${SUBJECT}"
if [ $? -ne 0 ]; then
    echo "FEHLER: Konnte das Zertifikat nicht erneuern."
    exit 1
fi
echo "Zertifikat erfolgreich erneuert."
echo ""

echo "--- Fertig ---"
echo "Das erneuerte Zertifikat wurde gespeichert: ${CERT_FILE}"
echo "Bitte denke daran, deinen Server neu zu starten, damit er das neue Zertifikat verwendet."
