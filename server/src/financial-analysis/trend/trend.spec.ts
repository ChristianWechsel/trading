import { MIN_SWING_POINTS } from './parameters';
import { TrendTestData } from './testdata';
import { Trend } from './trend';

describe('Trend', () => {
  const testData = new TrendTestData();

  describe('Checking input data', () => {
    it('should throw if less than 3 swing points are provided', () => {
      expect(() => new Trend(testData.lessThanMinSwingPoints())).toThrow();
    });

    it('should throw with correct error message if less than 3 swing points are provided', () => {
      expect(() => new Trend([testData.lessThanMinSwingPoints()[0]])).toThrow(
        `swingPoints must be an array with at least ${MIN_SWING_POINTS} elements`,
      );
    });

    it('should not throw if at least 3 swing points are provided', () => {
      expect(() => new Trend(testData.minSwingPoints())).not.toThrow();
    });

    it('should not throw if more than 3 swing points are provided', () => {
      expect(() => new Trend(testData.moreThanMinSwingPoints())).not.toThrow();
    });
  });
});
