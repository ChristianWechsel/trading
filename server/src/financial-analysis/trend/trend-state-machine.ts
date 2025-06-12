import { SwingPointData } from 'src/digital-signal-processing/swing-points/swing-points.interface';
import { Memory } from './memory';
import { State } from './states';

export class TrendStateMachine {
  private swingPointStore: Memory<SwingPointData> =
    new Memory<SwingPointData>();

  constructor(
    private currentState: State,
    private onTransition: (state: State) => void,
  ) {}

  process(swingPoint: SwingPointData): void {
    this.swingPointStore.add(swingPoint);
    this.currentState = this.currentState.process(
      this.swingPointStore,
      this.onTransition,
    );
  }
}
