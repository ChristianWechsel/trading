import { Test, TestingModule } from '@nestjs/testing';
import { TickerDto } from '../data-aggregation/data-aggregation.dto';
import { DataAggregationService } from '../data-aggregation/data-aggregation.service';
import { AnalysisQueryDto } from './analysis-query.dto';
import { AnalysisController } from './analysis.controller';
import { AnalysisService } from './analysis.service';
import { Step } from './core/analysis.interface';

describe('AnalysisController', () => {
  let controller: AnalysisController;
  let service: AnalysisService;
  let dataAggregationService: DataAggregationService;

  beforeEach(async () => {
    const mockService = {
      performAnalysis: jest.fn().mockReturnValue({ foo: 'bar' }),
    };
    const mockDataAggregationService = {
      loadData: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnalysisController],
      providers: [
        { provide: AnalysisService, useValue: mockService },
        {
          provide: DataAggregationService,
          useValue: mockDataAggregationService,
        },
      ],
    }).compile();

    controller = module.get<AnalysisController>(AnalysisController);
    service = module.get<AnalysisService>(AnalysisService);
    dataAggregationService = module.get<DataAggregationService>(
      DataAggregationService,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should delegate performAnalysis to the service', async () => {
    const dto: AnalysisQueryDto = {
      steps: ['MovingAverage'],
      dataAggregation: { ticker: { exchange: 'US', symbol: 'AAPL' } },
    } as any;
    // Mock loadData, da performAnalysis async ist und auf Daten zugreift
    dataAggregationService.loadData = jest.fn().mockResolvedValue([]);
    const result = await controller.performAnalysis(dto);

    expect(service.performAnalysis).toHaveBeenCalledWith(dto, []);
    expect(result).toEqual({ foo: 'bar' });
  });

  it('should load data from dataAggregationService and transform to dataPoints', async () => {
    const mockData = [
      { priceDate: '2024-06-01T00:00:00Z', closePrice: 100 },
      { priceDate: '2024-06-02T00:00:00Z', closePrice: 110 },
    ];
    const mockSteps: Step[] = ['MovingAverage', 'TrendDetection'];
    const mockTicker: TickerDto = { exchange: 'US', symbol: 'AAPL' };
    dataAggregationService.loadData = jest.fn().mockResolvedValue(mockData);
    service.performAnalysis = jest.fn();

    await controller.performAnalysis({ dataAggregation: { ticker: mockTicker }, steps: mockSteps } as any);

    expect(dataAggregationService.loadData).toHaveBeenCalledWith({ ticker: mockTicker });
    expect(service.performAnalysis).toHaveBeenCalledWith(
      { dataAggregation: { ticker: mockTicker }, steps: mockSteps },
      [
        { x: new Date('2024-06-01T00:00:00Z').getTime(), y: 100 },
        { x: new Date('2024-06-02T00:00:00Z').getTime(), y: 110 },
      ],
    );
  });
});
