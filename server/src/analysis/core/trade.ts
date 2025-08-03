export class Trade {
  constructor(
    private entry: { entryDate: string; entryPrice: number },
    private exit: { exitDate: string; exitPrice: number },
  ) {}

  isProfitable(): boolean {
    return this.calculateProfit() > 0;
  }

  getProfit(): number {
    return this.calculateProfit();
  }

  private calculateProfit(): number {
    return this.exit.exitPrice - this.entry.entryPrice;
  }
}
