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
  period5_with10datapoints(): AverageTrueRangeTestCase {
    return {
      name: 'Period 5 with 10 data points, testing initial and smoothed ATR',
      setting: {
        period: 5,
      },
      testcase: [
        // Periode 1 -> Kein ATR
        {
          dataPoint: this.createEnrichedDataPoint({
            highPrice: 101,
            lowPrice: 99,
            closePrice: 100,
          }),
        },
        // Periode 2 -> Kein ATR
        {
          dataPoint: this.createEnrichedDataPoint({
            highPrice: 102,
            lowPrice: 98,
            closePrice: 101,
          }),
        },
        // Periode 3 -> Kein ATR
        {
          dataPoint: this.createEnrichedDataPoint({
            highPrice: 103,
            lowPrice: 99,
            closePrice: 102,
          }),
        },
        // Periode 4 -> Kein ATR
        {
          dataPoint: this.createEnrichedDataPoint({
            highPrice: 105,
            lowPrice: 101,
            closePrice: 104,
          }),
        },
        // Periode 5 -> Initialer ATR wird berechnet
        {
          dataPoint: this.createEnrichedDataPoint({
            highPrice: 106,
            lowPrice: 102,
            closePrice: 105,
          }),
          expectedATR: 3.8,
        },
        // Periode 6 -> Erster geglätteter ATR
        {
          dataPoint: this.createEnrichedDataPoint({
            highPrice: 110,
            lowPrice: 105,
            closePrice: 109,
          }),
          expectedATR: 4.04,
        },
        // Periode 7
        {
          dataPoint: this.createEnrichedDataPoint({
            highPrice: 112,
            lowPrice: 108,
            closePrice: 110,
          }),
          expectedATR: 4.032,
        },
        // Periode 8
        {
          dataPoint: this.createEnrichedDataPoint({
            highPrice: 115,
            lowPrice: 110,
            closePrice: 114,
          }),
          expectedATR: 4.2256,
        },
        // Periode 9
        {
          dataPoint: this.createEnrichedDataPoint({
            highPrice: 118,
            lowPrice: 112,
            closePrice: 117,
          }),
          expectedATR: 4.58048,
        },
        // Periode 10
        {
          dataPoint: this.createEnrichedDataPoint({
            highPrice: 117,
            lowPrice: 111,
            closePrice: 113,
          }),
          expectedATR: 4.864384,
        },
      ],
    };
  }
}
