import { Injectable } from '@nestjs/common';
import { TickerDto } from '../data-aggregation/data-aggregation.dto';
import { DataAggregationService } from '../data-aggregation/data-aggregation.service';

@Injectable()
export class DataProviderService {
  constructor(
    private readonly dataAggregationService: DataAggregationService,
  ) {}
  async getEod(dto: TickerDto) {
    const eodData = await this.dataAggregationService.loadData(dto);
    return eodData;
  }
}
