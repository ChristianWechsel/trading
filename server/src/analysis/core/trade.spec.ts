import { Trade } from './trade';

describe('Trade', () => {
  it('should return true for a profitable trade', () => {
    const trade = new Trade(
      { entryDate: '2024-01-01', entryPrice: 100 },
      { exitDate: '2024-01-02', exitPrice: 120 },
    );
    expect(trade.isProfitable()).toBe(true);
    expect(trade.getProfit()).toBe(20);
  });

  it('should return false for a losing trade', () => {
    const trade = new Trade(
      { entryDate: '2024-01-01', entryPrice: 150 },
      { exitDate: '2024-01-02', exitPrice: 100 },
    );
    expect(trade.isProfitable()).toBe(false);
    expect(trade.getProfit()).toBe(-50);
  });

  it('should return false for a breakeven trade', () => {
    const trade = new Trade(
      { entryDate: '2024-01-01', entryPrice: 200 },
      { exitDate: '2024-01-02', exitPrice: 200 },
    );
    expect(trade.isProfitable()).toBe(false);
    expect(trade.getProfit()).toBe(0);
  });

  it('should handle decimal prices correctly', () => {
    const trade = new Trade(
      { entryDate: '2024-01-01', entryPrice: 99.95 },
      { exitDate: '2024-01-02', exitPrice: 100.05 },
    );
    expect(trade.isProfitable()).toBe(true);
    expect(trade.getProfit()).toBeCloseTo(0.1, 5);
  });
});
