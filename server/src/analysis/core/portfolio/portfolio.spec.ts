import { Account } from '../account/account';
import { Position } from '../position/position';
import { Portfolio } from './portfolio';

describe('Portfolio', () => {
  let account: Account;
  let portfolio: Portfolio;
  const initialCapital = 20000;

  const aaplPosition = new Position({
    ticker: {
      symbol: 'AAPL',
      exchange: 'NASDAQ',
    },
    shares: 10,
    entryPrice: 150,
    entryDate: new Date('2023-01-01T00:00:00.000Z'),
  });

  const googPosition = new Position({
    ticker: {
      symbol: 'GOOG',
      exchange: 'NASDAQ',
    },
    shares: 5,
    entryPrice: 100,
    entryDate: new Date('2023-01-02T00:00:00.000Z'),
  });

  beforeEach(() => {
    account = new Account(initialCapital);
    portfolio = new Portfolio(account);
  });

  describe('Initial State', () => {
    it('should start with no open or closed positions', () => {
      expect(portfolio.getOpenPositions()).toHaveLength(0);
      expect(portfolio.getClosedPositions()).toHaveLength(0);
    });
  });

  describe('openPosition', () => {
    it('should open a position, debit the account, and return the position ID', () => {
      const cost = aaplPosition.getEntryValue(); // 1500
      const id = portfolio.openPosition(aaplPosition);

      expect(id).toBe(aaplPosition.getIdentifier());
      expect(portfolio.getOpenPositions()).toHaveLength(1);
      expect(portfolio.getOpenPositions()[0]).toBe(aaplPosition);
      expect(account.getCash()).toBe(initialCapital - cost);
    });

    it('should allow opening multiple positions', () => {
      portfolio.openPosition(aaplPosition);
      portfolio.openPosition(googPosition);

      const totalCost =
        aaplPosition.getEntryValue() + googPosition.getEntryValue(); // 1500 + 500
      expect(portfolio.getOpenPositions()).toHaveLength(2);
      expect(account.getCash()).toBe(initialCapital - totalCost);
    });

    it('should throw an error if the same position is already open', () => {
      portfolio.openPosition(aaplPosition);
      expect(() => portfolio.openPosition(aaplPosition)).toThrow(
        `Position ${aaplPosition.getIdentifier()} is already open.`,
      );
    });
  });

  describe('closePosition', () => {
    beforeEach(() => {
      portfolio.openPosition(aaplPosition); // cost 1500
      portfolio.openPosition(googPosition); // cost 500
      // Cash is now 20000 - 2000 = 18000
    });

    it('should close a specific position, credit the account, and move it to closed positions', () => {
      const exitPriceAapl = 160;
      aaplPosition.closePosition(exitPriceAapl); // 10 shares * 160 = 1600
      const proceeds = aaplPosition.getExitValue(); // 1600
      const aaplId = aaplPosition.getIdentifier();

      portfolio.closePosition(aaplId, exitPriceAapl);

      // Check open positions
      expect(portfolio.getOpenPositions()).toHaveLength(1);
      expect(portfolio.getOpenPositions()[0].getIdentifier()).toBe(
        googPosition.getIdentifier(),
      );

      // Check closed positions
      expect(portfolio.getClosedPositions()).toHaveLength(1);
      expect(portfolio.getClosedPositions()[0].getIdentifier()).toBe(aaplId);

      // Check account balance
      expect(account.getCash()).toBe(18000 + proceeds); // 19600
    });

    it('should throw an error when trying to close a non-existent position', () => {
      const nonExistentId = 'TSLA 2023-01-01T00:00:00.000Z';
      expect(() => portfolio.closePosition(nonExistentId, 300)).toThrow(
        `Cannot close position: No position found for ID ${nonExistentId}.`,
      );
    });
  });
});
