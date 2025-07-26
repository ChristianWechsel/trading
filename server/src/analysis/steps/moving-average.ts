import { AnalysisContextClass } from '../core/analysis-context';
import { AnalysisStep, Step } from '../core/analysis.interface';

export class MovingAverage implements AnalysisStep {
  name: Step = 'MovingAverage';
  dependsOn: Step[] = [];

  execute(context: AnalysisContextClass): void {
    console.log('MovingAverage executed');
  }
}
