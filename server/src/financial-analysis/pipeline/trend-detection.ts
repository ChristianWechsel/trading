import { EnrichedDataPoint } from '../../digital-signal-processing/dto/enriched-data-point/enriched-data-point';
import { AnalysisStep } from './pipeline.interface';

export class TrendDetection implements AnalysisStep {
  execute(context: EnrichedDataPoint[]): void {
    console.log('TrendDetection executed');
  }
}
