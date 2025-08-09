# ToDo List

## Analyse-Engine: Modulare Handelssimulation

# Auswertung

- Trading ist default step, wenn nichts angegeben
- normalisierung des close berücksichtigen. Evtl. gab es Aktiensplits, etc, welche Kurs nicht vergleichbar macht
- In Position sind manchmal numbers und manchmal string enthalten
- In Position das Ausstiegsdatum notieren
- Auflistung aller Trades, mit Kauf-/Verkausdatum und Einstriegs-/Ausstiegspreis, Grund für Eintieg und Ausstieg
- Nicht alle Positionen sind geschlossen => warum?
- Initiales Konto und Endkonto anzeigen
- Parallel dazu den Chart legen, um zu erkennen, was gemacht wurde
- Trendkanäle in Chart anzeigen.

# Klasse Trade kann entfallen

# Klasse Position soll zu einem TradingJournal ausgebaut werden. Daher muss angegeben werden, warum Kauf/Verkauf stattgefunden hat

Ideen zur Weiterentwicklung der Architektur:

Trading-Journal / Logging:
Führe ein Trading-Journal ein, das alle Trades, Gründe, Zeitpunkte und Preise protokolliert. Das hilft bei der Analyse und Nachvollziehbarkeit.

Order-Typen und Ausführungslogik:
Unterstütze verschiedene Order-Typen (Market, Limit, Stop) und simuliere realistischere Ausführungsbedingungen (Slippage, Latenz).

Strategie-Interface und Plug-and-Play:
Definiere ein Interface für Strategien (z.B. ITradingStrategy), sodass verschiedene Strategien einfach ausgetauscht oder kombiniert werden können.

Multi-Asset/Portfolio-Strategien:
Erweitere die Architektur, um mehrere Ticker/Assets gleichzeitig zu handeln und Portfolio-übergreifende Regeln zu ermöglichen.

Risikomanagement auf Portfolio-Ebene:
Ergänze Regeln wie maximale Positionsanzahl, Risikobegrenzung pro Trade und Gesamtportfolio.

Performance-Metriken & Reporting:
Baue ein Modul, das Kennzahlen wie Sharpe Ratio, Drawdown, Trefferquote usw. berechnet.

Event-System / Hooks:
Implementiere ein Event-System, um auf bestimmte Ereignisse (Trade geöffnet, geschlossen, Stop-Loss ausgelöst) reagieren zu können (z.B. für Benachrichtigungen oder Logging).

Backtest-Konfiguration als Objekt:
Halte alle Parameter (Strategien, Startkapital, Gebühren, etc.) in einer zentralen Konfigurationsklasse.

Simulation von Gebühren und Steuern:
Berücksichtige Transaktionskosten, Steuern oder andere realistische Faktoren.

Unit-Tests für Strategien:
Baue eine Test-Infrastruktur, um Strategien automatisiert gegen historische Daten zu testen.

Doch, ich habe auch konkrete Verbesserungsvorschläge bezogen auf den Code, die über die ToDo-Liste hinausgehen und direkt die Wartbarkeit, Erweiterbarkeit und Testbarkeit deiner Trading-Logik betreffen. Hier einige Beispiele:

1. Trennung von Logik und Datenhaltung
   Aktuell ist die gesamte Handelslogik in einer Methode (execute) gebündelt. Besser wäre es, einzelne Verantwortlichkeiten (z.B. Signalverarbeitung, Orderausführung, Stop-Loss-Überwachung) in eigene Methoden oder Klassen auszulagern.

2. Order-Objekt einführen
   Statt Positionen direkt zu öffnen/schließen, könntest du ein Order-Objekt einführen, das Order-Typ, Limit/Stop-Preis, Status etc. kapselt. Das macht die spätere Erweiterung auf Limit/Stop-Orders und realistischere Simulationen einfacher.

3. Trading-Journal als eigene Klasse
   Das Protokollieren von Trades (inkl. Grund, Zeit, Preis) sollte in einer eigenen Journal-Klasse erfolgen, nicht in der Position selbst. So kannst du Trades, Fehler, Slippage etc. zentral erfassen und auswerten.

4. Events/Hooks
   Statt Logik direkt im Loop zu verankern, könntest du Events (z.B. onPositionOpened, onStopLossHit) einführen, auf die andere Module (z.B. Logging, Benachrichtigungen) reagieren können.

5. Konfigurierbarkeit und Testbarkeit
   Stelle sicher, dass alle Strategien, Parameter und Abhängigkeiten (wie Money- und Risk-Management) über den Kontext oder eine Konfigurationsklasse injiziert werden und nicht fest verdrahtet sind.

6. Unit-Tests für die Trading-Logik
   Baue Unit-Tests für die Trading-Logik auf, z.B. mit Mock-Strategien und Testdaten, um die Korrektheit der Orderausführung und Signalverarbeitung zu prüfen.

```

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
```
