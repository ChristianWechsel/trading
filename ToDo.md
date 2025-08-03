# ToDo List

# Trenderkennung muss auch Punkte liefern: Trendbestätigung und Warnung Trendbruch

# TradingCharts

- Auswahl der Charts Linien oder Candlestick
- Auswahl der Filter ermöglichen
- Candlestick zusätzliche Linien hinzufügen für gleitende Durchschnitte Trendkanäle etc
- Tages, Wochen, Minuten Charts, ...
- Liniencharts z.B. auf Bais open, close, max, min Kurs, wenn candleStick data vorliegen
- Idee: Verwendung von Art Toolbox, in welcher schematisch verschiedene Charts
  vorhanden sind. Diese kann man mit Drag & Drop in Seite ziehen und damit die gewünschte Chartart erhalten.
- chart und analyse sind in .pug, .js und .css sehr ähnlich. Daher sollte man gemeinsame Aspekte herausschneiden. Gilt auch auch für module data-provide und analysis.
- SwingPoints als Label dem Chart hinzufügen
- Trendkanäle hinzufügen
- Seite für Auswahl der Optionen, dann submit, dann neue Seite öffnen => evtl. kann man
  dadurch auch ServerSide Rendering nutzen, um Last auf Server zu nehmen (ThinClient) => Variablen von pug nutzen, um daten einzuschleußen.
- Trendkanäle mit Checkbox anbieten und gezielt in Chart einblenden lassen. Alle Trendkanäle einblenden hat im ersten Versuch nicht geklappt

# ToDo UI

- [ ] Chart-Seite erstellen
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
