import { Test, TestingModule } from '@nestjs/testing';
import {
  DataAggregationDto,
  TickerDto,
} from '../data-aggregation/data-aggregation.dto';
import { DataAggregationService } from '../data-aggregation/data-aggregation.service';
import { OHLCV } from '../data-aggregation/ohlcv.entity';
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
      loadAndUpdateIfNeeded: jest.fn(),
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
    const ticker: TickerDto = { exchange: 'US', symbol: 'AAPL' };
    const dataAggregation: DataAggregationDto = { ticker };
    const dto: AnalysisQueryDto = {
      steps: ['MovingAverage'],
      dataAggregation,
    };
    (
      dataAggregationService.loadAndUpdateIfNeeded as jest.Mock
    ).mockResolvedValue([]);
    const result = await controller.performAnalysis(dto);

    expect(service.performAnalysis).toHaveBeenCalledWith(dto, []);
    expect(result).toEqual({ foo: 'bar' });
  });

  it('should load data from dataAggregationService and transform to dataPoints', async () => {
    const mockData: OHLCV[] = [
      new OHLCV({
        priceDate: '2024-06-01T00:00:00Z',
        closePrice: 100,
        securityId: 1,
        volume: 1000,
        adjustedClosePrice: 100,
        highPrice: 105,
        lowPrice: 95,
        openPrice: 98,
      }),
      new OHLCV({
        priceDate: '2024-06-02T00:00:00Z',
        closePrice: 110,
        securityId: 1,
        volume: 1100,
        adjustedClosePrice: 110,
        highPrice: 115,
        lowPrice: 105,
        openPrice: 108,
      }),
    ];
    const mockSteps: Step[] = ['MovingAverage', 'TrendDetection'];
    const mockTicker: TickerDto = { exchange: 'US', symbol: 'AAPL' };
    const dataAggregation: DataAggregationDto = { ticker: mockTicker };
    (
      dataAggregationService.loadAndUpdateIfNeeded as jest.Mock
    ).mockResolvedValue(mockData);
    service.performAnalysis = jest.fn();

    await controller.performAnalysis({ dataAggregation, steps: mockSteps });

    expect(dataAggregationService.loadAndUpdateIfNeeded).toHaveBeenCalledWith({
      ticker: mockTicker,
    });
    expect(service.performAnalysis).toHaveBeenCalledWith(
      { dataAggregation, steps: mockSteps },
      mockData,
    );
  });
});
