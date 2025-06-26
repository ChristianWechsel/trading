import {
  EnrichedDataPoint,
  TrendType,
} from '../../../digital-signal-processing/dto/enriched-data-point/enriched-data-point';
import { analysisConfig } from '../../config/analysis.config';
import { TrendDetection } from './trend-detection';
import { TrendDetectionTestdata } from './trend-detection.testdata';

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
  const testData = new TrendDetectionTestdata();

  describe('Checking input data', () => {
    it('should throw if less than 3 swing points are provided', () => {
      expect(() =>
        new TrendDetection({
          relativeThreshold: 0.1,
        }).execute({ enrichedDataPoints: testData.lessThanMinSwingPoints() }),
      ).toThrow();
    });

    it('should not throw if at least 3 swing points are provided', () => {
      expect(() =>
        new TrendDetection({
          relativeThreshold: 0.1,
        }).execute({ enrichedDataPoints: testData.minSwingPoints() }),
      ).not.toThrow();
    });

    it('should not throw if more than 3 swing points are provided', () => {
      expect(() =>
        new TrendDetection({
          relativeThreshold: 0.1,
        }).execute({ enrichedDataPoints: testData.moreThanMinSwingPoints() }),
      ).not.toThrow();
    });

    it('should throw if relativeThreshold is below the minimum threshold', () => {
      expect(() =>
        new TrendDetection({
          relativeThreshold: -0.1, // Wert unter MIN_THRESHOLD (angenommen 0)
        }).execute({ enrichedDataPoints: testData.minSwingPoints() }),
      ).toThrow(
        `relativeThreshold must be between ${analysisConfig.comparableNumber.MIN_THRESHOLD} and ${analysisConfig.comparableNumber.MAX_THRESHOLD}`,
      );
    });

    it('should throw if relativeThreshold is above the maximum threshold', () => {
      expect(() =>
        new TrendDetection({
          relativeThreshold: 1.1, // Wert über MAX_THRESHOLD (angenommen 1)
        }).execute({ enrichedDataPoints: testData.minSwingPoints() }),
      ).toThrow(
        `relativeThreshold must be between ${analysisConfig.comparableNumber.MIN_THRESHOLD} and ${analysisConfig.comparableNumber.MAX_THRESHOLD}`,
      );
    });

    it('should not throw if relativeThreshold is exactly at the minimum threshold', () => {
      expect(() =>
        new TrendDetection({
          relativeThreshold: analysisConfig.comparableNumber.MIN_THRESHOLD, // Exakter Grenzwert
        }).execute({ enrichedDataPoints: testData.minSwingPoints() }),
      ).not.toThrow();
    });

    it('should not throw if relativeThreshold is exactly at the maximum threshold', () => {
      expect(() =>
        new TrendDetection({
          relativeThreshold: analysisConfig.comparableNumber.MAX_THRESHOLD, // Exakter Grenzwert
        }).execute({ enrichedDataPoints: testData.minSwingPoints() }),
      ).not.toThrow();
    });

    it('should not throw if relativeThreshold is within the valid range', () => {
      expect(() =>
        new TrendDetection({
          relativeThreshold: 0.05, // Gültiger Wert innerhalb der Grenzen
        }).execute({ enrichedDataPoints: testData.minSwingPoints() }),
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
      new TrendDetection(testcase.settings).execute({
        enrichedDataPoints: testcase.data,
      });

      const areTrendsAsExpected = testcase.data.every(
        (elementResult, idxResult) => {
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
        },
      );
      expect(areTrendsAsExpected).toBe(true);
    });
  });

  describe('Trend with Thresholds', () => {
    const testData = new TrendDetectionTestdata();

    it.each([
      testData.upwardTrendFailsDueToInsufficientlyHigherLow(),
      testData.downwardTrendFailsDueToInsufficientlyLowerHigh(),
      testData.upwardTrendBreaksDueToStallingHigh(),
      testData.downwardTrendBreaksDueToStallingLow(),
      testData.sidewaysTrendRecognizedAsNoUpDownTrend(),
    ])('$name', ({ testcase }) => {
      new TrendDetection(testcase.settings).execute({
        enrichedDataPoints: testcase.data,
      });

      const areTrendsAsExpected = testcase.data.every(
        (elementResult, idxResult) => {
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
        },
      );
      expect(areTrendsAsExpected).toBe(true);
    });
  });
});
