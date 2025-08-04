import { MoneyManagement } from './money-management.interface';

/**
 * A position sizing strategy that uses the maximum available cash to buy shares.
 * It calculates the largest integer number of shares that can be afforded.
 */
export const allInSizing: MoneyManagement = (
  cash: number,
  price: number,
): number => {
  if (price <= 0 || cash <= 0) {
    return 0;
  }
  return Math.floor(cash / price);
};
