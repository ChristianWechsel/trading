import { StepOptionsDto } from '../analysis-query.dto';
import { AverageTrueRange } from '../steps/average-true-range/average-true-range';
import { MovingAverage } from '../steps/moving-average';
import { SwingPointDetection } from '../steps/swing-point-detection/swing-point-detection';
import { TrendChannelCalculation } from '../steps/trend-channel-calculation/trend-channel-calculation';
import { TrendDetection } from '../steps/trend-detection/trend-detection';
import { AnalysisPipeline } from './analysis-pipeline';
import { AnalysisStep, Step } from './analysis.interface';

type StepConfiguration = {
  swingPointDetection: { relativeThreshold: number; windowSize: number };
  trendDetection: { relativeThreshold: number };
  averageTrueRange: { period: number };
};

export class AnalysisBuilder {
  private steps: AnalysisStep[] = [];
  private configuration: StepConfiguration;

  constructor(options?: StepOptionsDto) {
    const defaultConfiguration: StepConfiguration = {
      swingPointDetection: { relativeThreshold: 0.01, windowSize: 1 },
      trendDetection: { relativeThreshold: 0.01 },
      averageTrueRange: { period: 14 },
    };
    this.configuration = {
      swingPointDetection: {
        ...defaultConfiguration.swingPointDetection,
        ...(options?.swingPointDetection ?? {}),
      },
      trendDetection: {
        ...defaultConfiguration.trendDetection,
        ...(options?.trendDetection ?? {}),
      },
      averageTrueRange: {
        ...defaultConfiguration.averageTrueRange,
        ...(options?.averageTrueRange ?? {}),
      },
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
        return new SwingPointDetection(this.configuration.swingPointDetection);
      case 'TrendDetection':
        return new TrendDetection(this.configuration.trendDetection);
      case 'TrendChannelCalculation':
        return new TrendChannelCalculation();
      case 'AverageTrueRange':
        return new AverageTrueRange(this.configuration.averageTrueRange);
      default:
        throw new Error(`Unknown analysis step`);
    }
  }
}
