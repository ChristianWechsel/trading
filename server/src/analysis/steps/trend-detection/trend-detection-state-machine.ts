import { Memory } from '../utils/memory/memory';
import { StartState, State } from './trend-detection-states';
import {
  SwingPointData,
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

  process(swingPoint: SwingPointData): void {
    this.currentState = this.currentState.process(swingPoint);
  }
}
