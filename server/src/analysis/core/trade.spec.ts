import { Trade } from './trade';

describe('Trade', () => {
  it('should return true for a profitable trade', () => {
    const trade = new Trade({
      entry: { date: '2024-01-01', price: 100 },
      exit: { date: '2024-01-02', price: 120 },
    });

    expect(trade.isProfitable()).toBe(true);
    expect(trade.getProfit()).toBe(20);
  });

  it('should return false for a losing trade', () => {
    const trade = new Trade({
      entry: { date: '2024-01-01', price: 150 },
      exit: { date: '2024-01-02', price: 100 },
    });
    expect(trade.isProfitable()).toBe(false);
    expect(trade.getProfit()).toBe(-50);
  });

  it('should return false for a breakeven trade', () => {
    const trade = new Trade({
      entry: { date: '2024-01-01', price: 200 },
      exit: { date: '2024-01-02', price: 200 },
    });
    expect(trade.isProfitable()).toBe(false);
    expect(trade.getProfit()).toBe(0);
  });

  it('should handle decimal prices correctly', () => {
    const trade = new Trade({
      entry: { date: '2024-01-01', price: 99.95 },
      exit: { date: '2024-01-02', price: 100.05 },
    });
    expect(trade.isProfitable()).toBe(true);
    expect(trade.getProfit()).toBeCloseTo(0.1, 5);
  });
});
