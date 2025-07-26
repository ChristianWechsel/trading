import { OHLCV } from '../../data-aggregation/ohlcv.entity';
import { AnalysisQueryDto } from '../analysis-query.dto';
import { TrendDataMetadata } from './analysis.interface';
import { EnrichedDataPoint } from './enriched-data-point';

export class AnalysisContextClass {
  private enrichedDataPoints: EnrichedDataPoint[];
  private trends: TrendDataMetadata['trendData'][];

  constructor(
    private query: AnalysisQueryDto,
    private ohlcvs: OHLCV[],
  ) {
    this.enrichedDataPoints = [];
    this.trends = [];
  }

  getEnrichedDataPoints(): EnrichedDataPoint[] {
    return this.enrichedDataPoints;
  }

  getTrends(): TrendDataMetadata['trendData'][] {
    return this.trends;
  }
}
