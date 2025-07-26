import { AnalysisQueryDto } from '../../../analysis/analysis-query.dto';
import { AnalysisContextClass } from '../../../analysis/core/analysis-context';
import { AnalysisContext } from '../../../analysis/core/analysis.interface';
import { analysisConfig } from '../../config/analysis.config';
import { EnrichedDataPoint } from '../../core/enriched-data-point';
import { TrendDetection } from './trend-detection';
import { TrendDetectionTestdata } from './trend-detection.testdata';

export type TrendTestCase = {
  name: string;
  testcase: {
    data: EnrichedDataPoint[];
    expectedTrends: AnalysisContext['trends'];
    settings: {
      relativeThreshold: number;
    };
  };
};

describe('Trend', () => {
  const testData = new TrendDetectionTestdata();

  describe('Checking input data', () => {
    it('should throw if less than 3 swing points are provided', () => {
      const context = new AnalysisContextClass(
        {} as AnalysisQueryDto,
        testData.lessThanMinSwingPoints().map((dp) => dp.getDataPoint()),
      );
      expect(() =>
        new TrendDetection({
          relativeThreshold: 0.1,
        }).execute(context),
      ).toThrow();
    });

    it('should not throw if at least 3 swing points are provided', () => {
      const context = new AnalysisContextClass(
        {} as AnalysisQueryDto,
        testData.minSwingPoints().map((dp) => dp.getDataPoint()),
      );
      expect(() =>
        new TrendDetection({
          relativeThreshold: 0.1,
        }).execute(context),
      ).not.toThrow();
    });

    it('should not throw if more than 3 swing points are provided', () => {
      const context = new AnalysisContextClass(
        {} as AnalysisQueryDto,
        testData.moreThanMinSwingPoints().map((dp) => dp.getDataPoint()),
      );
      expect(() =>
        new TrendDetection({
          relativeThreshold: 0.1,
        }).execute(context),
      ).not.toThrow();
    });

    it('should throw if relativeThreshold is below the minimum threshold', () => {
      const context = new AnalysisContextClass(
        {} as AnalysisQueryDto,
        testData.minSwingPoints().map((dp) => dp.getDataPoint()),
      );
      expect(() =>
        new TrendDetection({
          relativeThreshold: -0.1, // Wert unter MIN_THRESHOLD (angenommen 0)
        }).execute(context),
      ).toThrow(
        `relativeThreshold must be between ${analysisConfig.comparableNumber.MIN_THRESHOLD} and ${analysisConfig.comparableNumber.MAX_THRESHOLD}`,
      );
    });

    it('should throw if relativeThreshold is above the maximum threshold', () => {
      const context = new AnalysisContextClass(
        {} as AnalysisQueryDto,
        testData.minSwingPoints().map((dp) => dp.getDataPoint()),
      );
      expect(() =>
        new TrendDetection({
          relativeThreshold: 1.1, // Wert über MAX_THRESHOLD (angenommen 1)
        }).execute(context),
      ).toThrow(
        `relativeThreshold must be between ${analysisConfig.comparableNumber.MIN_THRESHOLD} and ${analysisConfig.comparableNumber.MAX_THRESHOLD}`,
      );
    });

    it('should not throw if relativeThreshold is exactly at the minimum threshold', () => {
      const context = new AnalysisContextClass(
        {} as AnalysisQueryDto,
        testData.minSwingPoints().map((dp) => dp.getDataPoint()),
      );
      expect(() =>
        new TrendDetection({
          relativeThreshold: analysisConfig.comparableNumber.MIN_THRESHOLD, // Exakter Grenzwert
        }).execute(context),
      ).not.toThrow();
    });

    it('should not throw if relativeThreshold is exactly at the maximum threshold', () => {
      const context = new AnalysisContextClass(
        {} as AnalysisQueryDto,
        testData.minSwingPoints().map((dp) => dp.getDataPoint()),
      );
      expect(() =>
        new TrendDetection({
          relativeThreshold: analysisConfig.comparableNumber.MAX_THRESHOLD, // Exakter Grenzwert
        }).execute(context),
      ).not.toThrow();
    });

    it('should not throw if relativeThreshold is within the valid range', () => {
      const context = new AnalysisContextClass(
        {} as AnalysisQueryDto,
        testData.minSwingPoints().map((dp) => dp.getDataPoint()),
      );
      expect(() =>
        new TrendDetection({
          relativeThreshold: 0.05, // Gültiger Wert innerhalb der Grenzen
        }).execute(context),
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
      const context = new AnalysisContextClass(
        {} as AnalysisQueryDto,
        testcase.data.map((dp) => dp.getDataPoint()),
      );

      new TrendDetection(testcase.settings).execute(context);
      expect(context.getTrends()).toEqual(testcase.expectedTrends);
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
      const context = new AnalysisContextClass(
        {} as AnalysisQueryDto,
        testcase.data.map((dp) => dp.getDataPoint()),
      );

      new TrendDetection(testcase.settings).execute(context);
      expect(context.getTrends()).toEqual(testcase.expectedTrends);
    });
  });
});
