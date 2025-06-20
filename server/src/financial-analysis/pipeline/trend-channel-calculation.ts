import { EnrichedDataPoint } from '../../digital-signal-processing/dto/enriched-data-point/enriched-data-point';
import { AnalysisStep, Step } from './pipeline.interface';

export class TrendChannelCalculation implements AnalysisStep {
  name: Step = 'TrendChannelCalculation';
  dependsOn: Step[] = ['TrendDetection'];

  execute(context: EnrichedDataPoint[]): void {
    console.log('TrendChannelCalculation executed');
    // PRÜFUNG: Sind die benötigten Daten (trends) vorhanden?
    // if (!context.trends || context.trends.length === 0) {
    //   throw new Error(
    //     'Voraussetzung nicht erfüllt: ChannelCalculationStep benötigt die Ergebnisse von TrendDetectionStep. Bitte fügen Sie TrendDetectionStep vor diesem Schritt zur Pipeline hinzu.'
    //   );
    // }
  }
}
