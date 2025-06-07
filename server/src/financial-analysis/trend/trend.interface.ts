import { DataPoint } from '../../digital-signal-processing/digital-signal-processing.interface';

export type TrendType = 'upward' | 'downward' | 'sideways';
type State = 'not confirmed' | 'confirmed' | 'warning' | 'broken';

export type TrendData = {
  trendType: TrendType;
  startPoint: DataPoint;
  endPoint?: DataPoint;
};

export type WrappedTrendData = {
  trend: TrendData;
  state: State;
  warningAt?: DataPoint;
};
