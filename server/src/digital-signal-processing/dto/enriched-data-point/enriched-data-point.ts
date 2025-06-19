import { DataPoint } from 'src/digital-signal-processing/digital-signal-processing.interface';

export class EnrichedDataPoint {
  constructor(private dataPoint: DataPoint<number>) {}
}
