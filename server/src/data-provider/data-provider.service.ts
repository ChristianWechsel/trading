import { Injectable } from '@nestjs/common';
import { DataAggregationDto } from '../data-aggregation/data-aggregation.dto';
import { DataAggregationService } from '../data-aggregation/data-aggregation.service';

@Injectable()
export class DataProviderService {
  constructor(
    private readonly dataAggregationService: DataAggregationService,
  ) {}
  getCandleSticks(dto: DataAggregationDto) {
    return this.dataAggregationService.loadAndUpdateIfNeeded(dto);
  }
}
