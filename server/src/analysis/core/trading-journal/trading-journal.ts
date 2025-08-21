import { TickerDto } from '../../../data-aggregation/data-aggregation.dto';
import { Transaction } from '../transaction/transaction';

type TransactionRecord = {
  general: { date: Date; ticker: TickerDto };
  financialInfo: {
    cash: number;
  };
  transaction: Transaction;
};

export class TradingJournal {
  private records: TransactionRecord[] = [];

  addRecord(record: TransactionRecord) {
    this.records.push(record);
  }

  getRecords() {
    return this.records;
  }
}
