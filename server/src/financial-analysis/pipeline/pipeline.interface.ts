import { EnrichedDataPoint } from '../../digital-signal-processing/dto/enriched-data-point/enriched-data-point';

export interface AnalysisStep {
  execute(context: EnrichedDataPoint[]): void;
  readonly dependsOn: Step[];
}

export type Step =
  | 'MovingAverage'
  | 'SwingPointDetection'
  | 'TrendDetection'
  | 'TrendChannelCalculation';
