import { DataPoint } from '../digital-signal-processing.interface';
import { SwingPointData } from './swing-points.interface';

export class SwingPoints {
  constructor(private data: DataPoint[]) {}

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
      }
      idx++;
    }
    return swingPointDataList;
  }

  private isSwingLow(curr: DataPoint, prev: DataPoint, next: DataPoint) {
    return curr.y < prev.y && curr.y < next.y;
  }

  private isSwingHigh(curr: DataPoint, prev: DataPoint, next: DataPoint) {
    return curr.y > prev.y && curr.y > next.y;
  }
}
