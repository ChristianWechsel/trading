import { SignalForTrade } from '../analysis.interface';

export type TransactionData = Pick<SignalForTrade, 'type' | 'reason'> & {
  shares: number;
  price: number;
  date: Date;
};
