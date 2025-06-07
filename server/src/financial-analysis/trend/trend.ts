import { SwingPointData } from '../../digital-signal-processing/swing-points/swing-points.interface';
import { MIN_SWING_POINTS } from './parameters';

export class Trend {
  constructor(private swingPoints: SwingPointData[]) {
    // Einen Trend kann man erst ab 3 Swing Punkten erkennen. Weniger Swing Punkte
    // sind nicht ausreichend, um eine Richtung zu bestimmen.
    if (this.swingPoints.length < MIN_SWING_POINTS) {
      throw new Error(
        `swingPoints must be an array with at least ${MIN_SWING_POINTS} elements`,
      );
    }
  }
}
