import { YValueAccessor } from '../analysis-context';
import { EnrichedDataPoint } from '../enriched-data-points/enriched-data-point';
import { StopLossStrategy } from './risk-management.interface';

/**
 * A factory function that creates a stop-loss strategy based on a multiple of the Average True Range (ATR).
 * @param multiplier The factor by which to multiply the ATR value (e.g., 2 for 2 * ATR).
 * @returns A StopLossStrategy function.
 */
export const atrStopLoss =
  (multiplier: number): StopLossStrategy =>
  (dataPoint: EnrichedDataPoint, yValueAccessor: YValueAccessor): number => {
    if (multiplier < 0) {
      throw new Error('Multiplier cannot be negative.');
    }
    const price = yValueAccessor(dataPoint);
    const atrValue = dataPoint.getAverageTrueRange();
    if (typeof atrValue !== 'number') {
      throw new Error(
        `ATR value is not available or not a number on the given data point.`,
      );
    }

    return price - atrValue * multiplier;
  };
