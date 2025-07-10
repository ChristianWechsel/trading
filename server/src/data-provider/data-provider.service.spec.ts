import { Test, TestingModule } from '@nestjs/testing';
import { DataAggregationService } from '../data-aggregation/data-aggregation.service';
import { DataProviderService } from './data-provider.service';

describe('DataProviderService', () => {
  let service: DataProviderService;
  let aggregationService: { loadData: jest.Mock };

  beforeEach(async () => {
    aggregationService = { loadData: jest.fn() };
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

  it('should call loadData and return result', async () => {
    const dto = { ticker: { symbol: 'AAPL', exchange: 'US' } };
    const resultData = [{ priceDate: '2024-01-01', closePrice: 123 }];
    aggregationService.loadData.mockResolvedValue(resultData);
    const result = await service.getEod(dto as any);
    expect(aggregationService.loadData).toHaveBeenCalledWith(dto);
    expect(result).toEqual(resultData);
  });
});
