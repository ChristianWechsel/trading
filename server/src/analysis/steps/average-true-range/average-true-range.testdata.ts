import { CreateTestData } from '../../../utils/test-utils';
import { AverageTrueRangeTestCase } from './average-true-range.spec';

export class AverageTrueRangeTestdata extends CreateTestData {
  minimumPeriod_todayMax(): AverageTrueRangeTestCase {
    return {
      name: 'Minimum Period - Today Max',
      setting: {
        period: 2,
      },
      context: this.createContextOf([
        {
          lowPrice: 10,
          highPrice: 20,
          closePrice: 15,
        },
        {
          lowPrice: 10,
          highPrice: 20,
          closePrice: 15,
        },
      ]),
      expected: [{ index: 1, atr: 10 }],
    };
  }

  minimumPeriod_todayHighClosingYesterday(): AverageTrueRangeTestCase {
    return {
      name: 'Minimum Period - Today High, Closing Yesterday',
      setting: {
        period: 2,
      },
      context: this.createContextOf([
        {
          lowPrice: 10,
          highPrice: 20,
          closePrice: 15,
        },
        {
          lowPrice: 19,
          highPrice: 20,
          closePrice: 15,
        },
      ]),
      expected: [{ index: 1, atr: 5 }],
    };
  }

  minimumPeriod_todayLowClosingYesterday(): AverageTrueRangeTestCase {
    return {
      name: 'Minimum Period - Today Low, Closing Yesterday Negative',
      setting: {
        period: 2,
      },
      context: this.createContextOf([
        {
          lowPrice: 10,
          highPrice: 20,
          closePrice: 15,
        },
        {
          lowPrice: 2,
          highPrice: 10,
          closePrice: 15,
        },
      ]),
      expected: [{ index: 1, atr: 13 }],
    };
  }

  period5_with10datapoints(): AverageTrueRangeTestCase {
    return {
      name: 'Period 5 with 10 data points, testing initial and smoothed ATR',
      setting: {
        period: 5,
      },
      context: this.createContextOf([
        {
          highPrice: 101,
          lowPrice: 99,
          closePrice: 100,
        },
        {
          highPrice: 102,
          lowPrice: 98,
          closePrice: 101,
        },
        {
          highPrice: 101,
          lowPrice: 99,
          closePrice: 102,
        },
        {
          highPrice: 105,
          lowPrice: 101,
          closePrice: 104,
        },
        {
          highPrice: 106,
          lowPrice: 102,
          closePrice: 105,
        },
        {
          highPrice: 110,
          lowPrice: 105,
          closePrice: 109,
        },
        {
          highPrice: 112,
          lowPrice: 108,
          closePrice: 110,
        },
        {
          highPrice: 115,
          lowPrice: 110,
          closePrice: 114,
        },
        {
          highPrice: 118,
          lowPrice: 112,
          closePrice: 117,
        },
        {
          highPrice: 117,
          lowPrice: 111,
          closePrice: 113,
        },
      ]),
      expected: [
        { index: 1, atr: 4 },
        { index: 2, atr: 3 },
        { index: 3, atr: 3.33 },
        { index: 4, atr: 3.5 },
        { index: 5, atr: 3.8 },
        { index: 6, atr: 3.84 },
        { index: 7, atr: 4.07 },
        { index: 8, atr: 4.46 },
        { index: 9, atr: 4.77 },
      ],
    };
  }
}
