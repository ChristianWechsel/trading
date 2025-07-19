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
  }

  private checkData(data: EnrichedDataPoint[]) {
    if (data.length < this.options.period) {
      throw new Error(
        `Not enough data points for period=${this.options.period}`,
      );
    }
  }
}
