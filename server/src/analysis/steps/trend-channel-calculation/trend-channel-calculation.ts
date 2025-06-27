import {
  AnalysisContext,
  AnalysisStep,
  Step,
} from '../../core/analysis.interface';

export class TrendChannelCalculation implements AnalysisStep {
  name: Step = 'TrendChannelCalculation';
  dependsOn: Step[] = ['TrendDetection'];

  execute(context: AnalysisContext): void {
    console.log('TrendChannelCalculation executed');
    // Fallunterscheidung
    //  Es gibt keinen Trend
    //  Es gibt einen Trend
    //  Es gibt mehrere Trends (getrennt, überlappend)

    // PRÜFUNG: Sind die benötigten Daten (trends) vorhanden?
    // if (!context.trends || context.trends.length === 0) {
    //   throw new Error(
    //     'Voraussetzung nicht erfüllt: ChannelCalculationStep benötigt die Ergebnisse von TrendDetectionStep. Bitte fügen Sie TrendDetectionStep vor diesem Schritt zur Pipeline hinzu.'
    //   );
    // }
  }
}
