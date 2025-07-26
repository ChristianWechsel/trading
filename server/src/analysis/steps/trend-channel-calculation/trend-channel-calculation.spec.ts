import { AnalysisQueryDto } from '../../../analysis/analysis-query.dto';
import { AnalysisContextClass } from '../../../analysis/core/analysis-context';
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
    testData.overlappingTrends(),
    testData.separatedTrends(),
    testData.multiplePointsBetweenSwings(),
    testData.decimalValues(),
    testData.leadingPoints(),
    testData.trailingPoints(),
  ])('$name', ({ testcase }) => {
    const context = new AnalysisContextClass(
      {} as AnalysisQueryDto,
      testcase.initialContext.enrichedDataPoints.map((dp) => dp.getDataPoint()),
    );
    new TrendChannelCalculation().execute(context);
    const actualTrendChannels = context.getTrends().map((t) => t.channel);
    expect(actualTrendChannels).toEqual(testcase.expectedChannels);
  });
});
