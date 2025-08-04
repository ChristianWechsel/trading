import { YValueAccessor } from '../analysis-context';
import { EnrichedDataPoint } from '../enriched-data-points/enriched-data-point';
import { RiskManagement } from './risk-management.interface';

/**
 * A factory function that creates a stop-loss strategy based on a fixed percentage below the entry price.
 * @param percentage The percentage to set the stop-loss below the entry price (e.g., 5 for 5%).
 * @returns A StopLossStrategy function.
 */
export const percentageStopLoss =
  (percentage: number): RiskManagement =>
  (dataPoint: EnrichedDataPoint, yValueAccessor: YValueAccessor): number => {
    if (percentage < 0) {
      throw new Error('Percentage cannot be negative.');
    }
    const price = yValueAccessor(dataPoint);
    const factor = 1 - percentage / 100;
    return price * factor;
  };
