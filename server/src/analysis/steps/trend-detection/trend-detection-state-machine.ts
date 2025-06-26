import { SwingPointData } from '../../../digital-signal-processing/swing-points/swing-points.interface';
import {
  TransitionCallback,
  TrendAnalysisPoint,
} from '../../../financial-analysis/trend/trend-detection/trend-detection.interface';
import { ComparableNumber } from '../utils/comparable-number/comparable-number';
import { Memory } from '../utils/memory/memory';
import { StartState, State } from './trend-detection-states';

export class TrendDetectionStateMachine {
  private currentState: State;
  private memory: Memory<TrendAnalysisPoint>;

  constructor(onTransition: TransitionCallback) {
    this.memory = new Memory<TrendAnalysisPoint>();
    this.currentState = new StartState(this.memory, onTransition);
  }

  process(swingPoint: SwingPointData<ComparableNumber>): void {
    this.currentState = this.currentState.process(swingPoint);
  }
}
