import { DataPoint } from '../digital-signal-processing.interface';

export type SwingPointType =
  | 'swingHigh' // previous < current > next
  | 'swingLow' // previous > current < next
  | 'plateauToUpward' // previous == current < next
  | 'plateauToDownward' // previous == current > next
  | 'upwardToPlateau' // previous < current == next
  | 'downwardToPlateau'; // previous > current == next;

export type SwingPointData = {
  swingPointType: SwingPointType;
  point: DataPoint<number>;
};
