import { AnalysisContextClass } from '../../../analysis/core/analysis-context';
import { OHLCV } from '../../../data-aggregation/ohlcv.entity';
import { analysisConfig } from '../../config/analysis.config';
import { AnalysisStep, Step } from '../../core/analysis.interface';
import { EnrichedDataPoint } from '../../core/enriched-data-point';

export class AverageTrueRange implements AnalysisStep {
  dependsOn: Step[] = [];
  name: Step = 'AverageTrueRange';

  private readonly startPeriod = analysisConfig.averageTrueRange.MIN_PERIOD - 1;

  constructor(private options: { period: number }) {
    if (!Number.isInteger(this.options.period) || this.options.period < 2) {
      throw new Error(
        `Period must be a natural number >= ${analysisConfig.averageTrueRange.MIN_PERIOD}`,
      );
    }
  }

  execute(context: AnalysisContextClass): void {
    const data = context.getEnrichedDataPoints();
    this.checkData(data);
    this.getAverageTrueRange(data);
  }

  private checkData(data: EnrichedDataPoint[]) {
    if (data.length < this.options.period) {
      throw new Error(
        `Not enough data points for period=${this.options.period}`,
      );
    }
  }

  private getAverageTrueRange(data: EnrichedDataPoint[]) {
    let n = this.startPeriod;

    // Berechnung des True Range für die ersten Perioden
    let accumulatedTrueRangeFirstPeriod = 0;
    let previousATR = 0;

    while (n <= this.options.period - 1) {
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
        (previousATR * (this.options.period - 1) + calculatedTrueRange) /
        this.options.period;

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
