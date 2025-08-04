/**
 * A function that determines how many shares to buy based on available cash and current price.
 * @param cash The total available cash for investment.
 * @param price The current price per share.
 * @returns The number of shares to purchase.
 */
export type PositionSizingStrategy = (cash: number, price: number) => number;
