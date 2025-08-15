import { Account } from '../account/account';
import { IDPosition, Position } from '../position/position';

// Portfolio besteht aus mehrern Positionen. Jede Position verwaltet alle Transaktionen
// offene und geschlossende Positionen verwerfen. Jede Position muss für sich selbst entscheiden, ob gekauft, verkauft oder
// über stops Aktion ausgelöst wird. Dies muss Portfolio nicht kümmern
// Es muss für jede Iteration der aktuelle Preis an Position weitergebgen werden,
// damit die stops korrekt ausgelöst werden können
// Ebenso müssen die Strategiesignale an Position weitergegeben werden

export class Portfolio {
  private openPositions = new Map<IDPosition, Position>();
  private closedPositions = new Map<IDPosition, Position>();

  constructor(private readonly account: Account) {}

  hasOpenPositions(): boolean {
    return this.openPositions.size > 0;
  }

  getOpenPositions(): Position[] {
    return Array.from(this.openPositions.values());
  }

  getClosedPositions(): Position[] {
    return Array.from(this.closedPositions.values());
  }

  openPosition(position: Position) {
    const id = position.getIdentifier();
    if (this.openPositions.has(id)) {
      throw new Error(`Position ${id} is already open.`);
    }

    const cost = position.getEntryValue();
    this.account.debit(cost);
    this.openPositions.set(id, position);
    return id;
  }

  closePosition(id: IDPosition, exitPrice: number) {
    const positionToClose = this.openPositions.get(id);
    if (!positionToClose) {
      throw new Error(`Cannot close position: No position found for ID ${id}.`);
    }

    positionToClose.closePosition(exitPrice);

    const proceeds = positionToClose.getExitValue();
    this.account.credit(proceeds);
    this.openPositions.delete(id);
    this.closedPositions.set(id, positionToClose);
  }
}
