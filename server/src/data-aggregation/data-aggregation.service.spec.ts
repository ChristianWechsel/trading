import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { of } from 'rxjs';
import { DataAggregationDto, TickerDto } from './data-aggregation.dto';
import { DataAggregationService } from './data-aggregation.service';
import { OHLCV, OHLCVEntity } from './ohlcv.entity';
import { Security } from './security.entity';

describe('DataAggregationService', () => {
  let service: DataAggregationService;
  const securityRepo = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };
  const ohlcvRepo = {
    create: jest.fn(),
    upsert: jest.fn(),
    find: jest.fn(),
  };
  const httpService = {
    get: () => {
      return of({
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
      });
    },
  };
  const configService = { get: jest.fn() };

  beforeEach(async () => {
    configService.get.mockReturnValue('test-api-key');
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DataAggregationService,
        { provide: getRepositoryToken(Security), useValue: securityRepo },
        { provide: getRepositoryToken(OHLCVEntity), useValue: ohlcvRepo },
        { provide: HttpService, useValue: httpService },
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    service = module.get<DataAggregationService>(DataAggregationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
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
    securityRepo.findOne.mockResolvedValue(undefined);
    securityRepo.create.mockReturnValue({ symbol: 'AAPL', exchangeId: 'US' });
    securityRepo.save.mockResolvedValue({
      securityId: 1,
      symbol: 'AAPL',
      exchangeId: 'US',
    });

    ohlcvRepo.create.mockReturnValue({});
    ohlcvRepo.upsert.mockResolvedValue(undefined);
    const dto: TickerDto = { symbol: 'AAPL', exchange: 'US' };
    const result = await service.importAndSaveData(dto);
    expect(securityRepo.create).toHaveBeenCalled();
    expect(securityRepo.save).toHaveBeenCalled();
    expect(ohlcvRepo.upsert).toHaveBeenCalled();
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
    const eodPrices: OHLCVEntity[] = [
      {
        priceDate: '2024-01-01',
        closePrice: 100,
        adjustedClosePrice: 1,
        securityId: 3,
        openPrice: 95,
        highPrice: 110,
        lowPrice: 90,
        volume: 1000,
      },
      {
        priceDate: '2024-02-01',
        closePrice: 110,
        adjustedClosePrice: 1,
        securityId: 3,
        openPrice: 105,
        highPrice: 115,
        lowPrice: 95,
        volume: 1200,
      },
    ];
    securityRepo.findOne.mockResolvedValue(security);
    ohlcvRepo.find = jest.fn().mockResolvedValue(eodPrices);
    const ticker: TickerDto = { symbol: 'GOOG', exchange: 'US' };
    const dto = { ticker };
    const result = await service.loadData(dto);
    expect(result).toEqual(eodPrices.map((item) => new OHLCV(item)));
    expect(securityRepo.findOne).toHaveBeenCalledWith({
      where: { symbol: ticker.symbol, exchangeId: ticker.exchange },
    });
    expect(ohlcvRepo.find).toHaveBeenCalledWith({
      where: { securityId: security.securityId },
      order: { priceDate: 'ASC' },
    });
  });

  describe('loadAndUpdateIfNeeded', () => {
    it('should import and reload if no data is present', async () => {
      const dto: DataAggregationDto = {
        ticker: { symbol: 'AAPL', exchange: 'US' },
      };
      const importedData: OHLCVEntity[] = [
        {
          adjustedClosePrice: 0.1,
          closePrice: 100,
          highPrice: 110,
          lowPrice: 90,
          openPrice: 95,
          priceDate: '2024-01-01',
          securityId: 1,
          volume: 1000,
        },
      ];
      ohlcvRepo.find
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce(importedData);
      securityRepo.findOne.mockResolvedValue({
        securityId: 1,
        symbol: 'AAPL',
        exchangeId: 'US',
      });
      const result = await service.loadAndUpdateIfNeeded(dto);
      expect(result).toEqual(
        importedData.map<OHLCV>((item) => new OHLCV(item)),
      );
    });

    it('should import if data is stale (older than 24h)', async () => {
      const dto: DataAggregationDto = {
        ticker: { symbol: 'AAPL', exchange: 'US' },
      };
      const oldDate = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
      const currentDate = new Date(Date.now()).toISOString();
      const oldData: OHLCVEntity[] = [
        {
          adjustedClosePrice: 0.1,
          closePrice: 100,
          highPrice: 110,
          lowPrice: 90,
          openPrice: 95,
          priceDate: oldDate,
          securityId: 1,
          volume: 1000,
        },
      ];
      const currentData: OHLCVEntity[] = [
        ...oldData,
        {
          adjustedClosePrice: 0.1,
          closePrice: 100,
          highPrice: 110,
          lowPrice: 90,
          openPrice: 95,
          priceDate: currentDate,
          securityId: 1,
          volume: 1000,
        },
      ];
      ohlcvRepo.find
        .mockResolvedValueOnce(oldData)
        .mockResolvedValueOnce(currentData);
      securityRepo.findOne.mockResolvedValue({
        securityId: 1,
        symbol: 'AAPL',
        exchangeId: 'US',
      });

      const result = await service.loadAndUpdateIfNeeded(dto);

      expect(result).toEqual(currentData.map<OHLCV>((item) => new OHLCV(item)));
    });

    it('should not import if data is up-to-date', async () => {
      const dto: DataAggregationDto = {
        ticker: { symbol: 'AAPL', exchange: 'US' },
      };

      const currentDate = new Date(Date.now()).toISOString();
      const currentData: OHLCVEntity[] = [
        {
          adjustedClosePrice: 0.1,
          closePrice: 100,
          highPrice: 110,
          lowPrice: 90,
          openPrice: 95,
          priceDate: currentDate,
          securityId: 1,
          volume: 1000,
        },

        {
          adjustedClosePrice: 0.1,
          closePrice: 100,
          highPrice: 110,
          lowPrice: 90,
          openPrice: 95,
          priceDate: currentDate,
          securityId: 1,
          volume: 1000,
        },
      ];
      ohlcvRepo.find
        .mockResolvedValueOnce(currentData)
        .mockResolvedValueOnce(currentData);
      securityRepo.findOne.mockResolvedValue({
        securityId: 1,
        symbol: 'AAPL',
        exchangeId: 'US',
      });
      const result = await service.loadAndUpdateIfNeeded(dto);
      expect(result).toEqual(currentData.map<OHLCV>((item) => new OHLCV(item)));
    });
  });
});
