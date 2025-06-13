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
    this.onTransition({ state: newState, memory: this.memory });
    return newState;
  }
}

export class StartState extends State {
  process(swingPoint: SwingPointData): State {
    if (swingPoint.swingPointType === 'swingLow') {
      this.memory.add({ swingPoint, characteristic: 'start-trend' });
      return this.transitionTo(
        new UpwardTrendFirstCheck(this.memory, this.onTransition),
      );
    }

    if (swingPoint.swingPointType === 'swingHigh') {
      this.memory.add({ swingPoint, characteristic: 'start-trend' });
      return this.transitionTo(
        new DownwardTrendFirstCheck(this.memory, this.onTransition),
      );
    }

    this.memory.add({ swingPoint, characteristic: 'none' });
    return this;
  }
}

class UpwardTrendFirstCheck extends State {
  process(swingPoint: SwingPointData): State {
    this.memory.add({ swingPoint, characteristic: 'none' });
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
    this.memory.add({ swingPoint, characteristic: 'none' });

    if (swingPoint.swingPointType === 'swingLow') {
      const lastThreePoints = this.memory.getLatest(3);

      const previousLow = lastThreePoints[0];
      const newLow = swingPoint;

      if (newLow.point.y > previousLow.swingPoint.point.y) {
        return this.transitionTo(
          new UpwardTrendConfirmed(this.memory, this.onTransition),
        );
      }
    }
    return this.transitionTo(new StartState(this.memory, this.onTransition));
  }
}

export class UpwardTrendConfirmed extends State {
  process(swingPoint: SwingPointData): State {
    this.memory.add({ swingPoint, characteristic: 'none' });
    return this;
  }
}

class DownwardTrendFirstCheck extends State {
  process(swingPoint: SwingPointData): State {
    this.memory.add({ swingPoint, characteristic: 'none' });
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
    this.memory.add({ swingPoint, characteristic: 'none' });

    if (swingPoint.swingPointType === 'swingHigh') {
      const lastThreePoints = this.memory.getLatest(3);

      const previousHigh = lastThreePoints[0];
      const newHigh = swingPoint;

      if (previousHigh.swingPoint.point.y > newHigh.point.y) {
        return this.transitionTo(
          new DownwardTrendConfirmed(this.memory, this.onTransition),
        );
      }
    }
    return this.transitionTo(new StartState(this.memory, this.onTransition));
  }
}

export class DownwardTrendConfirmed extends State {
  process(swingPoint: SwingPointData): State {
    this.memory.add({ swingPoint, characteristic: 'none' });
    return this;
  }
}
