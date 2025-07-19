import { DataPoint } from '../../core/analysis.interface';
import { EnrichedDataPoint } from '../../core/enriched-data-point';

export class AverageTrueRangeTestdata {
  private createEnrichedDataPoint(dataPoint: DataPoint<number>) {
    return new EnrichedDataPoint(dataPoint);
  }

  minimumPeriod() {
    return {
      name: 'Minimum Period',
      testcase: {
        period: 2,
        data: [
          this.createEnrichedDataPoint({ x: 1, y: 1 }),
          this.createEnrichedDataPoint({ x: 1, y: 1 }),
        ],
        expectedATR: 1,
      },
    };
  }
}
