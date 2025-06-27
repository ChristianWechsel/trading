import { EnrichedDataPoint } from './enriched-data-point';

export type AnalysisContext = {
  enrichedDataPoints: EnrichedDataPoint[]; // sammelt alle Daten zu einem Datenpunkt

  // übergeordnete Daten, welche sich nicht einem einzelnen Datenpunkt zuordnen lassen
  trends?: TrendDataMetadata['trendData'][];
};

export type TrendDataMetadata = {
  trendData: {
    type: 'upward' | 'downward';
    startPoint: Pick<DataPoint<number>, 'x'>;
    endPoint?: Pick<DataPoint<number>, 'x'>;
  };
  metaddata: { statusTrend: 'ongoing' | 'finished' };
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

export type DataPoint<T> = {
  x: T;
  y: T;
};
