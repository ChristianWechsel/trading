import { RelativeComparableNumber } from './relative-comparable-number';

describe('RelativeComparableNumber', () => {
  describe('constructor', () => {
    it('should create instance with valid parameters', () => {
      expect(() => new RelativeComparableNumber(100, 0.1)).not.toThrow();
    });

    it('should create instance with zero threshold', () => {
      expect(() => new RelativeComparableNumber(100, 0)).not.toThrow();
    });

    it('should create instance with negative value', () => {
      expect(() => new RelativeComparableNumber(-50, 0.2)).not.toThrow();
    });
  });

  describe('isCloseEnough', () => {
    it('should return true for identical values', () => {
      const a = new RelativeComparableNumber(5, 0.1);
      const b = new RelativeComparableNumber(5, 0.1);
      expect(a.isCloseEnough(b)).toBe(true);
    });

    it('should return true when both values are zero', () => {
      const a = new RelativeComparableNumber(0, 0.1);
      const b = new RelativeComparableNumber(0, 0.1);
      expect(a.isCloseEnough(b)).toBe(true);
    });

    it('should return true if relative difference is exactly threshold', () => {
      const a = new RelativeComparableNumber(10, 0.2);
      const b = new RelativeComparableNumber(8, 0.2); // diff = 2/10 = 0.2
      expect(a.isCloseEnough(b)).toBe(true);
    });

    it('should return false if relative difference is above threshold', () => {
      const a = new RelativeComparableNumber(10, 0.19);
      const b = new RelativeComparableNumber(8, 0.19); // diff = 2/10 = 0.2
      expect(a.isCloseEnough(b)).toBe(false);
    });

    it('should handle one zero and one non-zero value', () => {
      const a = new RelativeComparableNumber(0, 0.5);
      const b = new RelativeComparableNumber(1, 0.5);
      // denominator = max(0, 1) = 1, diff = 1/1 = 1.0 > 0.5
      expect(a.isCloseEnough(b)).toBe(false);
    });

    it('should handle negative values within threshold', () => {
      const a = new RelativeComparableNumber(-10, 0.1);
      const b = new RelativeComparableNumber(-10.5, 0.1);
      // diff = 0.5/10.5 ≈ 0.048 < 0.1
      expect(a.isCloseEnough(b)).toBe(true);
    });

    it('should handle negative values outside threshold', () => {
      const a = new RelativeComparableNumber(-10, 0.1);
      const b = new RelativeComparableNumber(-12, 0.1);
      // diff = 2/12 ≈ 0.167 > 0.1
      expect(a.isCloseEnough(b)).toBe(false);
    });

    it('should handle mixed positive and negative values', () => {
      const a = new RelativeComparableNumber(5, 0.1);
      const b = new RelativeComparableNumber(-5, 0.1);
      // diff = 10/5 = 2.0 > 0.1
      expect(a.isCloseEnough(b)).toBe(false);
    });

    it('should use larger absolute value as denominator', () => {
      const a = new RelativeComparableNumber(2, 0.5);
      const b = new RelativeComparableNumber(10, 0.5);
      // diff = 8/10 = 0.8 > 0.5
      expect(a.isCloseEnough(b)).toBe(false);
    });
  });

  describe('isSignificantlyHigherThan', () => {
    it('should return false if values are equal', () => {
      const a = new RelativeComparableNumber(5, 0.1);
      const b = new RelativeComparableNumber(5, 0.1);
      expect(a.isSignificantlyHigherThan(b)).toBe(false);
    });

    it('should return true if value is significantly higher', () => {
      const a = new RelativeComparableNumber(11.01, 0.1);
      const b = new RelativeComparableNumber(10, 0.1);
      // 11.01 > 10 * (1 + 0.1) = 11
      expect(a.isSignificantlyHigherThan(b)).toBe(true);
    });

    it('should return false if value is exactly at threshold', () => {
      const a = new RelativeComparableNumber(11, 0.1);
      const b = new RelativeComparableNumber(10, 0.1);
      // 11 = 10 * (1 + 0.1) = 11
      expect(a.isSignificantlyHigherThan(b)).toBe(false);
    });

    it('should handle negative values correctly', () => {
      const a = new RelativeComparableNumber(-8, 0.1);
      const b = new RelativeComparableNumber(-10, 0.1);
      // -8 > -10 * (1 + 0.1) = -11
      expect(a.isSignificantlyHigherThan(b)).toBe(true);
    });

    it('should return false for negative first value being lower', () => {
      const a = new RelativeComparableNumber(-12, 0.1);
      const b = new RelativeComparableNumber(-10, 0.1);
      // -12 < -10 * (1 + 0.1) = -11
      expect(a.isSignificantlyHigherThan(b)).toBe(false);
    });

    it('should handle zero comparison value', () => {
      const a = new RelativeComparableNumber(1, 0.1);
      const b = new RelativeComparableNumber(0, 0.1);
      // 1 > 0 * (1 + 0.1) = 0
      expect(a.isSignificantlyHigherThan(b)).toBe(true);
    });
  });

  describe('isSignificantlyLowerThan', () => {
    it('should return false if values are equal', () => {
      const a = new RelativeComparableNumber(5, 0.1);
      const b = new RelativeComparableNumber(5, 0.1);
      expect(a.isSignificantlyLowerThan(b)).toBe(false);
    });

    it('should return true if value is significantly lower', () => {
      const a = new RelativeComparableNumber(8.99, 0.1);
      const b = new RelativeComparableNumber(10, 0.1);
      // 8.99 < 10 * (1 - 0.1) = 9
      expect(a.isSignificantlyLowerThan(b)).toBe(true);
    });

    it('should return false if value is exactly at threshold', () => {
      const a = new RelativeComparableNumber(9, 0.1);
      const b = new RelativeComparableNumber(10, 0.1);
      // 9 = 10 * (1 - 0.1) = 9
      expect(a.isSignificantlyLowerThan(b)).toBe(false);
    });

    it('should handle negative values correctly', () => {
      const a = new RelativeComparableNumber(-12, 0.1);
      const b = new RelativeComparableNumber(-10, 0.1);
      // -12 < -10 * (1 - 0.1) = -9
      expect(a.isSignificantlyLowerThan(b)).toBe(true);
    });

    it('should return false for negative first value being higher', () => {
      const a = new RelativeComparableNumber(-8, 0.1);
      const b = new RelativeComparableNumber(-10, 0.1);
      // -8 > -10 * (1 - 0.1) = -9
      expect(a.isSignificantlyLowerThan(b)).toBe(false);
    });

    it('should handle zero comparison value', () => {
      const a = new RelativeComparableNumber(-1, 0.1);
      const b = new RelativeComparableNumber(0, 0.1);
      // -1 < 0 * (1 - 0.1) = 0
      expect(a.isSignificantlyLowerThan(b)).toBe(true);
    });
  });

  describe('getValue', () => {
    it('should return the correct positive value', () => {
      const number = 123.45;
      const comparable = new RelativeComparableNumber(number, 0.1);
      expect(comparable.getValue()).toBe(number);
    });

    it('should return the correct negative value', () => {
      const number = -50;
      const comparable = new RelativeComparableNumber(number, 0.1);
      expect(comparable.getValue()).toBe(number);
    });

    it('should return the correct zero value', () => {
      const number = 0;
      const comparable = new RelativeComparableNumber(number, 0.1);
      expect(comparable.getValue()).toBe(number);
    });
  });
});
