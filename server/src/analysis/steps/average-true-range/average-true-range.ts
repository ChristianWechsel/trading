import { OHLCV } from '../../../data-aggregation/ohlcv.entity';
import { analysisConfig } from '../../config/analysis.config';
import {
  AnalysisContext,
  AnalysisStep,
  Step,
} from '../../core/analysis.interface';
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

  execute(context: AnalysisContext): void {
    const data = context.enrichedDataPoints;
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
    let period = this.startPeriod;
    while (period < data.length) {
      const previous = data[period - 1];
      const current = data[period];
      const trueRange = this.calculateTrueRange(
        previous.getDataPoint(),
        current.getDataPoint(),
      );
      current.setAverageTrueRange(trueRange);

      period++;
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
