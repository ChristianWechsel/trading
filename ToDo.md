# ToDo List

# Performance Messung auf Client etablieren. Damit ich schnell Feedback erhalte, wie sich die Performace entwickelt.

# TradingCharts

- Auswahl der Charts Linien oder Candlestick
- Auswahl der Filter ermöglichen
- Candlestick zusätzliche Linien hinzufügen für gleitende Durchschnitte Trendkanäle etc
- Tages, Woichen, Minuten Charts, ...
- Liniencharts z.B. auf Bais open, close, max, min Kurs, wenn candleStick data vorliegen
- Idee: Verwendung von Art Toolbox, in welcher schematisch verschiedene Charts
  vorhanden sind. Diese kann man mit Drag & Drop in Seite ziehen und damit die gewünschte Chartart erhalten.

# Backend Architektur & Module

- [ ] Neues Modul `data-provider` für reine Datenbereitstellung (EOD, Unternehmenskennzahlen, Wirtschaftskalender etc.) anlegen
- [ ] `data-provider`-Modul greift ausschließlich auf lokale Datenbank/die von `data-aggregation` bereitgestellten Daten zu
- [ ] `data-aggregation` bleibt für Datenimport und -aktualisierung aus externen Quellen zuständig
- [ ] Schnittstelle zwischen `data-provider` und `data-aggregation` definieren (z.B. Service-Methoden für Datenzugriff)
- [ ] Erweiterbarkeit für weitere Datenarten (z.B. Fundamentals, Kalenderdaten) sicherstellen

# Technische Aufgaben

- [ ] Datenbankstruktur für EOD-Daten, Unternehmenskennzahlen, Wirtschaftskalender etc. entwerfen und ggf. partitionieren
- [ ] Upsert-Logik für EOD-Daten implementieren (bestehende Daten aktualisieren oder ergänzen)
- [ ] Endpoints im `data-provider`-Modul für verschiedene Datenarten bereitstellen (z.B. `/market-data/eod`, `/market-data/fundamentals`)
- [ ] DTOs mit Validierung für alle Datenabfragen erstellen
- [ ] Tests für neue Module und Endpoints (Unit, Integration, e2e) anlegen

# ToDo UI

- [ ] Analyse-Seite erstellen
- [ ] Notification-Seite erstellen
- [ ] Logout-Button auf der Startseite implementieren
- [ ] Registrierung für Notifications implementieren
- [ ] Notifications versenden implementieren
- [ ] Analyse-Funktionalität implementieren
- [ ] Daten-Aggregations-Funktionalität implementieren
- [ ] User-Management implementieren
- [ ] Authentifizierung implementieren
- [ ] Kalender-Event-Funktionalität implementieren
- [ ] Für jede Seite soll eine einfache Navigation vorliegen
      Button logout auf login seite ausblenden, dann funktioniert Logik in main.js besser
      Dazu in main.js den Button Logout kontrollieren

# .env von github copilot ausschließen, da hier Passwörter enthalten sind
