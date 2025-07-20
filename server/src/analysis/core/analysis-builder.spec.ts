import { StepOptionsDto } from '../analysis-query.dto';
import { MovingAverage } from '../steps/moving-average';
import { SwingPointDetection } from '../steps/swing-point-detection/swing-point-detection';
import { TrendChannelCalculation } from '../steps/trend-channel-calculation/trend-channel-calculation';
import { TrendDetection } from '../steps/trend-detection/trend-detection';
import { AnalysisBuilder } from './analysis-builder';
import { AnalysisPipeline } from './analysis-pipeline';
import { AnalysisStep } from './analysis.interface';

// Mocken der Step-Klassen, um die Instanziierung zu kontrollieren
jest.mock('../steps/swing-point-detection/swing-point-detection');
jest.mock('../steps/trend-detection/trend-detection');
jest.mock('../steps/moving-average');
jest.mock('../steps/trend-channel-calculation/trend-channel-calculation');
jest.mock('./analysis-pipeline');

describe('AnalysisBuilder', () => {
  let builder: AnalysisBuilder;

  // Spione für die Konstruktoren der gemockten Klassen
  const swingPointDetectionMock =
    SwingPointDetection as jest.Mock<SwingPointDetection>;
  const trendDetectionMock = TrendDetection as jest.Mock<TrendDetection>;
  const movingAverageMock = MovingAverage as jest.Mock;
  const trendChannelCalculationMock =
    TrendChannelCalculation as jest.Mock<TrendChannelCalculation>;

  beforeEach(() => {
    // Mocks vor jedem Test zurücksetzen
    swingPointDetectionMock.mockClear();
    trendDetectionMock.mockClear();
    movingAverageMock.mockClear?.();
    trendChannelCalculationMock.mockClear?.();
    (AnalysisPipeline as jest.Mock).mockClear();

    // Ensure all mocks return an object with a dependsOn array
    swingPointDetectionMock.mockImplementation(
      () =>
        ({
          name: 'SwingPointDetection',
          dependsOn: [],
          execute: jest.fn(),
        }) as unknown as SwingPointDetection,
    );
    trendDetectionMock.mockImplementation(
      () =>
        ({
          name: 'TrendDetection',
          dependsOn: ['SwingPointDetection'],
          execute: jest.fn(),
        }) as unknown as TrendDetection,
    );
    movingAverageMock.mockImplementation?.(
      () =>
        ({
          name: 'MovingAverage',
          dependsOn: [],
          execute: jest.fn(),
        }) as unknown,
    );
    trendChannelCalculationMock.mockImplementation(
      () =>
        ({
          name: 'TrendChannelCalculation',
          dependsOn: ['TrendDetection'],
          execute: jest.fn(),
        }) as unknown as TrendChannelCalculation,
    );
  });

  describe('Konfiguration', () => {
    it('sollte Standardwerte verwenden, wenn keine Optionen übergeben werden', () => {
      builder = new AnalysisBuilder();
      builder.addStep('SwingPointDetection');
      builder.addStep('TrendDetection');
      builder.build();

      expect(swingPointDetectionMock).toHaveBeenCalledWith({
        relativeThreshold: 0.01,
        windowSize: 1,
      });
      expect(trendDetectionMock).toHaveBeenCalledWith({
        relativeThreshold: 0.01,
      });
    });

    it('sollte übergebene Optionen mit den Standardwerten mergen', () => {
      const customOptions: StepOptionsDto = {
        swingPointDetection: {
          windowSize: 10,
        },
        trendDetection: {
          relativeThreshold: 0.05,
        },
      };

      builder = new AnalysisBuilder(customOptions);
      builder.addStep('SwingPointDetection');
      builder.addStep('TrendDetection');
      builder.build();

      // windowSize wurde überschrieben, relativeThreshold bleibt Standard
      expect(swingPointDetectionMock).toHaveBeenCalledWith({
        relativeThreshold: 0.01,
        windowSize: 10,
      });

      // relativeThreshold wurde überschrieben
      expect(trendDetectionMock).toHaveBeenCalledWith({
        relativeThreshold: 0.05,
      });
    });

    it('sollte nur die Optionen für einen Step überschreiben', () => {
      const customOptions: StepOptionsDto = {
        swingPointDetection: {
          relativeThreshold: 0.02,
          windowSize: 5,
        },
      };

      builder = new AnalysisBuilder(customOptions);
      builder.addStep('SwingPointDetection');
      builder.addStep('TrendDetection'); // Für diesen Step werden Standardwerte erwartet
      builder.build();

      expect(swingPointDetectionMock).toHaveBeenCalledWith({
        relativeThreshold: 0.02,
        windowSize: 5,
      });
      expect(trendDetectionMock).toHaveBeenCalledWith({
        relativeThreshold: 0.01,
      });
    });
  });

  describe('Abhängigkeitsauflösung', () => {
    // Bestehende Tests zur Abhängigkeitsauflösung bleiben hier unverändert.
    // Wir stellen sicher, dass sie mit dem leeren Konstruktor laufen.
    beforeEach(() => {
      builder = new AnalysisBuilder();
      // Wir müssen die Mocks so konfigurieren, dass sie die `dependsOn` Eigenschaft haben
      swingPointDetectionMock.mockImplementation(
        () =>
          ({
            name: 'SwingPointDetection',
            dependsOn: [],
            execute: jest.fn(),
            checkData: jest.fn(),
            getSwingPoints: jest.fn(),
            getSurroundingPoints: jest.fn(),
          }) as unknown as SwingPointDetection,
      );
      trendDetectionMock.mockImplementation(
        () =>
          ({
            name: 'TrendDetection',
            dependsOn: ['SwingPointDetection'],
            execute: jest.fn(),
            generateSwingPointsAndData: jest.fn(),
            detectTrends: jest.fn(),
          }) as unknown as TrendDetection,
      );
      (TrendChannelCalculation as jest.Mock).mockImplementation(() => ({
        name: 'TrendChannelCalculation',
        dependsOn: ['TrendDetection'],
        execute: jest.fn(),
      }));
    });

    it('sollte eine mehrstufige Abhängigkeitskette korrekt auflösen und sortieren', () => {
      builder.addStep('TrendChannelCalculation');
      builder.build();

      const steps = (AnalysisPipeline as jest.Mock).mock
        .calls[0][0] as AnalysisStep[];

      expect(steps).toHaveLength(3);
      expect(steps[0].name).toBe('SwingPointDetection');
      expect(steps[1].name).toBe('TrendDetection');
      expect(steps[2].name).toBe('TrendChannelCalculation');
    });
  });
});
