import { AnalysisContextClass } from 'src/analysis/core/analysis-context';
import { AnalysisStep, Step } from '../../../analysis/core/analysis.interface';

export class Trading implements AnalysisStep {
  dependsOn: Step[] = ['TradingSignal'];
  name: Step = 'Trading';

  execute(context: AnalysisContextClass): void {
    const tradingSignals = context.getTradingSignals();
    if (!tradingSignals || tradingSignals.length === 0) return;
  }
}
