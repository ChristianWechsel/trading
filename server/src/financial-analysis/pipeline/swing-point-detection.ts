import { EnrichedDataPoint } from '../../digital-signal-processing/dto/enriched-data-point/enriched-data-point';
import { AnalysisStep, Step } from './pipeline.interface';

export class SwingPointDetection implements AnalysisStep {
  dependsOn: Step[] = [];

  execute(context: EnrichedDataPoint[]): void {
    console.log('SwingPointDetection executed');
  }
}
