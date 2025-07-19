import { OHLCVEntity } from '../data-aggregation/ohlcv.entity';
import { AnalysisQueryDto } from './analysis-query.dto';
import { EnrichedDataPoint } from './core/enriched-data-point';
import { TestDatasets } from './TestDatasets';

export type TestData = {
  dto: AnalysisQueryDto;
  data: OHLCVEntity[];
  expected: EnrichedDataPoint[];
};

export class AnalysisIntTestData {
  private testDatasets: TestDatasets;

  constructor() {
    this.testDatasets = new TestDatasets();
  }

  getMCDUSHistoricalData1980FirstHalf(): TestData {
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
        steps: ['SwingPointDetection'],
        stepOptions: {
          swingPointDetection: { relativeThreshold: 0.005 },
          trendDetection: { relativeThreshold: 0.005 },
        },
      },
      ...this.testDatasets.getMCD_US_19800317_19800601(),
    };
  }
  getMCDUSHistoricalData1980SecondHalf(): TestData {
    return {
      dto: {
        dataAggregation: {
          ticker: {
            symbol: 'MCD',
            exchange: 'US',
          },
          range: {
            from: '1980-06-01',
            to: '1980-12-31',
          },
        },
        steps: ['SwingPointDetection'],
        stepOptions: {
          swingPointDetection: { relativeThreshold: 0.01 },
          trendDetection: { relativeThreshold: 0.01 },
        },
      },
      ...this.testDatasets.getMCD_US_19800601_19801231(),
    };
  }
}
