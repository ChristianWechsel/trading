import { AnalysisContextClass } from '../../../analysis/core/analysis-context';
import { EnrichedDataPoint } from '../../../analysis/core/enriched-data-points/enriched-data-point';
import { OHLCV } from '../../../data-aggregation/ohlcv.entity';
import { analysisConfig } from '../../config/analysis.config';
import { AnalysisStep, Step } from '../../core/analysis.interface';

export class AverageTrueRange implements AnalysisStep {
  dependsOn: Step[] = [];
  name: Step = 'AverageTrueRange';

  private readonly startPeriod = analysisConfig.averageTrueRange.MIN_PERIOD - 1;

  execute(context: AnalysisContextClass): void {
    const data = context.getEnrichedDataPoints();
    const period = context.getOptions().getAverageTrueRange().getPeriod();
    this.checkData(data, period);
    this.getAverageTrueRange(data, period);
  }

  private checkData(data: EnrichedDataPoint[], period: number) {
    if (data.length < period) {
      throw new Error(`Not enough data points for period=${period}`);
    }
  }

  private getAverageTrueRange(data: EnrichedDataPoint[], period: number) {
    let n = this.startPeriod;

    // Berechnung des True Range für die ersten Perioden
    let accumulatedTrueRangeFirstPeriod = 0;
    let previousATR = 0;

    while (n <= period - 1) {
      const previous = data[n - 1];
      const current = data[n];
      const calculatedTrueRange = this.calculateTrueRange(
        previous.getDataPoint(),
        current.getDataPoint(),
      );
      accumulatedTrueRangeFirstPeriod += calculatedTrueRange;
      const trueRange = accumulatedTrueRangeFirstPeriod / n;
      previousATR = trueRange;
      current.setAverageTrueRange(trueRange);

      n++;
    }

    // Berechnung des geglätteten ATR für die restlichen Perioden
    while (n < data.length) {
      const previous = data[n - 1];
      const current = data[n];
      const calculatedTrueRange = this.calculateTrueRange(
        previous.getDataPoint(),
        current.getDataPoint(),
      );
      const averageTrueRange =
        (previousATR * (period - 1) + calculatedTrueRange) / period;

      current.setAverageTrueRange(averageTrueRange);
      previousATR = averageTrueRange;
      n++;
    }
  }

  private calculateTrueRange(previous: OHLCV, current: OHLCV) {
    const highLow = current.getHighPrice() - current.getLowPrice();
    const highClose = Math.abs(
      current.getHighPrice() - previous.getClosePrice(),
    );
    const lowClose = Math.abs(current.getLowPrice() - previous.getClosePrice());

    return Math.max(highLow, highClose, lowClose);
  }
}
