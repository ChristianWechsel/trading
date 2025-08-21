import { TickerDto } from 'src/data-aggregation/data-aggregation.dto';
import { Account } from '../account/account';
import { TransactionData } from '../analysis.interface';
import { Position, PriceDateInfo, Stops } from '../position/position';
import { TradingJournal } from '../trading-journal/trading-journal';

export class Portfolio {
  private positions: Position[];

  constructor(
    private readonly account: Account,
    private readonly tradingJournal: TradingJournal,
  ) {
    this.positions = [];
  }

  addPosition(ticker: TickerDto) {
    if (!this.hasPosition(ticker)) {
      this.positions.push(
        new Position(ticker, {
          buy: (transaction) => {
            this.tradingJournal.addRecord({
              transaction,
              financialInfo: { cash: this.account.getCash() },
              general: { ticker, date: transaction.date },
            });
            this.account.debit(transaction.price * transaction.shares);
          },
          sell: (transaction) => {
            this.tradingJournal.addRecord({
              transaction,
              financialInfo: { cash: this.account.getCash() },
              general: { ticker, date: transaction.date },
            });
            this.account.credit(transaction.price * transaction.shares);
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
