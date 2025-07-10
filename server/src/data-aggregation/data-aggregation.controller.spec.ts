import { Test, TestingModule } from '@nestjs/testing';
import { DataAggregationController } from './data-aggregation.controller';
import { DataAggregationDto, TickerDto } from './data-aggregation.dto';
import { DataAggregationService } from './data-aggregation.service';

describe('DataAggregationController', () => {
  let controller: DataAggregationController;
  let service: {
    importAndSaveData: jest.Mock;
    loadAndUpdateIfNeeded: jest.Mock;
  };

  beforeEach(async () => {
    service = {
      importAndSaveData: jest.fn(),
      loadAndUpdateIfNeeded: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DataAggregationController],
      providers: [{ provide: DataAggregationService, useValue: service }],
    }).compile();
    controller = module.get(DataAggregationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call importAndSaveData and return result', async () => {
    const dto: TickerDto = { symbol: 'AAPL', exchange: 'US' };
    service.importAndSaveData.mockResolvedValue({ message: 'ok' });
    const result = await controller.importData(dto);
    expect(service.importAndSaveData).toHaveBeenCalledWith(dto);
    expect(result).toEqual({ message: 'ok' });
  });

  it('should throw if service throws', async () => {
    const dto: TickerDto = { symbol: 'AAPL', exchange: 'US' };
    service.importAndSaveData.mockRejectedValue(new Error('fail'));
    await expect(controller.importData(dto)).rejects.toThrow('fail');
  });

  it('should handle empty dto', async () => {
    service.importAndSaveData.mockResolvedValue({ message: 'ok' });
    // @ts-expect-error purposely incomplete dto
    const result = await controller.importData({});
    expect(service.importAndSaveData).toHaveBeenCalled();
    expect(result).toEqual({ message: 'ok' });
  });

  describe('loadData', () => {
    it('should call loadAndUpdateIfNeeded and return result', async () => {
      const ticker: TickerDto = { symbol: 'AAPL', exchange: 'US' };
      const dto: DataAggregationDto = { ticker };
      const eodPrices = [
        { priceDate: new Date().toISOString(), closePrice: 123 },
      ];
      service.loadAndUpdateIfNeeded = jest.fn().mockResolvedValue(eodPrices);
      const result = await controller.loadData(dto);
      expect(service.loadAndUpdateIfNeeded).toHaveBeenCalledWith(dto);
      expect(result).toEqual(eodPrices);
    });

    it('should throw if service throws', async () => {
      const ticker: TickerDto = { symbol: 'AAPL', exchange: 'US' };
      const dto: DataAggregationDto = { ticker };
      service.loadAndUpdateIfNeeded = jest
        .fn()
        .mockRejectedValue(new Error('fail'));
      await expect(controller.loadData(dto)).rejects.toThrow('fail');
    });

    it('should handle empty dto', async () => {
      service.loadAndUpdateIfNeeded = jest.fn().mockResolvedValue([]);
      // @ts-expect-error purposely incomplete dto
      const result = await controller.loadData({});
      expect(service.loadAndUpdateIfNeeded).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });
});
