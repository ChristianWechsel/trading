import { AnalysisContextClass } from '../../../analysis/core/analysis-context';
import { TrendDataMetadata } from '../../../analysis/core/analysis.interface';
import { TrendDetection } from './trend-detection';
import { TrendDetectionTestdata } from './trend-detection.testdata';

export type TrendTestCase = {
  name: string;
  testcase: {
    expectedTrends: TrendDataMetadata['trendData'][];
    context: AnalysisContextClass;
  };
};

describe('Trend', () => {
  const testData = new TrendDetectionTestdata();

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
      new TrendDetection().execute(testcase.context);
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
      new TrendDetection().execute(testcase.context);
      expect(testcase.context.getTrends()).toEqual(testcase.expectedTrends);
    });
  });
});
