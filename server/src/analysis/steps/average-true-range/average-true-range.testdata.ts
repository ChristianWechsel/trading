import { OHLCV, OHLCVEntity } from '../../../data-aggregation/ohlcv.entity';
import { EnrichedDataPoint } from '../../core/enriched-data-point';
import { AverageTrueRangeTestCase } from './average-true-range.spec';

export class AverageTrueRangeTestdata {
  private createEnrichedDataPoint(
    ohlcv: Partial<OHLCVEntity>,
  ): EnrichedDataPoint {
    const defaultData: OHLCVEntity = {
      securityId: 0,
      priceDate: '1970-01-01',
      openPrice: 0,
      highPrice: 0,
      lowPrice: 0,
      closePrice: 0,
      adjustedClosePrice: 0,
      volume: 0,
    };
    return new EnrichedDataPoint(new OHLCV({ ...defaultData, ...ohlcv }));
  }

  minimumPeriod_todayMax(): AverageTrueRangeTestCase {
    return {
      name: 'Minimum Period - Today Max',
      setting: {
        period: 2,
      },
      testcase: [
        {
          dataPoint: this.createEnrichedDataPoint({
            lowPrice: 10,
            highPrice: 20,
            closePrice: 15,
          }),
        },
        {
          dataPoint: this.createEnrichedDataPoint({
            lowPrice: 10,
            highPrice: 20,
            closePrice: 15,
          }),
          expectedATR: 10,
        },
      ],
    };
  }
  minimumPeriod_todayHighClosingYesterday(): AverageTrueRangeTestCase {
    return {
      name: 'Minimum Period - Today High, Closing Yesterday',
      setting: {
        period: 2,
      },
      testcase: [
        {
          dataPoint: this.createEnrichedDataPoint({
            lowPrice: 10,
            highPrice: 20,
            closePrice: 15,
          }),
        },
        {
          dataPoint: this.createEnrichedDataPoint({
            lowPrice: 19,
            highPrice: 20,
            closePrice: 15,
          }),
          expectedATR: 5,
        },
      ],
    };
  }
  minimumPeriod_todayLowClosingYesterday(): AverageTrueRangeTestCase {
    return {
      name: 'Minimum Period - Today Low, Closing Yesterday Negative',
      setting: {
        period: 2,
      },
      testcase: [
        {
          dataPoint: this.createEnrichedDataPoint({
            lowPrice: 10,
            highPrice: 20,
            closePrice: 15,
          }),
        },
        {
          dataPoint: this.createEnrichedDataPoint({
            lowPrice: 2,
            highPrice: 10,
            closePrice: 15,
          }),
          expectedATR: 13,
        },
      ],
    };
  }
}
