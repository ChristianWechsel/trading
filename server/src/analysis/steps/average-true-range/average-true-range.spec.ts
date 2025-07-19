import { OHLCV } from '../../../data-aggregation/ohlcv.entity';
import { analysisConfig } from '../../config/analysis.config';
import { AnalysisContext } from '../../core/analysis.interface';
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
      expect(() =>
        atr.execute({
          enrichedDataPoints: new Array<EnrichedDataPoint>(period - 1).fill(
            new EnrichedDataPoint(
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
            ),
          ),
        }),
      ).toThrow(`Not enough data points for period=${period}`);
    });

    it('should not throw if enrichedDataPoints are equal to period', () => {
      const period = 10;
      const atr = new AverageTrueRange({ period });
      expect(() =>
        atr.execute({
          enrichedDataPoints: new Array<EnrichedDataPoint>(period).fill(
            new EnrichedDataPoint(
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
            ),
          ),
        }),
      ).not.toThrow();
    });

    it('should not throw if enrichedDataPoints are more than period', () => {
      const period = 10;
      const atr = new AverageTrueRange({ period });

      expect(() =>
        atr.execute({
          enrichedDataPoints: new Array<EnrichedDataPoint>(period + 1).fill(
            new EnrichedDataPoint(
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
            ),
          ),
        }),
      ).not.toThrow();
    });
  });

  describe('AverageTrueRange calculation', () => {
    const testData = new AverageTrueRangeTestdata();
    it.only.each([
      testData.minimumPeriod_todayMax(),
      testData.minimumPeriod_todayHighClosingYesterday(),
      testData.minimumPeriod_todayLowClosingYesterday(),
    ])('$name', ({ setting, testcase }) => {
      expect.assertions(testcase.length);

      const atr = new AverageTrueRange(setting);
      const context: AnalysisContext = {
        enrichedDataPoints: testcase.map((tc) => tc.dataPoint),
      };
      atr.execute(context);
      context.enrichedDataPoints.forEach((dataPoint, index) => {
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
