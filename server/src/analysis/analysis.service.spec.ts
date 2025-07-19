import { Test, TestingModule } from '@nestjs/testing';
import { AnalysisQueryDto } from './analysis-query.dto';
import { AnalysisService } from './analysis.service';
import { AnalysisBuilder } from './core/analysis-builder';
import { AnalysisPipeline } from './core/analysis-pipeline';

// Mocken des AnalysisBuilder und der Pipeline
jest.mock('./core/analysis-builder', () => {
  return {
    AnalysisBuilder: jest.fn().mockImplementation(() => ({
      addStep: jest.fn(),
      build: jest.fn().mockImplementation(() => new AnalysisPipeline([])),
    })),
  };
});
jest.mock('./core/analysis-pipeline', () => {
  return {
    AnalysisPipeline: jest.fn().mockImplementation(() => ({
      run: jest.fn().mockReturnValue({
        enrichedDataPoints: [],
        trends: [],
      }),
    })),
  };
});

describe('AnalysisService', () => {
  let service: AnalysisService;
  const analysisBuilderMock = AnalysisBuilder as jest.Mock<AnalysisBuilder>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnalysisService],
    }).compile();

    service = module.get<AnalysisService>(AnalysisService);
    analysisBuilderMock.mockClear();
    // (analysisPipelineMock as any).mock.instances[0].run.mockClear(); // Remove or comment out this line
  });

  it('sollte den AnalysisBuilder mit den stepOptions aus dem Query-DTO instanziieren', () => {
    const query: AnalysisQueryDto = {
      dataAggregation: { ticker: { symbol: 'AAPL', exchange: 'US' } },
      steps: ['SwingPointDetection'],
      stepOptions: {
        swingPointDetection: { windowSize: 5 },
      },
    };

    service.performAnalysis(query, []);

    // Prüfen, ob der Konstruktor des Builders mit den Optionen aufgerufen wurde
    expect(analysisBuilderMock).toHaveBeenCalledWith(query.stepOptions);
  });

  it('sollte den AnalysisBuilder ohne Optionen instanziieren, wenn keine übergeben werden', () => {
    const query: AnalysisQueryDto = {
      dataAggregation: { ticker: { symbol: 'AAPL', exchange: 'US' } },
      steps: ['SwingPointDetection'],
      // stepOptions ist hier absichtlich nicht gesetzt
    };

    service.performAnalysis(query, []);

    // Prüfen, ob der Konstruktor des Builders mit `undefined` aufgerufen wurde
    expect(analysisBuilderMock).toHaveBeenCalledWith(undefined);
  });
});
