import { DataPoint } from '../../core/analysis.interface';
import { SwingPointType } from '../../core/enriched-data-point';
import { ComparableNumber } from '../utils/comparable-number/comparable-number';
import { Memory } from '../utils/memory/memory';
import { State } from './trend-detection-states';

export type TransitionCallback = (values: {
  newState: State;
  oldState?: State;
  memory: Memory<TrendAnalysisPoint>;
}) => void;

export type TrendAnalysisPoint = {
  swingPoint: SwingPointData<ComparableNumber>;
};

export type SwingPointData<T> = {
  swingPointType: SwingPointType;
  point: DataPoint<T>;
};
