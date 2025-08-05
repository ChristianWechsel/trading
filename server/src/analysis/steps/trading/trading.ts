import { Position } from 'src/analysis/core/position/position';
import { AnalysisContextClass } from '../../../analysis/core/analysis-context';
import { AnalysisStep, Step } from '../../../analysis/core/analysis.interface';

export class Trading implements AnalysisStep {
  dependsOn: Step[] = ['TradingSignal'];
  name: Step = 'Trading';

  execute(context: AnalysisContextClass): void {
    // alle dataPoints durchlaufen
    // für jeden dataPoint prüfen,
    //    TradingSignal prüfen
    //      => Preis wird durch yValueAccesor bestimmt
    //    ob ein StopLoss getroffen wurde
    //      => Wird durch Tiefstkurs bestimmt
    // Kauf Verkauf erfassen
    const tradingSignals = context.getTradingSignals();
    if (!tradingSignals || tradingSignals.length === 0) return;

    const dataPoints = context.getEnrichedDataPoints();
    const yYalueAccessor = context.buildYValueAccessor();
    const ticker = context.getOptions().getTicker().getTicker();
    const account = context.getAccount();
    const moneyManagement = context.buildMoneyManagement();
    const riskManagement = context.buildRiskManagement();
    const portfolio = context.getPortfolio();

    dataPoints.forEach((dataPoint) => {
      const price = yYalueAccessor(dataPoint);

      if (portfolio.hasOpenPositions()) {
        const openPositions = portfolio.getOpenPositions();
        openPositions.forEach((position) => {
          const stopLossPrice = position.getStopLossPrice();

          if (
            stopLossPrice !== undefined &&
            dataPoint.getDataPoint().getLowPrice() <= stopLossPrice
          ) {
            const id = position.getIdentifier();
            portfolio.closePosition(id, stopLossPrice);
          }
        });
      }
      const tradingSignal = tradingSignals.find(
        (signal) =>
          signal.dataPoint.getDataPoint().getPriceDateIsoDate() ===
          dataPoint.getDataPoint().getPriceDateIsoDate(),
      );

      if (tradingSignal && tradingSignal.type === 'buy') {
        const position = new Position({
          entryDate: dataPoint.getDataPoint().getPriceDate(),
          entryPrice: price,
          shares: moneyManagement(account.getCash(), price),
          ticker,
        });
        position.setStopLossPrice(riskManagement(dataPoint, yYalueAccessor));
        portfolio.openPosition(position);
      }

      if (tradingSignal && tradingSignal.type === 'sell') {
        const openPositions = portfolio.getOpenPositions();
        const positionToClose = openPositions.find((position) =>
          position.isPosition(ticker),
        );

        if (positionToClose) {
          const id = positionToClose.getIdentifier();
          portfolio.closePosition(id, price);
        }
      }
    });
  }
}
