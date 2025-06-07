# Definition of Done (DoD) – Trading-Server-Projekt

Diese Checkliste dient als verbindliche Vorgabe, um sicherzustellen, dass alle wesentlichen Qualitäts-, Sicherheits- und Architekturstandards bei der Entwicklung eingehalten werden.

## 1. Funktionale Anforderungen

- [ ] Alle Akzeptanzkriterien der User Story sind erfüllt.
- [ ] Die Funktionalität ist dokumentiert (Code-Kommentare, README, API-Doku).

## 2. Codequalität & Clean Code

- [ ] Der Code ist verständlich, konsistent und folgt Clean-Code-Prinzipien (z.B. sprechende Namen, Single Responsibility, keine toten Codepfade).
- [ ] Keine Code-Duplikate, keine "Magic Numbers" oder Hardcodings.
- [ ] Linting- und Formatierungsregeln (z.B. ESLint, Prettier) werden eingehalten.
- [ ] Die Projektstruktur folgt den NestJS-Konventionen (Module, Controller, Service, DTOs, Guards, etc.).

## 3. Tests & Testabdeckung

- [ ] Es existieren Unit-Tests für alle neuen/angepassten Services, Controller und Hilfsfunktionen.
- [ ] Integrationstests prüfen das Zusammenspiel mehrerer Module (z.B. User + Auth).
- [ ] End-to-End-Tests (e2e) für relevante Workflows sind vorhanden.
- [ ] Die Testabdeckung liegt bei mindestens 80% (Statements, Branches, Functions, Lines).
- [ ] Für alle Tests wird eine In-Memory-Datenbank (z.B. SQLite) verwendet, niemals die Produktivdatenbank.
- [ ] Fehler- und Randfälle sind durch Tests abgedeckt.

## 4. Sicherheit

- [ ] Alle sensiblen Endpunkte sind durch Authentifizierung und ggf. Autorisierung geschützt (z.B. JWT, Guards).
- [ ] Eingaben werden validiert (class-validator, DTOs, Pipes).
- [ ] Sicherheitsrelevante Header (z.B. Helmet) sind gesetzt.
- [ ] Rate-Limiting ist aktiv.
- [ ] Keine sensiblen Daten (z.B. Passwörter, Secrets) im Repository.
- [ ] CORS ist für öffentliche APIs gezielt konfiguriert.
- [ ] Logging ist so konfiguriert, dass keine sensiblen Daten geloggt werden.

## 5. Dokumentation & Wartbarkeit

- [ ] Öffentliche APIs sind dokumentiert (z.B. Swagger/OpenAPI, README).
- [ ] Neue/angepasste Funktionen sind im Changelog oder in der Doku vermerkt.
- [ ] Die Architektur bleibt modular und erweiterbar (z.B. durch saubere Trennung von Modulen und Services).

## 6. Deployment & Automatisierung

- [ ] Alle Tests laufen automatisiert im CI/CD und müssen grün sein.
- [ ] Die Anwendung kann lokal und im Zielsystem (z.B. Ubuntu-Server) fehlerfrei gestartet werden.
- [ ] Environment-spezifische Einstellungen (z.B. .env) sind dokumentiert und nicht im Repo.

## 7. Sonstiges

- [ ] Abhängigkeiten sind aktuell (npm audit, Updates geprüft).
- [ ] Für gefixte Bugs existiert ein Regressionstest.
- [ ] Die Definition of Done wurde im Team abgestimmt und akzeptiert.

---

**Hinweis:** Diese Checkliste ist vor jedem Merge/Release vollständig abzuarbeiten. Sie kann und soll bei Bedarf erweitert werden.
