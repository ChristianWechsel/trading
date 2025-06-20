import { EnrichedDataPoint } from '../../digital-signal-processing/dto/enriched-data-point/enriched-data-point';
import { AnalysisStep, Steps } from './pipeline.interface';

export class MovingAverage implements AnalysisStep {
  dependsOn: Steps[] = [];

  execute(context: EnrichedDataPoint[]): void {
    console.log('MovingAverage executed');
  }
}
