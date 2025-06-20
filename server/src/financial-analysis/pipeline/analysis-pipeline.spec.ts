import { EnrichedDataPoint } from '../../digital-signal-processing/dto/enriched-data-point/enriched-data-point';
import { AnalysisPipeline } from './analysis-pipeline';

import { AnalysisStep } from './pipeline.interface';

// Eine konkrete Implementierung von AnalysisStep für unsere Tests
class ConcreteAnalysisStep implements AnalysisStep {
  // Die Methode kann leer sein, da wir sie mit einem Spy überwachen
  execute(context: EnrichedDataPoint[]): void {
    // Diese Implementierung wird im Test durch einen Spy ersetzt
  }
}

// Ein Step, der die Daten aktiv verändert, um die Immutabilität zu testen
class MutatorStep implements AnalysisStep {
  execute(context: EnrichedDataPoint[]): void {
    if (context.length > 0) {
      // Wir verwenden eine echte Methode der Klasse, um den Zustand zu ändern
      context[0].setSwingPointType('swingLow');
    }
  }
}

describe('AnalysisPipeline (with spyOn)', () => {
  let originalData: EnrichedDataPoint[];

  // WICHTIG: Nach jedem Test müssen Spione wiederhergestellt werden,
  // um Tests nicht gegenseitig zu beeinflussen.
  afterEach(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    // Wir erstellen echte Instanzen von EnrichedDataPoint
    originalData = [
      new EnrichedDataPoint({ x: 10, y: 20 }),
      new EnrichedDataPoint({ x: 30, y: 40 }),
    ];
  });

  it('sollte die clone-Methode für jeden Datenpunkt aufrufen', () => {
    // Setup: Wir spionieren die clone-Methode der echten Objekte aus
    const cloneSpy1 = jest.spyOn(originalData[0], 'clone');
    const cloneSpy2 = jest.spyOn(originalData[1], 'clone');

    const pipeline = new AnalysisPipeline([new ConcreteAnalysisStep()]);

    // Aktion
    pipeline.run(originalData);

    // Assertion
    expect(cloneSpy1).toHaveBeenCalledTimes(1);
    expect(cloneSpy2).toHaveBeenCalledTimes(1);
  });

  it('sollte die execute-Methode jedes Steps mit den geklonten Daten aufrufen', () => {
    // Setup
    const step1 = new ConcreteAnalysisStep();
    const step2 = new ConcreteAnalysisStep();
    const executeSpy1 = jest.spyOn(step1, 'execute');
    const executeSpy2 = jest.spyOn(step2, 'execute');

    const pipeline = new AnalysisPipeline([step1, step2]);

    // Aktion
    const result = pipeline.run(originalData);

    // Assertion
    expect(executeSpy1).toHaveBeenCalledTimes(1);
    expect(executeSpy2).toHaveBeenCalledTimes(1);

    // Prüfen, ob 'execute' mit einer Liste von EnrichedDataPoint-Instanzen aufgerufen wurde
    expect(executeSpy1).toHaveBeenCalledWith(expect.any(Array));
    const executeArgs = executeSpy1.mock.calls[0][0];
    expect(executeArgs[0]).toBeInstanceOf(EnrichedDataPoint);

    // Wichtig: Das übergebene Array darf nicht das Original-Array sein
    expect(executeArgs).not.toBe(originalData);
    expect(executeArgs[0]).not.toBe(originalData[0]);

    // Das Ergebnis von run() ist das gleiche Array, das an die Steps ging
    expect(result).toBe(executeArgs);
  });

  it('sollte die Originaldaten dank des Klonens nicht mutieren', () => {
    // Setup
    const mutatorStep = new MutatorStep();
    const pipeline = new AnalysisPipeline([mutatorStep]);

    // Der ursprüngliche SwingPointType ist null
    expect(originalData[0].getSwingPointType()).toBeNull();

    // Aktion
    const result = pipeline.run(originalData);

    // Assertion: Das Original-Objekt bleibt unberührt
    expect(originalData[0].getSwingPointType()).toBeNull();

    // Das geklonte, prozessierte Objekt im Ergebnis hat sich jedoch geändert
    expect(result[0].getSwingPointType()).toBe('swingLow');
  });

  it('sollte die Steps in der korrekten Reihenfolge ausführen', () => {
    const callOrder: string[] = [];
    const step1 = new ConcreteAnalysisStep();
    const step2 = new ConcreteAnalysisStep();

    // Der Spy kann auch eine Fake-Implementierung haben, um die Reihenfolge zu tracken
    jest
      .spyOn(step1, 'execute')
      .mockImplementation(() => callOrder.push('step1'));
    jest
      .spyOn(step2, 'execute')
      .mockImplementation(() => callOrder.push('step2'));

    const pipeline = new AnalysisPipeline([step1, step2]);

    // Aktion
    pipeline.run([]);

    // Assertion
    expect(callOrder).toEqual(['step1', 'step2']);
  });
});
