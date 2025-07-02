# ToDo List

- In `src/analysis/analysis.service.ts` soll eine Konfigurationsmöglichkeit eingefügt werden,
  um z.B. Parameter für die SwingDetection (oder andere Analyse-Schritte) zentral zu verwalten und zu übergeben.

# Technische Analyse Pipeline erweitern

- `TrendChannelCalculation`-Step implementieren:
  - Für jeden erkannten Trend (Aufwärts/Abwärts) die Trend- und Rückkehrlinie berechnen.
  - Die Linien als mathematische Formel (Steigung, y-Achsenabschnitt) in der `TrendDataMetadata` im `AnalysisContext` speichern.
  - Die Logik soll die Swing-Punkte nutzen, um die definierenden Punkte für die Linien zu finden (z.B. zwei steigende Tiefs für Aufwärtstrendlinie).

# Zusammenspiel von Data Aggregation und Analysis (Use-Case: On-Demand Analyse)

- **Orchestrierung von Datenbeschaffung und Analyse:**

  - Einen neuen Endpoint im `AnalysisController` (z.B. `POST /analysis/full-analysis`) erstellen, der den gesamten Prozess steuert.
  - Dieser Endpoint soll als Eingabe ein Tickersymbol (`TickerDto`) und die Analyse-Parameter (`AnalysisQueryDto`) erhalten.

- **`AnalysisService` entkoppeln:**

  - Die `AnalysisService.performAnalysis`-Methode so anpassen, dass sie die zu analysierenden Kursdaten als Parameter (`EnrichedDataPoint[]`) entgegennimmt. Die hartcodierte Datenerzeugung muss entfernt werden.

- **On-Demand-Datenaktualisierung (Strategie A) implementieren:**

  - Im neuen Orchestrierungs-Endpoint eine Logik einbauen, die vor der Analyse die Aktualität der Daten sicherstellt:
    1.  Prüfen, wann die Daten für das angefragte Tickersymbol zuletzt in der Datenbank gespeichert wurden.
    2.  Wenn die Daten nicht aktuell sind (z.B. älter als 24 Stunden), den `DataAggregationService.importAndSaveData` aufrufen, um die neuesten Daten von der API zu holen und in der DB zu speichern.
    3.  Die (nun aktuellen) Kursdaten aus der `eod_price`-Tabelle laden.

- **Daten-Transformation:**

  - Eine Logik implementieren, die die aus der Datenbank geladenen `EodPrice`-Entitäten in das für die `AnalysisPipeline` benötigte `EnrichedDataPoint[]`-Format umwandelt (Mapping von `priceDate` -> `x` und `closePrice` -> `y`).

- **Integrationstest für den neuen Endpoint:**
  - Einen Integrationstest schreiben, der den neuen Endpoint `POST /analysis/full-analysis` testet.
  - Der Test sollte folgendes überprüfen:
    - Erfolgreiche Analyse-Anfrage mit gültigem Tickersymbol und Analyse-Parametern.
    - Fehlerhafte Analyse-Anfrage mit ungültigem Tickersymbol.
    - Fehlerhafte Analyse-Anfrage ohne erforderliche Parameter.

# TradingCharts

- TradingView Lightweight Charts **self-hosted** einbinden (ohne CDN, keine Fremdserver):

  1. Library installieren:  
     `npm install --save lightweight-charts`
  2. Die JS/CSS-Dateien aus `node_modules/lightweight-charts/dist/` ins eigene `public`-Verzeichnis kopieren, z.B.:  
     `cp node_modules/lightweight-charts/dist/lightweight-charts.standalone.production.js server/public/vendor/lightweight-charts/`
  3. Statische Auslieferung des Vendor-Ordners im Server sicherstellen (NestJS: ServeStaticModule).
  4. Ein einfaches HTML-Template (z.B. `chart.html` oder mit Pug) bereitstellen, das die JS-Datei lokal einbindet:
     ```html
     <script src="/vendor/lightweight-charts/lightweight-charts.standalone.production.js"></script>
     ```
  5. Im HTML eine Chart-Container-DIV und ein JS-Snippet, das einen Beispiel-Chart rendert:
     ```js
     const chart = LightweightCharts.createChart(document.getElementById('chart'), { width: 600, height: 400 });
     const series = chart.addLineSeries();
     series.setData([{ time: '2024-06-01', value: 100 }, ...]);
     ```
  6. Testen: Seite im Browser aufrufen und prüfen, ob der Chart angezeigt wird.
  7. (Später) Daten dynamisch per `fetch('/analysis', ...)` laden und im Chart anzeigen.
  8. Keine Frameworks wie React verwenden, sondern reine Templates (z.B. Pug) und Vanilla JS.

- Apache ECharts als Alternative prüfen (ebenfalls self-hosted möglich).

---

````<!-- filepath: /home/christian/Programmierung/trading/ToDo.md -->
# TradingCharts

- TradingView Lightweight Charts **self-hosted** einbinden (ohne CDN, keine Fremdserver):
  1. Library installieren:
     `npm install --save lightweight-charts`
  2. Die JS/CSS-Dateien aus `node_modules/lightweight-charts/dist/` ins eigene `public`-Verzeichnis kopieren, z.B.:
     `cp node_modules/lightweight-charts/dist/lightweight-charts.standalone.production.js server/public/vendor/lightweight-charts/`
  3. Statische Auslieferung des Vendor-Ordners im Server sicherstellen (NestJS: ServeStaticModule).
  4. Ein einfaches HTML-Template (z.B. `chart.html` oder mit Pug) bereitstellen, das die JS-Datei lokal einbindet:
     ```html
     <script src="/vendor/lightweight-charts/lightweight-charts.standalone.production.js"></script>
     ```
  5. Im HTML eine Chart-Container-DIV und ein JS-Snippet, das einen Beispiel-Chart rendert:
     ```js
     const chart = LightweightCharts.createChart(document.getElementById('chart'), { width: 600, height: 400 });
     const series = chart.addLineSeries();
     series.setData([{ time: '2024-06-01', value: 100 }, ...]);
     ```
  6. Testen: Seite im Browser aufrufen und prüfen, ob der Chart angezeigt wird.
  7. (Später) Daten dynamisch per `fetch('/analysis', ...)` laden und im Chart anzeigen.
  8. Keine Frameworks wie React verwenden, sondern reine Templates (z.B. Pug) und Vanilla JS.

- Apache ECharts als Alternative prüfen (ebenfalls self-hosted möglich).
````

# Login implementieren. Dabei JWT Token mit Cookie versenden

Ablauf:

5.  Nach login auf Startseite umleiten
6.  Bei fehlgeschlagenem Login, logout, zugriff auf nicht authorisierte Seite wird auf login umgeleitet
