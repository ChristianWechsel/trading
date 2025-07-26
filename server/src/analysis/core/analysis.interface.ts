import { EnrichedDataPoint } from './enriched-data-point';

export type AnalysisContext = {
  enrichedDataPoints: EnrichedDataPoint[];
  trends?: TrendDataMetadata['trendData'][];
};

export type TrendDataMetadata = {
  trendData: {
    type: 'upward' | 'downward';
    startPoint: EnrichedDataPoint;
    endPoint?: EnrichedDataPoint;
    channel?: TrendChannel;
  };
  metaddata: { statusTrend: 'ongoing' | 'finished' };
};

export type TrendChannel = {
  trendLine: Line;
  returnLine: Line;
};

// y = mx + b
type Line = {
  slope: number; // m
  yIntercept: number; // b
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
  | 'TrendDetection'
  | 'AverageTrueRange';
