import { Test, TestingModule } from '@nestjs/testing';
import { DataAggregationController } from './data-aggregation.controller';
import { TickerDto } from './data-aggregation.dto';
import { DataAggregationService } from './data-aggregation.service';

describe('DataAggregationController', () => {
  let controller: DataAggregationController;
  let service: { importAndSaveData: jest.Mock; loadData: jest.Mock };

  beforeEach(async () => {
    service = { importAndSaveData: jest.fn(), loadData: jest.fn() };
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
    it('should call loadData and return result', async () => {
      const dto: TickerDto = { symbol: 'AAPL', exchange: 'US' };
      const eodPrices = [
        { priceDate: new Date().toISOString(), closePrice: 123 },
      ];
      service.loadData.mockResolvedValue(eodPrices);
      const result = await controller.loadData(dto);
      expect(service.loadData).toHaveBeenCalledWith(dto);
      expect(result).toEqual(eodPrices);
    });

    it('should throw if service throws', async () => {
      const dto: TickerDto = { symbol: 'AAPL', exchange: 'US' };
      service.loadData.mockRejectedValue(new Error('fail'));
      await expect(controller.loadData(dto)).rejects.toThrow('fail');
    });

    it('should handle empty dto', async () => {
      service.loadData.mockResolvedValue([]);
      // @ts-expect-error purposely incomplete dto
      const result = await controller.loadData({});
      expect(service.loadData).toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    it('should call importAndSaveData if no data is present', async () => {
      const dto: TickerDto = { symbol: 'AAPL', exchange: 'US' };
      // 1. Beim ersten Aufruf: keine Daten
      service.loadData.mockResolvedValueOnce([]);
      // 2. Nach dem Import: neue Daten vorhanden
      const importedData = [
        { priceDate: new Date().toISOString(), closePrice: 123 },
      ];
      service.importAndSaveData.mockResolvedValue({ message: 'imported' });
      service.loadData.mockResolvedValueOnce(importedData);

      const result = await controller.loadData(dto);

      expect(service.importAndSaveData).toHaveBeenCalledWith(dto);
      expect(result).toEqual(importedData);
    });

    it('should return data if last date is not older than 24h', async () => {
      const dto: TickerDto = { symbol: 'AAPL', exchange: 'US' };
      const now = new Date();
      const recentDate = new Date(now.getTime() - 2 * 60 * 60 * 1000); // 2h alt
      const eodPrices = [
        { priceDate: recentDate.toISOString(), closePrice: 100 },
      ];
      service.loadData.mockResolvedValue(eodPrices);

      const result = await controller.loadData(dto);

      expect(result).toEqual(eodPrices);
      expect(service.importAndSaveData).not.toHaveBeenCalled();
    });

    it('should call importAndSaveData if last date is older than 24h', async () => {
      const dto: TickerDto = { symbol: 'AAPL', exchange: 'US' };
      const oldDate = new Date(Date.now() - 48 * 60 * 60 * 1000); // 48h alt
      const eodPrices = [{ priceDate: oldDate.toISOString(), closePrice: 100 }];
      // 1. Erstes Laden: alte Daten
      service.loadData.mockResolvedValueOnce(eodPrices);
      // 2. Nach Import: neue Daten (hier einfach die gleichen, aber das Verhalten zählt)
      service.importAndSaveData.mockResolvedValue({ message: 'imported' });
      service.loadData.mockResolvedValueOnce(eodPrices);

      const result = await controller.loadData(dto);

      expect(service.importAndSaveData).toHaveBeenCalledWith(dto);
      expect(result).toEqual(eodPrices);
    });

    it('should not call importAndSaveData if data is up-to-date (simulate API returns no newer data)', async () => {
      const dto: TickerDto = { symbol: 'AAPL', exchange: 'US' };
      const now = new Date();
      const recentDate = new Date(now.getTime() - 1 * 60 * 60 * 1000); // 1h alt
      const eodPrices = [
        { priceDate: recentDate.toISOString(), closePrice: 100 },
      ];
      service.loadData.mockResolvedValue(eodPrices);

      const result = await controller.loadData(dto);

      expect(service.importAndSaveData).not.toHaveBeenCalled();
      expect(result).toEqual(eodPrices);
    });
  });
});
