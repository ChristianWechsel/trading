import { EnrichedDataPoint } from 'src/digital-signal-processing/dto/enriched-data-point/enriched-data-point';
import { AnalysisStep } from './pipeline.interface';

export class AnalysisPipeline {
  constructor(private steps: AnalysisStep[]) {}

  run(data: EnrichedDataPoint[]) {
    for (const step of this.steps) {
      step.execute(data);
    }
  }
}
