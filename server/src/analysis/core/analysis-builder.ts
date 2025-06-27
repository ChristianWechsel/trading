import { MovingAverage } from '../steps/moving-average';
import { SwingPointDetection } from '../steps/swing-point-detection/swing-point-detection';
import { TrendChannelCalculation } from '../steps/trend-channel-calculation';
import { TrendDetection } from '../steps/trend-detection/trend-detection';
import { AnalysisPipeline } from './analysis-pipeline';
import { AnalysisStep, Step } from './analysis.interface';

export class AnalysisBuilder {
  private steps: AnalysisStep[] = [];
  private configuration: {
    SwingPointDetection: ConstructorParameters<typeof SwingPointDetection>;
    TrendDetection: ConstructorParameters<typeof TrendDetection>;
  };

  constructor() {
    this.configuration = {
      SwingPointDetection: [{ relativeThreshold: 0.01, windowSize: 1 }],
      TrendDetection: [{ relativeThreshold: 0.01 }],
    };
  }

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
        return new SwingPointDetection(
          ...this.configuration.SwingPointDetection,
        );
      case 'TrendDetection':
        return new TrendDetection(...this.configuration.TrendDetection);
      case 'TrendChannelCalculation':
        return new TrendChannelCalculation();
      default:
        throw new Error(`Unknown analysis step`);
    }
  }
}
