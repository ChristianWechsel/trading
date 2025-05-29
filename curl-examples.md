# Beispiel-curl-Befehle für Auth-Server

## 1. Registrierung eines neuen Benutzers

```bash
curl -k -X POST https://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "Test1234!"}'
```

**Parameter-Erklärung:**

- `-k` : Ignoriert das selbstsignierte Zertifikat (nur für Entwicklung!)
- `-X POST` : HTTP-Methode POST
- `https://localhost:3000/auth/register` : Ziel-Endpoint für die Registrierung
- `-H "Content-Type: application/json"` : Setzt den Content-Type Header auf JSON
- `-d '{...}'` : Sendet die Nutzerdaten als JSON-Body

---

## 2. Login (Token erhalten)

```bash
curl -k -X POST https://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "Test1234!"}'
```

**Parameter-Erklärung:**

- Wie oben, aber Endpoint ist `/auth/login`
- Antwort enthält ein Feld `access_token`, das für geschützte Endpunkte benötigt wird

**Hinweis:**

- Die Registrierung (1) muss vor dem Login (2) erfolgen!

---

## 3. Profil-Endpunkt (geschützt, benötigt Token)

```bash
curl -k https://localhost:3000/auth/profile \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

**Parameter-Erklärung:**

- `-k` : Ignoriert das selbstsignierte Zertifikat
- `https://localhost:3000/auth/profile` : Ziel-Endpoint für das User-Profil
- `-H "Authorization: Bearer <ACCESS_TOKEN>"` : Überträgt das JWT-Token im Header (ersetze `<ACCESS_TOKEN>` durch den Wert aus Schritt 2)

---

## 4. Root-Endpoint (optional, falls vorhanden)

```bash
curl -k https://localhost:3000/
```

**Parameter-Erklärung:**

- `-k` : Ignoriert das selbstsignierte Zertifikat
- `https://localhost:3000/` : Root-Endpoint, gibt z.B. "Hello World!" zurück

---

**Reihenfolge:**

1. Zuerst Registrierung (1)
2. Dann Login (2) und Token merken
3. Mit Token geschützte Endpunkte wie Profil (3) testen
4. Root-Endpoint (4) ist optional

---

**Hinweis:**

- Für weitere Endpoints kannst du die Struktur analog verwenden.
- Das `-k`-Flag ist nur für selbstsignierte Zertifikate nötig.
