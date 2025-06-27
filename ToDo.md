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
