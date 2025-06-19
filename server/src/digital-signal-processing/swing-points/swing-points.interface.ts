import { DataPoint } from '../digital-signal-processing.interface';
import { SwingPointType } from '../dto/enriched-data-point/enriched-data-point';

export type SwingPointData<T> = {
  swingPointType: SwingPointType;
  point: DataPoint<T>;
};
