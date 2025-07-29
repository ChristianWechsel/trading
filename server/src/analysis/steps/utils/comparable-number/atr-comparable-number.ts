import { ComparableNumber } from './comparable-number';

export class ATRComparableNumber extends ComparableNumber {
  constructor(
    value: number,
    private atrValue: number,
    private atrFactor: number,
  ) {
    super(value);
  }

  isCloseEnough(other: ComparableNumber): boolean {
    const threshold = this.atrValue * this.atrFactor;
    return Math.abs(this.value - other.getValue()) <= threshold;
  }

  isSignificantlyHigherThan(other: ComparableNumber): boolean {
    const threshold = this.atrValue * this.atrFactor;
    return this.value > other.getValue() + threshold;
  }

  isSignificantlyLowerThan(other: ComparableNumber): boolean {
    const threshold = this.atrValue * this.atrFactor;
    return this.value < other.getValue() - threshold;
  }
}
