import { TickerDto } from '../../../data-aggregation/data-aggregation.dto';
import { Transaction, TransactionData } from '../transaction/transaction';

export type IDPosition = string;

type Stops = Partial<{
  loss: number;
  profit: number;
}>;

export class Position {
  private transactions: Transaction[];
  private stops: Stops;

  constructor(private ticker: TickerDto) {
    this.transactions = [];
    this.stops = {};
  }

  isPosition(ticker: TickerDto): boolean {
    return (
      this.ticker.symbol === ticker.symbol &&
      this.ticker.exchange === ticker.exchange
    );
  }

  getIdentifier(): IDPosition {
    return `${this.ticker.symbol} ${this.ticker.exchange}`;
  }

  buy(order: TransactionData) {
    this.transactions.push(new Transaction(order));
  }

  sell(order: TransactionData) {
    this.transactions.push(new Transaction(order));
  }

  setStops(stops: Stops): void {
    this.stops = { ...this.stops, ...stops };
  }

  calc(datum: Pick<TransactionData, 'price' | 'date'>) {
    const shares = this.getCurrentShares();
    const { price, date } = datum;
    const stopLoss = this.stops.loss;
    const stopProfit = this.stops.profit;

    if (this.isStopLossTriggered(shares, stopLoss, price)) {
      this.sell({ date, price, reason: 'stop-loss', shares, type: 'sell' });
    } else if (this.isTakeProfitTriggerd(shares, stopProfit, price)) {
      this.sell({ date, price, reason: 'take-profit', shares, type: 'sell' });
    }
  }

  getProfit() {
    const buys = this.getBuys().reduce<number[]>(
      (listEveryShareWithPrice, buy) => {
        const shares = buy.getShares();
        const price = buy.getPrice();
        const list = new Array<number>(shares).fill(price);
        listEveryShareWithPrice.push(...list);
        return listEveryShareWithPrice;
      },
      [],
    );
    const sells = this.getSells().reduce<number[]>(
      (listEveryShareWithPrice, sell) => {
        const shares = sell.getShares();
        const price = sell.getPrice();
        const list = new Array<number>(shares).fill(price);
        listEveryShareWithPrice.push(...list);
        return listEveryShareWithPrice;
      },
      [],
    );

    return sells.reduce<number>((profit, sell, idxSell) => {
      const buy = buys[idxSell];

      const margin = sell - buy;
      profit += margin;
      return profit;
    }, 0);
  }

  getTransactions() {
    return this.transactions;
  }

  private getCurrentShares() {
    return this.transactions.reduce<number>(
      (sharesAccumulated, transaction) => {
        if (transaction.getType() === 'buy') {
          sharesAccumulated += transaction.getShares();
        } else {
          sharesAccumulated -= transaction.getShares();
        }
        return sharesAccumulated;
      },
      0,
    );
  }

  private isStopLossTriggered(
    shares: number,
    stopLoss: number | undefined,
    price: number,
  ) {
    return shares !== 0 && stopLoss && price < stopLoss;
  }

  private isTakeProfitTriggerd(
    shares: number,
    stopProfit: number | undefined,
    price: number,
  ) {
    return shares !== 0 && stopProfit && price > stopProfit;
  }

  private getBuys() {
    return this.transactions.filter((tx) => tx.getType() === 'buy');
  }

  private getSells() {
    return this.transactions.filter((tx) => tx.getType() === 'sell');
  }
}
