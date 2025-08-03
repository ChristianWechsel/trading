type TradeRecord = {
  date: string;
  price: number;
};

type TradeTransaction = {
  entry: TradeRecord;
  exit: TradeRecord;
};

export class Trade {
  constructor(private transaction: TradeTransaction) {}

  isProfitable(): boolean {
    return this.calculateProfit() > 0;
  }

  getProfit(): number {
    return this.calculateProfit();
  }

  private calculateProfit(): number {
    return this.transaction.exit.price - this.transaction.entry.price;
  }
}
