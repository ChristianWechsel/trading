export class Position {
  private stops: { loss?: number; profit?: number };
  private isClosed: boolean;

  constructor(
    private position: {
      symbol: string;
      shares: number;
      entryPrice: number;
      entryDate: string;
    },
  ) {
    this.stops = {};
    this.isClosed = false;
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

  setIsClosed(closed: boolean): void {
    this.isClosed = closed;
  }

  getIsClosed(): boolean {
    return this.isClosed;
  }

  /**
   * Calculates the total value of the position at the entry price.
   */
  getEntryValue(): number {
    return this.position.shares * this.position.entryPrice;
  }

  /**
   * Calculates the current value of the position given a new price.
   * @param currentPrice The current market price.
   */
  getCurrentValue(currentPrice: number): number {
    if (currentPrice < 0) {
      throw new Error('Current price cannot be negative.');
    }
    return this.position.shares * currentPrice;
  }

  /**
   * Calculates the profit or loss based on the current price.
   * @param currentPrice The current market price.
   */
  getProfitOrLoss(currentPrice: number): number {
    return this.getCurrentValue(currentPrice) - this.getEntryValue();
  }
}
