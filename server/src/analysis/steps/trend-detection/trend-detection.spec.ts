import { AnalysisContextClass } from '../../../analysis/core/analysis-context';
import { TrendDataMetadata } from '../../../analysis/core/analysis.interface';
import { analysisConfig } from '../../config/analysis.config';
import { TrendDetection } from './trend-detection';
import { TrendDetectionTestdata } from './trend-detection.testdata';

export type TrendTestCase = {
  name: string;
  testcase: {
    expectedTrends: TrendDataMetadata['trendData'][];
    settings: {
      relativeThreshold: number;
    };
    context: AnalysisContextClass;
  };
};

describe('Trend', () => {
  const testData = new TrendDetectionTestdata();

  describe('Checking input data', () => {
    it('should throw if less than 3 swing points are provided', () => {
      const testcase = testData.lessThanMinSwingPoints().testcase;
      expect(() =>
        new TrendDetection({
          relativeThreshold: testcase.settings.relativeThreshold,
        }).execute(testcase.context),
      ).toThrow();
    });

    it('should not throw if at least 3 swing points are provided', () => {
      const testcase = testData.minSwingPoints().testcase;
      expect(() =>
        new TrendDetection(testcase.settings).execute(testcase.context),
      ).not.toThrow();
    });

    it('should throw if relativeThreshold is below the minimum threshold', () => {
      const testcase = testData.validateMinSwingPoints().testcase;

      expect(() =>
        new TrendDetection(testcase.settings).execute(testcase.context),
      ).toThrow(
        `relativeThreshold must be between ${analysisConfig.comparableNumber.MIN_THRESHOLD} and ${analysisConfig.comparableNumber.MAX_THRESHOLD}`,
      );
    });

    it('should throw if relativeThreshold is above the maximum threshold', () => {
      const testcase = testData.validateMaxSwingPoints().testcase;

      expect(() =>
        new TrendDetection(testcase.settings).execute(testcase.context),
      ).toThrow(
        `relativeThreshold must be between ${analysisConfig.comparableNumber.MIN_THRESHOLD} and ${analysisConfig.comparableNumber.MAX_THRESHOLD}`,
      );
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
      new TrendDetection(testcase.settings).execute(testcase.context);
      expect(testcase.context.getTrends()).toEqual(testcase.expectedTrends);
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
      new TrendDetection(testcase.settings).execute(testcase.context);
      expect(testcase.context.getTrends()).toEqual(testcase.expectedTrends);
    });
  });
});
