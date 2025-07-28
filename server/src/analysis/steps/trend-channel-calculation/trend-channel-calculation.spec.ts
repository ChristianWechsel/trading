import { AnalysisContextClass } from '../../../analysis/core/analysis-context';
import { TrendChannel } from '../../core/analysis.interface';
import { TrendChannelCalculation } from './trend-channel-calculation';
import { TrendChannelCalculationTestdata } from './trend-channel-calculation.testdata';

export type TrendChannelTestCase = {
  name: string;
  testcase: {
    expectedChannels: TrendChannel[];
    context: AnalysisContextClass;
  };
};

describe('TrendChannelCalculation', () => {
  const testData = new TrendChannelCalculationTestdata();

  it.each([
    testData.noTrends(),
    testData.simpleUpwardTrend(),
    testData.simpleDownwardTrend(),
    testData.overlappingTrends(),
    testData.separatedTrends(),
    testData.multiplePointsBetweenSwings(),
    testData.decimalValues(),
    testData.leadingPoints(),
    testData.trailingPoints(),
  ])('$name', ({ testcase }) => {
    new TrendChannelCalculation().execute(testcase.context);
    const actualTrendChannels = testcase.context
      .getTrends()
      .map((t) => t.channel);
    expect(actualTrendChannels).toEqual(testcase.expectedChannels);
  });
});
