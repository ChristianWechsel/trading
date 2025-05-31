import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class DataAggregationService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}
  async importAndSaveData() {
    // 1. Daten von externer API holen
    const apiKey = this.configService.get<string>('EODHD_API_KEY');

    if (!apiKey) {
      return { message: 'API Key fehlt' };
    }

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
        `https://eodhd.com/api/eod/MCD.US?api_token=${apiKey}&fmt=json&period=monthly`,
      ),
    );
    console.log('Daten von API:', data);
    // 2. Daten validieren/transformieren (optional)

    // 3. In die Datenbank speichern (Repository verwenden)
    // Beispiel: await this.repo.save(data);

    return { message: 'Data imported and saved successfully' };
  }
}
