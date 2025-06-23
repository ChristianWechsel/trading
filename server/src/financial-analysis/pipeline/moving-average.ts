import {
  AnalysisContext,
  AnalysisStep,
  Step,
} from '../../analysis/core/analysis.interface';

export class MovingAverage implements AnalysisStep {
  name: Step = 'MovingAverage';
  dependsOn: Step[] = [];

  execute(context: AnalysisContext): void {
    console.log('MovingAverage executed');
  }
}
