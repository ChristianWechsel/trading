import { DataPoint } from '../digital-signal-processing.interface';

export type SwingPointData<T> = {
  swingPointType: SwingPointType;
  point: DataPoint<T>;
};
