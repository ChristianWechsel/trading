import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
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
import { EodPrice } from './eod-price.entity';
import { Security } from './security.entity';

@Injectable()
export class DataAggregationService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @InjectRepository(Security)
    private readonly securityRepo: Repository<Security>,
    @InjectRepository(EodPrice)
    private readonly eodPriceRepo: Repository<EodPrice>,
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
      this.eodPriceRepo.create({
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
    await this.eodPriceRepo.upsert(priceEntities, ['securityId', 'priceDate']);
    return {
      message: `Data imported and saved for ${dto.symbol}.${dto.exchange}`,
    };
  }

  /**
   * Lädt EOD-Daten aus der Datenbank. Löst KEINE externe Aktualisierung aus.
   * @param dto - Enthält Ticker und optionalen Zeitraum.
   * @returns Ein Array von EodPrice-Entitäten.
   */
  async loadData({ ticker, range }: DataAggregationDto): Promise<EodPrice[]> {
    const security = await this.fetchSecurityByTicker(ticker);
    if (!security) {
      return [];
    }

    return this.eodPriceRepo.find(
      this.createPriceQueryOptions(security, range),
    );
  }

  /**
   * Stellt sicher, dass die Daten aktuell sind.
   * Lädt Daten und prüft, ob sie fehlen oder veraltet sind.
   * Falls nötig, wird ein Import von der externen API angestoßen.
   * @param dto - Enthält Ticker und optionalen Zeitraum.
   * @returns Ein Array der (ggf. aktualisierten) EodPrice-Entitäten.
   */
  async loadAndUpdateIfNeeded(dto: DataAggregationDto): Promise<EodPrice[]> {
    // Zuerst die Daten ohne Range laden, um das letzte Datum zu prüfen
    const latestData = await this.loadData({ ticker: dto.ticker });

    const isDataMissing = !latestData || latestData.length === 0;
    const isDataStale =
      !isDataMissing &&
      Date.now() -
        new Date(latestData[latestData.length - 1].priceDate).getTime() >=
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
    const options: FindManyOptions<EodPrice> = {
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
