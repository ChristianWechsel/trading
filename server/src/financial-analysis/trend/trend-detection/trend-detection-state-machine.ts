import { ComparableNumber } from '../../../analysis/steps/utils/comparable-number/comparable-number';
import { SwingPointData } from '../../../digital-signal-processing/swing-points/swing-points.interface';
import { Memory } from '../../memory/memory';
import { StartState, State } from './trend-detection-states';
import {
  TransitionCallback,
  TrendAnalysisPoint,
} from './trend-detection.interface';

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
