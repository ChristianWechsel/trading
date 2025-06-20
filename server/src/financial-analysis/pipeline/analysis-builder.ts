import { MovingAverage } from './moving-average';
import { AnalysisStep, Step } from './pipeline.interface';
import { SwingPointDetection } from './swing-point-detection';
import { TrendChannelCalculation } from './trend-channel-calculation';
import { TrendDetection } from './trend-detection';

export class AnalysisBuilder {
  private steps = new Map<Step, AnalysisStep>();

  addStep(step: Step): void {
    if (!this.steps.has(step)) {
      const newStep = this.factoryStep(step);
      for (const dependency of newStep.dependsOn) {
        if (!this.steps.has(dependency)) {
          this.addStep(dependency);
        }
      }
      this.steps.set(step, newStep);
    }
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
