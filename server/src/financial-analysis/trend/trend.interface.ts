import { SwingPointData } from 'src/digital-signal-processing/swing-points/swing-points.interface';
import { DataPoint } from '../../digital-signal-processing/digital-signal-processing.interface';
import { Memory } from './memory';
import { State } from './states';

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

export type TransitionCallback = (values: {
  state: State;
  memory: Memory<TrendAnalysisPoint>;
}) => void;
