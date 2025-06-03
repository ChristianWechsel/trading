import { ComparableNumber } from './comparable-number';

describe('ComparableNumber', () => {
  describe('constructor', () => {
    it.each([
      ['should create instance with valid threshold 0', 0, false],
      ['should create instance with valid threshold 1', 1, false],
      ['should throw with threshold < 0', -0.01, true],
      ['should throw with threshold > 1', 1.01, true],
    ])('%s', (_desc, threshold, shouldThrow) => {
      if (shouldThrow) {
        expect(() => new ComparableNumber(100, threshold)).toThrow();
      } else {
        expect(() => new ComparableNumber(100, threshold)).not.toThrow();
      }
    });
  });

  describe('isCloseEnough', () => {
    it('should return true for identical values', () => {
      const a = new ComparableNumber(5, 0.1);
      const b = new ComparableNumber(5, 0.1);
      expect(a.isCloseEnough(b)).toBe(true);
    });

    it('should return true if relative difference is exactly threshold', () => {
      const a = new ComparableNumber(10, 0.2);
      const b = new ComparableNumber(8, 0.2); // diff = 2/10 = 0.2
      expect(a.isCloseEnough(b)).toBe(true);
    });

    it('should return false if relative difference is just above threshold', () => {
      const a = new ComparableNumber(10, 0.19);
      const b = new ComparableNumber(8, 0.19); // diff = 2/10 = 0.2
      expect(a.isCloseEnough(b)).toBe(false);
    });

    it('should handle zero values correctly', () => {
      const a = new ComparableNumber(0, 0.5);
      const b = new ComparableNumber(0, 0.5);
      expect(a.isCloseEnough(b)).toBe(true);
    });

    it('should handle one zero and one non-zero value', () => {
      const a = new ComparableNumber(0, 0.5);
      const b = new ComparableNumber(1, 0.5);
      expect(a.isCloseEnough(b)).toBe(false);
    });

    it('should return false for negative values outside threshold', () => {
      const a = new ComparableNumber(-10, 0.1);
      const b = new ComparableNumber(-12, 0.1);
      expect(a.isCloseEnough(b)).toBe(false);
    });

    it('should return true for negative values within threshold', () => {
      const a = new ComparableNumber(-10, 0.1);
      const c = new ComparableNumber(-10.5, 0.1);
      expect(a.isCloseEnough(c)).toBe(true);
    });
  });

  describe('isSignificantlyHigherThan', () => {
    it('should return false if values are equal', () => {
      const a = new ComparableNumber(5, 0.1);
      const b = new ComparableNumber(5, 0.1);
      expect(a.isSignificantlyHigherThan(b)).toBe(false);
    });

    it('should return true if value is just above threshold', () => {
      const a = new ComparableNumber(11.01, 0.1);
      const b = new ComparableNumber(10, 0.1);
      expect(a.isSignificantlyHigherThan(b)).toBe(true);
    });

    it('should return false if value is exactly at threshold', () => {
      const a = new ComparableNumber(11, 0.1);
      const b = new ComparableNumber(10, 0.1);
      // 10 * (1 + 0.1) = 11, so a.value == threshold
      expect(a.isSignificantlyHigherThan(b)).toBe(false);
    });

    it('should handle negative values', () => {
      const a = new ComparableNumber(-8, 0.1);
      const b = new ComparableNumber(-10, 0.1);
      expect(a.isSignificantlyHigherThan(b)).toBe(true);
    });
  });

  describe('isSignificantlyLowerThan', () => {
    it('should return false if values are equal', () => {
      const a = new ComparableNumber(5, 0.1);
      const b = new ComparableNumber(5, 0.1);
      expect(a.isSignificantlyLowerThan(b)).toBe(false);
    });

    it('should return true if value is just below threshold', () => {
      const a = new ComparableNumber(8.9, 0.1);
      const b = new ComparableNumber(10, 0.1);
      expect(a.isSignificantlyLowerThan(b)).toBe(true);
    });

    it('should return false if value is exactly at threshold', () => {
      const a = new ComparableNumber(9, 0.1);
      const b = new ComparableNumber(10, 0.1);
      // 10 * (1 - 0.1) = 9, so a.value == threshold
      expect(a.isSignificantlyLowerThan(b)).toBe(false);
    });

    it('should handle negative values', () => {
      const a = new ComparableNumber(-12, 0.1);
      const b = new ComparableNumber(-10, 0.1);
      expect(a.isSignificantlyLowerThan(b)).toBe(true);
    });
  });
});
