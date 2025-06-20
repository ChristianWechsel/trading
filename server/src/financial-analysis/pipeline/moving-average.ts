import { AnalysisContext, AnalysisStep, Step } from './pipeline.interface';

export class MovingAverage implements AnalysisStep {
  name: Step = 'MovingAverage';
  dependsOn: Step[] = [];

  execute(context: AnalysisContext): void {
    console.log('MovingAverage executed');
  }
}
