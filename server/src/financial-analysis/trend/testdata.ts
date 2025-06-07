import { DataPoint } from '../../digital-signal-processing/digital-signal-processing.interface';
import { SwingPointData } from '../../digital-signal-processing/swing-points/swing-points.interface';
import { TrendData } from './trend.interface';

export class TrendTestData {
  /**
   * Weniger als die Mindestanzahl an SwingPoints (z.B. 2)
   */
  lessThanMinSwingPoints(): SwingPointData[] {
    return [
      { swingPointType: 'swingHigh', point: { x: 1, y: 1 } },
      { swingPointType: 'swingLow', point: { x: 2, y: 2 } },
    ];
  }

  /**
   * Genau die Mindestanzahl an SwingPoints (z.B. 3)
   */
  minSwingPoints(): SwingPointData[] {
    return [
      { swingPointType: 'swingHigh', point: { x: 1, y: 1 } },
      { swingPointType: 'swingLow', point: { x: 2, y: 2 } },
      { swingPointType: 'swingHigh', point: { x: 3, y: 3 } },
    ];
  }

  /**
   * Mehr als die Mindestanzahl an SwingPoints (z.B. 4)
   */
  moreThanMinSwingPoints(): SwingPointData[] {
    return [
      { swingPointType: 'swingHigh', point: { x: 1, y: 1 } },
      { swingPointType: 'swingLow', point: { x: 2, y: 2 } },
      { swingPointType: 'swingHigh', point: { x: 3, y: 3 } },
      { swingPointType: 'swingLow', point: { x: 4, y: 4 } },
    ];
  }

  /**
   * Datenpunkte für die Tests (mindestens MIN_SWING_POINTS)
   */
  minDataPoints(): DataPoint[] {
    return [
      { x: 1, y: 1 },
      { x: 2, y: 2 },
      { x: 3, y: 3 },
    ];
  }

  /**
   * Datenpunkte für die Tests (mehr als MIN_SWING_POINTS)
   */
  moreThanMinDataPoints(): DataPoint[] {
    return [
      { x: 1, y: 1 },
      { x: 2, y: 2 },
      { x: 3, y: 3 },
      { x: 4, y: 4 },
    ];
  }

  /**
   * Zu wenige Datenpunkte (weniger als MIN_SWING_POINTS)
   */
  lessThanMinDataPoints(): DataPoint[] {
    return [
      { x: 1, y: 1 },
      { x: 2, y: 2 },
    ];
  }

  // Aufwärtstrend
  upwardTrend(): {
    swingPoints: SwingPointData[];
    data: DataPoint[];
    result: TrendData[];
  } {
    return {
      swingPoints: [
        { swingPointType: 'swingLow', point: { x: 1, y: 1 } },
        { swingPointType: 'swingHigh', point: { x: 2, y: 2 } },
        { swingPointType: 'swingLow', point: { x: 3, y: 3 } },
      ],
      data: [
        { x: 1, y: 1 },
        { x: 2, y: 2 },
        { x: 3, y: 3 },
      ],
      result: [
        {
          trendType: 'upward',
          startPoint: { x: 1, y: 1 },
          endPoint: { x: 3, y: 3 },
        },
      ],
    };
  }

  // Abwärtstrend
  downwardTrend(): {
    swingPoints: SwingPointData[];
    data: DataPoint[];
    result: TrendData[];
  } {
    return {
      swingPoints: [
        { swingPointType: 'swingHigh', point: { x: 1, y: 3 } },
        { swingPointType: 'swingLow', point: { x: 2, y: 2 } },
        { swingPointType: 'swingHigh', point: { x: 3, y: 1 } },
      ],
      data: [
        { x: 1, y: 3 },
        { x: 2, y: 2 },
        { x: 3, y: 1 },
      ],
      result: [
        {
          trendType: 'downward',
          startPoint: { x: 1, y: 3 },
          endPoint: { x: 3, y: 1 },
        },
      ],
    };
  }
}
