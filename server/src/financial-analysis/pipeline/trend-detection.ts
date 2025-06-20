import { AnalysisContext, AnalysisStep, Step } from './pipeline.interface';

export class TrendDetection implements AnalysisStep {
  name: Step = 'TrendDetection';
  dependsOn: Step[] = ['SwingPointDetection'];

  execute(context: AnalysisContext): void {
    console.log('TrendDetection executed');
  }
}
