import { SignalForTrade } from '../analysis.interface';

export type TransactionData = Pick<SignalForTrade, 'type' | 'reason'> & {
  shares: number;
  price: number;
  date: Date;
};

export class Transaction {
  constructor(private details: TransactionData) {}

  getType() {
    return this.details.type;
  }

  getShares() {
    return this.details.shares;
  }
}
