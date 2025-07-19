import { OHLCV } from 'src/data-aggregation/ohlcv.entity';

export class EnrichedDataPoint {
  private swingPointType?: SwingPointType;
  private averageTrueRange?: number;

  constructor(private dataPoint: OHLCV) {}

  getDataPoint(): OHLCV {
    return this.dataPoint;
  }

  getSwingPointType() {
    return this.swingPointType;
  }

  setSwingPointType(type: SwingPointType): void {
    this.swingPointType = type;
  }

  getAverageTrueRange() {
    return this.averageTrueRange;
  }

  setAverageTrueRange(atr: number): void {
    this.averageTrueRange = atr;
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
