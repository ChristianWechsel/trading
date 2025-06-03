import { DataPoint } from '../digital-signal-processing.interface';

export type SwingPointType =
  | 'swingHigh' // previous < current > next
  | 'swingLow' // previous > current < next
  | 'plateauHigh' // previous == current < next
  | 'plateauLow' // previous == current > next
  | 'lowPlateau' // previous < current == next
  | 'highPlateau'; // previous > current == next;

export type SwingPointData = {
  swingPointType: SwingPointType;
  point: DataPoint;
};
