import {
  MAX_THRESHOLD,
  MIN_THRESHOLD,
} from '../../../digital-signal-processing/comparable-number/parameters';
import {
  EnrichedDataPoint,
  TrendType,
} from '../../../digital-signal-processing/dto/enriched-data-point/enriched-data-point';
import { TrendTestData } from '../testdata';
import { TrendDetection } from './trend-detection';

export type TrendTestCase = {
  name: string;
  testcase: {
    data: EnrichedDataPoint[];
    expectedTrend: { index: number; type: TrendType }[];
    settings: {
      relativeThreshold: number;
    };
  };
};

describe('Trend', () => {
  const testData = new TrendTestData();

  describe('Checking input data', () => {
    it('should throw if less than 3 swing points are provided', () => {
      expect(
        () =>
          new TrendDetection(testData.lessThanMinSwingPoints(), {
            relativeThreshold: 0.1,
          }),
      ).toThrow();
    });

    it('should not throw if at least 3 swing points are provided', () => {
      expect(
        () =>
          new TrendDetection(testData.minSwingPoints(), {
            relativeThreshold: 0.1,
          }),
      ).not.toThrow();
    });

    it('should not throw if more than 3 swing points are provided', () => {
      expect(
        () =>
          new TrendDetection(testData.moreThanMinSwingPoints(), {
            relativeThreshold: 0.1,
          }),
      ).not.toThrow();
    });

    it('should throw if relativeThreshold is below the minimum threshold', () => {
      expect(
        () =>
          new TrendDetection(testData.minSwingPoints(), {
            relativeThreshold: -0.1, // Wert unter MIN_THRESHOLD (angenommen 0)
          }),
      ).toThrow(
        `relativeThreshold must be between ${MIN_THRESHOLD} and ${MAX_THRESHOLD}`,
      );
    });

    it('should throw if relativeThreshold is above the maximum threshold', () => {
      expect(
        () =>
          new TrendDetection(testData.minSwingPoints(), {
            relativeThreshold: 1.1, // Wert über MAX_THRESHOLD (angenommen 1)
          }),
      ).toThrow(
        `relativeThreshold must be between ${MIN_THRESHOLD} and ${MAX_THRESHOLD}`,
      );
    });

    it('should not throw if relativeThreshold is exactly at the minimum threshold', () => {
      expect(
        () =>
          new TrendDetection(testData.minSwingPoints(), {
            relativeThreshold: MIN_THRESHOLD, // Exakter Grenzwert
          }),
      ).not.toThrow();
    });

    it('should not throw if relativeThreshold is exactly at the maximum threshold', () => {
      expect(
        () =>
          new TrendDetection(testData.minSwingPoints(), {
            relativeThreshold: MAX_THRESHOLD, // Exakter Grenzwert
          }),
      ).not.toThrow();
    });

    it('should not throw if relativeThreshold is within the valid range', () => {
      expect(
        () =>
          new TrendDetection(testData.minSwingPoints(), {
            relativeThreshold: 0.05, // Gültiger Wert innerhalb der Grenzen
          }),
      ).not.toThrow();
    });
  });

  describe('detectTrends', () => {
    it.each([
      testData.upwardTrend(),
      testData.downwardTrend(),
      testData.upwardTrendNotConfirmed(),
      testData.downwardTrendNotConfirmed(),
      testData.upwardTrendNotConfirmedEdgeCase(),
      testData.downwardTrendNotConfirmedEdgeCase(),
      testData.upwardTrendInfinite(),
      testData.downwardTrendInfinite(),
      testData.upwardTrendContinuesWithoutEndpoint(),
      testData.upwardTrendBreaksWithLowerLowAndLowerHigh(),
      testData.downwardTrendContinuesWithoutEndpoint(),
      testData.downwardTrendBreaksWithHigherHighAndHigherLow(),
      testData.upwardTrendRecoversAfterWarning(),
      testData.downwardTrendBreaksAfterWarning(),
      testData.downwardTrendRecoversAfterWarning(),
      testData.upwardTrendFollowedByDownwardTrend(),
      testData.downwardTrendFollowedByUpwardTrend(),
      testData.trendFollowedByChoppyPeriodThenNewTrend(),
      testData.trendBreaksFollowedByGapThenNewTrend(),
    ])('$name', ({ testcase }) => {
      const result = new TrendDetection(
        testcase.data,
        testcase.settings,
      ).detectTrends();
      expect(result).toHaveLength(testcase.data.length);

      const areTrendsAsExpected = result.every((elementResult, idxResult) => {
        const idxExpectedTrend = testcase.expectedTrend.findIndex(
          (expected) => expected.index === idxResult,
        );
        if (idxExpectedTrend > -1) {
          const expectedTrendType =
            testcase.expectedTrend[idxExpectedTrend].type;
          const actualTrendType = elementResult.getTrend();
          if (
            Array.isArray(expectedTrendType) &&
            Array.isArray(actualTrendType) &&
            expectedTrendType.length === actualTrendType.length
          ) {
            return expectedTrendType.every(
              (trend, index) => trend === actualTrendType[index],
            );
          }
          return actualTrendType === expectedTrendType;
        }
        return elementResult.getTrend() === null;
      });
      expect(areTrendsAsExpected).toBe(true);
    });
  });

  describe('Trend with Thresholds', () => {
    const testData = new TrendTestData();

    it.each([
      testData.upwardTrendFailsDueToInsufficientlyHigherLow(),
      testData.downwardTrendFailsDueToInsufficientlyLowerHigh(),
      testData.upwardTrendBreaksDueToStallingHigh(),
      testData.downwardTrendBreaksDueToStallingLow(),
      testData.sidewaysTrendRecognizedAsNoUpDownTrend(),
    ])('$name', ({ testcase }) => {
      const result = new TrendDetection(
        testcase.data,
        testcase.settings,
      ).detectTrends();
      expect(result).toHaveLength(testcase.data.length);

      const areTrendsAsExpected = result.every((elementResult, idxResult) => {
        const idxExpectedTrend = testcase.expectedTrend.findIndex(
          (expected) => expected.index === idxResult,
        );
        if (idxExpectedTrend > -1) {
          return (
            elementResult.getTrend() ===
            testcase.expectedTrend[idxExpectedTrend].type
          );
        }
        return elementResult.getTrend() === null;
      });
      expect(areTrendsAsExpected).toBe(true);
    });
  });
});
