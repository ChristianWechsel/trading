export type IDPosition = string;

export class Position {
  private stops: { loss?: number; profit?: number };
  private exitPrice?: number;

  constructor(
    private position: {
      symbol: string;
      shares: number;
      entryPrice: number;
      entryDate: Date;
    },
  ) {
    this.stops = {};
  }

  getIdentifier(): IDPosition {
    return `${this.position.symbol} ${this.position.entryDate.toISOString()}`;
  }

  setStopLossPrice(price: number): void {
    if (price < 0) {
      throw new Error('Stop loss price cannot be negative.');
    }
    this.stops.loss = price;
  }

  setTakeProfitPrice(price: number): void {
    if (price < 0) {
      throw new Error('Take profit price cannot be negative.');
    }
    this.stops.profit = price;
  }

  getStopLossPrice(): number | undefined {
    return this.stops.loss;
  }

  getTakeProfitPrice(): number | undefined {
    return this.stops.profit;
  }

  closePosition(exitPrice: number): void {
    this.exitPrice = exitPrice;
  }

  getEntryValue(): number {
    return this.position.shares * this.position.entryPrice;
  }

  getExitValue(): number {
    if (!this.exitPrice) {
      throw new Error('Position is not closed yet.');
    }
    return this.position.shares * this.exitPrice;
  }

  getProfitOrLoss(): number {
    if (!this.exitPrice) {
      throw new Error('Position is not closed yet.');
    }
    return this.position.shares * this.exitPrice - this.getEntryValue();
  }
}
