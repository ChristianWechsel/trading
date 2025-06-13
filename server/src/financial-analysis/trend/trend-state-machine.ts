import { SwingPointData } from 'src/digital-signal-processing/swing-points/swing-points.interface';
import { Memory } from './memory';
import { StartState, State } from './states';
import { TransitionCallback, TrendAnalysisPoint } from './trend.interface';

export class TrendStateMachine {
  private currentState: State;
  private memory: Memory<TrendAnalysisPoint>;

  constructor(onTransition: TransitionCallback) {
    // Wir starten immer mit einem sauberen StartState.
    this.memory = new Memory<TrendAnalysisPoint>();
    this.currentState = new StartState(this.memory, onTransition);
  }

  process(swingPoint: SwingPointData): void {
    // Die process-Methode des aktuellen Zustands wird aufgerufen
    // und gibt den nächsten Zustand zurück (entweder sich selbst oder einen neuen).
    this.currentState = this.currentState.process(swingPoint);
  }
}
