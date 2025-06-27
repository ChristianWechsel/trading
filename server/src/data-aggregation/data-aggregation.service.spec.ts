import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { of } from 'rxjs';
import { TickerDto } from './data-aggregation.dto';
import { DataAggregationService } from './data-aggregation.service';
import { EodPrice } from './eod-price.entity';
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
        { provide: getRepositoryToken(EodPrice), useValue: eodPriceRepo },
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
    const dto: TickerDto = { symbol: 'MSFT', exchange: 'US' };
    const result = await service.loadData(dto);
    expect(result).toEqual([]);
    expect(securityRepo.findOne).toHaveBeenCalledWith({
      where: { symbol: dto.symbol, exchangeId: dto.exchange },
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
    const dto: TickerDto = { symbol: 'GOOG', exchange: 'US' };
    const result = await service.loadData(dto);
    expect(result).toBe(eodPrices);
    expect(securityRepo.findOne).toHaveBeenCalledWith({
      where: { symbol: dto.symbol, exchangeId: dto.exchange },
    });
    expect(eodPriceRepo.find).toHaveBeenCalledWith({
      where: { securityId: security.securityId },
      order: { priceDate: 'ASC' },
    });
  });
});
