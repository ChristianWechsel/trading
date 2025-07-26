import { OHLCV } from '../../../data-aggregation/ohlcv.entity';
import { AnalysisQueryDto } from '../../analysis-query.dto';
import { analysisConfig } from '../../config/analysis.config';
import { AnalysisContextClass } from '../../core/analysis-context';
import { EnrichedDataPoint } from '../../core/enriched-data-point';
import { AverageTrueRange } from './average-true-range';
import { AverageTrueRangeTestdata } from './average-true-range.testdata';

export type AverageTrueRangeTestCase = {
  name: string;
  setting: { period: number };
  testcase: {
    dataPoint: EnrichedDataPoint;
    expectedATR?: number;
  }[];
};

describe('AverageTrueRange', () => {
  let query: AnalysisQueryDto;

  beforeEach(() => {
    query = {} as AnalysisQueryDto;
  });

  describe('checks', () => {
    it('should throw if period is below the minimum period', () => {
      expect(
        () =>
          new AverageTrueRange({
            period: analysisConfig.averageTrueRange.MIN_PERIOD - 1,
          }),
      ).toThrow(
        `Period must be a natural number >= ${analysisConfig.averageTrueRange.MIN_PERIOD}`,
      );
    });

    it('should not throw if period is exactly at the minimum period', () => {
      expect(
        () =>
          new AverageTrueRange({
            period: analysisConfig.averageTrueRange.MIN_PERIOD,
          }),
      ).not.toThrow();
    });

    it('should throw if period is not an integer', () => {
      expect(() => new AverageTrueRange({ period: 14.34 })).toThrow(
        `Period must be a natural number >= ${analysisConfig.averageTrueRange.MIN_PERIOD}`,
      );
    });

    it('should not throw if period is a valid integer above minimum', () => {
      expect(
        () =>
          new AverageTrueRange({
            period: analysisConfig.averageTrueRange.MIN_PERIOD + 5,
          }),
      ).not.toThrow();
    });

    it('should throw if enrichedDataPoints are less than period', () => {
      const period = 10;
      const atr = new AverageTrueRange({ period });
      const ohlcvs = new Array<OHLCV>(period - 1).fill(
        new OHLCV({
          securityId: 0,
          priceDate: '1970-01-01',
          openPrice: 0,
          highPrice: 0,
          lowPrice: 0,
          closePrice: 0,
          adjustedClosePrice: 0,
          volume: 0,
        }),
      );
      const context = new AnalysisContextClass(query, ohlcvs);
      expect(() => atr.execute(context)).toThrow(
        `Not enough data points for period=${period}`,
      );
    });

    it('should not throw if enrichedDataPoints are equal to period', () => {
      const period = 10;
      const atr = new AverageTrueRange({ period });
      const ohlcvs = new Array<OHLCV>(period).fill(
        new OHLCV({
          securityId: 0,
          priceDate: '1970-01-01',
          openPrice: 0,
          highPrice: 0,
          lowPrice: 0,
          closePrice: 0,
          adjustedClosePrice: 0,
          volume: 0,
        }),
      );
      const context = new AnalysisContextClass(query, ohlcvs);
      expect(() => atr.execute(context)).not.toThrow();
    });

    it('should not throw if enrichedDataPoints are more than period', () => {
      const period = 10;
      const atr = new AverageTrueRange({ period });
      const ohlcvs = new Array<OHLCV>(period + 1).fill(
        new OHLCV({
          securityId: 0,
          priceDate: '1970-01-01',
          openPrice: 0,
          highPrice: 0,
          lowPrice: 0,
          closePrice: 0,
          adjustedClosePrice: 0,
          volume: 0,
        }),
      );
      const context = new AnalysisContextClass(query, ohlcvs);
      expect(() => atr.execute(context)).not.toThrow();
    });
  });

  describe('AverageTrueRange calculation', () => {
    const testData = new AverageTrueRangeTestdata();
    it.each([
      testData.minimumPeriod_todayMax(),
      testData.minimumPeriod_todayHighClosingYesterday(),
      testData.minimumPeriod_todayLowClosingYesterday(),
      testData.period5_with10datapoints(),
    ])('$name', ({ setting, testcase }) => {
      expect.assertions(testcase.length);

      const atr = new AverageTrueRange(setting);
      const ohlcvs = testcase.map((tc) => tc.dataPoint.getDataPoint());
      const context = new AnalysisContextClass(query, ohlcvs);
      atr.execute(context);
      context.getEnrichedDataPoints().forEach((dataPoint, index) => {
        if (testcase[index].expectedATR !== undefined) {
          expect(dataPoint.getAverageTrueRange()).toBeCloseTo(
            testcase[index].expectedATR,
          );
        } else {
          expect(dataPoint.getAverageTrueRange()).toBeUndefined();
        }
      });
    });
  });
});
