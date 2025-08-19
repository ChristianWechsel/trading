import { TickerDto } from 'src/data-aggregation/data-aggregation.dto';
import { Account } from '../account/account';
import { Position, PriceDateInfo, Stops } from '../position/position';
import { TransactionData } from '../transaction/transaction';

// Portfolio besteht aus mehrern Positionen. Jede Position verwaltet alle Transaktionen
// offene und geschlossende Positionen verwerfen. Jede Position muss für sich selbst entscheiden, ob gekauft, verkauft oder
// über stops Aktion ausgelöst wird. Dies muss Portfolio nicht kümmern
// Es muss für jede Iteration der aktuelle Preis an Position weitergebgen werden,
// damit die stops korrekt ausgelöst werden können
// Ebenso müssen die Strategiesignale an Position weitergegeben werden

export class Portfolio {
  private positions: Position[];

  constructor(private readonly account: Account) {
    this.positions = [];
  }

  addPosition(ticker: TickerDto) {
    if (!this.hasPosition(ticker)) {
      this.positions.push(new Position(ticker));
    }
  }

  placeOrder(ticker: TickerDto, order: TransactionData) {
    const position = this.getPosition(ticker);
    if (position) {
      this.updateAccountBalance(order);
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

  private hasPosition(ticker: TickerDto) {
    return this.positions.some((p) => p.isPosition(ticker));
  }

  private getPosition(ticker: TickerDto) {
    return this.positions.find((p) => p.isPosition(ticker));
  }

  private updateAccountBalance(order: TransactionData) {
    switch (order.type) {
      case 'buy':
        this.account.debit(order.price * order.shares);
        break;
      case 'sell':
        this.account.credit(order.price * order.shares);
        break;
    }
  }
}
