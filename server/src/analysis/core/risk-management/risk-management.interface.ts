import { YValueAccessor } from '../analysis-context';
import { EnrichedDataPoint } from '../enriched-data-points/enriched-data-point';

/**
 * A function that determines the stop-loss price for a trade.
 * @param entryPrice The price at which the position was entered.
 * @param dataPoint The enriched data point at the time of entry, which may contain indicators like ATR.
 * @returns The calculated stop-loss price.
 */
export type StopLossStrategy = (
  dataPoint: EnrichedDataPoint,
  yValueAccessor: YValueAccessor,
) => number;
