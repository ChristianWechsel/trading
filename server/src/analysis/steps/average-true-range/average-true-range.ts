import {
  AnalysisContext,
  AnalysisStep,
  Step,
} from '../../core/analysis.interface';

export class AverageTrueRange implements AnalysisStep {
  dependsOn: Step[];
  name: Step = 'AverageTrueRange';
  execute(context: AnalysisContext): void {
    throw new Error('Method not implemented.');
  }
}
