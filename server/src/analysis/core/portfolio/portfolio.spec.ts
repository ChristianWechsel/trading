import { Account } from '../account/account';
import { TransactionData } from '../analysis.interface';
import { TradingJournal } from '../trading-journal/trading-journal';
import { Portfolio } from './portfolio';

describe('Portfolio', () => {
  let account: Account;
  let tradingJournal: TradingJournal;
  let portfolio: Portfolio;
  const initialCapital = 20000;

  // Ticker Definitionen
  const aaplTicker = { symbol: 'AAPL', exchange: 'NASDAQ' };
  const googTicker = { symbol: 'GOOG', exchange: 'NASDAQ' };

  beforeEach(() => {
    account = new Account(initialCapital);
    tradingJournal = new TradingJournal();
    portfolio = new Portfolio(account, tradingJournal);
  });

  describe('Initial State', () => {
    it('should start with no transactions', () => {
      expect(portfolio.getTransactions()).toHaveLength(0);
    });
  });

  describe('addPosition', () => {
    it('should add a position', () => {
      portfolio.addPosition(aaplTicker);

      // Platziere eine Order, um zu prüfen, ob die Position korrekt angelegt wurde
      const buyOrder: TransactionData = {
        date: new Date('2025-08-19'),
        price: 150,
        shares: 10,
        type: 'buy',
        reason: 'Upward trend started',
      };

      portfolio.placeOrder(aaplTicker, buyOrder);

      expect(portfolio.getTransactions()).toHaveLength(1);
      expect(account.getCash()).toBe(initialCapital - 150 * 10);
    });

    it('should not add the same position twice', () => {
      portfolio.addPosition(aaplTicker);
      portfolio.addPosition(aaplTicker);

      const buyOrder: TransactionData = {
        date: new Date('2025-08-19'),
        price: 150,
        shares: 10,
        type: 'buy',
        reason: 'Upward trend started',
      };

      portfolio.placeOrder(aaplTicker, buyOrder);

      expect(portfolio.getTransactions()).toHaveLength(1);
    });

    it('should allow adding multiple positions', () => {
      portfolio.addPosition(aaplTicker);
      portfolio.addPosition(googTicker);

      // Kauf von AAPL
      const aaplBuyOrder: TransactionData = {
        date: new Date('2025-08-19'),
        price: 150,
        shares: 10,
        type: 'buy',
        reason: 'Upward trend started',
      };

      // Kauf von GOOG
      const googBuyOrder: TransactionData = {
        date: new Date('2025-08-20'),
        price: 100,
        shares: 5,
        type: 'buy',
        reason: 'Upward trend started',
      };

      portfolio.placeOrder(aaplTicker, aaplBuyOrder);
      portfolio.placeOrder(googTicker, googBuyOrder);

      expect(portfolio.getTransactions()).toHaveLength(2);
      expect(account.getCash()).toBe(initialCapital - 150 * 10 - 100 * 5);
    });
  });

  describe('placeOrder', () => {
    beforeEach(() => {
      portfolio.addPosition(aaplTicker);
      portfolio.addPosition(googTicker);

      // Spy auf die addRecord-Methode des TradingJournals
      jest.spyOn(tradingJournal, 'addRecord');
    });

    it('should execute a buy order and debit the account', () => {
      const buyOrder: TransactionData = {
        date: new Date('2025-08-19'),
        price: 150,
        shares: 10,
        type: 'buy',
        reason: 'Upward trend started',
      };

      portfolio.placeOrder(aaplTicker, buyOrder);

      expect(portfolio.getTransactions()).toHaveLength(1);
      expect(account.getCash()).toBe(initialCapital - 150 * 10);

      // Überprüfe, ob das TradingJournal aktualisiert wurde
      expect(tradingJournal.addRecord).toHaveBeenCalledWith({
        general: { date: buyOrder.date, ticker: aaplTicker },
        financialInfo: { cash: account.getCash() },
        transaction: buyOrder,
      });
    });

    it('should execute a sell order and credit the account', () => {
      // Reset Spy-Zähler für diesen Test
      jest.clearAllMocks();

      // Zuerst kaufen, damit wir verkaufen können
      const buyOrder: TransactionData = {
        date: new Date('2025-08-19'),
        price: 150,
        shares: 10,
        type: 'buy',
        reason: 'Upward trend started',
      };

      portfolio.placeOrder(aaplTicker, buyOrder);

      // Dann verkaufen
      const sellOrder: TransactionData = {
        date: new Date('2025-08-20'),
        price: 160,
        shares: 5,
        type: 'sell',
        reason: 'Upward trend ended',
      };

      portfolio.placeOrder(aaplTicker, sellOrder);

      expect(portfolio.getTransactions()).toHaveLength(2);
      // 20000 - 150 * 10 + 160 * 5 = 20000 - 1500 + 800 = 19300
      const expectedBalance = initialCapital - 150 * 10 + 160 * 5;
      expect(account.getCash()).toBe(expectedBalance);

      // Überprüfe, ob das TradingJournal für den Verkauf aktualisiert wurde
      // Da addRecord zweimal aufgerufen wird (für Kauf und Verkauf), überprüfen wir den letzten Aufruf
      expect(tradingJournal.addRecord).toHaveBeenLastCalledWith({
        general: { date: sellOrder.date, ticker: aaplTicker },
        financialInfo: { cash: expectedBalance },
        transaction: sellOrder,
      });
    });

    it('should do nothing if position does not exist', () => {
      const nonExistentTicker = { symbol: 'TSLA', exchange: 'NASDAQ' };
      const buyOrder: TransactionData = {
        date: new Date('2025-08-19'),
        price: 150,
        shares: 10,
        type: 'buy',
        reason: 'Upward trend started',
      };

      portfolio.placeOrder(nonExistentTicker, buyOrder);

      expect(portfolio.getTransactions()).toHaveLength(0);
      expect(account.getCash()).toBe(initialCapital);
    });
  });

  describe('setStops and calc', () => {
    beforeEach(() => {
      portfolio.addPosition(aaplTicker);

      // Kauf von AAPL
      const buyOrder: TransactionData = {
        date: new Date('2025-08-19'),
        price: 150,
        shares: 10,
        type: 'buy',
        reason: 'Upward trend started',
      };

      portfolio.placeOrder(aaplTicker, buyOrder);

      // Spy auf die addRecord-Methode des TradingJournals zurücksetzen
      jest.clearAllMocks();
      jest.spyOn(tradingJournal, 'addRecord');
    });

    it('should trigger stop loss and sell all shares', () => {
      // Set stop loss at 140
      portfolio.setStops(aaplTicker, { loss: 140 });

      // Datum für Stop-Loss
      const stopLossDate = new Date('2025-08-20');

      // Simulate price drop to 135
      portfolio.calc(aaplTicker, { date: stopLossDate, price: 135 });

      // Should trigger stop loss and create a sell transaction
      expect(portfolio.getTransactions()).toHaveLength(2);
      expect(portfolio.getTransactions()[1].type).toBe('sell');
      expect(portfolio.getTransactions()[1].shares).toBe(10);
      expect(portfolio.getTransactions()[1].price).toBe(135);

      // Check account balance: 20000 - 150 * 10 + 135 * 10 = 20000 - 1500 + 1350 = 19850
      const expectedBalance = initialCapital - 150 * 10 + 135 * 10;
      expect(account.getCash()).toBe(expectedBalance);

      // Überprüfe, ob das TradingJournal für den Stop-Loss-Verkauf aktualisiert wurde
      expect(tradingJournal.addRecord).toHaveBeenCalledWith({
        general: { date: stopLossDate, ticker: aaplTicker },
        financialInfo: { cash: expectedBalance },
        transaction: expect.objectContaining({
          type: 'sell',
          price: 135,
          shares: 10,
          reason: 'stop-loss',
          date: stopLossDate,
        }),
      });
    });

    it('should trigger take profit and sell all shares', () => {
      // Reset Spy-Zähler für diesen Test
      jest.clearAllMocks();

      // Set take profit at 160
      portfolio.setStops(aaplTicker, { profit: 160 });

      // Datum für Take-Profit
      const takeProfitDate = new Date('2025-08-20');

      // Simulate price rise to 165
      portfolio.calc(aaplTicker, { date: takeProfitDate, price: 165 });

      // Should trigger take profit and create a sell transaction
      expect(portfolio.getTransactions()).toHaveLength(2);
      expect(portfolio.getTransactions()[1].type).toBe('sell');
      expect(portfolio.getTransactions()[1].shares).toBe(10);
      expect(portfolio.getTransactions()[1].price).toBe(165);

      // Check account balance: 20000 - 150 * 10 + 165 * 10 = 20000 - 1500 + 1650 = 20150
      const expectedBalance = initialCapital - 150 * 10 + 165 * 10;
      expect(account.getCash()).toBe(expectedBalance);

      // Überprüfe, ob das TradingJournal für den Take-Profit-Verkauf aktualisiert wurde
      expect(tradingJournal.addRecord).toHaveBeenCalledWith({
        general: { date: takeProfitDate, ticker: aaplTicker },
        financialInfo: { cash: expectedBalance },
        transaction: expect.objectContaining({
          type: 'sell',
          price: 165,
          shares: 10,
          reason: 'take-profit',
          date: takeProfitDate,
        }),
      });
    });

    it('should do nothing if no stops are triggered', () => {
      portfolio.setStops(aaplTicker, { loss: 140, profit: 160 });

      // Simulate price at 145 (between stop loss and take profit)
      portfolio.calc(aaplTicker, { date: new Date('2025-08-20'), price: 145 });

      // No new transaction should be created
      expect(portfolio.getTransactions()).toHaveLength(1);

      // Account balance unchanged
      expect(account.getCash()).toBe(initialCapital - 150 * 10);
    });
  });
});
