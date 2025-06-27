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
});
