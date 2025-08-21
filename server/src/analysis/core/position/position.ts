import { TickerDto } from '../../../data-aggregation/data-aggregation.dto';
import { TransactionData } from '../analysis.interface';

export type Stops = Partial<{
  loss: number;
  profit: number;
}>;

export type PriceDateInfo = Pick<TransactionData, 'price' | 'date'>;

export class Position {
  private transactions: TransactionData[];
  private stops: Stops;

  constructor(
    private ticker: TickerDto,
    private on: {
      buy: (transaction: TransactionData) => void;
      sell: (transaction: TransactionData) => void;
    },
  ) {
    this.transactions = [];
    this.stops = {};
  }

  isPosition(ticker: TickerDto): boolean {
    return (
      this.ticker.symbol === ticker.symbol &&
      this.ticker.exchange === ticker.exchange
    );
  }

  placeOrder(order: TransactionData) {
    this.transactions.push(order);
    this.triggerOrderCallbacks(order);
  }

  setStops(stops: Stops) {
    this.stops = { ...this.stops, ...stops };
  }

  calc(datum: PriceDateInfo) {
    const shares = this.getCurrentShares();
    const { price, date } = datum;
    const stopLoss = this.stops.loss;
    const stopProfit = this.stops.profit;

    if (this.isStopLossTriggered(shares, stopLoss, price)) {
      this.placeOrder({
        date,
        price,
        reason: 'stop-loss',
        shares,
        type: 'sell',
      });
    } else if (this.isTakeProfitTriggerd(shares, stopProfit, price)) {
      this.placeOrder({
        date,
        price,
        reason: 'take-profit',
        shares,
        type: 'sell',
      });
    }
  }

  getCurrentShares() {
    return this.transactions.reduce<number>(
      (sharesAccumulated, transaction) => {
        if (transaction.type === 'buy') {
          sharesAccumulated += transaction.shares;
        } else {
          sharesAccumulated -= transaction.shares;
        }
        return sharesAccumulated;
      },
      0,
    );
  }

  getProfit() {
    const buys = this.getBuys().reduce<number[]>(
      (listEveryShareWithPrice, buy) => {
        const shares = buy.shares;
        const price = buy.price;
        const list = new Array<number>(shares).fill(price);
        listEveryShareWithPrice.push(...list);
        return listEveryShareWithPrice;
      },
      [],
    );
    const sells = this.getSells().reduce<number[]>(
      (listEveryShareWithPrice, sell) => {
        const shares = sell.shares;
        const price = sell.price;
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

  private triggerOrderCallbacks(order: TransactionData) {
    switch (order.type) {
      case 'buy':
        this.on.buy(order);
        break;
      case 'sell':
        this.on.sell(order);
        break;
    }
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
    return this.transactions.filter((tx) => tx.type === 'buy');
  }

  private getSells() {
    return this.transactions.filter((tx) => tx.type === 'sell');
  }
}
