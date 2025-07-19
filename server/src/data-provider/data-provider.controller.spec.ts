import { Test, TestingModule } from '@nestjs/testing';
import { DataProviderController } from './data-provider.controller';
import { DataProviderService } from './data-provider.service';

jest.mock('./data-provider.service');

describe('DataProviderController', () => {
  let controller: DataProviderController;
  let service: { getCandleSticks: jest.Mock };

  beforeEach(async () => {
    service = { getCandleSticks: jest.fn() };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DataProviderController],
      providers: [{ provide: DataProviderService, useValue: service }],
    }).compile();

    controller = module.get<DataProviderController>(DataProviderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call getEod and return result', async () => {
    const dto = { ticker: { symbol: 'AAPL', exchange: 'US' } };
    const resultData = [{ priceDate: '2024-01-01', closePrice: 123 }];
    service.getCandleSticks.mockResolvedValue(resultData);
    const result = await controller.candleSticks(dto);
    expect(service.getCandleSticks).toHaveBeenCalledWith(dto);
    expect(result).toEqual(resultData);
  });
});
