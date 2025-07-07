# ToDo List

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
