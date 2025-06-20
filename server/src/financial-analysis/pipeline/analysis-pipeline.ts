import { EnrichedDataPoint } from '../../digital-signal-processing/dto/enriched-data-point/enriched-data-point';
import { AnalysisStep } from './pipeline.interface';

export class AnalysisPipeline {
  constructor(private steps: AnalysisStep[]) {}

  run(data: EnrichedDataPoint[]) {
    const clonedData = data.map((datum) => datum.clone());

    for (const step of this.steps) {
      step.execute(clonedData);
    }

    return clonedData;
  }
}
