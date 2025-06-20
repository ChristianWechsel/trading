import { EnrichedDataPoint } from '../../digital-signal-processing/dto/enriched-data-point/enriched-data-point';

export interface AnalysisStep {
  execute(context: EnrichedDataPoint[]): void;
  readonly dependsOn: Steps[];
}

export type Steps =
  | 'MovingAverage'
  | 'SwingPointDetection'
  | 'TrendDetection'
  | 'TrendChannelCalculation';
