import { AnalysisPipeline } from './analysis-pipeline';
import { MovingAverage } from './moving-average';
import { AnalysisStep, Step } from './pipeline.interface';
import { SwingPointDetection } from './swing-point-detection';
import { TrendChannelCalculation } from './trend-channel-calculation';
import { TrendDetection } from './trend-detection';

export class AnalysisBuilder {
  private steps: AnalysisStep[] = [];

  addStep(step: Step): void {
    if (!this.has(step)) {
      const newStep = this.factoryStep(step);
      for (const dependency of newStep.dependsOn) {
        if (!this.has(dependency)) {
          this.addStep(dependency);
        }
      }
      this.add(newStep);
    }
  }

  build(): AnalysisPipeline {
    return new AnalysisPipeline(this.steps);
  }

  private has(step: Step): boolean {
    return this.steps.some((s) => s.name === step);
  }

  private add(step: AnalysisStep): void {
    this.steps.push(step);
  }

  private factoryStep(step: Step): AnalysisStep {
    switch (step) {
      case 'MovingAverage':
        return new MovingAverage();
      case 'SwingPointDetection':
        return new SwingPointDetection();
      case 'TrendDetection':
        return new TrendDetection();
      case 'TrendChannelCalculation':
        return new TrendChannelCalculation();
      default:
        throw new Error(`Unknown analysis step`);
    }
  }
}
