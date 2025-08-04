import { OHLCV } from '../data-aggregation/ohlcv.entity';
import { AnalysisQueryDto } from './analysis-query.dto';
import { TrendDataMetadata } from './core/analysis.interface';
import { EnrichedDataPoint } from './core/enriched-data-points/enriched-data-point';
import { Trade } from './core/trade/trade';
import { TestDatasets } from './TestDatasets';

export type TestData = {
  dto: AnalysisQueryDto;
  data: OHLCV[];
  expected: EnrichedDataPoint[];
  expectedTrends?: TrendDataMetadata['trendData'][];
  expectedTrades?: Trade[];
};

export class AnalysisIntTestData {
  private testDatasets: TestDatasets;

  constructor() {
    this.testDatasets = new TestDatasets();
  }

  getMCDUSHistoricalData1980FirstHalfRelativeThreshold(): TestData {
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
        stepOptions: {
          swingPointDetection: { relativeThreshold: 0.005 },
          trendDetection: { relativeThreshold: 0.005 },
        },
      },
      ...this.testDatasets.getMCD_US_19800317_19800601(),
    };
  }

  getMCDUSHistoricalData1980FirstHalfATR(): TestData {
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
        stepOptions: {
          swingPointDetection: { atrFactor: 0.5 },
          trendDetection: { atrFactor: 0.5 },
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
        steps: ['TrendChannelCalculation'],
        stepOptions: {
          swingPointDetection: { relativeThreshold: 0.01 },
          trendDetection: { relativeThreshold: 0.01 },
        },
      },
      ...this.testDatasets.getMCD_US_19800601_19801231(),
    };
  }

  getDataYSelectOpen(): TestData {
    return {
      dto: {
        dataAggregation: {
          ticker: {
            symbol: 'MCD',
            exchange: 'US',
          },
          range: {
            from: '1980-01-01',
            to: '1980-12-31',
          },
        },
        steps: ['TrendChannelCalculation'],
        stepOptions: {
          swingPointDetection: { relativeThreshold: 0.01 },
          trendDetection: { relativeThreshold: 0.01 },
          averageTrueRange: { period: 2 },
          yValueSource: 'open',
        },
      },
      ...this.testDatasets.getYValueSourceOpen(),
    };
  }

  getDataYSelectClose(): TestData {
    return {
      dto: {
        dataAggregation: {
          ticker: {
            symbol: 'MCD',
            exchange: 'US',
          },
          range: {
            from: '1980-01-01',
            to: '1980-12-31',
          },
        },
        steps: ['TrendChannelCalculation'],
        stepOptions: {
          swingPointDetection: { relativeThreshold: 0.01 },
          trendDetection: { relativeThreshold: 0.01 },
          averageTrueRange: { period: 2 },
          yValueSource: 'close',
        },
      },
      ...this.testDatasets.getYValueSourceClose(),
    };
  }

  getDataYSelectHigh(): TestData {
    return {
      dto: {
        dataAggregation: {
          ticker: {
            symbol: 'MCD',
            exchange: 'US',
          },
          range: {
            from: '1980-01-01',
            to: '1980-12-31',
          },
        },
        steps: ['TrendChannelCalculation'],
        stepOptions: {
          swingPointDetection: { relativeThreshold: 0.01 },
          trendDetection: { relativeThreshold: 0.01 },
          averageTrueRange: { period: 2 },
          yValueSource: 'high',
        },
      },
      ...this.testDatasets.getYValueSourceHigh(),
    };
  }

  getDataYSelectLow(): TestData {
    return {
      dto: {
        dataAggregation: {
          ticker: {
            symbol: 'MCD',
            exchange: 'US',
          },
          range: {
            from: '1980-01-01',
            to: '1980-12-31',
          },
        },
        steps: ['TrendChannelCalculation'],
        stepOptions: {
          swingPointDetection: { relativeThreshold: 0.01 },
          trendDetection: { relativeThreshold: 0.01 },
          averageTrueRange: { period: 2 },
          yValueSource: 'low',
        },
      },
      ...this.testDatasets.getYValueSourceLow(),
    };
  }

  getFullAnalysisWithATR(): TestData {
    const dataset = this.testDatasets.getFullAnalysisWithATRData();
    return {
      dto: {
        dataAggregation: {
          ticker: {
            symbol: 'MCD',
            exchange: 'US',
          },
          range: {
            from: '2023-01-01',
            to: '2023-06-01',
          },
        },
        steps: ['Trading', 'TrendChannelCalculation'],
        stepOptions: {
          swingPointDetection: { atrFactor: 0.1 },
          trendDetection: { atrFactor: 0.1 },
          averageTrueRange: { period: 2 },
          yValueSource: 'high',
        },
      },
      ...dataset,
    };
  }
}
