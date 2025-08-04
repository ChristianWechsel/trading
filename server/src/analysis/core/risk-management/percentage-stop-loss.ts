import { StopLossStrategy } from './risk-management.interface';

/**
 * A factory function that creates a stop-loss strategy based on a fixed percentage below the entry price.
 * @param percentage The percentage to set the stop-loss below the entry price (e.g., 5 for 5%).
 * @returns A StopLossStrategy function.
 */
export const percentageStopLoss =
  (percentage: number): StopLossStrategy =>
  (entryPrice: number): number => {
    if (percentage < 0) {
      throw new Error('Percentage cannot be negative.');
    }
    const factor = 1 - percentage / 100;
    return entryPrice * factor;
  };
