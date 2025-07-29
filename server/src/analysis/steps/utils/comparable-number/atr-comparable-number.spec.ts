import { ATRComparableNumber } from './atr-comparable-number';

describe('ATRComparableNumber', () => {
  describe('constructor', () => {
    it('should create instance with valid parameters', () => {
      expect(() => new ATRComparableNumber(100, 2.5, 1.5)).not.toThrow();
    });

    it('should create instance with zero ATR value', () => {
      expect(() => new ATRComparableNumber(100, 0, 1.5)).not.toThrow();
    });

    it('should create instance with zero ATR factor', () => {
      expect(() => new ATRComparableNumber(100, 2.5, 0)).not.toThrow();
    });

    it('should create instance with negative value', () => {
      expect(() => new ATRComparableNumber(-50, 2.5, 1.5)).not.toThrow();
    });
  });

  describe('isCloseEnough', () => {
    it('should return true for identical values', () => {
      const a = new ATRComparableNumber(100, 2, 1);
      const b = new ATRComparableNumber(100, 2, 1);
      expect(a.isCloseEnough(b)).toBe(true);
    });

    it('should return true when difference equals ATR threshold', () => {
      const a = new ATRComparableNumber(100, 2, 1);
      const b = new ATRComparableNumber(98, 2, 1);
      // threshold = 2 * 1 = 2, diff = |100 - 98| = 2
      expect(a.isCloseEnough(b)).toBe(true);
    });

    it('should return false when difference exceeds ATR threshold', () => {
      const a = new ATRComparableNumber(100, 2, 1);
      const b = new ATRComparableNumber(97.5, 2, 1);
      // threshold = 2 * 1 = 2, diff = |100 - 97.5| = 2.5 > 2
      expect(a.isCloseEnough(b)).toBe(false);
    });

    it('should handle zero ATR value', () => {
      const a = new ATRComparableNumber(100, 0, 1.5);
      const b = new ATRComparableNumber(100.1, 0, 1.5);
      // threshold = 0 * 1.5 = 0, diff = 0.1 > 0
      expect(a.isCloseEnough(b)).toBe(false);
    });

    it('should handle zero ATR factor', () => {
      const a = new ATRComparableNumber(100, 2.5, 0);
      const b = new ATRComparableNumber(105, 2.5, 0);
      // threshold = 2.5 * 0 = 0, diff = 5 > 0
      expect(a.isCloseEnough(b)).toBe(false);
    });

    it('should work with negative values', () => {
      const a = new ATRComparableNumber(-100, 3, 0.5);
      const b = new ATRComparableNumber(-98.5, 3, 0.5);
      // threshold = 3 * 0.5 = 1.5, diff = |-100 - (-98.5)| = 1.5
      expect(a.isCloseEnough(b)).toBe(true);
    });

    it('should work with fractional ATR values', () => {
      const a = new ATRComparableNumber(50, 1.25, 2);
      const b = new ATRComparableNumber(47.5, 1.25, 2);
      // threshold = 1.25 * 2 = 2.5, diff = |50 - 47.5| = 2.5
      expect(a.isCloseEnough(b)).toBe(true);
    });

    it('should handle large ATR factor', () => {
      const a = new ATRComparableNumber(10, 1, 10);
      const b = new ATRComparableNumber(5, 1, 10);
      // threshold = 1 * 10 = 10, diff = |10 - 5| = 5 < 10
      expect(a.isCloseEnough(b)).toBe(true);
    });
  });

  describe('isSignificantlyHigherThan', () => {
    it('should return false if values are equal', () => {
      const a = new ATRComparableNumber(100, 2, 1);
      const b = new ATRComparableNumber(100, 2, 1);
      expect(a.isSignificantlyHigherThan(b)).toBe(false);
    });

    it('should return true if value exceeds other by ATR threshold', () => {
      const a = new ATRComparableNumber(105, 2, 1);
      const b = new ATRComparableNumber(102, 2, 1);
      // threshold = 2 * 1 = 2, 105 > 102 + 2 = 104
      expect(a.isSignificantlyHigherThan(b)).toBe(true);
    });

    it('should return false if value equals other plus ATR threshold', () => {
      const a = new ATRComparableNumber(104, 2, 1);
      const b = new ATRComparableNumber(102, 2, 1);
      // threshold = 2 * 1 = 2, 104 = 102 + 2
      expect(a.isSignificantlyHigherThan(b)).toBe(false);
    });

    it('should handle negative values', () => {
      const a = new ATRComparableNumber(-95, 2, 1);
      const b = new ATRComparableNumber(-100, 2, 1);
      // threshold = 2 * 1 = 2, -95 > -100 + 2 = -98
      expect(a.isSignificantlyHigherThan(b)).toBe(true);
    });

    it('should handle zero ATR threshold', () => {
      const a = new ATRComparableNumber(100.1, 0, 1);
      const b = new ATRComparableNumber(100, 0, 1);
      // threshold = 0 * 1 = 0, 100.1 > 100 + 0
      expect(a.isSignificantlyHigherThan(b)).toBe(true);
    });

    it('should work with fractional differences', () => {
      const a = new ATRComparableNumber(102.5, 1.2, 2);
      const b = new ATRComparableNumber(100, 1.2, 2);
      // threshold = 1.2 * 2 = 2.4, 102.5 > 100 + 2.4 = 102.4
      expect(a.isSignificantlyHigherThan(b)).toBe(true);
    });
  });

  describe('isSignificantlyLowerThan', () => {
    it('should return false if values are equal', () => {
      const a = new ATRComparableNumber(100, 2, 1);
      const b = new ATRComparableNumber(100, 2, 1);
      expect(a.isSignificantlyLowerThan(b)).toBe(false);
    });

    it('should return true if value is below other minus ATR threshold', () => {
      const a = new ATRComparableNumber(95, 2, 1);
      const b = new ATRComparableNumber(100, 2, 1);
      // threshold = 2 * 1 = 2, 95 < 100 - 2 = 98
      expect(a.isSignificantlyLowerThan(b)).toBe(true);
    });

    it('should return false if value equals other minus ATR threshold', () => {
      const a = new ATRComparableNumber(98, 2, 1);
      const b = new ATRComparableNumber(100, 2, 1);
      // threshold = 2 * 1 = 2, 98 = 100 - 2
      expect(a.isSignificantlyLowerThan(b)).toBe(false);
    });

    it('should handle negative values', () => {
      const a = new ATRComparableNumber(-105, 2, 1);
      const b = new ATRComparableNumber(-100, 2, 1);
      // threshold = 2 * 1 = 2, -105 < -100 - 2 = -102
      expect(a.isSignificantlyLowerThan(b)).toBe(true);
    });

    it('should handle zero ATR threshold', () => {
      const a = new ATRComparableNumber(99.9, 0, 1);
      const b = new ATRComparableNumber(100, 0, 1);
      // threshold = 0 * 1 = 0, 99.9 < 100 - 0
      expect(a.isSignificantlyLowerThan(b)).toBe(true);
    });

    it('should work with fractional differences', () => {
      const a = new ATRComparableNumber(97.5, 1.2, 2);
      const b = new ATRComparableNumber(100, 1.2, 2);
      // threshold = 1.2 * 2 = 2.4, 97.5 < 100 - 2.4 = 97.6
      expect(a.isSignificantlyLowerThan(b)).toBe(true);
    });

    it('should return false when difference is just within threshold', () => {
      const a = new ATRComparableNumber(97.7, 1.2, 2);
      const b = new ATRComparableNumber(100, 1.2, 2);
      // threshold = 1.2 * 2 = 2.4, 97.7 > 100 - 2.4 = 97.6
      expect(a.isSignificantlyLowerThan(b)).toBe(false);
    });
  });

  describe('getValue', () => {
    it('should return the correct positive value', () => {
      const number = 123.45;
      const comparable = new ATRComparableNumber(number, 2.5, 1.5);
      expect(comparable.getValue()).toBe(number);
    });

    it('should return the correct negative value', () => {
      const number = -50;
      const comparable = new ATRComparableNumber(number, 2.5, 1.5);
      expect(comparable.getValue()).toBe(number);
    });

    it('should return the correct zero value', () => {
      const number = 0;
      const comparable = new ATRComparableNumber(number, 2.5, 1.5);
      expect(comparable.getValue()).toBe(number);
    });
  });
});
