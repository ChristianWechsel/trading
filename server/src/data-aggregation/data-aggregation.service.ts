import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import { Repository } from 'typeorm';
import { TickerDto } from './data-aggregation.dto';
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

  async importAndSaveData(dto: TickerDto): Promise<{ message: string }> {
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
}
