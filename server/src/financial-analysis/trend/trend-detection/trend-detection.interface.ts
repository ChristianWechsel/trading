import { ComparableNumber } from '../../../analysis/steps/utils/comparable-number/comparable-number';
import { DataPoint } from '../../../digital-signal-processing/digital-signal-processing.interface';
import { TrendDirection } from '../../../digital-signal-processing/dto/enriched-data-point/enriched-data-point';
import { SwingPointData } from '../../../digital-signal-processing/swing-points/swing-points.interface';
import { Memory } from '../../memory/memory';
import { State } from './trend-detection-states';

export type TrendDataMetadata = {
  trendData: {
    type: TrendDirection;
    startPoint: DataPoint<number>;
    endPoint?: DataPoint<number>;
  };
  metaddata: { statusTrend: 'ongoing' | 'finished' };
};

export type TrendAnalysisPoint = {
  swingPoint: SwingPointData<ComparableNumber>;
};

export type TransitionCallback = (values: {
  newState: State;
  oldState?: State;
  memory: Memory<TrendAnalysisPoint>;
}) => void;
