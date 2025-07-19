import { OHLCV } from 'src/data-aggregation/ohlcv.entity';
import { AnalysisContext, AnalysisStep } from './analysis.interface';

export class AnalysisPipeline {
  constructor(private steps: AnalysisStep[]) {
    this.validateDependencies();
  }

  run(ohlcvs: OHLCV[]) {
    const context: AnalysisContext = {
      enrichedDataPoints: [], //ohlcvs.map((datum) => datum.clone()),
    };
    for (const step of this.steps) {
      step.execute(context);
    }

    return context;
  }

  private validateDependencies(): void {
    const configuredSteps = this.steps.map((step) => step.name);

    for (const step of this.steps) {
      for (const dependency of step.dependsOn) {
        // Dieser Fehler sollte dank des Builders nie auftreten, ist aber eine gute Absicherung.
        if (!configuredSteps.includes(dependency)) {
          throw new Error(
            `Missing dependency: '${step.name}' requires '${dependency}', which is not configured in the pipeline.`,
          );
        }
        // Bonus: Reihenfolge prüfen
        const dependencyIndex = configuredSteps.indexOf(dependency);
        const stepIndex = configuredSteps.indexOf(step.name);
        if (dependencyIndex > stepIndex) {
          throw new Error(
            `Invalid order: '${dependency}' must run before '${step.name}'.`,
          );
        }
      }
    }
  }
}
