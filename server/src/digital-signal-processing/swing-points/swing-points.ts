import { DataPoint } from '../digital-signal-processing.interface';
import { SwingPointData } from './swing-points.interface';

const MIN_THRESHOLD = 0;
const MAX_THRESHOLD = 1;

export class SwingPoints {
  private relativeThreshold: number;
  constructor(
    private data: DataPoint[],
    relativeThreshold: number,
  ) {
    if (
      relativeThreshold < MIN_THRESHOLD ||
      relativeThreshold > MAX_THRESHOLD
    ) {
      throw new Error('Relative threshold must be between 0 and 1');
    }
    this.relativeThreshold = relativeThreshold;
  }

  getSwingPoints(): SwingPointData[] {
    const swingPointDataList: SwingPointData[] = [];
    let idx = 1;
    while (idx < this.data.length - 1) {
      const prev = this.data[idx - 1];
      const curr = this.data[idx];
      const next = this.data[idx + 1];

      if (this.isSwingHigh(curr, prev, next)) {
        swingPointDataList.push({
          swingPointType: 'swingHigh',
          point: curr,
        });
      } else if (this.isSwingLow(curr, prev, next)) {
        swingPointDataList.push({
          swingPointType: 'swingLow',
          point: curr,
        });
      } else if (this.isDownwardToPlateau(curr, prev, next)) {
        swingPointDataList.push({
          swingPointType: 'downwardToPlateau',
          point: curr,
        });
      } else if (this.isUpwardToPlateau(curr, prev, next)) {
        swingPointDataList.push({
          swingPointType: 'upwardToPlateau',
          point: curr,
        });
      } else if (this.isPlateauToUpward(curr, prev, next)) {
        swingPointDataList.push({
          swingPointType: 'plateauToUpward',
          point: curr,
        });
      } else if (this.isPlateauToDownward(curr, prev, next)) {
        swingPointDataList.push({
          swingPointType: 'plateauToDownward',
          point: curr,
        });
      }
      idx++;
    }
    return swingPointDataList;
  }

  private isSwingLow(curr: DataPoint, prev: DataPoint, next: DataPoint) {
    return prev.y > curr.y && curr.y < next.y;
  }

  private isSwingHigh(curr: DataPoint, prev: DataPoint, next: DataPoint) {
    return prev.y < curr.y && curr.y > next.y;
  }

  private isPlateauToUpward(curr: DataPoint, prev: DataPoint, next: DataPoint) {
    return prev.y === curr.y && curr.y < next.y;
  }

  private isPlateauToDownward(
    curr: DataPoint,
    prev: DataPoint,
    next: DataPoint,
  ) {
    return prev.y === curr.y && curr.y > next.y;
  }

  private isDownwardToPlateau(
    curr: DataPoint,
    prev: DataPoint,
    next: DataPoint,
  ) {
    return prev.y > curr.y && curr.y === next.y;
  }

  private isUpwardToPlateau(curr: DataPoint, prev: DataPoint, next: DataPoint) {
    return prev.y < curr.y && curr.y === next.y;
  }
}
