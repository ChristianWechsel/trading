import { CreateTestData } from 'src/utils/test-utils';
import { AverageTrueRangeTestCase } from './average-true-range.spec';

export class AverageTrueRangeTestdata extends CreateTestData {
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
        // Periode 0 -> Kein ATR
        {
          dataPoint: this.createEnrichedDataPoint({
            highPrice: 101,
            lowPrice: 99,
            closePrice: 100,
          }),
        },
        // Periode 1 -> Kein ATR
        {
          dataPoint: this.createEnrichedDataPoint({
            highPrice: 102,
            lowPrice: 98,
            closePrice: 101,
          }),
          expectedATR: 4,
        },
        // Periode 2 -> Kein ATR
        {
          dataPoint: this.createEnrichedDataPoint({
            highPrice: 101,
            lowPrice: 99,
            closePrice: 102,
          }),
          expectedATR: 3,
        },
        // Periode 3 -> Kein ATR
        {
          dataPoint: this.createEnrichedDataPoint({
            highPrice: 105,
            lowPrice: 101,
            closePrice: 104,
          }),
          expectedATR: 3.33,
        },
        // Periode 4 -> Initialer ATR wird berechnet
        {
          dataPoint: this.createEnrichedDataPoint({
            highPrice: 106,
            lowPrice: 102,
            closePrice: 105,
          }),
          expectedATR: 3.5,
        },
        // Periode 5 -> Erster geglätteter ATR
        {
          dataPoint: this.createEnrichedDataPoint({
            highPrice: 110,
            lowPrice: 105,
            closePrice: 109,
          }),
          expectedATR: 3.8,
        },
        // Periode 6
        {
          dataPoint: this.createEnrichedDataPoint({
            highPrice: 112,
            lowPrice: 108,
            closePrice: 110,
          }),
          expectedATR: 3.84,
        },
        // Periode 7
        {
          dataPoint: this.createEnrichedDataPoint({
            highPrice: 115,
            lowPrice: 110,
            closePrice: 114,
          }),
          expectedATR: 4.07,
        },
        // Periode 8
        {
          dataPoint: this.createEnrichedDataPoint({
            highPrice: 118,
            lowPrice: 112,
            closePrice: 117,
          }),
          expectedATR: 4.46,
        },
        // Periode 9
        {
          dataPoint: this.createEnrichedDataPoint({
            highPrice: 117,
            lowPrice: 111,
            closePrice: 113,
          }),
          expectedATR: 4.77,
        },
      ],
    };
  }
}
