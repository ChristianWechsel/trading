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
    it('should detect upward trend', () => {
      const { swingPoints, data, result } = testData.upwardTrend();
      const trend = new Trend(swingPoints, data);

      expect(trend.detectTrends()).toEqual(result);
    });

    it('should detect downward trend', () => {
      const { swingPoints, data, result } = testData.downwardTrend();
      const trend = new Trend(swingPoints, data);

      expect(trend.detectTrends()).toEqual(result);
    });
  });
});
