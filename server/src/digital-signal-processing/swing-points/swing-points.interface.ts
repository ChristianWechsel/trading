import { DataPoint } from '../digital-signal-processing.interface';

export type SwingPointType = 'swingHigh' | 'swingLow';
export type SwingPointData = {
  swingPointType: SwingPointType;
  point: DataPoint;
};
