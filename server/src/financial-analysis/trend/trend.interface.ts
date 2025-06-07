import { DataPoint } from '../../digital-signal-processing/digital-signal-processing.interface';

export type TrendType = 'upward' | 'downward' | 'sideways';
export type TrendData = {
  trendType: TrendType;
  startPoint: DataPoint;
  endPoint: DataPoint;
};
