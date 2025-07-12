# Checkliste: Frontend-Performance Analyse

Diese Checkliste hilft dabei, die Performance des Frontends systematisch zu analysieren und Regressionen nach Code-Änderungen schnell zu identifizieren. Führe diese Schritte idealerweise vor und nach größeren Änderungen durch, um die Auswirkungen zu vergleichen.

---

### ☐ **Phase 1: Lighthouse Audit (Der schnelle Überblick)**

**Ziel:** Eine standardisierte Performance-Punktzahl erhalten und offensichtliche Probleme ("low-hanging fruits") aufdecken.

- [ ] **1. DevTools öffnen:**

  - Drücke `F12` oder `Cmd+Opt+I` (Mac) / `Strg+Shift+I` (Windows/Linux).

- [ ] **2. Lighthouse-Tab auswählen:**

  - Navigiere zum Tab "Lighthouse".

- [ ] **3. Audit konfigurieren:**

  - **Modus:** Wähle "Navigation".
  - **Gerät:** Teste sowohl "Mobil" als auch "Desktop". Mobil ist oft wichtiger, da die Leistung hier kritischer ist.
  - **Kategorien:** Wähle mindestens **"Performance"**.

- [ ] **4. Analyse starten:**

  - Klicke auf **"Seitenaufbau analysieren"** ("Analyze page load").

- [ ] **5. Report auswerten:**
  - **Performance-Punktzahl:** Notiere die Gesamtpunktzahl. Hat sie sich verschlechtert?
  - **Messwerte (Metrics):** Überprüfe die Kernwerte:
    - `Largest Contentful Paint (LCP)`: Wie schnell wird der Hauptinhalt sichtbar?
    - `Total Blocking Time (TBT)`: Wie lange wird die Seite durch Skripte blockiert?
  - **Empfehlungen (Opportunities):** Lies die Vorschläge. Oft werden zu große Bilder, ungenutztes JavaScript oder CSS und blockierende Ressourcen genannt.

---

### ☐ **Phase 2: Netzwerkanalyse (Ladezeiten & Daten)**

**Ziel:** Langsame oder zu große Ressourcen identifizieren, insbesondere die API-Antwort für die Chart-Daten.

- [ ] **1. Network-Tab öffnen:**

  - Gehe in den DevTools zum Tab "Network".

- [ ] **2. Cache deaktivieren:**

  - Setze einen Haken bei **"Disable cache"**. Das simuliert, wie ein neuer Besucher die Seite lädt.

- [ ] **3. Seite neu laden & Aktion ausführen:**

  - Lade die Seite neu (`Cmd+R` / `Strg+R`).
  - Fülle das Formular aus und klicke auf "Anzeigen", um den `/data-provider/eod` Request auszulösen.

- [ ] **4. Ergebnisse analysieren:**
  - **Gesamtstatistik:** Achte auf die Gesamtgröße der heruntergeladenen Daten ("transferred") und die Ladezeit ("Load") in der Statusleiste unten.
  - **Ressourcenliste:** Sortiere nach "Size" oder "Time", um die größten oder langsamsten Dateien zu finden.
    - Ist `lightweight-charts.standalone.production.js` groß? Wird es vom Server komprimiert (gzipped)?
  - **API-Request (`eod`):** Klicke auf den `eod`-Request in der Liste.
    - **Status:** Ist er `200 OK`?
    - **Größe (Size):** Ist die Datenmenge angemessen?
    - **Dauer (Time):** Wie lange dauert der Request? Achte im "Timing"-Tab besonders auf die **"Time to First Byte (TTFB)"** – sie zeigt die Antwortgeschwindigkeit des Backends.

---

### ☐ **Phase 3: Performance-Profil (Laufzeit-Analyse)**

**Ziel:** Ruckler, "eingefrorene" Oberflächen und langsame JavaScript-Funktionen während der Interaktion aufspüren.

- [ ] **1. Performance-Tab öffnen:**

  - Gehe zum Tab "Performance".

- [ ] **2. Aufnahme starten:**

  - Klicke auf den Aufnahme-Button (⚫️) oder drücke `Cmd+E` / `Strg+E`.

- [ ] **3. Aktionen durchführen:**

  - Führe die zu testenden Aktionen aus:
    - Laden der Seite.
    - Absenden des Formulars.
    - Zoomen oder Verschieben des Charts.

- [ ] **4. Aufnahme stoppen:**

  - Klicke erneut auf den Aufnahme-Button.

- [ ] **5. Zeitachse (Timeline) analysieren:**
  - **Main-Thread:** Achte im "Main"-Bereich auf rote Dreiecke. Diese markieren **"Long Tasks"** (>50ms), die die UI blockieren.
  - **Experience:** Suche nach roten Balken im Bereich "Layout Shifts". Sie zeigen unerwartete Bewegungen von Elementen an.
  - **Flame Chart:** Wenn du eine "Long Task" findest, klicke darauf. Das "Flame Chart" darunter zeigt dir, welche JavaScript-Funktion (`transformChartData`, `setData`, etc.) die meiste Zeit in Anspruch genommen hat.
  - **Summary (Zusammenfassung):** Das Kuchendiagramm unten gibt einen schnellen Überblick, womit der Browser seine Zeit verbracht hat (z.B. `Scripting`, `Rendering`).
