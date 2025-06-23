import { EnrichedDataPoint } from '../../digital-signal-processing/dto/enriched-data-point/enriched-data-point';
import { AnalysisPipeline } from './analysis-pipeline';
import { AnalysisContext, AnalysisStep, Step } from './pipeline.interface';

// NEU: Wir erstellen robustere Mock-Implementierungen, die die komplette Schnittstelle erfüllen.
class MockStep implements AnalysisStep {
  name: Step;
  dependsOn: Step[] = [];

  constructor(name: Step, dependsOn: Step[] = []) {
    this.name = name;
    this.dependsOn = dependsOn;
  }

  execute(_context: AnalysisContext): void {
    // Diese Implementierung wird im Test durch einen Spy ersetzt
  }
}

// NEU: Der MutatorStep wurde ebenfalls an die neue Schnittstelle angepasst.
class MutatorStep implements AnalysisStep {
  name: Step = 'SwingPointDetection'; // Beispielhafter Name
  dependsOn: Step[] = [];

  execute(context: AnalysisContext): void {
    if (context.enrichedDataPoints.length > 0) {
      // Wir verwenden eine echte Methode der Klasse, um den Zustand zu ändern
      context.enrichedDataPoints[0].setSwingPointType('swingLow');
    }
  }
}

describe('AnalysisPipeline', () => {
  let originalData: EnrichedDataPoint[];

  beforeEach(() => {
    originalData = [
      new EnrichedDataPoint({ x: 10, y: 20 }),
      new EnrichedDataPoint({ x: 30, y: 40 }),
    ];
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('run method', () => {
    it('sollte die clone-Methode für jeden Datenpunkt aufrufen, um den Kontext zu initialisieren', () => {
      const cloneSpy1 = jest.spyOn(originalData[0], 'clone');
      const cloneSpy2 = jest.spyOn(originalData[1], 'clone');

      const pipeline = new AnalysisPipeline([
        new MockStep('SwingPointDetection'),
      ]);

      pipeline.run(originalData);

      expect(cloneSpy1).toHaveBeenCalledTimes(1);
      expect(cloneSpy2).toHaveBeenCalledTimes(1);
    });

    it('sollte die execute-Methode jedes Steps mit dem korrekten AnalysisContext aufrufen', () => {
      const step1 = new MockStep('SwingPointDetection');
      const step2 = new MockStep('TrendDetection', ['SwingPointDetection']);
      const executeSpy1 = jest.spyOn(step1, 'execute');
      const executeSpy2 = jest.spyOn(step2, 'execute');

      const pipeline = new AnalysisPipeline([step1, step2]);

      const result = pipeline.run(originalData);

      expect(executeSpy1).toHaveBeenCalledTimes(1);
      expect(executeSpy2).toHaveBeenCalledTimes(1);

      // GEÄNDERT: Wir prüfen jetzt, ob 'execute' mit einem Objekt (dem Kontext) aufgerufen wurde.
      expect(executeSpy1).toHaveBeenCalledWith(expect.any(Object));

      // Wir extrahieren das Kontext-Objekt, mit dem der Spy aufgerufen wurde.
      const contextArg = executeSpy1.mock.calls[0][0];

      // GEÄNDERT: Wir prüfen die Eigenschaften des Kontext-Objekts.
      expect(contextArg).toHaveProperty('enrichedDataPoints');
      expect(contextArg.enrichedDataPoints[0]).toBeInstanceOf(
        EnrichedDataPoint,
      );

      // Wichtig: Das Array im Kontext darf nicht das Original-Array sein.
      expect(contextArg.enrichedDataPoints).not.toBe(originalData);
      expect(contextArg.enrichedDataPoints[0]).not.toBe(originalData[0]);

      // Das Ergebnis von run() ist das geklonte und bearbeitete Array aus dem Kontext.
      expect(result.enrichedDataPoints).toBe(contextArg.enrichedDataPoints);
    });

    it('sollte die Originaldaten dank des Klonens nicht mutieren', () => {
      const mutatorStep = new MutatorStep();
      const pipeline = new AnalysisPipeline([mutatorStep]);

      expect(originalData[0].getSwingPointType()).toBeNull();

      const result = pipeline.run(originalData);

      // Das Original-Objekt bleibt unberührt.
      expect(originalData[0].getSwingPointType()).toBeNull();

      // Das geklonte, prozessierte Objekt im Ergebnis hat sich jedoch geändert.
      expect(result.enrichedDataPoints[0].getSwingPointType()).toBe('swingLow');
    });

    it('sollte die Steps in der korrekten Reihenfolge ausführen', () => {
      const callOrder: string[] = [];
      const step1 = new MockStep('SwingPointDetection');
      const step2 = new MockStep('TrendDetection', ['SwingPointDetection']);

      jest
        .spyOn(step1, 'execute')
        .mockImplementation(() => callOrder.push('step1'));
      jest
        .spyOn(step2, 'execute')
        .mockImplementation(() => callOrder.push('step2'));

      const pipeline = new AnalysisPipeline([step1, step2]);

      pipeline.run([]);

      expect(callOrder).toEqual(['step1', 'step2']);
    });
  });

  // NEU: Ein eigener Test-Block für die Validierungslogik im Konstruktor.
  describe('constructor and validation', () => {
    it('sollte KEINEN Fehler werfen, wenn die Abhängigkeiten und die Reihenfolge korrekt sind', () => {
      const step1 = new MockStep('SwingPointDetection');
      const step2 = new MockStep('TrendDetection', ['SwingPointDetection']);

      // Diese Erstellung sollte erfolgreich sein.
      expect(() => new AnalysisPipeline([step1, step2])).not.toThrow();
    });

    it('sollte einen Fehler werfen, wenn eine Abhängigkeit fehlt', () => {
      const step2 = new MockStep('TrendDetection', ['SwingPointDetection']);

      // Hier fehlt 'SwingPointDetection', also sollte der Konstruktor einen Fehler werfen.
      expect(() => new AnalysisPipeline([step2])).toThrow(
        "Missing dependency: 'TrendDetection' requires 'SwingPointDetection', which is not configured in the pipeline.",
      );
    });

    it('sollte einen Fehler werfen, wenn die Reihenfolge der Abhängigkeiten falsch ist', () => {
      const step1 = new MockStep('SwingPointDetection');
      const step2 = new MockStep('TrendDetection', ['SwingPointDetection']);

      // Hier ist die Reihenfolge im Array falsch.
      expect(() => new AnalysisPipeline([step2, step1])).toThrow(
        "Invalid order: 'SwingPointDetection' must run before 'TrendDetection'.",
      );
    });
  });
});
