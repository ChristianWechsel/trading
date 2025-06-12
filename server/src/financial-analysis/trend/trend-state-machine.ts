import { SwingPointData } from 'src/digital-signal-processing/swing-points/swing-points.interface';
import { State } from './states';

export class TrendStateMachine {
  constructor(private currentState: State) {}

  process(swingPoint: SwingPointData): void {
    this.currentState = this.currentState.process(swingPoint);
  }
}
