# Beispiel-curl-Befehle für Auth-Server (Admin-geschützte Registrierung)

## 1. Admin-Login (Token erhalten)

```bash
curl -k -X POST https://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "<ADMIN_PASSWORT>"}'
```

**Parameter-Erklärung:**

- `-k` : Ignoriert das selbstsignierte Zertifikat (nur für Entwicklung!)
- `-X POST` : HTTP-Methode POST
- `https://localhost:3000/auth/login` : Admin-Login-Endpoint
- `-H "Content-Type: application/json"` : Setzt den Content-Type Header auf JSON
- `-d '{...}'` : Sendet die Admin-Zugangsdaten als JSON-Body

---

## 2. Registrierung eines neuen Benutzers (nur mit Admin-Token möglich!)

```bash
curl -k -X POST https://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ADMIN_ACCESS_TOKEN>" \
  -d '{"username": "testuser", "password": "Test1234!"}'
```

**Parameter-Erklärung:**

- `-k` : Ignoriert das selbstsignierte Zertifikat
- `-X POST` : HTTP-Methode POST
- `https://localhost:3000/auth/register` : Registrierungs-Endpoint (nur für Admins)
- `-H "Content-Type: application/json"` : Setzt den Content-Type Header auf JSON
- `-H "Authorization: Bearer <ADMIN_ACCESS_TOKEN>"` : Überträgt das Admin-JWT im Header (ersetze `<ADMIN_ACCESS_TOKEN>` durch den Wert aus Schritt 1)
- `-d '{...}'` : Sendet die neuen Nutzerdaten als JSON-Body

---

## 3. Login als normaler User (Token erhalten)

```bash
curl -k -X POST https://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "Test1234!"}'
```

---

## 4. Profil-Endpunkt (geschützt, benötigt User-Token)

```bash
curl -k https://localhost:3000/auth/profile \
  -H "Authorization: Bearer <USER_ACCESS_TOKEN>"
```

---

## Reihenfolge:

1. Admin-Login (1) und Token merken
2. Mit Admin-Token neuen User registrieren (2)
3. Als User einloggen (3) und User-Token merken
4. Mit User-Token geschützte Endpunkte wie Profil (4) testen

---

**Hinweis:**

- Die Registrierung ist jetzt nur noch für eingeloggte Admins möglich!
- Das `-k`-Flag ist nur für selbstsignierte Zertifikate nötig.

---

# Kalender- und Benachrichtigungs-Testplan

## 1. Admin-Login (Token erhalten)

```bash
curl -k -X POST https://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "<ADMIN_PASSWORT>"}'
```

## 2. Kalender-Event für die nächste Minute anlegen

```bash
# Beispiel: Event in 1 Minute (Zeit anpassen!)
EVENT_TIME=$(date -u -d "+1 minute" +"%Y-%m-%dT%H:%M:00.000Z")
curl -k -X POST https://localhost:3000/calendar-events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ADMIN_ACCESS_TOKEN>" \
  -d '{
    "title": "Test-Event Benachrichtigung",
    "description": "Dies ist ein Test für die Push-Benachrichtigung.",
    "eventDate": "'"$EVENT_TIME"'",
    "recurring": false
  }'
```

## 3. Alle Kalender-Events anzeigen

```bash
curl -k https://localhost:3000/calendar-events \
  -H "Authorization: Bearer <ADMIN_ACCESS_TOKEN>"
```

## 4. Einzelnes Event anzeigen

```bash
curl -k https://localhost:3000/calendar-events/1
```

## 5. Event löschen

```bash
curl -k -X DELETE https://localhost:3000/calendar-events/1 \
  -H "Authorization: Bearer <ADMIN_ACCESS_TOKEN>"
```

## Hinweise zum Testen der Benachrichtigung

- Stelle sicher, dass du im Browser für Push-Benachrichtigungen registriert bist.
- Nach dem Anlegen eines Events für die nächste Minute sollte nach maximal 1 Minute eine Push-Benachrichtigung erscheinen.
- Die Zeitangabe für das Event muss im UTC-Format erfolgen.
- Der Cronjob prüft jede Minute auf anstehende Events.
