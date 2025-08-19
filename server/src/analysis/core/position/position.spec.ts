import { TickerDto } from '../../../data-aggregation/data-aggregation.dto';
import { TransactionData } from '../transaction/transaction';
import { Position } from './position';

describe('Position', () => {
  let position: Position;
  const ticker: TickerDto = { symbol: 'AAPL', exchange: 'NASDAQ' };

  beforeEach(() => {
    position = new Position(ticker);
  });

  it('should be created', () => {
    expect(position).toBeInstanceOf(Position);
  });

  it('should identify position by ticker', () => {
    expect(position.isPosition({ symbol: 'AAPL', exchange: 'NASDAQ' })).toBe(
      true,
    );
    expect(position.isPosition({ symbol: 'GOOGL', exchange: 'NASDAQ' })).toBe(
      false,
    );
  });

  it('should return correct identifier', () => {
    expect(position.getIdentifier()).toBe('AAPL NASDAQ');
  });

  it('should add buy transaction', () => {
    const buyOrder: TransactionData = {
      date: new Date('2025-08-19'),
      price: 200,
      shares: 10,
      type: 'buy',
      reason: 'Upward trend started',
    };
    position.buy(buyOrder);
    expect(position.getTransactions()).toHaveLength(1);
    expect(position.getTransactions()[0].getType()).toBe('buy');
    expect(position.getTransactions()[0].getShares()).toBe(10);
  });

  it('should add sell transaction', () => {
    const sellOrder: TransactionData = {
      date: new Date('2025-08-19'),
      price: 210,
      shares: 5,
      type: 'sell',
      reason: 'Upward trend ended',
    };
    position.sell(sellOrder);
    expect(position.getTransactions()).toHaveLength(1);
    expect(position.getTransactions()[0].getType()).toBe('sell');
    expect(position.getTransactions()[0].getShares()).toBe(5);
  });

  it('should set stops', () => {
    position.setStops({ loss: 190, profit: 220 });

    // Buy some shares first
    position.buy({
      date: new Date('2025-08-19'),
      price: 200,
      shares: 10,
      type: 'buy',
      reason: 'Upward trend started',
    });

    // Test stop loss
    position.calc({ date: new Date('2025-08-20'), price: 185 });
    expect(position.getTransactions()).toHaveLength(2);
    expect(position.getTransactions()[1].getType()).toBe('sell');

    // Reset position
    position = new Position(ticker);
    position.setStops({ loss: 190, profit: 220 });

    // Buy some shares
    position.buy({
      date: new Date('2025-08-19'),
      price: 200,
      shares: 10,
      type: 'buy',
      reason: 'Upward trend started',
    });

    // Test take profit
    position.calc({ date: new Date('2025-08-20'), price: 225 });
    expect(position.getTransactions()).toHaveLength(2);
    expect(position.getTransactions()[1].getType()).toBe('sell');
  });

  it('should calculate profit for one buy and one sell transaction', () => {
    // Buy 10 shares at $100 each
    position.buy({
      date: new Date('2025-08-19'),
      price: 100,
      shares: 10,
      type: 'buy',
      reason: 'Upward trend started',
    });

    // Sell 10 shares at $120 each
    position.sell({
      date: new Date('2025-08-25'),
      price: 120,
      shares: 10,
      type: 'sell',
      reason: 'take-profit',
    });

    // Profit should be (120 - 100) * 10 = $200
    expect(position.getProfit()).toBe(200);
  });

  it('should calculate profit for multiple buys and one sell with different prices', () => {
    // Buy 5 shares at $100 each
    position.buy({
      date: new Date('2025-08-19'),
      price: 100,
      shares: 5,
      type: 'buy',
      reason: 'Upward trend started',
    });

    // Buy 8 shares at $110 each
    position.buy({
      date: new Date('2025-08-20'),
      price: 110,
      shares: 8,
      type: 'buy',
      reason: 'Upward trend started',
    });

    // Sell all 13 shares at $120 each
    position.sell({
      date: new Date('2025-08-25'),
      price: 120,
      shares: 13,
      type: 'sell',
      reason: 'Upward trend ended',
    });

    // Profit should be (120 - 100) * 5 + (120 - 110) * 8 = $100 + $80 = $180
    expect(position.getProfit()).toBe(180);
  });

  it('should calculate profit using FIFO when partially selling shares', () => {
    // Buy 5 shares at $100 each
    position.buy({
      date: new Date('2025-08-19'),
      price: 100,
      shares: 5,
      type: 'buy',
      reason: 'Upward trend started',
    });

    // Buy 8 shares at $110 each
    position.buy({
      date: new Date('2025-08-20'),
      price: 110,
      shares: 8,
      type: 'buy',
      reason: 'Upward trend started',
    });

    // Sell only 7 shares at $120 each (5 from first buy, 2 from second buy)
    position.sell({
      date: new Date('2025-08-25'),
      price: 120,
      shares: 7,
      type: 'sell',
      reason: 'Upward trend ended',
    });

    // Profit should be (120 - 100) * 5 + (120 - 110) * 2 = $100 + $20 = $120
    expect(position.getProfit()).toBe(120);
  });

  it('should calculate profit for multiple buys and multiple sells', () => {
    // Buy 10 shares at $100 each
    position.buy({
      date: new Date('2025-08-19'),
      price: 100,
      shares: 10,
      type: 'buy',
      reason: 'Upward trend started',
    });

    // Buy 5 shares at $90 each
    position.buy({
      date: new Date('2025-08-20'),
      price: 90,
      shares: 5,
      type: 'buy',
      reason: 'Upward trend started',
    });

    // Sell 7 shares at $110 each
    position.sell({
      date: new Date('2025-08-25'),
      price: 110,
      shares: 7,
      type: 'sell',
      reason: 'Upward trend ended',
    });

    // Buy 3 shares at $105 each
    position.buy({
      date: new Date('2025-08-28'),
      price: 105,
      shares: 3,
      type: 'buy',
      reason: 'Upward trend started',
    });

    // Sell 6 shares at $120 each
    position.sell({
      date: new Date('2025-08-30'),
      price: 120,
      shares: 6,
      type: 'sell',
      reason: 'Upward trend ended',
    });

    // Profit calculation (FIFO):
    // First sell: (110 - 100) * 7 = $70
    // Second sell: (120 - 100) * 3 + (120 - 90) * 3 = $60 + $90 = $150
    // Total profit: $70 + $150 = $220
    expect(position.getProfit()).toBe(220);
  });

  it('should calculate losses when selling at lower prices', () => {
    // Buy 10 shares at $100 each
    position.buy({
      date: new Date('2025-08-19'),
      price: 100,
      shares: 10,
      type: 'buy',
      reason: 'Upward trend started',
    });

    // Buy 5 shares at $90 each
    position.buy({
      date: new Date('2025-08-20'),
      price: 90,
      shares: 5,
      type: 'buy',
      reason: 'Upward trend started',
    });

    // Sell 8 shares at $80 each (at a loss)
    position.sell({
      date: new Date('2025-08-25'),
      price: 80,
      shares: 8,
      type: 'sell',
      reason: 'Upward trend ended',
    });

    // Loss calculation (FIFO):
    // Sell 8 shares: (80 - 100) * 8 = -$160
    expect(position.getProfit()).toBe(-160);
  });
});
