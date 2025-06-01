# Testkonzept für das Trading-Server-Projekt

## Zielsetzung

Das Ziel dieses Testkonzepts ist es, die Anwendung möglichst fehlerfrei, robust und wartbar zu gestalten. Die Tests sollen eine hohe Abdeckung erreichen und das Zusammenspiel der einzelnen Komponenten sicherstellen. Die folgenden Prinzipien und Vorgaben sind bei der Erstellung und Erweiterung von Tests zu beachten.

---

## 1. Testarten

### 1.1 Unit-Tests

- **Ziel:** Einzelne Funktionen, Methoden und Klassen isoliert testen.
- **Vorgehen:**
  - Mocking von Abhängigkeiten (z.B. Datenbank, externe Services).
  - Fokus auf Logik, Validierung und Fehlerbehandlung.
  - Jeder Service, Controller und jede Hilfsfunktion erhält eigene Unit-Tests.
- **Beispiel:** Teste, ob das Passwort korrekt gehasht wird, ob DTO-Validierungen greifen, ob ein Service die erwarteten Werte zurückgibt.

### 1.2 Integrationstests

- **Ziel:** Zusammenspiel mehrerer Module und Komponenten testen.
- **Vorgehen:**
  - **Immer eine In-Memory-Datenbank verwenden** (z.B. SQLite im Memory-Modus). Die echte MySQL-Datenbank darf für Tests nicht verwendet werden.
  - Mehrere Module gemeinsam initialisieren (z.B. Auth + User, Notification + CalendarEvent).
  - Teste typische Workflows (z.B. User-Registrierung, Login, Event-Erstellung).
- **Beispiel:** Teste, ob ein User nach Registrierung und Login einen JWT-Token erhält und damit geschützte Endpunkte aufrufen kann.

### 1.3 End-to-End-Tests (e2e)

- **Ziel:** Die Anwendung als Ganzes aus Sicht eines externen Clients testen.
- **Vorgehen:**
  - Starte die Anwendung vollständig **mit einer In-Memory-Datenbank** (z.B. SQLite). Die echte MySQL-Datenbank darf für e2e-Tests nicht verwendet werden.
  - Verwende HTTP-Requests, um typische Nutzeraktionen zu simulieren.
  - Teste komplette Abläufe (z.B. Registrierung, Login, Event anlegen, Push-Benachrichtigung).
- **Beispiel:** Teste, ob ein Nutzer sich registrieren, einloggen und ein Event anlegen kann und ob die API die korrekten Antworten liefert.

---

## 2. Testabdeckung

- **Ziel:** Mindestens 80% Codeabdeckung (Statements, Branches, Functions, Lines).
- **Vorgehen:**
  - Coverage-Tools (z.B. Jest Coverage) verwenden.
  - Nicht abgedeckte Bereiche regelmäßig identifizieren und gezielt testen.
  - Auch Fehlerfälle und Randbedingungen abdecken.

---

## 3. Teststruktur und -organisation

- **Dateibenennung:**
  - Unit- und Integrationstests: `*.spec.ts`
  - End-to-End-Tests: `*.e2e-spec.ts` im `test/`-Verzeichnis
- **Testdaten:**
  - Für Integration und e2e **immer eine separate In-Memory-Datenbank** (z.B. SQLite) nutzen. Die echte MySQL-Datenbank darf nicht verwendet werden.
  - Testdaten vor jedem Testlauf initialisieren und nachher bereinigen.
- **Mocking:**
  - Für Unit-Tests alle externen Abhängigkeiten mocken.
  - Für Integrationstests möglichst wenig mocken, um das echte Zusammenspiel zu testen.

---

## 4. Testinhalte und -prinzipien

- **Positiv- und Negativtests:**
  - Erfolgsfälle und Fehlerfälle (z.B. ungültige Eingaben, fehlende Berechtigungen) abdecken.
- **Validierung:**
  - DTO-Validierungen, Guards, Pipes und Interceptors testen.
- **Sicherheit:**
  - Authentifizierung, Autorisierung, Rate-Limiting, Input-Validierung testen.
- **Zusammenspiel:**
  - Workflows über mehrere Module hinweg testen (z.B. User + Auth + Notification).
- **Regression:**
  - Für gefixte Bugs immer einen Testfall anlegen.

---

## 5. Automatisierung

- **CI/CD:**
  - Tests müssen automatisiert im CI/CD laufen und bei Fehlern den Build abbrechen.
- **Skripte:**
  - `npm test` für Unit- und Integrationstests.
  - `npm run test:e2e` für End-to-End-Tests.

---

## 6. Erweiterung und Pflege

- **Neue Features:**
  - Für jede neue Funktionalität müssen passende Tests (Unit, Integration, ggf. e2e) erstellt werden.
- **Refactoring:**
  - Bestehende Tests anpassen und erweitern.
- **Dokumentation:**
  - Testfälle und -ziele dokumentieren, damit sie nachvollziehbar sind.

---

**Hinweis:** Dieses Testkonzept ist bei jeder Testgenerierung zu beachten und dient als verbindliche Vorgabe für die Testabdeckung und -qualität. Für alle Tests (Unit, Integration, e2e) ist zwingend eine In-Memory-Datenbank (z.B. SQLite) zu verwenden. Die produktive MySQL-Datenbank darf niemals für Testzwecke genutzt werden.
