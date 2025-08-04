import { AnalysisContextClass } from '../../../analysis/core/analysis-context';
import {
  AnalysisStep,
  SignalForTrade,
  Step,
} from '../../../analysis/core/analysis.interface';
import { Trade } from '../../core/trade/trade';

export class Trading implements AnalysisStep {
  dependsOn: Step[] = ['TradingSignal'];
  name: Step = 'Trading';

  execute(context: AnalysisContextClass): void {
    const yYalueAccessor = context.buildYValueAccessor();
    const tradingSignals = context.getTradingSignals();
    if (!tradingSignals || tradingSignals.length === 0) return;

    let activeBuySignal: SignalForTrade | null = null;

    for (const signal of tradingSignals) {
      if (signal.type === 'buy') {
        if (!activeBuySignal) {
          activeBuySignal = signal;
        }
      } else if (signal.type === 'sell') {
        if (activeBuySignal) {
          context.addTrade(
            new Trade({
              entry: {
                date: activeBuySignal.dataPoint
                  .getDataPoint()
                  .getPriceDateIsoDate(),
                price: yYalueAccessor(activeBuySignal.dataPoint),
              },
              exit: {
                date: signal.dataPoint.getDataPoint().getPriceDateIsoDate(),
                price: yYalueAccessor(signal.dataPoint),
              },
            }),
          );
          activeBuySignal = null;
        }
      }
    }
  }
}
