/**
 * A function that determines how many shares to buy based on available cash and current price.
 * @param cash The total available cash for investment.
 * @param price The current price per share.
 * @returns The number of shares to purchase.
 */
export type MoneyManagement = (cash: number, price: number) => number;

export type SelectorMoneyManagement = 'all-in' | 'fixed-fractional';
