import { SwingPointData } from 'src/digital-signal-processing/swing-points/swing-points.interface';
import { Memory } from './memory';

interface Transistion {
  isApplicable(memory: Memory<SwingPointData>): boolean;
}

export class State {
  protected connections: { transistion: Transistion; state: State }[] = [];

  setConnections(
    connections: { transistion: Transistion; state: State }[],
  ): void {
    this.connections = connections;
  }

  process(
    swingPointStore: Memory<SwingPointData>,
    onTransition: (state: State) => void,
  ): State {
    for (const { transistion, state } of this.connections) {
      if (transistion.isApplicable(swingPointStore)) {
        onTransition(state);
        return state;
      }
    }
    return this;
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

class StartState extends State {}
class UpwardTrendFirstCheck extends State {}
class UpwardTrendSecondCheck extends State {}
class UpwardTrendConfirmed extends State {}
class DownwardTrendFirstCheck extends State {}
class DownwardTrendSecondCheck extends State {}
class DownwardTrendConfirmed extends State {}

export const startState = new StartState();
const upwardTrendFirstCheck = new UpwardTrendFirstCheck();
const upwardTrendSecondCheck = new UpwardTrendSecondCheck();
const upwardTrendConfirmed = new UpwardTrendConfirmed();
const downwardTrendFirstCheck = new DownwardTrendFirstCheck();
const downwardTrendSecondCheck = new DownwardTrendSecondCheck();
const downwardTrendConfirmed = new DownwardTrendConfirmed();
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

downwardTrendFirstCheck.setConnections([
  { transistion: new SwingLowTransistion(), state: downwardTrendSecondCheck },
  { transistion: new SwingHighTransistion(), state: startState },
]);

downwardTrendSecondCheck.setConnections([
  { transistion: new SwingHighTransistion(), state: downwardTrendConfirmed },
  { transistion: new SwingLowTransistion(), state: startState },
]);
