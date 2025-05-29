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
