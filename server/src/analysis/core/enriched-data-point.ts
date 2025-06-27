import { DataPoint } from './analysis.interface';

export class EnrichedDataPoint {
  private swingPointType: SwingPointType = null;

  constructor(private dataPoint: DataPoint<number>) {}

  get x(): number {
    return this.dataPoint.x;
  }

  get y(): number {
    return this.dataPoint.y;
  }

  getSwingPointType(): SwingPointType {
    return this.swingPointType;
  }

  setSwingPointType(type: SwingPointType): void {
    this.swingPointType = type;
  }

  clone(): EnrichedDataPoint {
    const clone = new EnrichedDataPoint({
      x: this.dataPoint.x,
      y: this.dataPoint.y,
    });

    clone.swingPointType = this.swingPointType;

    return clone;
  }
}

export type SwingPointType =
  | 'swingHigh' // previous < current > next
  | 'swingLow' // previous > current < next
  | 'plateauToUpward' // previous == current < next
  | 'plateauToDownward' // previous == current > next
  | 'upwardToPlateau' // previous < current == next
  | 'downwardToPlateau' // previous > current == next;
  | null; // no swing point detected
