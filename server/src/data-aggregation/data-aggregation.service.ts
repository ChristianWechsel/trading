import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import { IDataAggregationService } from 'src/analysis/analysis.interface';
import {
  Between,
  FindManyOptions,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import {
  DataAggregationDto,
  DateRangeDto,
  TickerDto,
} from './data-aggregation.dto';
import { OHLCV, OHLCVEntity } from './ohlcv.entity';
import { Security } from './security.entity';

@Injectable()
export class DataAggregationService implements IDataAggregationService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @InjectRepository(Security)
    private readonly securityRepo: Repository<Security>,
    @InjectRepository(OHLCVEntity)
    private readonly ohlcvRepo: Repository<OHLCVEntity>,
  ) {}

  async importAndSaveData(
    dto: DataAggregationDto['ticker'],
  ): Promise<{ message: string }> {
    // Beispiel: symbol = 'MCD', exchange = 'US'

    const apiKey = this.configService.get<string>('EODHD_API_KEY');

    if (!apiKey) {
      return { message: 'API Key fehlt' };
    }
    // 1. Security suchen oder anlegen
    let security = await this.securityRepo.findOne({
      where: { symbol: dto.symbol, exchangeId: dto.exchange },
    });
    if (!security) {
      security = this.securityRepo.create({
        symbol: dto.symbol,
        exchangeId: dto.exchange,
      });
      security = await this.securityRepo.save(security);
    }
    // 2. Daten von API holen
    const { data } = await firstValueFrom(
      this.httpService.get<
        {
          date: string;
          open: number;
          high: number;
          low: number;
          close: number;
          adjusted_close: number;
          volume: number;
        }[]
      >(
        `https://eodhd.com/api/eod/${dto.symbol}.${dto.exchange}?api_token=${apiKey}&fmt=json&period=monthly`,
      ),
    );
    // 3. Daten transformieren und upserten
    const priceEntities = data.map((item) =>
      this.ohlcvRepo.create({
        securityId: security.securityId,
        priceDate: item.date,
        openPrice: item.open,
        highPrice: item.high,
        lowPrice: item.low,
        closePrice: item.close,
        adjustedClosePrice: item.adjusted_close,
        volume: item.volume,
      }),
    );
    // Upsert: nach PK (securityId, priceDate)
    await this.ohlcvRepo.upsert(priceEntities, ['securityId', 'priceDate']);
    return {
      message: `Data imported and saved for ${dto.symbol}.${dto.exchange}`,
    };
  }

  async loadData({ ticker, range }: DataAggregationDto): Promise<OHLCV[]> {
    const security = await this.fetchSecurityByTicker(ticker);
    if (!security) {
      return [];
    }

    const ohlcvData = await this.ohlcvRepo.find(
      this.createPriceQueryOptions(security, range),
    );
    return ohlcvData.map<OHLCV>((item) => new OHLCV(item));
  }

  async loadAndUpdateIfNeeded(dto: DataAggregationDto): Promise<OHLCV[]> {
    // Zuerst die Daten ohne Range laden, um das letzte Datum zu prüfen
    const latestData = await this.loadData({ ticker: dto.ticker });

    const isDataMissing = !latestData || latestData.length === 0;
    const isDataStale =
      !isDataMissing &&
      Date.now() - latestData[latestData.length - 1].getPriceEpochTime() >=
        24 * 60 * 60 * 1000;

    if (isDataMissing || isDataStale) {
      await this.importAndSaveData(dto.ticker);
    }

    // Nach potenzieller Aktualisierung die Daten mit dem gewünschten Filter laden
    return this.loadData(dto);
  }

  private fetchSecurityByTicker(ticker: TickerDto) {
    return this.securityRepo.findOne({
      where: { symbol: ticker.symbol, exchangeId: ticker.exchange },
    });
  }

  private createPriceQueryOptions(
    security: Security,
    range: DateRangeDto | undefined,
  ) {
    const options: FindManyOptions<OHLCVEntity> = {
      where: { securityId: security.securityId },
      order: { priceDate: 'ASC' },
    };

    if (range && options.where) {
      if (range.from && range.to) {
        options.where['priceDate'] = Between(range.from, range.to);
      } else if (range.from) {
        options.where['priceDate'] = MoreThanOrEqual(range.from);
      } else if (range.to) {
        options.where['priceDate'] = LessThanOrEqual(range.to);
      }
    }
    return options;
  }
}
