import { DataPoint } from 'src/digital-signal-processing/digital-signal-processing.interface';

// entferne export, da dieser Typ nur in EnrichedDataPoint verwendet werden soll
export type SwingPointType =
  | 'swingHigh' // previous < current > next
  | 'swingLow' // previous > current < next
  | 'plateauToUpward' // previous == current < next
  | 'plateauToDownward' // previous == current > next
  | 'upwardToPlateau' // previous < current == next
  | 'downwardToPlateau'; // previous > current == next;

export class EnrichedDataPoint {
  private swingPointType: SwingPointType | null = null;

  constructor(private dataPoint: DataPoint<number>) {}

  get x(): number {
    return this.dataPoint.x;
  }

  get y(): number {
    return this.dataPoint.y;
  }

  getSwingPointType(): SwingPointType | null {
    return this.swingPointType;
  }

  setSwingPointType(type: SwingPointType): void {
    this.swingPointType = type;
  }
}
