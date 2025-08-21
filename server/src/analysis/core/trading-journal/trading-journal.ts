import { TickerDto } from '../../../data-aggregation/data-aggregation.dto';
import { TransactionData } from '../transaction/transaction';

type TransactionRecord = {
  general: { date: Date; ticker: TickerDto };
  financialInfo: {
    cash: number;
  };
  transaction: TransactionData;
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
