import { EnrichedDataPoint } from '../../digital-signal-processing/dto/enriched-data-point/enriched-data-point';
import { AnalysisStep, Step } from './pipeline.interface';

export class TrendDetection implements AnalysisStep {
  dependsOn: Step[] = ['SwingPointDetection'];

  execute(context: EnrichedDataPoint[]): void {
    console.log('TrendDetection executed');
  }
}
