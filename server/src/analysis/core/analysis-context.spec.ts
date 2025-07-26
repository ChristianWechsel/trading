import { OHLCV } from '../../data-aggregation/ohlcv.entity';
import { AnalysisQueryDto } from '../analysis-query.dto';
import { AnalysisContextClass } from './analysis-context';
import { TrendDataMetadata } from './analysis.interface';
import { EnrichedDataPoint } from './enriched-data-point';

describe('AnalysisContextClass', () => {
  let query: AnalysisQueryDto;
  let ohlcvs: OHLCV[];

  beforeEach(() => {
    query = {} as AnalysisQueryDto;
    ohlcvs = [] as OHLCV[];
  });

  it('should initialize enrichedDataPoints and trends as empty arrays', () => {
    const ctx = new AnalysisContextClass(query, ohlcvs);
    expect(ctx.getEnrichedDataPoints()).toEqual([]);
    expect(ctx.getTrends()).toEqual([]);
  });

  it('should return enrichedDataPoints via getEnrichedDataPoints()', () => {
    const ctx = new AnalysisContextClass(query, ohlcvs);
    // @ts-expect-error: testing private property
    ctx.enrichedDataPoints = [{ value: 1 }] as EnrichedDataPoint[];
    expect(ctx.getEnrichedDataPoints()).toEqual([{ value: 1 }]);
  });

  it('should return trends via getTrends()', () => {
    const ctx = new AnalysisContextClass(query, ohlcvs);
    // @ts-expect-error: testing private property
    ctx.trends = [[{ trend: 'up' }]] as TrendDataMetadata['trendData'][];
    expect(ctx.getTrends()).toEqual([[{ trend: 'up' }]]);
  });
});
