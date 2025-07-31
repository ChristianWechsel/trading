import { OHLCV } from '../../../data-aggregation/ohlcv.entity';
import { AnalysisQueryDto } from '../../analysis-query.dto';
import { AnalysisContextClass } from '../../core/analysis-context';
import { AverageTrueRange } from './average-true-range';
import { AverageTrueRangeTestdata } from './average-true-range.testdata';

export type AverageTrueRangeTestCase = {
  name: string;
  context: AnalysisContextClass;
  expected: {
    index: number;
    atr: number;
  }[];
};

describe('AverageTrueRange', () => {
  const query: AnalysisQueryDto = {
    steps: [],
    dataAggregation: { ticker: { exchange: '', symbol: '' } },
    stepOptions: { averageTrueRange: { period: 10 } },
  };

  describe('checks', () => {
    it('should throw if enrichedDataPoints are less than period', () => {
      const atr = new AverageTrueRange();
      const ohlcvs = new Array<OHLCV>(
        query.stepOptions!.averageTrueRange!.period! - 1,
      ).fill(
        new OHLCV({
          securityId: 0,
          priceDate: '1970-01-01',
          openPrice: 0,
          highPrice: 0,
          lowPrice: 0,
          closePrice: 0,
          adjustedClosePrice: 0,
          volume: 0,
        }),
      );
      const context = new AnalysisContextClass(query, ohlcvs);
      expect(() => atr.execute(context)).toThrow(
        `Not enough data points for period=${query.stepOptions!.averageTrueRange!.period!}`,
      );
    });

    it('should not throw if enrichedDataPoints are equal to period', () => {
      const atr = new AverageTrueRange();
      const ohlcvs = new Array<OHLCV>(
        query.stepOptions!.averageTrueRange!.period!,
      ).fill(
        new OHLCV({
          securityId: 0,
          priceDate: '1970-01-01',
          openPrice: 0,
          highPrice: 0,
          lowPrice: 0,
          closePrice: 0,
          adjustedClosePrice: 0,
          volume: 0,
        }),
      );
      const context = new AnalysisContextClass(query, ohlcvs);
      expect(() => atr.execute(context)).not.toThrow();
    });

    it('should not throw if enrichedDataPoints are more than period', () => {
      const atr = new AverageTrueRange();
      const ohlcvs = new Array<OHLCV>(
        query.stepOptions!.averageTrueRange!.period! + 1,
      ).fill(
        new OHLCV({
          securityId: 0,
          priceDate: '1970-01-01',
          openPrice: 0,
          highPrice: 0,
          lowPrice: 0,
          closePrice: 0,
          adjustedClosePrice: 0,
          volume: 0,
        }),
      );
      const context = new AnalysisContextClass(query, ohlcvs);
      expect(() => atr.execute(context)).not.toThrow();
    });
  });

  describe('AverageTrueRange calculation', () => {
    const testData = new AverageTrueRangeTestdata();
    it.each([
      testData.minimumPeriod_todayMax(),
      testData.minimumPeriod_todayHighClosingYesterday(),
      testData.minimumPeriod_todayLowClosingYesterday(),
      testData.period5_with10datapoints(),
    ])('$name', ({ context, expected }) => {
      expect.assertions(expected.length + 1);
      const atr = new AverageTrueRange();
      atr.execute(context);
      context.getEnrichedDataPoints().forEach((dp, idx) => {
        const actualATR = dp.getAverageTrueRange();
        const expectedATR = expected.find((atr) => atr.index == idx);
        if (expectedATR) {
          expect(actualATR).toBeCloseTo(expectedATR.atr, 2);
        } else {
          expect(actualATR).toBeUndefined();
        }
      });
    });
  });
});
