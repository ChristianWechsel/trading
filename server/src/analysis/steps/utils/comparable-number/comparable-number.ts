export abstract class ComparableNumber {
  constructor(protected value: number) {}

  abstract isCloseEnough(other: ComparableNumber): boolean;
  abstract isSignificantlyHigherThan(other: ComparableNumber): boolean;
  abstract isSignificantlyLowerThan(other: ComparableNumber): boolean;
  getValue(): number {
    return this.value;
  }
}
