import { MIN_SWING_POINTS } from './parameters';
import { TrendTestData } from './testdata';
import { Trend } from './trend';

describe('Trend', () => {
  const testData = new TrendTestData();

  describe('Checking input data', () => {
    it('should throw if less than 3 swing points are provided', () => {
      expect(
        () =>
          new Trend(
            testData.lessThanMinSwingPoints(),
            testData.minDataPoints(),
          ),
      ).toThrow();
    });

    it('should throw with correct error message if less than 3 swing points are provided', () => {
      expect(
        () =>
          new Trend(
            [testData.lessThanMinSwingPoints()[0]],
            testData.minDataPoints(),
          ),
      ).toThrow(
        `swingPoints must be an array with at least ${MIN_SWING_POINTS} elements`,
      );
    });

    it('should not throw if at least 3 swing points are provided', () => {
      expect(
        () => new Trend(testData.minSwingPoints(), testData.minDataPoints()),
      ).not.toThrow();
    });

    it('should not throw if more than 3 swing points are provided', () => {
      expect(
        () =>
          new Trend(
            testData.moreThanMinSwingPoints(),
            testData.moreThanMinDataPoints(),
          ),
      ).not.toThrow();
    });

    it('should throw if data is less than MIN_SWING_POINTS', () => {
      const swingPoints = testData.minSwingPoints();
      expect(
        () => new Trend(swingPoints, testData.lessThanMinDataPoints()),
      ).toThrow(
        `data must be an array with at least ${MIN_SWING_POINTS} elements`,
      );
    });

    it('should not throw if data is at least MIN_SWING_POINTS', () => {
      const swingPoints = testData.minSwingPoints();
      expect(
        () => new Trend(swingPoints, testData.minDataPoints()),
      ).not.toThrow();
    });
  });

  describe('detectTrends', () => {
    it.each([
      ['upward trend', testData.upwardTrend()],
      ['downward trend', testData.downwardTrend()],
      ['upward trend not confirmed', testData.upwardTrendNotConfirmed()],
      ['downward trend not confirmed', testData.downwardTrendNotConfirmed()],
      [
        'upward trend not confirmed edge case',
        testData.upwardTrendNotConfirmedEdgeCase(),
      ],
      [
        'downward trend not confirmed edge case',
        testData.downwardTrendNotConfirmedEdgeCase(),
      ],
      ['upward trend infinite', testData.upwardTrendInfinite()],
      ['downward trend infinite', testData.downwardTrendInfinite()],
      [
        'upward trend continues without endpoint',
        testData.upwardTrendContinuesWithoutEndpoint(),
      ],
      [
        'upward trend breaks with lower low and lower high',
        testData.upwardTrendBreaksWithLowerLowAndLowerHigh(),
      ],
      [
        'downward trend continues without endpoint',
        testData.downwardTrendContinuesWithoutEndpoint(),
      ],
      [
        'downward trend breaks with higher high and higher low',
        testData.downwardTrendBreaksWithHigherHighAndHigherLow(),
      ],
    ])('should detect %s', (_desc, { swingPoints, data, result }) => {
      const trend = new Trend(swingPoints, data).detectTrends();
      expect(trend).toEqual(result);
    });
  });
});
