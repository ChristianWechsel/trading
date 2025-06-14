import { SwingPointData } from 'src/digital-signal-processing/swing-points/swing-points.interface';
import { Memory } from './memory';
import { TransitionCallback, TrendAnalysisPoint } from './trend.interface';

export abstract class State {
  constructor(
    protected memory: Memory<TrendAnalysisPoint>,
    protected onTransition: TransitionCallback,
  ) {}

  abstract process(swingPoint: SwingPointData): State;

  protected transitionTo(newState: State): State {
    this.onTransition({ newState, oldState: this, memory: this.memory });
    return newState;
  }
}

export class StartState extends State {
  process(swingPoint: SwingPointData): State {
    this.memory.clear();
    this.memory.add({ swingPoint });

    if (swingPoint.swingPointType === 'swingLow') {
      return this.transitionTo(
        new UpwardTrendFirstCheck(this.memory, this.onTransition),
      );
    }

    if (swingPoint.swingPointType === 'swingHigh') {
      return this.transitionTo(
        new DownwardTrendFirstCheck(this.memory, this.onTransition),
      );
    }

    this.memory.add({ swingPoint });
    return this;
  }
}

class UpwardTrendFirstCheck extends State {
  process(swingPoint: SwingPointData): State {
    this.memory.add({ swingPoint });
    if (swingPoint.swingPointType === 'swingHigh') {
      return this.transitionTo(
        new UpwardTrendSecondCheck(this.memory, this.onTransition),
      );
    }
    return this.transitionTo(new StartState(this.memory, this.onTransition));
  }
}

class UpwardTrendSecondCheck extends State {
  process(swingPoint: SwingPointData): State {
    const lastRelevantPoint = this.memory.findLast(
      (point) => point.swingPoint.swingPointType === 'swingLow',
    );
    this.memory.add({ swingPoint });

    if (
      swingPoint.swingPointType === 'swingLow' &&
      lastRelevantPoint &&
      lastRelevantPoint.swingPoint.point.y < swingPoint.point.y
    ) {
      return this.transitionTo(
        new UpwardTrendConfirmed(this.memory, this.onTransition),
      );
    }

    return this.transitionTo(new StartState(this.memory, this.onTransition));
  }
}

export class UpwardTrendConfirmed extends State {
  process(swingPoint: SwingPointData): State {
    const lastRelevantPoint = this.memory.findLast(
      (point) => point.swingPoint.swingPointType === swingPoint.swingPointType,
    );
    this.memory.add({ swingPoint });

    if (
      lastRelevantPoint &&
      lastRelevantPoint.swingPoint.point.y < swingPoint.point.y
    ) {
      return this;
    }
    return this.transitionTo(
      new UpwardTrendWarning(this.memory, this.onTransition),
    );
  }
}

class DownwardTrendFirstCheck extends State {
  process(swingPoint: SwingPointData): State {
    this.memory.add({ swingPoint });
    if (swingPoint.swingPointType === 'swingLow') {
      return this.transitionTo(
        new DownwardTrendSecondCheck(this.memory, this.onTransition),
      );
    }
    return this.transitionTo(new StartState(this.memory, this.onTransition));
  }
}

class DownwardTrendSecondCheck extends State {
  process(swingPoint: SwingPointData): State {
    const lastRelevantPoint = this.memory.findLast(
      (point) => point.swingPoint.swingPointType === 'swingHigh',
    );
    this.memory.add({ swingPoint });

    if (
      swingPoint.swingPointType === 'swingHigh' &&
      lastRelevantPoint &&
      lastRelevantPoint.swingPoint.point.y > swingPoint.point.y
    ) {
      return this.transitionTo(
        new DownwardTrendConfirmed(this.memory, this.onTransition),
      );
    }
    return this.transitionTo(new StartState(this.memory, this.onTransition));
  }
}

export class DownwardTrendConfirmed extends State {
  process(swingPoint: SwingPointData): State {
    const lastRelevantPoint = this.memory.findLast(
      (point) => point.swingPoint.swingPointType === swingPoint.swingPointType,
    );
    this.memory.add({ swingPoint });

    if (
      lastRelevantPoint &&
      lastRelevantPoint.swingPoint.point.y > swingPoint.point.y
    ) {
      return this;
    }
    return this.transitionTo(
      new DownwardTrendWarning(this.memory, this.onTransition),
    );
  }
}

export class UpwardTrendWarning extends State {
  process(swingPoint: SwingPointData): State {
    const lastRelevantPoint = this.memory.findLast(
      (point) => point.swingPoint.swingPointType === swingPoint.swingPointType,
    );
    this.memory.add({ swingPoint });

    if (
      lastRelevantPoint &&
      lastRelevantPoint.swingPoint.point.y < swingPoint.point.y
    ) {
      return this.transitionTo(
        new UpwardTrendConfirmed(this.memory, this.onTransition),
      );
    }

    return this.transitionTo(new TrendBroken(this.memory, this.onTransition));
  }
}

export class DownwardTrendWarning extends State {
  process(swingPoint: SwingPointData): State {
    const lastRelevantPoint = this.memory.findLast(
      (point) => point.swingPoint.swingPointType === swingPoint.swingPointType,
    );
    this.memory.add({ swingPoint });

    if (
      lastRelevantPoint &&
      lastRelevantPoint.swingPoint.point.y > swingPoint.point.y
    ) {
      return this.transitionTo(
        new DownwardTrendConfirmed(this.memory, this.onTransition),
      );
    }

    return this.transitionTo(new TrendBroken(this.memory, this.onTransition));
  }
}

export class TrendBroken extends State {
  process(swingPoint: SwingPointData): State {
    const relevantHistory = this.memory.getLatest(3);
    const beginNewTrend = new BeginNewTrend(
      this.memory,
      this.onTransition,
      relevantHistory,
    );
    return beginNewTrend.process(swingPoint);
  }
}

class BeginNewTrend extends State {
  private historyToProcess: TrendAnalysisPoint[];

  constructor(
    memory: Memory<TrendAnalysisPoint>,
    onTransition: TransitionCallback,
    historyToProcess: TrendAnalysisPoint[],
  ) {
    super(memory, onTransition);
    this.historyToProcess = historyToProcess;
  }

  process(swingPoint: SwingPointData): State {
    let currentState: State = new StartState(this.memory, this.onTransition);

    for (const point of this.historyToProcess) {
      currentState = currentState.process(point.swingPoint);
    }

    return currentState.process(swingPoint);
  }
}
