export class Account {
  private cash: number;

  constructor(initialCapital: number) {
    if (initialCapital < 0) {
      throw new Error('Initial capital cannot be negative.');
    }
    this.cash = initialCapital;
  }

  getCash(): number {
    return this.cash;
  }

  debit(amount: number) {
    if (amount < 0) {
      throw new Error('Debit amount cannot be negative.');
    }

    this.cash -= amount;
  }

  credit(amount: number): void {
    if (amount < 0) {
      throw new Error('Credit amount cannot be negative.');
    }
    this.cash += amount;
  }
}
