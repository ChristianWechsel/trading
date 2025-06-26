import { State } from '../../../analysis/steps/trend-detection/trend-detection-states';
import { ComparableNumber } from '../../../analysis/steps/utils/comparable-number/comparable-number';
import { Memory } from '../../../analysis/steps/utils/memory/memory';
import { SwingPointData } from '../../../digital-signal-processing/swing-points/swing-points.interface';

export type TrendAnalysisPoint = {
  swingPoint: SwingPointData<ComparableNumber>;
};

export type TransitionCallback = (values: {
  newState: State;
  oldState?: State;
  memory: Memory<TrendAnalysisPoint>;
}) => void;
