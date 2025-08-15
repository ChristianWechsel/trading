import { TickerDto } from '../../../data-aggregation/data-aggregation.dto';
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

  describe('transactions and shares calculation', () => {
    it('should have zero shares initially', () => {
      // @ts-expect-error testing private method
      expect(position.getCurrentShares()).toBe(0);
    });

    it('should calculate current shares correctly after buying', () => {
      position.buy({
        date: new Date(),
        price: 150,
        shares: 10,
        type: 'buy',
        reason: 'Upward trend started',
      });
      // @ts-expect-error testing private method
      expect(position.getCurrentShares()).toBe(10);
    });

    it('should calculate current shares correctly after multiple buys', () => {
      position.buy({
        date: new Date(),
        price: 150,
        shares: 10,
        type: 'buy',
        reason: 'Upward trend started',
      });
      position.buy({
        date: new Date(),
        price: 155,
        shares: 5,
        type: 'buy',
        reason: 'Upward trend started',
      });
      // @ts-expect-error testing private method
      expect(position.getCurrentShares()).toBe(15);
    });

    it('should calculate current shares correctly after selling', () => {
      position.buy({
        date: new Date(),
        price: 150,
        shares: 10,
        type: 'buy',
        reason: 'Upward trend started',
      });
      position.sell({
        date: new Date(),
        price: 160,
        shares: 5,
        type: 'sell',
        reason: 'Upward trend ended',
      });
      // @ts-expect-error testing private method
      expect(position.getCurrentShares()).toBe(5);
    });

    it('should calculate current shares correctly after selling all shares', () => {
      position.buy({
        date: new Date(),
        price: 150,
        shares: 10,
        type: 'buy',
        reason: 'Upward trend started',
      });
      position.sell({
        date: new Date(),
        price: 160,
        shares: 10,
        type: 'sell',
        reason: 'Upward trend ended',
      });
      // @ts-expect-error testing private method
      expect(position.getCurrentShares()).toBe(0);
    });
  });

  describe('stops', () => {
    beforeEach(() => {
      position.buy({
        date: new Date(),
        price: 100,
        shares: 10,
        type: 'buy',
        reason: 'Upward trend started',
      });
      position.setStops({ loss: 90, profit: 110 });
    });

    it('should not trigger sell if price is between stops', () => {
      position.calc({ date: new Date(), price: 105 });
      // @ts-expect-error testing private method
      expect(position.getCurrentShares()).toBe(10);
    });

    it('should trigger stop-loss and sell all shares', () => {
      position.calc({ date: new Date(), price: 89 });
      // @ts-expect-error testing private method
      expect(position.getCurrentShares()).toBe(0);
    });

    it('should trigger take-profit and sell all shares', () => {
      position.calc({ date: new Date(), price: 111 });
      // @ts-expect-error testing private method
      expect(position.getCurrentShares()).toBe(0);
    });

    it('should not trigger sell if there are no shares', () => {
      position.sell({
        date: new Date(),
        price: 105,
        shares: 10,
        type: 'sell',
        reason: 'Upward trend ended',
      });
      position.calc({ date: new Date(), price: 89 });
      // @ts-expect-error testing private method
      expect(position.getCurrentShares()).toBe(0);
      // @ts-expect-error testing private property
      expect(position.transactions.length).toBe(2); // buy, sell
    });
  });
});
