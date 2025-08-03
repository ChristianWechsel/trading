# ToDo List

## Analyse-Engine: Modulare Handelssimulation

**Ziel:** Eine flexible Backtesting-Engine schaffen, bei der Handelslogik (Sizing, Risk-Management) konfigurierbar ist und alle Ergebnisse zentral im `AnalysisContext` gespeichert werden.

### 1. Kernkomponenten der Simulation

- **`Account` Klasse:**

  - **Zweck:** Verwaltet ausschließlich das Kapital (Bargeld).
  - **Verantwortlichkeiten:** `initialCapital`, `currentCash`, `debit(amount)`, `credit(amount)`.

- **`Position` Klasse:**

  - **Zweck:** Repräsentiert eine offene Investition.
  - **Verantwortlichkeiten:** `symbol`, `shares`, `entryPrice`, `entryDate`, `stopLossPrice`.

- **`Portfolio` Klasse:**
  - **Zweck:** Koordiniert `Account` und `Position`en.
  - **Verantwortlichkeiten:** Hält eine `Account`-Instanz und eine Liste von `Position`en. Bietet Methoden wie `openPosition(...)`, `closePosition(...)`, `hasOpenPosition()`.

### 2. Konfigurierbare Strategien

- **`PositionSizingStrategy` (Funktionstyp):**

  - **Signatur:** `(cash: number, price: number) => number` (gibt Anzahl der Aktien zurück).
  - **Beispiele:** `AllInSizing`, `FixedAmountSizing`.

- **`StopLossStrategy` (Funktionstyp):**
  - **Signatur:** `(entryPrice: number, dataPoint: EnrichedDataPoint) => number` (gibt Stop-Preis zurück).
  - **Beispiele:** `PercentageStopLoss`, `ATRStopLoss`.

### 3. Integration in den `AnalysisContext`

- Der `AnalysisContext` wird erweitert und hält:
  - `private portfolio: Portfolio;`
  - `private account: Account;`
  - `private positionSizingStrategy: PositionSizingStrategy;`
  - `private stopLossStrategy: StopLossStrategy;`
- Der `constructor` des `AnalysisContext` initialisiert diese Objekte basierend auf der `AnalysisQueryDto`.

### 4. Ablauf in `Trading.execute()`

Die `Trading`-Klasse wird zur reinen Simulations-Engine, die die Komponenten aus dem `Context` nutzt.

```typescript
// Pseudocode für Trading.execute(context)

const portfolio = context.getPortfolio();
const account = context.getAccount();
const positionSizingStrategy = context.getPositionSizingStrategy();
const stopLossStrategy = context.getStopLossStrategy();

const allDataPoints = context.getEnrichedDataPoints();
const signals = context.getTradingSignalsAsMap(); // Helper-Methode im Context

for (const dataPoint of allDataPoints) {
  const openPosition = portfolio.getOpenPosition();

  // 1. Stop-Loss prüfen
  if (openPosition && dataPoint.lowPrice <= openPosition.stopLossPrice) {
    portfolio.closePosition(openPosition.stopLossPrice);
    // Trade im Context speichern...
    continue;
  }

  const signal = signals.get(dataPoint.priceDate);

  // 2. Verkaufssignal prüfen
  if (openPosition && signal === "sell") {
    portfolio.closePosition(dataPoint.closePrice);
    // Trade im Context speichern...
  }

  // 3. Kaufsignal prüfen
  else if (!openPosition && signal === "buy") {
    const shares = positionSizingStrategy(
      account.getCash(),
      dataPoint.closePrice
    );
    if (shares > 0) {
      const stopLoss = stopLossStrategy(dataPoint.closePrice, dataPoint);
      portfolio.openPosition(shares, dataPoint.closePrice, stopLoss);
    }
  }
}
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
