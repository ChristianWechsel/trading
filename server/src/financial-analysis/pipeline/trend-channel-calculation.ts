import { EnrichedDataPoint } from '../../digital-signal-processing/dto/enriched-data-point/enriched-data-point';
import { AnalysisStep } from './pipeline.interface';

export class TrendChannelCalculation implements AnalysisStep {
  execute(context: EnrichedDataPoint[]): void {
    console.log('TrendChannelCalculation executed');
  }
}
