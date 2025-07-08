import { Injectable } from '@nestjs/common';
import { DataAggregationDto } from '../data-aggregation/data-aggregation.dto';
import { DataAggregationService } from '../data-aggregation/data-aggregation.service';

@Injectable()
export class DataProviderService {
  constructor(
    private readonly dataAggregationService: DataAggregationService,
  ) {}
  getEod(dto: DataAggregationDto) {
    return this.dataAggregationService.loadData(dto);
  }
}
