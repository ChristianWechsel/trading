import { PositionSizingStrategy } from './money-management.interface';

/**
 * A factory function that creates a position sizing strategy based on a fixed fraction of available cash.
 * @param fraction The fraction of cash to invest (e.g., 0.25 for 25%). Must be between 0 and 1.
 * @returns A PositionSizingStrategy function.
 */
export const fixedFractionalSizing =
  (fraction: number): PositionSizingStrategy =>
  (cash: number, price: number): number => {
    if (price <= 0 || cash <= 0 || fraction <= 0 || fraction > 1) {
      return 0;
    }

    const amountToInvest = cash * fraction;
    return Math.floor(amountToInvest / price);
  };
