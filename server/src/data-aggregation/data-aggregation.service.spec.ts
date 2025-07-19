import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { of } from 'rxjs';
import { TickerDto } from './data-aggregation.dto';
import { DataAggregationService } from './data-aggregation.service';
import { OHLCV } from './ohlcv.entity';
import { Security } from './security.entity';

describe('DataAggregationService', () => {
  let service: DataAggregationService;
  let securityRepo: any;
  let eodPriceRepo: any;
  let httpService: any;
  let configService: any;

  beforeEach(async () => {
    securityRepo = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };
    eodPriceRepo = {
      create: jest.fn(),
      upsert: jest.fn(),
    };
    httpService = { get: jest.fn() };
    configService = { get: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DataAggregationService,
        { provide: getRepositoryToken(Security), useValue: securityRepo },
        { provide: getRepositoryToken(OHLCV), useValue: eodPriceRepo },
        { provide: HttpService, useValue: httpService },
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    service = module.get<DataAggregationService>(DataAggregationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return error if API key is missing', async () => {
    configService.get.mockReturnValue(undefined);
    const dto: TickerDto = { symbol: 'AAPL', exchange: 'US' };
    const result = await service.importAndSaveData(dto);
    expect(result.message).toMatch(/API Key fehlt/);
  });

  it('should create security if not exists and upsert prices', async () => {
    configService.get.mockReturnValue('testkey');
    securityRepo.findOne.mockResolvedValue(undefined);
    securityRepo.create.mockReturnValue({ symbol: 'AAPL', exchangeId: 'US' });
    securityRepo.save.mockResolvedValue({
      securityId: 1,
      symbol: 'AAPL',
      exchangeId: 'US',
    });
    httpService.get.mockReturnValue(
      of({
        data: [
          {
            date: '2024-01-01',
            open: 1,
            high: 2,
            low: 0.5,
            close: 1.5,
            adjusted_close: 1.4,
            volume: 1000,
          },
        ],
      }),
    );
    eodPriceRepo.create.mockReturnValue({});
    eodPriceRepo.upsert.mockResolvedValue(undefined);
    const dto: TickerDto = { symbol: 'AAPL', exchange: 'US' };
    const result = await service.importAndSaveData(dto);
    expect(securityRepo.create).toHaveBeenCalled();
    expect(securityRepo.save).toHaveBeenCalled();
    expect(eodPriceRepo.upsert).toHaveBeenCalled();
    expect(result.message).toMatch(/Data imported and saved/);
  });

  it('should use existing security if found', async () => {
    configService.get.mockReturnValue('testkey');
    securityRepo.findOne.mockResolvedValue({
      securityId: 2,
      symbol: 'TSLA',
      exchangeId: 'US',
    });
    httpService.get.mockReturnValue(
      of({
        data: [
          {
            date: '2024-01-01',
            open: 1,
            high: 2,
            low: 0.5,
            close: 1.5,
            adjusted_close: 1.4,
            volume: 1000,
          },
        ],
      }),
    );
    eodPriceRepo.create.mockReturnValue({});
    eodPriceRepo.upsert.mockResolvedValue(undefined);
    const dto: TickerDto = { symbol: 'TSLA', exchange: 'US' };
    const result = await service.importAndSaveData(dto);
    expect(securityRepo.create).not.toHaveBeenCalled();
    expect(securityRepo.save).not.toHaveBeenCalled();
    expect(eodPriceRepo.upsert).toHaveBeenCalled();
    expect(result.message).toMatch(/Data imported and saved/);
  });

  it('should return empty array if security not found in loadData', async () => {
    securityRepo.findOne.mockResolvedValue(undefined);
    const ticker: TickerDto = { symbol: 'MSFT', exchange: 'US' };
    const dto = { ticker };
    const result = await service.loadData(dto);
    expect(result).toEqual([]);
    expect(securityRepo.findOne).toHaveBeenCalledWith({
      where: { symbol: ticker.symbol, exchangeId: ticker.exchange },
    });
  });

  it('should return EodPrice array if security found in loadData', async () => {
    const security = { securityId: 3, symbol: 'GOOG', exchangeId: 'US' };
    const eodPrices = [
      { priceDate: '2024-01-01', closePrice: 100 },
      { priceDate: '2024-02-01', closePrice: 110 },
    ];
    securityRepo.findOne.mockResolvedValue(security);
    eodPriceRepo.find = jest.fn().mockResolvedValue(eodPrices);
    const ticker: TickerDto = { symbol: 'GOOG', exchange: 'US' };
    const dto = { ticker };
    const result = await service.loadData(dto);
    expect(result).toBe(eodPrices);
    expect(securityRepo.findOne).toHaveBeenCalledWith({
      where: { symbol: ticker.symbol, exchangeId: ticker.exchange },
    });
    expect(eodPriceRepo.find).toHaveBeenCalledWith({
      where: { securityId: security.securityId },
      order: { priceDate: 'ASC' },
    });
  });

  describe('loadAndUpdateIfNeeded', () => {
    beforeEach(() => {
      service.loadData = jest.fn();
      service.importAndSaveData = jest.fn();
    });

    it('should import and reload if no data is present', async () => {
      const ticker: TickerDto = { symbol: 'AAPL', exchange: 'US' };
      const dto = { ticker };
      // Erstes Laden: keine Daten
      (service.loadData as jest.Mock).mockResolvedValueOnce([]);
      // Nach Import: neue Daten vorhanden
      (service.importAndSaveData as jest.Mock).mockResolvedValue({
        message: 'imported',
      });
      const importedData = [
        { priceDate: new Date().toISOString(), closePrice: 123 },
      ];
      (service.loadData as jest.Mock).mockResolvedValueOnce(importedData);
      const result = await service.loadAndUpdateIfNeeded(dto);
      expect(service.importAndSaveData).toHaveBeenCalledWith(ticker);
      expect(result).toEqual(importedData);
    });

    it('should import if no data is present', async () => {
      const ticker = { symbol: 'AAPL', exchange: 'US' };
      const dto = { ticker };
      (service.loadData as jest.Mock).mockResolvedValueOnce([]);
      (service.loadData as jest.Mock).mockResolvedValueOnce([
        { priceDate: '2024-01-01', closePrice: 100 },
      ]);
      (service.importAndSaveData as jest.Mock).mockResolvedValue({
        message: 'imported',
      });
      const result = await service.loadAndUpdateIfNeeded(dto);
      expect(service.importAndSaveData as jest.Mock).toHaveBeenCalledWith(
        ticker,
      );
      expect(result).toEqual([{ priceDate: '2024-01-01', closePrice: 100 }]);
    });

    it('should import if data is stale (older than 24h)', async () => {
      const ticker = { symbol: 'AAPL', exchange: 'US' };
      const dto = { ticker };
      const oldDate = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
      (service.loadData as jest.Mock).mockResolvedValueOnce([
        { priceDate: oldDate, closePrice: 100 },
      ]);
      (service.loadData as jest.Mock).mockResolvedValueOnce([
        { priceDate: oldDate, closePrice: 100 },
      ]);
      (service.importAndSaveData as jest.Mock).mockResolvedValue({
        message: 'imported',
      });
      const result = await service.loadAndUpdateIfNeeded(dto);
      expect(service.importAndSaveData as jest.Mock).toHaveBeenCalledWith(
        ticker,
      );
      expect(result).toEqual([{ priceDate: oldDate, closePrice: 100 }]);
    });

    it('should not import if data is up-to-date', async () => {
      const ticker = { symbol: 'AAPL', exchange: 'US' };
      const dto = { ticker };
      const recentDate = new Date(
        Date.now() - 2 * 60 * 60 * 1000,
      ).toISOString();
      (service.loadData as jest.Mock).mockResolvedValue([
        { priceDate: recentDate, closePrice: 100 },
      ]);
      const result = await service.loadAndUpdateIfNeeded(dto);
      expect(service.importAndSaveData as jest.Mock).not.toHaveBeenCalled();
      expect(result).toEqual([{ priceDate: recentDate, closePrice: 100 }]);
    });
  });
});
