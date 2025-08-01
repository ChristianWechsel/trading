import { AnalysisContextClass } from './analysis-context';
import { EnrichedDataPoint } from './enriched-data-point';

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
  execute(context: AnalysisContextClass): void;
  readonly dependsOn: Step[];
  readonly name: Step;
}

export type Step =
  | 'MovingAverage'
  | 'SwingPointDetection'
  | 'TrendChannelCalculation'
  | 'TrendDetection'
  | 'AverageTrueRange'
  | 'TradingSignal';

export type TradingSignal = {
  type: 'buy' | 'sell';
  dataPoint: EnrichedDataPoint;
  reason: 'Upward trend started' | 'Upward trend ended';
};
