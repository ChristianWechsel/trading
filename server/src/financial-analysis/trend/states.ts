import { SwingPointData } from 'src/digital-signal-processing/swing-points/swing-points.interface';
import { Memory } from './memory';

interface Transistion {
  isApplicable(swingPointStore: Memory<SwingPointData>): boolean;
}

export abstract class State {
  protected connections: { transistion: Transistion; state: State }[] = [];

  constructor(
    private swingPointStore: Memory<SwingPointData>,
    private onTransition: (state: State) => void,
  ) {}

  setConnections(
    connections: { transistion: Transistion; state: State }[],
  ): void {
    this.connections = connections;
  }

  process(swingPoint: SwingPointData): State {
    this.swingPointStore.add(swingPoint);
    this.onState();
    return this.onExit();
  }

  protected abstract onState(): void;
  protected onExit(): State {
    for (const { transistion, state } of this.connections) {
      if (transistion.isApplicable(this.swingPointStore)) {
        this.onTransition(state);
        return state;
      }
    }
    return this;
  }
}

class Always implements Transistion {
  isApplicable(): boolean {
    return true;
  }
}

class SwingHighTransistion implements Transistion {
  isApplicable(swingPointStore: Memory<SwingPointData>): boolean {
    return swingPointStore.getLast()?.swingPointType === 'swingHigh';
  }
}

class SwingLowTransistion implements Transistion {
  isApplicable(swingPointStore: Memory<SwingPointData>): boolean {
    return swingPointStore.getLast()?.swingPointType === 'swingLow';
  }
}

class StartState extends State {
  protected onState(): void {}
}
class UpwardTrendStart extends State {
  protected onState(): void {}
}
class DownwardTrendStart extends State {
  protected onState(): void {}
}
class UpwardTrendFirstCheck extends State {
  protected onState(): void {}
}
class UpwardTrendSecondCheck extends State {
  protected onState(): void {}
}
export class UpwardTrendConfirmed extends State {
  protected onState(): void {}
}
class DownwardTrendFirstCheck extends State {
  protected onState(): void {}
}
class DownwardTrendSecondCheck extends State {
  protected onState(): void {}
}
export class DownwardTrendConfirmed extends State {
  protected onState(): void {}
}

export function getStartState(onTransition: (state: State) => void): State {
  const swingPointStore = new Memory<SwingPointData>();
  const startState = new StartState(swingPointStore, onTransition);
  const upwardTrendStart = new UpwardTrendStart(swingPointStore, onTransition);
  const downwardTrendStart = new DownwardTrendStart(
    swingPointStore,
    onTransition,
  );
  const upwardTrendFirstCheck = new UpwardTrendFirstCheck(
    swingPointStore,
    onTransition,
  );
  const upwardTrendSecondCheck = new UpwardTrendSecondCheck(
    swingPointStore,
    onTransition,
  );
  const upwardTrendConfirmed = new UpwardTrendConfirmed(
    swingPointStore,
    onTransition,
  );
  const downwardTrendFirstCheck = new DownwardTrendFirstCheck(
    swingPointStore,
    onTransition,
  );
  const downwardTrendSecondCheck = new DownwardTrendSecondCheck(
    swingPointStore,
    onTransition,
  );
  const downwardTrendConfirmed = new DownwardTrendConfirmed(
    swingPointStore,
    onTransition,
  );
  // const warningState = new WarningState();
  // const brokenState = new BrokenState();

  startState.setConnections([
    {
      transistion: new SwingLowTransistion(),
      state: upwardTrendFirstCheck,
    },
    {
      transistion: new SwingHighTransistion(),
      state: downwardTrendFirstCheck,
    },
  ]);

  upwardTrendStart.setConnections([]);

  upwardTrendFirstCheck.setConnections([
    {
      transistion: new SwingHighTransistion(),
      state: upwardTrendSecondCheck,
    },
    { transistion: new SwingLowTransistion(), state: startState },
  ]);

  upwardTrendSecondCheck.setConnections([
    { transistion: new SwingLowTransistion(), state: upwardTrendConfirmed },
    { transistion: new SwingHighTransistion(), state: startState },
  ]);

  downwardTrendStart.setConnections([]);

  downwardTrendFirstCheck.setConnections([
    { transistion: new SwingLowTransistion(), state: downwardTrendSecondCheck },
    { transistion: new SwingHighTransistion(), state: startState },
  ]);

  downwardTrendSecondCheck.setConnections([
    { transistion: new SwingHighTransistion(), state: downwardTrendConfirmed },
    { transistion: new SwingLowTransistion(), state: startState },
  ]);
  return startState;
}
