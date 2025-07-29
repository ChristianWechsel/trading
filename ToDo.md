# ToDo List

## Architektur-Refactoring: Context-basierte Konfiguration

### 1. AnalysisContextClass erweitern

- [ ] Factory-Methoden für ComparableNumber hinzufügen (createSwingPointComparableNumber, createTrendDetectionComparableNumber)
- [ ] Standardwerte-Methoden implementieren (getSwingPointDetectionOptions, getTrendDetectionOptions, getAverageTrueRangeOptions)
- [ ] Validierungsmethoden in Context verlagern (validateSwingPointDetectionOptions, validateTrendDetectionOptions)
- [ ] ATR-Verfügbarkeits-Prüfung implementieren (isATRAvailable, getATRValueForDataPoint)

### 2. ComparableNumber-System erweitern

- [ ] ATRComparableNumber-Klasse erstellen (mit atrValue und atrFactor)
- [ ] RelativeComparableNumber beibehalten für Fallback
- [ ] Factory-Logik: ATR-basiert wenn verfügbar, sonst relativ

### 3. Steps vereinfachen

- [ ] Constructor-Parameter aus allen Steps entfernen
- [ ] SwingPointDetection: Constructor-Logik entfernen, Context-basierte Konfiguration verwenden
- [ ] TrendDetection: Constructor-Logik entfernen, Context-basierte Konfiguration verwenden
- [ ] AverageTrueRange: Constructor-Logik entfernen, Context-basierte Konfiguration verwenden
- [ ] Validierungen aus Steps in Context verlagern

### 4. AnalysisBuilder anpassen

- [ ] Standardwerte-Konfiguration entfernen
- [ ] Factory-Methoden vereinfachen (keine Parameter mehr an Step-Constructors)
- [ ] StepConfiguration-Type möglicherweise entfernen

### 5. DTOs erweitern

- [ ] atrFactor zu SwingPointDetectionOptionsDto hinzufügen
- [ ] atrFactor zu TrendDetectionOptionsDto hinzufügen
- [ ] Validierungen für atrFactor implementieren

### 6. Tests anpassen

- [ ] Alle Step-Tests auf parameterlose Constructors umstellen
- [ ] Context-Mock für Tests erstellen
- [ ] Factory-Tests für ComparableNumber hinzufügen
- [ ] Integrationstests für ATR/Relative-Threshold-Auswahl

### 7. Bestehende ToDos

Für IntTest SwingPointData soll der ATR dynamisch übergeben werden und es soll möglich sein, diesen Wert gezielt festzulegen, um fixe Rahmenbedingungen vorzugeben
ATR wird bei SwingPoint und Trenderkennung benötigt, da hier mit THreshold gearbeitet wird, was eine signifikaten Änderung darstellt.
Im Konstruktor der Steps werden die Fallbackwerte definiert, wenn kWert nicht via DTO von Client kommt.
SwingPointDetection und TrendDetection verwenden faktor \* atr als relative Threshold => relativeThreshold entweder entfernen oder als Fallback verwenden.

# Integationstest für analysis für MCD.US von 17.03.1980 bis 01.06.1980

- die Erkennung von SwingPoints klappt noch nicht.
- => Average True Range nach Weller Wilders. Da ATR in kurzen Intervallen berechnet wird, müsste die SwingPointAnalyse für jeden DataPoint den aktuellen Wert der ATR verwenden => ein fester Wert via Construtor ist nur als Fallback geeignet ()kann aber auch für Tests verwendet werden).
  https://www.investopedia.com/terms/a/atr.asp

  Integrationstest, welche alle Steps umfasst, ATR, SwingPoint, TrendDetection, TrendChannelCalc => Das Zusammenspiel aller Teile abtesten. Insb, da Context geändert wurde.
  enrichedDataPoints: EnrichedDataPoint[];
  -TrendDataMetadata => start und end sollte idealerweise OHCLV Datum sein, dann habe ich Zugriff auf date als ISOString und als ms since epoche, was auch unnötige KOnvertierungen erspart. Alternativ ein EnrichedDataPoint ist.

  - analysis.int.spec.ts soll alle Bearbeitungsschritte abtesten: ATR, SwingPoint, TrendDetction, TrendChannelCalculation. Mit den gleichen Daten kann dann in jedem Schritt ein Integrationstest erstellt werden.

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
