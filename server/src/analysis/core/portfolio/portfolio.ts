import { TickerDto } from 'src/data-aggregation/data-aggregation.dto';
import { Account } from '../account/account';
import { Position, PriceDateInfo, Stops } from '../position/position';
import { TransactionData } from '../transaction/transaction';

export class Portfolio {
  private positions: Position[];

  constructor(private readonly account: Account) {
    this.positions = [];
  }

  addPosition(ticker: TickerDto) {
    if (!this.hasPosition(ticker)) {
      this.positions.push(
        new Position(ticker, {
          buy: (shares, price) => {
            this.account.debit(price * shares);
          },
          sell: (shares, price) => {
            this.account.credit(price * shares);
          },
        }),
      );
    }
  }

  placeOrder(ticker: TickerDto, order: TransactionData) {
    const position = this.getPosition(ticker);
    if (position) {
      position.placeOrder(order);
    }
  }

  setStops(ticker: TickerDto, stops: Stops) {
    const position = this.getPosition(ticker);
    if (position) {
      position.setStops(stops);
    }
  }

  calc(ticker: TickerDto, datum: PriceDateInfo) {
    const position = this.getPosition(ticker);
    if (position) {
      position.calc(datum);
    }
  }

  getCurrentShares(ticker: TickerDto): number {
    const position = this.getPosition(ticker);
    if (position) {
      return position.getCurrentShares();
    }
    return 0;
  }

  getTransactions() {
    return this.positions.flatMap((p) => p.getTransactions());
  }

  private hasPosition(ticker: TickerDto) {
    return this.positions.some((p) => p.isPosition(ticker));
  }

  private getPosition(ticker: TickerDto) {
    return this.positions.find((p) => p.isPosition(ticker));
  }
}
