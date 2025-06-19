import { DataPoint } from '../../digital-signal-processing.interface';

export class EnrichedDataPoint {
  private swingPointType: SwingPointType = null;
  private trend: TrendType = null;

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

  getTrend(): TrendType {
    return this.trend;
  }

  setTrend(trend: TrendElement): void {
    if (this.trend === null) {
      this.trend = trend;
    } else if (!Array.isArray(this.trend)) {
      this.trend = [this.trend, trend];
    }
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

type TrendElement = 'upward' | 'downward';
export type TrendType = TrendElement | [TrendElement, TrendElement] | null;
