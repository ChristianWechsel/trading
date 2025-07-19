import { analysisConfig } from '../../config/analysis.config';
import { EnrichedDataPoint } from '../../core/enriched-data-point';
import { AverageTrueRange } from './average-true-range';
import { AverageTrueRangeTestdata } from './average-true-range.testdata';

export type AverageTrueRangeTestCase = {
  name: string;
  testcase: {
    period: number;
    data: EnrichedDataPoint[];
    expectedATR?: number;
  };
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
            new EnrichedDataPoint({ x: 1, y: 1 }),
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
            new EnrichedDataPoint({ x: 1, y: 1 }),
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
            new EnrichedDataPoint({ x: 1, y: 1 }),
          ),
        }),
      ).not.toThrow();
    });
  });

  describe('AverageTrueRange calculation', () => {
    const testData = new AverageTrueRangeTestdata();
    it.each([testData.minimumPeriod()])('$name', ({ testcase }) => {
      const atr = new AverageTrueRange({ period: testcase.period });
      const result = atr.execute({ enrichedDataPoints: testcase.data });
      expect(result).toBeCloseTo(testcase.expectedATR, 5);
    });
  });
});
