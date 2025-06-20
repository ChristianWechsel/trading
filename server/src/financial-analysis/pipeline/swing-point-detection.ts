import { EnrichedDataPoint } from '../../digital-signal-processing/dto/enriched-data-point/enriched-data-point';
import { AnalysisStep, Steps } from './pipeline.interface';

export class SwingPointDetection implements AnalysisStep {
  dependsOn: Steps[] = [];

  execute(context: EnrichedDataPoint[]): void {
    console.log('SwingPointDetection executed');
  }
}
