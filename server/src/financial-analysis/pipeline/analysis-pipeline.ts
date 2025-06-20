import { EnrichedDataPoint } from '../../digital-signal-processing/dto/enriched-data-point/enriched-data-point';
import { AnalysisStep } from './pipeline.interface';

export class AnalysisPipeline {
  constructor(private steps: AnalysisStep[]) {
    this.validateDependencies();
  }

  run(data: EnrichedDataPoint[]) {
    const clonedData = data.map((datum) => datum.clone());

    for (const step of this.steps) {
      step.execute(clonedData);
    }

    return clonedData;
  }

  private validateDependencies(): void {
    const configuredSteps = this.steps.map((step) => step.constructor.name);

    for (const step of this.steps) {
      for (const dependency of step.dependsOn) {
        if (!configuredSteps.includes(dependency)) {
          throw new Error(
            `Missing dependency: '${step.constructor.name}' requires '${dependency}', which is not configured in the pipeline.`,
          );
        }
      }
    }
  }
}
