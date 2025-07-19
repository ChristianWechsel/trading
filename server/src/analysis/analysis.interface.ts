import { DataAggregationDto } from '../data-aggregation/data-aggregation.dto';
import { OHLCV } from '../data-aggregation/ohlcv.entity';

export interface IDataAggregationService {
  importAndSaveData(
    dto: DataAggregationDto['ticker'],
  ): Promise<{ message: string }>;
  loadData(dataAggregationDto: DataAggregationDto): Promise<OHLCV[]>;
  loadAndUpdateIfNeeded(dto: DataAggregationDto): Promise<OHLCV[]>;
}
