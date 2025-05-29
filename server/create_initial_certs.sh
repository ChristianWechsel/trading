#!/bin/bash

# ####################################################################
# Skript zum initialen Erstellen eines privaten Schlüssels und eines
# selbstsignierten Zertifikats.
# ####################################################################

# Konfiguration
DAYS_VALID=365
SUBJECT="/CN=localhost" # Common Name für das Zertifikat
KEY_LENGTH=2048
KEY_FILENAME="localhost.key"
CERT_FILENAME="localhost.cert"

# Ermittle das Verzeichnis, in dem das Skript ausgeführt wird
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
CERT_DIR="${SCRIPT_DIR}/certificates" # Unterordner für Zertifikate

# Erstelle den Zertifikatsordner, falls er nicht existiert
mkdir -p "${CERT_DIR}"
if [ $? -ne 0 ]; then
    echo "Fehler: Konnte das Verzeichnis ${CERT_DIR} nicht erstellen."
    exit 1
fi

KEY_FILE="${CERT_DIR}/${KEY_FILENAME}"
CERT_FILE="${CERT_DIR}/${CERT_FILENAME}"

echo "--- Initiales Erstellen von Schlüssel und Zertifikat ---"
echo "Speicherort für Zertifikate: ${CERT_DIR}"
echo "Gültigkeit: ${DAYS_VALID} Tage"
echo "Subjekt (CN): ${SUBJECT}"
echo ""

# Prüfen, ob Schlüssel oder Zertifikat bereits existieren
if [ -f "${KEY_FILE}" ] || [ -f "${CERT_FILE}" ]; then
    echo "WARNUNG: Ein Schlüssel oder Zertifikat (${KEY_FILENAME} / ${CERT_FILENAME}) existiert bereits in ${CERT_DIR}."
    read -p "Möchtest du die existierenden Dateien überschreiben und neue erstellen? (j/N): " choice
    case "$choice" in
    j | J | ja | Ja) echo "Existierende Dateien werden überschrieben..." ;;
    *)
        echo "Vorgang abgebrochen. Keine Dateien wurden geändert."
        exit 0
        ;;
    esac
fi

# 1. Privaten Schlüssel erstellen
echo "Erzeuge neuen privaten Schlüssel: ${KEY_FILE}"
openssl genrsa -out "${KEY_FILE}" "${KEY_LENGTH}"
if [ $? -ne 0 ]; then
    echo "FEHLER: Konnte den privaten Schlüssel nicht erstellen."
    exit 1
fi
echo "Privater Schlüssel erfolgreich erstellt."
echo ""

# 2. Selbstsigniertes Zertifikat erstellen
echo "Erzeuge neues selbstsigniertes Zertifikat: ${CERT_FILE}"
openssl req -new -x509 -key "${KEY_FILE}" -out "${CERT_FILE}" -days "${DAYS_VALID}" -subj "${SUBJECT}"
if [ $? -ne 0 ]; then
    echo "FEHLER: Konnte das selbstsignierte Zertifikat nicht erstellen."
    # Optional: Schlüsseldatei wieder löschen, wenn Zertifikatserstellung fehlschlägt
    # rm -f "${KEY_FILE}"
    exit 1
fi
echo "Selbstsigniertes Zertifikat erfolgreich erstellt."
echo ""

echo "--- Fertig ---"
echo "Privater Schlüssel: ${KEY_FILE}"
echo "Zertifikat:       ${CERT_FILE}"
echo "Bitte denke daran, deinen Server so zu konfigurieren, dass er diese Dateien verwendet, und ihn danach neu zu starten."
