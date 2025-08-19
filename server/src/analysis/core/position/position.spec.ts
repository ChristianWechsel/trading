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

  it('should calculate profit', () => {
    expect(position.getProfit()).toBe(10);
  });
});
