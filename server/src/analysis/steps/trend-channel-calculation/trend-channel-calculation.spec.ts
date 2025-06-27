import { AnalysisContext, TrendChannel } from '../../core/analysis.interface';
import { TrendChannelCalculation } from './trend-channel-calculation';
import { TrendChannelCalculationTestdata } from './trend-channel-calculation.testdata';

export type TrendChannelTestCase = {
  name: string;
  testcase: {
    initialContext: AnalysisContext;
    expectedChannels: TrendChannel[];
  };
};

describe('TrendChannelCalculation', () => {
  const testData = new TrendChannelCalculationTestdata();

  it.each([
    testData.noTrends(),
    testData.simpleUpwardTrend(),
    testData.simpleDownwardTrend(),
  ])('$name', ({ testcase }) => {
    const context = testcase.initialContext;
    new TrendChannelCalculation().execute(context);
    const actualTrendChannels = context.trends?.map((t) => t.channel);
    expect(actualTrendChannels).toEqual(testcase.expectedChannels);
  });
});
