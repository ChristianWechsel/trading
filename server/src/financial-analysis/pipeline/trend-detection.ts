import { EnrichedDataPoint } from '../../digital-signal-processing/dto/enriched-data-point/enriched-data-point';
import { AnalysisStep, Steps } from './pipeline.interface';

export class TrendDetection implements AnalysisStep {
  dependsOn: Steps[] = ['SwingPointDetection'];

  execute(context: EnrichedDataPoint[]): void {
    console.log('TrendDetection executed');
  }
}
