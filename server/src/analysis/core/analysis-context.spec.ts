import { OHLCV } from '../../data-aggregation/ohlcv.entity';
import { AnalysisQueryDto } from '../analysis-query.dto';
import { ATRComparableNumber } from '../steps/utils/comparable-number/atr-comparable-number';
import { RelativeComparableNumber } from '../steps/utils/comparable-number/relative-comparable-number';
import { AnalysisContextClass } from './analysis-context';
import { SignalForTrade, TrendDataMetadata } from './analysis.interface';
import { EnrichedDataPoint } from './enriched-data-points/enriched-data-point';

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
    expect(ctx.getTradingSignals()).toEqual([]);
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

  it('should set and get trends', () => {
    const ctx = new AnalysisContextClass(query, ohlcvs);
    const mockTrend = [
      { type: 'upward', start: {} as EnrichedDataPoint },
    ] as TrendDataMetadata['trendData'][];

    ctx.setTrends(mockTrend);
    expect(ctx.getTrends()).toEqual(mockTrend);
  });

  it('should add and get trading signals', () => {
    const ctx = new AnalysisContextClass(query, ohlcvs);
    const mockSignal: SignalForTrade = {
      type: 'buy',
      dataPoint: {} as EnrichedDataPoint,
      reason: 'Upward trend started',
    };

    ctx.addTradingSignals(mockSignal);
    expect(ctx.getTradingSignals()).toEqual([mockSignal]);
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

  describe('buildComparableNumber', () => {
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

    it('should return a RelativeComparableNumber by default', () => {
      const ctx = new AnalysisContextClass({} as AnalysisQueryDto, []);
      const comparableNumber = ctx.buildComparableNumber({
        enrichedDataPoint: dataPoint,
        step: 'SwingPointDetection',
      });
      expect(comparableNumber).toBeInstanceOf(RelativeComparableNumber);
    });

    it('should return an ATRComparableNumber when ATR is available', () => {
      const ctx = new AnalysisContextClass(
        {
          stepOptions: { swingPointDetection: { atrFactor: 2 } },
        } as AnalysisQueryDto,
        [],
      );

      // Set ATR on the data point
      dataPoint.setAverageTrueRange(1.5);

      const comparableNumber = ctx.buildComparableNumber({
        enrichedDataPoint: dataPoint,
        step: 'SwingPointDetection',
      });

      expect(comparableNumber).toBeInstanceOf(ATRComparableNumber);
    });
  });

  describe('money management and risk management', () => {
    it('should build default money management', () => {
      const ctx = new AnalysisContextClass({} as AnalysisQueryDto, []);
      const moneyManagement = ctx.buildMoneyManagement();
      expect(moneyManagement).toBeDefined();
    });

    it('should build default risk management', () => {
      const ctx = new AnalysisContextClass({} as AnalysisQueryDto, []);
      const riskManagement = ctx.buildRiskManagement();
      expect(riskManagement).toBeDefined();
    });

    it('should respect configured money management options', () => {
      const ctx = new AnalysisContextClass(
        {
          trading: {
            moneyManagement: {
              moneyManagement: 'all-in',
            },
          },
        } as AnalysisQueryDto,
        [],
      );

      const moneyManagement = ctx.buildMoneyManagement();
      expect(moneyManagement).toBeDefined();
      // Test implementation details would depend on how to identify the specific strategy
    });

    it('should respect configured risk management options', () => {
      const ctx = new AnalysisContextClass(
        {
          trading: {
            riskManagement: {
              riskManagement: 'atr-based',
              atrFactor: 2,
            },
          },
        } as AnalysisQueryDto,
        [],
      );

      const riskManagement = ctx.buildRiskManagement();
      expect(riskManagement).toBeDefined();
      // Test implementation details would depend on how to identify the specific strategy
    });
  });

  describe('options handling', () => {
    it('should provide access to options', () => {
      const ctx = new AnalysisContextClass(query, ohlcvs);
      expect(ctx.getOptions()).toBeDefined();
    });
  });
});
