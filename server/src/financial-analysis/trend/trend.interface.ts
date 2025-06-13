import { SwingPointData } from 'src/digital-signal-processing/swing-points/swing-points.interface';
import { DataPoint } from '../../digital-signal-processing/digital-signal-processing.interface';

export type TrendType = 'upward' | 'downward' | 'sideways';

export type TrendData = {
  trendType: TrendType;
  startPoint: DataPoint;
  endPoint?: DataPoint;
};

export type TrendAnalysisPoint = {
  swingPoint: SwingPointData;
  characteristic: 'start-trend' | 'end-trend' | 'none';
};
