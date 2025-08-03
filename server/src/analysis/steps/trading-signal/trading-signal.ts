import { AnalysisContextClass } from '../../../analysis/core/analysis-context';
import { AnalysisStep, Step } from '../../../analysis/core/analysis.interface';

export class TradingSignal implements AnalysisStep {
  dependsOn: Step[] = ['TrendDetection'];
  name: Step = 'TradingSignal';

  execute(context: AnalysisContextClass): void {
    const trends = context.getTrends();
    if (!trends || trends.length === 0) return;

    for (const trend of trends) {
      if (trend.type === 'upward') {
        // Kaufsignal für den Tag der Trendbestätigung
        const buySignalDataPoint = trend.confirmation || trend.start;
        context.addTradingSignals({
          type: 'buy',
          dataPoint: buySignalDataPoint,
          reason: 'Upward trend started',
        });

        if (trend.end) {
          context.addTradingSignals({
            type: 'sell',
            dataPoint: trend.end,
            reason: 'Upward trend ended',
          });
        }
      }
    }
  }
}
