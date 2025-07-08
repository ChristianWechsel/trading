import { Injectable } from '@nestjs/common';
import { DataAggregationDto } from '../data-aggregation/data-aggregation.dto';
import { DataAggregationService } from '../data-aggregation/data-aggregation.service';

@Injectable()
export class DataProviderService {
  constructor(
    private readonly dataAggregationService: DataAggregationService,
  ) {}
  async getEod(dto: DataAggregationDto) {
    // Zeitraum from to beachten.
    // Wird kein Zeitraum angegeben, dann wird der gesamte Zeitraum geladen.
    const eodData = await this.dataAggregationService.loadData(dto);
    return eodData;
  }
}
