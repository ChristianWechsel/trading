import { DataPoint } from 'src/digital-signal-processing/digital-signal-processing.interface';

export class EnrichedDataPoint {
  constructor(private dataPoint: DataPoint<number>) {}

  get x(): number {
    return this.dataPoint.x;
  }

  get y(): number {
    return this.dataPoint.y;
  }
}
