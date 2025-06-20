import { EnrichedDataPoint } from '../../digital-signal-processing/dto/enriched-data-point/enriched-data-point';
import { AnalysisStep, Step } from './pipeline.interface';

export class MovingAverage implements AnalysisStep {
  dependsOn: Step[] = [];

  execute(context: EnrichedDataPoint[]): void {
    console.log('MovingAverage executed');
  }
}
