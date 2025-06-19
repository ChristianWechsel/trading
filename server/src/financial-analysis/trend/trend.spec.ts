import {
  MAX_THRESHOLD,
  MIN_THRESHOLD,
} from '../../digital-signal-processing/comparable-number/parameters';
import { TrendTestData } from './testdata';
import { Trend } from './trend';

describe('Trend', () => {
  const testData = new TrendTestData();

  describe('Checking input data', () => {
    it('should throw if less than 3 swing points are provided', () => {
      expect(
        () =>
          new Trend(testData.lessThanMinSwingPoints(), {
            relativeThreshold: 0.1,
          }),
      ).toThrow();
    });

    it('should not throw if at least 3 swing points are provided', () => {
      expect(
        () =>
          new Trend(testData.minSwingPoints(), {
            relativeThreshold: 0.1,
          }),
      ).not.toThrow();
    });

    it('should not throw if more than 3 swing points are provided', () => {
      expect(
        () =>
          new Trend(testData.moreThanMinSwingPoints(), {
            relativeThreshold: 0.1,
          }),
      ).not.toThrow();
    });

    it('should throw if relativeThreshold is below the minimum threshold', () => {
      expect(
        () =>
          new Trend(testData.minSwingPoints(), {
            relativeThreshold: -0.1, // Wert unter MIN_THRESHOLD (angenommen 0)
          }),
      ).toThrow(
        `relativeThreshold must be between ${MIN_THRESHOLD} and ${MAX_THRESHOLD}`,
      );
    });

    it('should throw if relativeThreshold is above the maximum threshold', () => {
      expect(
        () =>
          new Trend(testData.minSwingPoints(), {
            relativeThreshold: 1.1, // Wert über MAX_THRESHOLD (angenommen 1)
          }),
      ).toThrow(
        `relativeThreshold must be between ${MIN_THRESHOLD} and ${MAX_THRESHOLD}`,
      );
    });

    it('should not throw if relativeThreshold is exactly at the minimum threshold', () => {
      expect(
        () =>
          new Trend(testData.minSwingPoints(), {
            relativeThreshold: MIN_THRESHOLD, // Exakter Grenzwert
          }),
      ).not.toThrow();
    });

    it('should not throw if relativeThreshold is exactly at the maximum threshold', () => {
      expect(
        () =>
          new Trend(testData.minSwingPoints(), {
            relativeThreshold: MAX_THRESHOLD, // Exakter Grenzwert
          }),
      ).not.toThrow();
    });

    it('should not throw if relativeThreshold is within the valid range', () => {
      expect(
        () =>
          new Trend(testData.minSwingPoints(), {
            relativeThreshold: 0.05, // Gültiger Wert innerhalb der Grenzen
          }),
      ).not.toThrow();
    });
  });

  // describe('detectTrends', () => {
  //   it.each([
  //     ['upward trend', testData.upwardTrend()],
  //     ['downward trend', testData.downwardTrend()],
  //     ['upward trend not confirmed', testData.upwardTrendNotConfirmed()],
  //     ['downward trend not confirmed', testData.downwardTrendNotConfirmed()],
  //     [
  //       'upward trend not confirmed edge case',
  //       testData.upwardTrendNotConfirmedEdgeCase(),
  //     ],
  //     [
  //       'downward trend not confirmed edge case',
  //       testData.downwardTrendNotConfirmedEdgeCase(),
  //     ],
  //     ['upward trend infinite', testData.upwardTrendInfinite()],
  //     ['downward trend infinite', testData.downwardTrendInfinite()],
  //     [
  //       'upward trend continues without endpoint',
  //       testData.upwardTrendContinuesWithoutEndpoint(),
  //     ],
  //     [
  //       'upward trend breaks with lower low and lower high',
  //       testData.upwardTrendBreaksWithLowerLowAndLowerHigh(),
  //     ],
  //     [
  //       'downward trend continues without endpoint',
  //       testData.downwardTrendContinuesWithoutEndpoint(),
  //     ],
  //     [
  //       'downward trend breaks with higher high and higher low',
  //       testData.downwardTrendBreaksWithHigherHighAndHigherLow(),
  //     ],
  //     [
  //       'upward trend recovers after warning',
  //       testData.upwardTrendRecoversAfterWarning(),
  //     ],
  //     [
  //       'downward trend breaks after warning',
  //       testData.downwardTrendBreaksAfterWarning(),
  //     ],
  //     [
  //       'downward trend recovers after warning',
  //       testData.downwardTrendRecoversAfterWarning(),
  //     ],
  //     [
  //       'upward trend followed by downward trend',
  //       testData.upwardTrendFollowedByDownwardTrend(),
  //     ],
  //     [
  //       'downward trend followed by upward trend',
  //       testData.downwardTrendFollowedByUpwardTrend(),
  //     ],
  //     [
  //       'trend followed by choppy period then new trend. Special Case.',
  //       testData.trendFollowedByChoppyPeriodThenNewTrend(),
  //     ],
  //     [
  //       'trend followed by choppy period then new trend',
  //       testData.trendBreaksFollowedByGapThenNewTrend(),
  //     ],
  //   ])('should detect %s', (_desc, { swingPoints, data, result }) => {
  //     const trend = new Trend(swingPoints, data, {
  //       relativeThreshold: 0.01,
  //     }).detectTrends();
  //     expect(trend).toEqual(result);
  //   });
  // });

  // describe('Trend with Thresholds', () => {
  //   const testData = new TrendTestData();

  //   it.each([
  //     [
  //       'should NOT confirm upward trend if low is not significantly higher',
  //       testData.upwardTrendFailsDueToInsufficientlyHigherLow(),
  //     ],
  //     [
  //       'should NOT confirm downward trend if high is not significantly lower',
  //       testData.downwardTrendFailsDueToInsufficientlyLowerHigh(),
  //     ],
  //     [
  //       'should BREAK upward trend if new high is not significantly higher',
  //       testData.upwardTrendBreaksDueToStallingHigh(),
  //     ],
  //     [
  //       'should BREAK downward trend if new low is not significantly lower',
  //       testData.downwardTrendBreaksDueToStallingLow(),
  //     ],
  //     [
  //       'should NOT detect up/down trend during sideways movement',
  //       testData.sidewaysTrendRecognizedAsNoUpDownTrend(),
  //     ],
  //   ])('%s', (_desc, { swingPoints, data, result }) => {
  //     // Annahme: Der Threshold wird über den Konstruktor oder eine Methode gesetzt.
  //     const trend = new Trend(swingPoints, data, {
  //       relativeThreshold: 0.01,
  //     }).detectTrends();
  //     expect(trend).toEqual(result);
  //   });
  // });
});
