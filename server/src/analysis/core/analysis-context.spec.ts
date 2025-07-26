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

  it('should create enrichedDataPoints from ohlcvs on initialization', () => {
    ohlcvs = [
      new OHLCV({
        securityId: 1,
        priceDate: '2023-01-01',
        openPrice: 100,
        highPrice: 110,
        lowPrice: 90,
        closePrice: 105,
        adjustedClosePrice: 105,
        volume: 1000,
      }),
      new OHLCV({
        securityId: 1,
        priceDate: '2023-01-02',
        openPrice: 105,
        highPrice: 115,
        lowPrice: 100,
        closePrice: 110,
        adjustedClosePrice: 110,
        volume: 1200,
      }),
    ];
    const ctx = new AnalysisContextClass(query, ohlcvs);
    const enrichedPoints = ctx.getEnrichedDataPoints();

    expect(enrichedPoints).toHaveLength(2);
    expect(enrichedPoints[0]).toBeInstanceOf(EnrichedDataPoint);
    expect(enrichedPoints[0].getDataPoint()).toEqual(ohlcvs[0]);
    expect(enrichedPoints[1]).toBeInstanceOf(EnrichedDataPoint);
    expect(enrichedPoints[1].getDataPoint()).toEqual(ohlcvs[1]);
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

  describe('buildYValueAccessor', () => {
    let dataPoint: EnrichedDataPoint;

    beforeEach(() => {
      const ohlcv = new OHLCV({
        securityId: 1,
        priceDate: '2023-01-01',
        openPrice: 10,
        highPrice: 20,
        lowPrice: 5,
        closePrice: 15,
        adjustedClosePrice: 15,
        volume: 1000,
      });
      dataPoint = new EnrichedDataPoint(ohlcv);
    });

    it('should return a function that accesses the close price by default', () => {
      const ctx = new AnalysisContextClass({} as AnalysisQueryDto, []);
      const accessor = ctx.buildYValueAccessor();
      expect(accessor(dataPoint)).toBe(15);
    });

    it('should return a function that accesses the close price if yValueSource is "close"', () => {
      const ctx = new AnalysisContextClass(
        { stepOptions: { yValueSource: 'close' } } as AnalysisQueryDto,
        [],
      );
      const accessor = ctx.buildYValueAccessor();
      expect(accessor(dataPoint)).toBe(15);
    });

    it('should return a function that accesses the open price if yValueSource is "open"', () => {
      const ctx = new AnalysisContextClass(
        { stepOptions: { yValueSource: 'open' } } as AnalysisQueryDto,
        [],
      );
      const accessor = ctx.buildYValueAccessor();
      expect(accessor(dataPoint)).toBe(10);
    });

    it('should return a function that accesses the high price if yValueSource is "high"', () => {
      const ctx = new AnalysisContextClass(
        { stepOptions: { yValueSource: 'high' } } as AnalysisQueryDto,
        [],
      );
      const accessor = ctx.buildYValueAccessor();
      expect(accessor(dataPoint)).toBe(20);
    });

    it('should return a function that accesses the low price if yValueSource is "low"', () => {
      const ctx = new AnalysisContextClass(
        { stepOptions: { yValueSource: 'low' } } as AnalysisQueryDto,
        [],
      );
      const accessor = ctx.buildYValueAccessor();
      expect(accessor(dataPoint)).toBe(5);
    });
  });
});
