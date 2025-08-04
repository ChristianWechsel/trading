import { fixedFractionalSizing } from './fixed-fractional';

describe('fixedFractionalSizing', () => {
  const cash = 10000;
  const price = 100;

  it('should invest a fraction of the available cash', () => {
    const sizingStrategy = fixedFractionalSizing(0.25); // Invest 25%
    const shares = sizingStrategy(cash, price); // 2500 / 100
    expect(shares).toBe(25);
  });

  it('should invest 100% of the cash if fraction is 1', () => {
    const sizingStrategy = fixedFractionalSizing(1);
    const shares = sizingStrategy(cash, price); // 10000 / 100
    expect(shares).toBe(100);
  });

  it('should return 0 if the fraction is zero or negative', () => {
    const strategyZero = fixedFractionalSizing(0);
    expect(strategyZero(cash, price)).toBe(0);

    const strategyNegative = fixedFractionalSizing(-0.5);
    expect(strategyNegative(cash, price)).toBe(0);
  });

  it('should return 0 if the fraction is greater than 1', () => {
    const sizingStrategy = fixedFractionalSizing(1.1);
    expect(sizingStrategy(cash, price)).toBe(0);
  });

  it('should return 0 if price is zero or negative', () => {
    const sizingStrategy = fixedFractionalSizing(0.5);
    expect(sizingStrategy(cash, 0)).toBe(0);
    expect(sizingStrategy(cash, -10)).toBe(0);
  });

  it('should return 0 if cash is zero or negative', () => {
    const sizingStrategy = fixedFractionalSizing(0.5);
    expect(sizingStrategy(0, price)).toBe(0);
    expect(sizingStrategy(-100, price)).toBe(0);
  });

  it('should handle fractions correctly by flooring the result', () => {
    const sizingStrategy = fixedFractionalSizing(0.5); // Invest 50% of 10000 = 5000
    const shares = sizingStrategy(cash, 101); // 5000 / 101 = 49.5...
    expect(shares).toBe(49);
  });
});
