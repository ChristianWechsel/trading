import { AverageTrueRange } from '../steps/average-true-range/average-true-range';
import { MovingAverage } from '../steps/moving-average';
import { SwingPointDetection } from '../steps/swing-point-detection/swing-point-detection';
import { TrendChannelCalculation } from '../steps/trend-channel-calculation/trend-channel-calculation';
import { TrendDetection } from '../steps/trend-detection/trend-detection';
import { AnalysisPipeline } from './analysis-pipeline';
import { AnalysisStep, Step } from './analysis.interface';

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
      case 'AverageTrueRange':
        return new AverageTrueRange();
      default:
        throw new Error(`Unknown analysis step`);
    }
  }
}
