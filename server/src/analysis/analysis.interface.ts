import { DataAggregationDto } from '../data-aggregation/data-aggregation.dto';
import { EodPrice } from '../data-aggregation/eod-price.entity';

export interface IDataAggregationService {
  importAndSaveData(
    dto: DataAggregationDto['ticker'],
  ): Promise<{ message: string }>;
  loadData(dataAggregationDto: DataAggregationDto): Promise<EodPrice[]>;
  loadAndUpdateIfNeeded(dto: DataAggregationDto): Promise<EodPrice[]>;
}
