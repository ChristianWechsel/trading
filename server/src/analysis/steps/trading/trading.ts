import { AnalysisContextClass } from '../../../analysis/core/analysis-context';
import { AnalysisStep, Step } from '../../../analysis/core/analysis.interface';

export class Trading implements AnalysisStep {
  dependsOn: Step[] = ['TradingSignal'];
  name: Step = 'Trading';

  execute(context: AnalysisContextClass): void {
    const tradingSignals = context.getTradingSignals();
    if (!tradingSignals || tradingSignals.length === 0) return;

    const dataPoints = context.getEnrichedDataPoints();
    const yYalueAccessor = context.buildYValueAccessor();
    const ticker = context.getOptions().getTicker().getTicker();
    const account = context.getAccount();
    const moneyManagement = context.buildMoneyManagement();
    const riskManagement = context.buildRiskManagement();
    const portfolio = context.getPortfolio();
    portfolio.addPosition(ticker);
    const tradingJournal = context.getTradingJournal();

    dataPoints.forEach((dataPoint) => {
      const price = yYalueAccessor(dataPoint);
      portfolio.calc(ticker, {
        date: dataPoint.getDataPoint().getPriceDate(),
        price,
      });

      const tradingSignal = tradingSignals.find(
        (signal) =>
          signal.dataPoint.getDataPoint().getPriceDateIsoDate() ===
          dataPoint.getDataPoint().getPriceDateIsoDate(),
      );

      if (tradingSignal && tradingSignal.type === 'buy') {
        portfolio.placeOrder(ticker, {
          type: 'buy',
          price,
          shares: moneyManagement(account.getCash(), price),
          reason: 'Upward trend started',
          date: dataPoint.getDataPoint().getPriceDate(),
        });
        portfolio.setStops(ticker, {
          loss: riskManagement(dataPoint, yYalueAccessor),
        });
      }

      if (tradingSignal && tradingSignal.type === 'sell') {
        const shares = portfolio.getCurrentShares(ticker);
        portfolio.placeOrder(ticker, {
          type: 'sell',
          price,
          shares,
          reason: 'Upward trend ended',
          date: dataPoint.getDataPoint().getPriceDate(),
        });
      }
    });
  }
}
