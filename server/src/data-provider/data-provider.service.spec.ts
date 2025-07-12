import { Test, TestingModule } from '@nestjs/testing';
import {
  DataAggregationDto,
  TickerDto,
} from '../data-aggregation/data-aggregation.dto';
import { DataAggregationService } from '../data-aggregation/data-aggregation.service';
import { DataProviderService } from './data-provider.service';

describe('DataProviderService', () => {
  let service: DataProviderService;
  let aggregationService: { loadAndUpdateIfNeeded: jest.Mock };

  beforeEach(async () => {
    aggregationService = { loadAndUpdateIfNeeded: jest.fn() };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DataProviderService,
        { provide: DataAggregationService, useValue: aggregationService },
      ],
    }).compile();

    service = module.get<DataProviderService>(DataProviderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call loadAndUpdateIfNeeded and return result', async () => {
    const ticker: TickerDto = { symbol: 'AAPL', exchange: 'US' };
    const dto: DataAggregationDto = { ticker };
    const resultData = [{ priceDate: '2024-01-01', closePrice: 123 }];
    aggregationService.loadAndUpdateIfNeeded.mockResolvedValue(resultData);
    const result = await service.getCandleSticks(dto);
    expect(aggregationService.loadAndUpdateIfNeeded).toHaveBeenCalledWith(dto);
    expect(result).toEqual(resultData);
  });
});
