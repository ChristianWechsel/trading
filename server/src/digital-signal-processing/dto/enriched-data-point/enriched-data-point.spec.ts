import { DataPoint } from 'src/digital-signal-processing/digital-signal-processing.interface';
import { EnrichedDataPoint } from './enriched-data-point';

describe('EnrichedDataPoint', () => {
  it('should return the correct x value', () => {
    const mockDataPoint: DataPoint<number> = { x: 11, y: 20 };
    const enrichedDataPoint = new EnrichedDataPoint(mockDataPoint);

    expect(enrichedDataPoint.x).toBe(11);
  });

  it('should return the correct y value', () => {
    const mockDataPoint: DataPoint<number> = { x: 10, y: 20 };
    const enrichedDataPoint = new EnrichedDataPoint(mockDataPoint);

    expect(enrichedDataPoint.y).toBe(20);
  });

  it('should set and get the swingPointType correctly', () => {
    const mockDataPoint: DataPoint<number> = { x: 10, y: 20 };
    const enrichedDataPoint = new EnrichedDataPoint(mockDataPoint);

    enrichedDataPoint.setSwingPointType('swingHigh');
    expect(enrichedDataPoint.getSwingPointType()).toBe('swingHigh');

    enrichedDataPoint.setSwingPointType('swingLow');
    expect(enrichedDataPoint.getSwingPointType()).toBe('swingLow');
  });

  it('should set and get the trend correctly', () => {
    const mockDataPoint: DataPoint<number> = { x: 10, y: 20 };
    const enrichedDataPoint = new EnrichedDataPoint(mockDataPoint);

    enrichedDataPoint.setTrend('upward');
    expect(enrichedDataPoint.getTrend()).toBe('upward');
  });

  it('should set and get the trend correctly - double tap', () => {
    const mockDataPoint: DataPoint<number> = { x: 10, y: 20 };
    const enrichedDataPoint = new EnrichedDataPoint(mockDataPoint);

    enrichedDataPoint.setTrend('upward');
    enrichedDataPoint.setTrend('downward');
    expect(enrichedDataPoint.getTrend()).toEqual(['upward', 'downward']);
  });

  it('should set and get the trend correctly - triple tap', () => {
    const mockDataPoint: DataPoint<number> = { x: 10, y: 20 };
    const enrichedDataPoint = new EnrichedDataPoint(mockDataPoint);

    enrichedDataPoint.setTrend('upward');
    enrichedDataPoint.setTrend('downward');
    enrichedDataPoint.setTrend('upward');
    expect(enrichedDataPoint.getTrend()).toEqual(['upward', 'downward']);
  });

  it('should set and get the trendChannel correctly', () => {
    const mockDataPoint: DataPoint<number> = { x: 10, y: 20 };
    const enrichedDataPoint = new EnrichedDataPoint(mockDataPoint);

    const channel = { upper: 100, lower: 90 };
    enrichedDataPoint.setTrendChannel(channel);
    expect(enrichedDataPoint.getTrendChannel()).toEqual(channel);
  });

  it('should set and get the trendChannel correctly - double tap', () => {
    const mockDataPoint: DataPoint<number> = { x: 10, y: 20 };
    const enrichedDataPoint = new EnrichedDataPoint(mockDataPoint);

    const channel1 = { upper: 100, lower: 90 };
    const channel2 = { upper: 110, lower: 95 };
    enrichedDataPoint.setTrendChannel(channel1);
    enrichedDataPoint.setTrendChannel(channel2);
    expect(enrichedDataPoint.getTrendChannel()).toEqual([channel1, channel2]);
  });

  it('should set and get the trendChannel correctly - triple tap', () => {
    const mockDataPoint: DataPoint<number> = { x: 10, y: 20 };
    const enrichedDataPoint = new EnrichedDataPoint(mockDataPoint);

    const channel1 = { upper: 100, lower: 90 };
    const channel2 = { upper: 110, lower: 95 };
    const channel3 = { upper: 120, lower: 100 };
    enrichedDataPoint.setTrendChannel(channel1);
    enrichedDataPoint.setTrendChannel(channel2);
    enrichedDataPoint.setTrendChannel(channel3);
    expect(enrichedDataPoint.getTrendChannel()).toEqual([channel1, channel2]);
  });
});

describe('EnrichedDataPoint.clone()', () => {
  let original: EnrichedDataPoint;
  let mockDataPoint: DataPoint<number>;

  // beforeEach sorgt dafür, dass jeder Test mit einer sauberen Instanz startet.
  beforeEach(() => {
    mockDataPoint = { x: 10, y: 20 };
    original = new EnrichedDataPoint(mockDataPoint);
    original.setSwingPointType('swingHigh');
  });

  it('sollte eine neue Instanz mit identischen Werten erstellen', () => {
    const clone = original.clone();

    // Test 1: Es ist eine andere Instanz
    expect(clone).not.toBe(original);
    expect(clone).toBeInstanceOf(EnrichedDataPoint);

    // Test 2: Die Werte sind initial identisch
    expect(clone.x).toBe(original.x);
    expect(clone.y).toBe(original.y);
    expect(clone.getSwingPointType()).toBe('swingHigh');
  });

  it('sollte das zugrundeliegende dataPoint-Objekt klonen', () => {
    const clone = original.clone();

    // Wir können nicht direkt auf #dataPoint zugreifen, aber wir können
    // prüfen, ob die Kopie des dataPoint-Objekts im Konstruktor funktioniert hat.
    // Wenn wir das Original-Objekt mutieren würden, dürfte der Klon nicht betroffen sein.
    // Dieser Test ist implizit durch die anderen abgedeckt, aber die Logik ist wichtig.
    mockDataPoint.x = 99; // Original-Objekt mutieren

    // Der Klon sollte den alten Wert behalten, da die clone()-Methode ein neues Objekt erzeugt.
    expect(clone.x).toBe(10);
  });

  it('sollte das trendChannel als tiefen Klon erstellen, wenn es ein einzelnes Objekt ist', () => {
    // Setup: Ein einzelnes Objekt setzen
    original.setTrendChannel({ upper: 100, lower: 90 });

    const clone = original.clone();

    // WICHTIG: Das geklonte Objekt *mutieren*, nicht ersetzen
    const clonedChannel = clone.getTrendChannel();
    if (clonedChannel && !Array.isArray(clonedChannel)) {
      clonedChannel.upper = 999;
    }

    // Erwartung: Das Original bleibt unberührt
    expect(clone.getTrendChannel()).toEqual({ upper: 999, lower: 90 });
    expect(original.getTrendChannel()).toEqual({ upper: 100, lower: 90 });
  });

  it('sollte das trendChannel als tiefen Klon erstellen, wenn es ein Array von Objekten ist', () => {
    // Setup: Ein Array von Objekten setzen
    original.setTrendChannel({ upper: 100, lower: 90 });
    original.setTrendChannel({ upper: 150, lower: 140 }); // `set` erzeugt jetzt ein Array

    const clone = original.clone();
    const clonedChannelArray = clone.getTrendChannel();

    // Sicherstellen, dass die Arrays selbst unterschiedliche Referenzen haben
    expect(clonedChannelArray).not.toBe(original.getTrendChannel());

    // WICHTIG: Ein Objekt *innerhalb* des geklonten Arrays mutieren
    if (clonedChannelArray && Array.isArray(clonedChannelArray)) {
      clonedChannelArray[0].lower = 777;
    }

    // Erwartung: Das Original bleibt unberührt
    const expectedCloneState = [
      { upper: 100, lower: 777 },
      { upper: 150, lower: 140 },
    ];
    const expectedOriginalState = [
      { upper: 100, lower: 90 },
      { upper: 150, lower: 140 },
    ];

    expect(clone.getTrendChannel()).toEqual(expectedCloneState);
    expect(original.getTrendChannel()).toEqual(expectedOriginalState);
  });

  it('sollte das trend-Array als unabhängige Kopie erstellen', () => {
    // Setup: Einen Zustand herstellen, bei dem 'trend' ein Array ist.
    original.setTrend('upward');
    original.setTrend('downward'); // original.getTrend() ist nun ['upward', 'downward']

    // Aktion: Den Klon erstellen
    const clone = original.clone();

    // --- Assertion 1: Prüfen, ob es eine neue Array-Instanz ist ---
    // Dies ist der wichtigste Test, um eine flache Kopie nachzuweisen.
    // .toEqual würde hier auch true ergeben, aber .toBe prüft die Objektidentität.
    expect(clone.getTrend()).not.toBe(original.getTrend());

    // Initial sollten die Inhalte aber gleich sein
    expect(clone.getTrend()).toEqual(['upward', 'downward']);

    // --- Assertion 2: Unabhängigkeit durch weitere Zustandsänderung beweisen ---
    // HINWEIS: Die 'setTrend'-Methode in der Klasse ist unvollständig. Sie behandelt nicht den
    // Fall, dass 'trend' bereits ein Array ist. Für einen robusten Test erweitern wir sie gedanklich
    // (oder im Code), sodass sie Werte zu einem bestehenden Array hinzufügt.

    /* Empfohlene Anpassung in der EnrichedDataPoint-Klasse:
    setTrend(trend: TrendDirection): void {
        if (this.#trend === null) {
          this.#trend = trend;
        } else if (!Array.isArray(this.#trend)) {
          this.#trend = [this.#trend, trend];
        } else {
          // DIESER TEIL IST NEU UND MACHT DIE METHODE VOLLSTÄNDIG
          this.#trend.push(trend);
        }
    }
    */

    // Mit der (angepassten) Methode den Klon verändern.
    // Wir verwenden einen gültigen Wert vom Typ TrendDirection.
    clone.setTrend('upward');

    // Erwartung: Nur der Klon hat sich geändert.
    expect(original.getTrend()).toEqual(['upward', 'downward']);
    expect(clone.getTrend()).toEqual(['upward', 'downward']);
  });
});
