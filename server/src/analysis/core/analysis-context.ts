import { OHLCV } from '../../data-aggregation/ohlcv.entity';
import { AnalysisQueryDto } from '../analysis-query.dto';
import { TrendDataMetadata } from './analysis.interface';
import { EnrichedDataPoint } from './enriched-data-point';

export class AnalysisContextClass {
  private enrichedDataPoints: EnrichedDataPoint[];
  private trends: TrendDataMetadata['trendData'][];

  constructor(
    private query: AnalysisQueryDto,
    ohlcvs: OHLCV[],
  ) {
    this.enrichedDataPoints = ohlcvs
      .map((ohlcv) => ohlcv.clone())
      .map((ohlcv) => new EnrichedDataPoint(ohlcv));
    this.trends = [];
  }

  getEnrichedDataPoints(): EnrichedDataPoint[] {
    return this.enrichedDataPoints;
  }

  getTrends(): TrendDataMetadata['trendData'][] {
    return this.trends;
  }

  buildYValueAccessor(): (dataPoint: EnrichedDataPoint) => number {
    return (dataPoint: EnrichedDataPoint) => {
      switch (this.query.stepOptions?.yValueSource) {
        case 'close':
          return dataPoint.getDataPoint().getClosePrice();
        case 'open':
          return dataPoint.getDataPoint().getOpenPrice();
        case 'high':
          return dataPoint.getDataPoint().getHighPrice();
        case 'low':
          return dataPoint.getDataPoint().getLowPrice();
        default:
          return dataPoint.getDataPoint().getClosePrice();
      }
    };
  }
}
