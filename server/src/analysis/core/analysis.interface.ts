import { AnalysisContextClass } from './analysis-context';
import { EnrichedDataPoint } from './enriched-data-points/enriched-data-point';

export type TrendDataMetadata = {
  trendData: {
    type: 'upward' | 'downward';
    start: EnrichedDataPoint;
    end?: EnrichedDataPoint;
    confirmation?: EnrichedDataPoint;
    warnings?: EnrichedDataPoint[];
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
  | 'TradingSignal'
  | 'Trading';

export type SignalForTrade = {
  type: 'buy' | 'sell';
  dataPoint: EnrichedDataPoint;
  reason: 'Upward trend started' | 'Upward trend ended';
};
