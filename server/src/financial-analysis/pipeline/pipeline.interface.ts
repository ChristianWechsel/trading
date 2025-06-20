import {
  EnrichedDataPoint,
  SwingPointType,
} from '../../digital-signal-processing/dto/enriched-data-point/enriched-data-point';
import { TrendDataMetadata } from '../trend/trend-detection/trend-detection.interface';

export type AnalysisContext = {
  enrichedDataPoints: EnrichedDataPoint[]; // sammelt alle Daten zu einem Datenpunkt

  // übergeordnete Daten, welche sich nicht einem einzelnen Datenpunkt zuordnen lassen
  trendData: TrendDataMetadata['trendData'][];
  swingPoints: SwingPointType[];
};

export interface AnalysisStep {
  execute(context: AnalysisContext): void;
  readonly dependsOn: Step[];
  readonly name: Step;
}

export type Step =
  | 'MovingAverage'
  | 'SwingPointDetection'
  | 'TrendChannelCalculation'
  | 'TrendDetection';
