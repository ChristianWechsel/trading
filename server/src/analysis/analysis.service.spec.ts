import { Test, TestingModule } from '@nestjs/testing';
import { OHLCV, OHLCVEntity } from '../data-aggregation/ohlcv.entity';
import { AnalysisQueryDto } from './analysis-query.dto';
import { AnalysisService } from './analysis.service';
import { AnalysisBuilder } from './core/analysis-builder';
import { AnalysisContextClass } from './core/analysis-context';
import { AnalysisPipeline } from './core/analysis-pipeline';

// Mocking external dependencies
jest.mock('./core/analysis-builder');
jest.mock('./core/analysis-pipeline');
jest.mock('./core/analysis-context');
jest.mock('../data-aggregation/ohlcv.entity');

describe('AnalysisService', () => {
  let service: AnalysisService;
  let analysisBuilderMock: jest.Mocked<AnalysisBuilder>;
  let analysisPipelineMock: jest.Mocked<AnalysisPipeline>;
  let analysisContextMock: jest.Mocked<AnalysisContextClass>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnalysisService],
    }).compile();

    service = module.get<AnalysisService>(AnalysisService);

    // Reset mocks before each test
    (AnalysisBuilder as jest.Mock).mockClear();
    (AnalysisPipeline as jest.Mock).mockClear();
    (AnalysisContextClass as jest.Mock).mockClear();
    (OHLCV as jest.Mock).mockClear();

    // Setup mock implementations
    analysisPipelineMock = {
      run: jest.fn(),
    } as unknown as jest.Mocked<AnalysisPipeline>;

    analysisBuilderMock = {
      addStep: jest.fn(),
      build: jest.fn().mockReturnValue(analysisPipelineMock),
    } as unknown as jest.Mocked<AnalysisBuilder>;

    (AnalysisBuilder as jest.Mock).mockReturnValue(analysisBuilderMock);

    analysisContextMock = {} as jest.Mocked<AnalysisContextClass>;
    (AnalysisContextClass as jest.Mock).mockReturnValue(analysisContextMock);
  });

  it('should instantiate AnalysisBuilder with stepOptions from the query DTO', () => {
    const query: AnalysisQueryDto = {
      dataAggregation: { ticker: { symbol: 'AAPL', exchange: 'US' } },
      steps: ['SwingPointDetection'],
      stepOptions: {
        swingPointDetection: { windowSize: 5 },
      },
    };
    const ohlcvs: OHLCV[] = [];

    service.performAnalysis(query, ohlcvs);

    expect(AnalysisBuilder).toHaveBeenCalledWith(query.stepOptions);
  });

  it('should instantiate AnalysisBuilder without options if none are provided', () => {
    const query: AnalysisQueryDto = {
      dataAggregation: { ticker: { symbol: 'AAPL', exchange: 'US' } },
      steps: ['SwingPointDetection'],
    };
    const ohlcvs: OHLCV[] = [];

    service.performAnalysis(query, ohlcvs);

    expect(AnalysisBuilder).toHaveBeenCalledWith(undefined);
  });

  it('should add each step from the query to the builder', () => {
    const query: AnalysisQueryDto = {
      dataAggregation: { ticker: { symbol: 'AAPL', exchange: 'US' } },
      steps: ['MovingAverage', 'SwingPointDetection'],
    };
    const ohlcvs: OHLCV[] = [];

    service.performAnalysis(query, ohlcvs);

    expect(analysisBuilderMock.addStep).toHaveBeenCalledWith('MovingAverage');
    expect(analysisBuilderMock.addStep).toHaveBeenCalledWith(
      'SwingPointDetection',
    );
    expect(analysisBuilderMock.addStep).toHaveBeenCalledTimes(2);
  });

  it('should create an AnalysisContext', () => {
    const query: AnalysisQueryDto = {
      dataAggregation: { ticker: { symbol: 'AAPL', exchange: 'US' } },
      steps: [],
    };
    const ohlcvData: OHLCVEntity = {
      securityId: 1,
      priceDate: '2023-01-01',
      openPrice: 100,
      highPrice: 110,
      lowPrice: 90,
      closePrice: 105,
      adjustedClosePrice: 105,
      volume: 1000,
    };
    const ohlcvs: OHLCV[] = [new OHLCV(ohlcvData)];

    service.performAnalysis(query, ohlcvs);

    expect(AnalysisContextClass).toHaveBeenCalledWith(query, ohlcvs);
  });

  it('should build the pipeline and run the analysis', () => {
    const query: AnalysisQueryDto = {
      dataAggregation: { ticker: { symbol: 'AAPL', exchange: 'US' } },
      steps: [],
    };
    const ohlcvs: OHLCV[] = [];
    const expectedResult = {} as AnalysisContextClass;
    analysisPipelineMock.run.mockReturnValue(expectedResult);

    const result = service.performAnalysis(query, ohlcvs);

    expect(analysisBuilderMock.build).toHaveBeenCalled();
    expect(analysisPipelineMock.run).toHaveBeenCalledWith(analysisContextMock);
    expect(result).toBe(expectedResult);
  });
});

describe('AnalysisService', () => {
  let service: AnalysisService;
  let analysisBuilderMock: jest.Mocked<AnalysisBuilder>;
  let analysisPipelineMock: jest.Mocked<AnalysisPipeline>;
  let analysisContextMock: jest.Mocked<AnalysisContextClass>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnalysisService],
    }).compile();

    service = module.get<AnalysisService>(AnalysisService);

    // Reset mocks before each test
    (AnalysisBuilder as jest.Mock).mockClear();
    (AnalysisPipeline as jest.Mock).mockClear();
    (AnalysisContextClass as jest.Mock).mockClear();
    (OHLCV as jest.Mock).mockClear();

    // Setup mock implementations
    analysisPipelineMock = {
      run: jest.fn(),
    } as unknown as jest.Mocked<AnalysisPipeline>;

    analysisBuilderMock = {
      addStep: jest.fn(),
      build: jest.fn().mockReturnValue(analysisPipelineMock),
    } as unknown as jest.Mocked<AnalysisBuilder>;

    (AnalysisBuilder as jest.Mock).mockReturnValue(analysisBuilderMock);

    analysisContextMock = {} as unknown as jest.Mocked<AnalysisContextClass>;
    (AnalysisContextClass as jest.Mock).mockReturnValue(analysisContextMock);
  });

  it('should instantiate AnalysisBuilder with stepOptions from the query DTO', () => {
    const query: AnalysisQueryDto = {
      dataAggregation: { ticker: { symbol: 'AAPL', exchange: 'US' } },
      steps: ['SwingPointDetection'],
      stepOptions: {
        swingPointDetection: { windowSize: 5 },
      },
    };
    const ohlcvs: OHLCV[] = [];

    service.performAnalysis(query, ohlcvs);

    expect(AnalysisBuilder).toHaveBeenCalledWith(query.stepOptions);
  });

  it('should instantiate AnalysisBuilder without options if none are provided', () => {
    const query: AnalysisQueryDto = {
      dataAggregation: { ticker: { symbol: 'AAPL', exchange: 'US' } },
      steps: ['SwingPointDetection'],
    };
    const ohlcvs: OHLCV[] = [];

    service.performAnalysis(query, ohlcvs);

    expect(AnalysisBuilder).toHaveBeenCalledWith(undefined);
  });

  it('should add each step from the query to the builder', () => {
    const query: AnalysisQueryDto = {
      dataAggregation: { ticker: { symbol: 'AAPL', exchange: 'US' } },
      steps: ['MovingAverage', 'SwingPointDetection'],
    };
    const ohlcvs: OHLCV[] = [];

    service.performAnalysis(query, ohlcvs);

    expect(analysisBuilderMock.addStep).toHaveBeenCalledWith('MovingAverage');
    expect(analysisBuilderMock.addStep).toHaveBeenCalledWith(
      'SwingPointDetection',
    );
    expect(analysisBuilderMock.addStep).toHaveBeenCalledTimes(2);
  });

  it('should create an AnalysisContext', () => {
    const query: AnalysisQueryDto = {
      dataAggregation: { ticker: { symbol: 'AAPL', exchange: 'US' } },
      steps: [],
    };
    const ohlcvs: OHLCV[] = [new OHLCV({} as any)];

    service.performAnalysis(query, ohlcvs);

    expect(AnalysisContextClass).toHaveBeenCalledWith(query, ohlcvs);
  });

  it('should build the pipeline and run the analysis', () => {
    const query: AnalysisQueryDto = {
      dataAggregation: { ticker: { symbol: 'AAPL', exchange: 'US' } },
      steps: [],
    };
    const ohlcvs: OHLCV[] = [];
    const expectedResult = {} as AnalysisContextClass;
    analysisPipelineMock.run.mockReturnValue(expectedResult);

    const result = service.performAnalysis(query, ohlcvs);

    expect(analysisBuilderMock.build).toHaveBeenCalled();
    expect(analysisPipelineMock.run).toHaveBeenCalledWith(analysisContextMock);
    expect(result).toBe(expectedResult);
  });
});
