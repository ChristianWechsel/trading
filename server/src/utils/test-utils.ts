import { EnrichedDataPoint } from '../analysis/core/enriched-data-point';
import { OHLCV, OHLCVEntity } from '../data-aggregation/ohlcv.entity';

export class CreateTestData {
  protected createEnrichedDataPoint(
    ohlcv: Partial<OHLCVEntity>,
  ): EnrichedDataPoint {
    const defaultData: OHLCVEntity = {
      securityId: 0,
      priceDate: '1970-01-01',
      openPrice: 0,
      highPrice: 0,
      lowPrice: 0,
      closePrice: 0,
      adjustedClosePrice: 0,
      volume: 0,
    };
    return new EnrichedDataPoint(new OHLCV({ ...defaultData, ...ohlcv }));
  }
}
