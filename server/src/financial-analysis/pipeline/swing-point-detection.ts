import {
  AnalysisContext,
  AnalysisStep,
  Step,
} from '../../analysis/core/analysis.interface';

export class SwingPointDetection implements AnalysisStep {
  name: Step = 'SwingPointDetection';
  dependsOn: Step[] = [];

  execute(context: AnalysisContext): void {
    console.log('SwingPointDetection executed');
  }
}
