import { Test, TestingModule } from '@nestjs/testing';
import { AnalysisQueryDto } from './analysis-query.dto';
import { AnalysisService } from './analysis.service';
import { AnalysisBuilder } from './core/analysis-builder';
import { AnalysisPipeline } from './core/analysis-pipeline';

jest.mock('./core/analysis-builder');
jest.mock('./core/analysis-pipeline');

describe('AnalysisService', () => {
  let service: AnalysisService;

  beforeEach(async () => {
    (AnalysisBuilder as jest.Mock).mockClear();
    (AnalysisPipeline as jest.Mock).mockClear();

    const module: TestingModule = await Test.createTestingModule({
      providers: [AnalysisService],
    }).compile();

    service = module.get<AnalysisService>(AnalysisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should build and run the pipeline with the requested steps', () => {
    const mockAddStep = jest.fn();
    const mockBuild = jest.fn();
    const mockRun = jest.fn().mockReturnValue({ result: 'ok' });

    (AnalysisBuilder as jest.Mock).mockImplementation(() => ({
      addStep: mockAddStep,
      build: mockBuild,
    }));
    (AnalysisPipeline as jest.Mock).mockImplementation(() => ({
      run: mockRun,
    }));

    mockBuild.mockReturnValue(new (AnalysisPipeline as any)());

    const dto: AnalysisQueryDto = {
      steps: ['MovingAverage', 'TrendDetection'],
      ticker: { exchange: 'US', symbol: 'AAPL' },
    };

    const result = service.performAnalysis(dto.steps, [
      { x: 1, y: 10 },
      { x: 2, y: 5 },
      { x: 3, y: 15 },
    ]);

    expect(mockAddStep).toHaveBeenCalledTimes(2);
    expect(mockAddStep).toHaveBeenCalledWith('MovingAverage');
    expect(mockAddStep).toHaveBeenCalledWith('TrendDetection');
    expect(mockBuild).toHaveBeenCalledTimes(1);
    expect(mockRun).toHaveBeenCalledTimes(1);
    expect(Array.isArray(mockRun.mock.calls[0][0])).toBe(true);
    expect(result).toEqual({ result: 'ok' });
  });

  it('should pass EnrichedDataPoints to pipeline.run', () => {
    const mockAddStep = jest.fn();
    const mockBuild = jest.fn();
    const mockRun = jest.fn().mockReturnValue({ result: 'ok' });

    (AnalysisBuilder as jest.Mock).mockImplementation(() => ({
      addStep: mockAddStep,
      build: mockBuild,
    }));
    (AnalysisPipeline as jest.Mock).mockImplementation(() => ({
      run: mockRun,
    }));

    mockBuild.mockReturnValue(new (AnalysisPipeline as any)());

    const dto: AnalysisQueryDto = {
      steps: ['MovingAverage'],
      ticker: { exchange: 'US', symbol: 'AAPL' },
    };

    const inputData = [
      { x: 1, y: 10 },
      { x: 2, y: 5 },
    ];

    service.performAnalysis(dto.steps, inputData);

    const calledWith = mockRun.mock.calls[0][0];
    expect(Array.isArray(calledWith)).toBe(true);
    expect(calledWith.length).toBe(2);
    // Prüfe, dass alle Elemente Instanzen von EnrichedDataPoint sind
    const { EnrichedDataPoint } = require('./core/enriched-data-point');
    expect(
      calledWith.every((item: any) => item instanceof EnrichedDataPoint),
    ).toBe(true);
    // Optional: Prüfe, dass die Werte korrekt übernommen wurden
    expect(calledWith[0].x).toBe(1);
    expect(calledWith[0].y).toBe(10);
    expect(calledWith[1].x).toBe(2);
    expect(calledWith[1].y).toBe(5);
  });
});
