export class Account {
  private cash: number;

  constructor(initialCapital: number) {
    if (initialCapital < 0) {
      throw new Error('Initial capital cannot be negative.');
    }
    this.cash = initialCapital;
  }

  /**
   * Returns the current cash balance.
   */
  getCash(): number {
    return this.cash;
  }

  /**
   * Reduces the cash balance by the given amount.
   * @param amount The amount to debit.
   * @returns `true` if the transaction was successful, `false` if there were insufficient funds.
   */
  debit(amount: number): boolean {
    if (amount < 0) {
      throw new Error('Debit amount cannot be negative.');
    }

    this.cash -= amount;
    return true;
  }

  /**
   * Increases the cash balance by the given amount.
   * @param amount The amount to credit.
   */
  credit(amount: number): void {
    if (amount < 0) {
      throw new Error('Credit amount cannot be negative.');
    }
    this.cash += amount;
  }
}
