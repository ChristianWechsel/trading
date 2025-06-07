import { SwingPointData } from '../../digital-signal-processing/swing-points/swing-points.interface';

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
}
