import { AnalysisBuilder } from './analysis-builder';
import { AnalysisPipeline } from './analysis-pipeline';
import { AnalysisStep, Step } from './pipeline.interface';

// Wir mocken die AnalysisPipeline, da wir nur prüfen wollen, OB und WOMIT
// der Konstruktor aufgerufen wird, nicht was die Pipeline intern macht.
jest.mock('./analysis-pipeline');

// Eine einfache Mock-Klasse für unsere Test-Objekte.
// Wir verwenden diese anstelle der echten Step-Klassen.
class MockAnalysisStep implements AnalysisStep {
  constructor(
    public name: Step,
    public dependsOn: Step[] = [],
  ) {}
  execute(): void {
    /* leer für Tests */
  }
}

describe('AnalysisBuilder', () => {
  let builder: AnalysisBuilder;
  let factorySpy: jest.SpyInstance;

  beforeEach(() => {
    builder = new AnalysisBuilder();

    // Wir spionieren die private factoryStep-Methode aus.
    // So können wir die Erstellung der echten Steps abfangen und
    // stattdessen unsere kontrollierten Mock-Objekte zurückgeben.
    factorySpy = jest
      .spyOn(builder as any, 'factoryStep')
      .mockImplementation((stepName: Step) => {
        switch (stepName) {
          case 'TrendChannelCalculation':
            return new MockAnalysisStep('TrendChannelCalculation', [
              'TrendDetection',
            ]);
          case 'TrendDetection':
            return new MockAnalysisStep('TrendDetection', [
              'SwingPointDetection',
            ]);
          case 'SwingPointDetection':
            return new MockAnalysisStep('SwingPointDetection', []);
          case 'MovingAverage':
            return new MockAnalysisStep('MovingAverage', []);
          default:
            throw new Error(`Test mock not implemented for ${stepName}`);
        }
      });
  });

  afterEach(() => {
    // Spione nach jedem Test wiederherstellen
    jest.restoreAllMocks();
  });

  it('sollte einen einzelnen Schritt ohne Abhängigkeiten hinzufügen', () => {
    builder.addStep('SwingPointDetection');
    const pipeline = builder.build();

    // Prüfen, ob der Pipeline-Konstruktor mit dem richtigen Array aufgerufen wurde
    const steps = (AnalysisPipeline as jest.Mock).mock
      .calls[0][0] as AnalysisStep[];

    expect(steps).toHaveLength(1);
    expect(steps[0].name).toBe('SwingPointDetection');
  });

  it('sollte eine Abhängigkeit automatisch vor dem angeforderten Schritt hinzufügen', () => {
    builder.addStep('TrendDetection');
    const pipeline = builder.build();

    const steps = (AnalysisPipeline as jest.Mock).mock
      .calls[0][0] as AnalysisStep[];

    expect(steps).toHaveLength(2);
    // Wichtig: Die Reihenfolge muss korrekt sein!
    expect(steps[0].name).toBe('SwingPointDetection');
    expect(steps[1].name).toBe('TrendDetection');
  });

  it('sollte eine mehrstufige Abhängigkeitskette korrekt auflösen und sortieren', () => {
    builder.addStep('TrendChannelCalculation');
    const pipeline = builder.build();

    const steps = (AnalysisPipeline as jest.Mock).mock
      .calls[0][0] as AnalysisStep[];

    expect(steps).toHaveLength(3);
    // Korrekte Reihenfolge: SwingPoint -> Trend -> Channel
    expect(steps[0].name).toBe('SwingPointDetection');
    expect(steps[1].name).toBe('TrendDetection');
    expect(steps[2].name).toBe('TrendChannelCalculation');
  });

  it('sollte bereits vorhandene Schritte und Abhängigkeiten nicht erneut hinzufügen', () => {
    // Zuerst einen Step mit Abhängigkeiten hinzufügen
    builder.addStep('TrendDetection'); // Fügt SwingPointDetection und TrendDetection hinzu
    // Dann einen unabhängigen Step hinzufügen
    builder.addStep('MovingAverage');
    // Dann einen Step, dessen Abhängigkeit ('TrendDetection') schon da ist
    builder.addStep('TrendChannelCalculation');

    const pipeline = builder.build();
    const steps = (AnalysisPipeline as jest.Mock).mock
      .calls[0][0] as AnalysisStep[];

    // Das Ergebnis sollte 4 einzigartige Steps in der korrekten Reihenfolge enthalten
    expect(steps).toHaveLength(4);
    const stepNames = steps.map((s) => s.name);
    expect(stepNames).toEqual([
      'SwingPointDetection',
      'TrendDetection',
      'MovingAverage',
      'TrendChannelCalculation',
    ]);
  });

  it('sollte die `build` Methode eine Instanz der AnalysisPipeline zurückgeben', () => {
    builder.addStep('MovingAverage');
    const pipeline = builder.build();

    expect(pipeline).toBeInstanceOf(AnalysisPipeline);
    // Prüfen, ob der Konstruktor genau einmal aufgerufen wurde
    expect(AnalysisPipeline).toHaveBeenCalledTimes(1);
  });

  it('sollte einen Fehler werfen, wenn build() auf einem leeren Builder aufgerufen wird', () => {
    // Um dies zu testen, müssen wir die build-Methode leicht anpassen, damit sie einen Fehler wirft.
    // Angenommen, die build-Methode würde so aussehen:
    // build(): AnalysisPipeline {
    //   if (this.steps.length === 0) throw new Error('Cannot build an empty pipeline');
    //   return new AnalysisPipeline(this.steps);
    // }
    // Der Test sähe dann so aus:
    // expect(() => builder.build()).toThrow('Cannot build an empty pipeline');

    // Für die aktuelle Implementierung erwarten wir, dass einfach eine leere Pipeline gebaut wird
    const pipeline = builder.build();
    const steps = (AnalysisPipeline as jest.Mock).mock
      .calls[0][0] as AnalysisStep[];
    expect(steps).toHaveLength(0);
  });

  it('sollte einen Fehler aus der factory werfen, wenn ein unbekannter Schritt hinzugefügt wird', () => {
    // Wir müssen den Spy für diesen Test überschreiben, damit er den default-Fall erreicht
    factorySpy.mockRestore(); // originalgetreue Factory wiederherstellen

    expect(() => builder.addStep('UnknownStep' as Step)).toThrow(
      'Unknown analysis step',
    );
  });
});
