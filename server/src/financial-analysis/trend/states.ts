import { SwingPointData } from 'src/digital-signal-processing/swing-points/swing-points.interface';
import { Memory } from './memory';
import { TrendAnalysisPoint } from './trend.interface';

interface Transistion {
  isApplicable(trendAnalysisPoints: Memory<TrendAnalysisPoint>): boolean;
}

export abstract class State {
  protected connections: { transistion: Transistion; state: State }[] = [];

  constructor(
    protected trendAnalysisPoints: Memory<TrendAnalysisPoint>,
    private onTransition: (values: {
      state: State;
      trendAnalysisPoints: Memory<TrendAnalysisPoint>;
    }) => void,
  ) {}

  setConnections(
    connections: { transistion: Transistion; state: State }[],
  ): void {
    this.connections = connections;
  }

  process(swingPoint: SwingPointData): State {
    this.trendAnalysisPoints.add({ characteristic: 'none', swingPoint });
    this.onState();
    return this.onExit();
  }

  protected abstract onState(): void;
  protected onExit(): State {
    for (const { transistion, state } of this.connections) {
      if (transistion.isApplicable(this.trendAnalysisPoints)) {
        this.onTransition({
          state,
          trendAnalysisPoints: this.trendAnalysisPoints,
        });
        return state;
      }
    }
    return this;
  }
}

class SwingHighTransistion implements Transistion {
  isApplicable(trendAnalysisPoints: Memory<TrendAnalysisPoint>): boolean {
    return (
      trendAnalysisPoints.getLast()?.swingPoint.swingPointType === 'swingHigh'
    );
  }
}

class SwingLowTransistion implements Transistion {
  isApplicable(trendAnalysisPoints: Memory<TrendAnalysisPoint>): boolean {
    return (
      trendAnalysisPoints.getLast()?.swingPoint.swingPointType === 'swingLow'
    );
  }
}

class StartState extends State {
  protected onState(): void {
    const latestSwingPoint = this.trendAnalysisPoints.getLast();
    if (latestSwingPoint) {
      latestSwingPoint.characteristic = 'start-trend';
    }
  }
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

export function getStartState(
  onTransition: (values: {
    state: State;
    trendAnalysisPoints: Memory<TrendAnalysisPoint>;
  }) => void,
): State {
  const trendAnalysisPoints = new Memory<TrendAnalysisPoint>();
  const startState = new StartState(trendAnalysisPoints, onTransition);

  const upwardTrendFirstCheck = new UpwardTrendFirstCheck(
    trendAnalysisPoints,
    onTransition,
  );
  const upwardTrendSecondCheck = new UpwardTrendSecondCheck(
    trendAnalysisPoints,
    onTransition,
  );
  const upwardTrendConfirmed = new UpwardTrendConfirmed(
    trendAnalysisPoints,
    onTransition,
  );
  const downwardTrendFirstCheck = new DownwardTrendFirstCheck(
    trendAnalysisPoints,
    onTransition,
  );
  const downwardTrendSecondCheck = new DownwardTrendSecondCheck(
    trendAnalysisPoints,
    onTransition,
  );
  const downwardTrendConfirmed = new DownwardTrendConfirmed(
    trendAnalysisPoints,
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
  return startState;
}
