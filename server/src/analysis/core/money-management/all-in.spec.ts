import { allInSizing } from './all-in';

describe('allInSizing', () => {
  it('should calculate the correct number of shares for the available cash', () => {
    const shares = allInSizing(1000, 150); // 1000 / 150 = 6.66...
    expect(shares).toBe(6);
  });

  it('should return 0 if cash is zero', () => {
    const shares = allInSizing(0, 150);
    expect(shares).toBe(0);
  });

  it('should return 0 if price is zero', () => {
    const shares = allInSizing(1000, 0);
    expect(shares).toBe(0);
  });

  it('should return 0 if price is negative', () => {
    const shares = allInSizing(1000, -10);
    expect(shares).toBe(0);
  });

  it('should return 0 if cash is negative', () => {
    const shares = allInSizing(-1000, 10);
    expect(shares).toBe(0);
  });

  it('should handle exact multiples correctly', () => {
    const shares = allInSizing(1500, 150);
    expect(shares).toBe(10);
  });

  it('should handle cases where cash is less than price', () => {
    const shares = allInSizing(100, 150);
    expect(shares).toBe(0);
  });
});
