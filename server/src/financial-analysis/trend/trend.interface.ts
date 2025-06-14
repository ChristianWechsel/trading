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

export type TrendDataMetadata = {
  trendData: TrendData;
  metaddata: { statusTrend: 'ongoing' | 'finished' };
};

export type TrendAnalysisPoint = {
  swingPoint: SwingPointData;
};

export type TransitionCallback = (values: {
  newState: State;
  oldState?: State;
  memory: Memory<TrendAnalysisPoint>;
}) => void;
