import { EodPrice } from '../data-aggregation/eod-price.entity';
import { AnalysisQueryDto } from './analysis-query.dto';
import { TestDatasets } from './TestDatasets';

type TestData = { dto: AnalysisQueryDto; data: EodPrice[] };

export class AnalysisIntTestData {
  private testDatasets: TestDatasets;

  constructor() {
    this.testDatasets = new TestDatasets();
  }

  getMCDUSHistoricalData1980(): TestData {
    return {
      dto: {
        dataAggregation: {
          ticker: {
            symbol: 'MCD',
            exchange: 'US',
          },
          range: {
            from: '1980-03-17',
            to: '1980-06-01',
          },
        },
        steps: ['TrendChannelCalculation'],
      },
      data: this.testDatasets.getMCD_US_19800317_19800601(),
    };
  }
}
