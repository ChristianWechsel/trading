import { AnalysisContextClass } from 'src/analysis/core/analysis-context';
import { AnalysisStep, Step } from 'src/analysis/core/analysis.interface';

export class TradingSignal implements AnalysisStep {
  dependsOn: Step[] = ['TrendDetection'];
  name: Step = 'TradingSignal';

  execute(context: AnalysisContextClass): void {
    const trends = context.getTrends();
    if (!trends || trends.length === 0) return;

    for (const trend of trends) {
      if (trend.type === 'upward') {
        context.addTradingSignals({
          type: 'buy',
          dataPoint: trend.startPoint,
          reason: 'Upward trend started',
        });

        if (trend.endPoint) {
          context.addTradingSignals({
            type: 'sell',
            dataPoint: trend.endPoint,
            reason: 'Upward trend ended',
          });
        }
      }
    }
  }
}
