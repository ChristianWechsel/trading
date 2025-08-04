import { Account } from './account';

describe('Account', () => {
  let account: Account;
  const initialCapital = 10000;

  beforeEach(() => {
    account = new Account(initialCapital);
  });

  describe('constructor', () => {
    it('should initialize with the correct initial capital and cash', () => {
      expect(account.getCash()).toBe(initialCapital);
    });

    it('should throw an error if initial capital is negative', () => {
      expect(() => new Account(-100)).toThrow(
        'Initial capital cannot be negative.',
      );
    });
  });

  describe('getCash', () => {
    it('should return the current cash balance', () => {
      expect(account.getCash()).toBe(initialCapital);
    });
  });

  describe('debit', () => {
    it('should reduce the cash balance for a valid debit', () => {
      const debitAmount = 500;
      account.debit(debitAmount);
      expect(account.getCash()).toBe(initialCapital - debitAmount);
    });

    it('should allow the balance to go negative if debit amount exceeds cash', () => {
      const debitAmount = initialCapital + 1;
      account.debit(debitAmount);
      expect(account.getCash()).toBe(-1);
    });

    it('should allow debiting the exact available cash', () => {
      account.debit(initialCapital);
      expect(account.getCash()).toBe(0);
    });

    it('should throw an error if the debit amount is negative', () => {
      expect(() => account.debit(-500)).toThrow(
        'Debit amount cannot be negative.',
      );
    });
  });

  describe('credit', () => {
    it('should increase the cash balance for a valid credit', () => {
      const creditAmount = 500;
      account.credit(creditAmount);
      expect(account.getCash()).toBe(initialCapital + creditAmount);
    });

    it('should throw an error if the credit amount is negative', () => {
      expect(() => account.credit(-500)).toThrow(
        'Credit amount cannot be negative.',
      );
    });
  });

  describe('transactions', () => {
    it('should correctly reflect the cash balance after multiple transactions', () => {
      account.debit(1000); // 9000
      account.credit(500); // 9500
      account.debit(2000); // 7500
      expect(account.getCash()).toBe(7500);
    });

    it('should handle a debit that results in a negative balance followed by a credit', () => {
      account.debit(12000); // Balance becomes -2000
      expect(account.getCash()).toBe(-2000);

      account.credit(500); // Balance becomes -1500
      expect(account.getCash()).toBe(-1500);
    });
  });
});
