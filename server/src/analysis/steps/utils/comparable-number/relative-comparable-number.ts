import { ComparableNumber } from './comparable-number';

export class RelativeComparableNumber extends ComparableNumber {
  constructor(
    value: number,
    private threshold: number,
  ) {
    super(value);
  }

  isCloseEnough(other: ComparableNumber): boolean {
    if (this.value === other.getValue()) {
      return true;
    }
    // Wenn beide Werte 0 sind, wird oben true zurückgegeben.
    // Wenn einer 0 ist, der andere nicht, ist der Nenner der Betrag des Nicht-Null-Wertes.
    const denominator = Math.max(
      Math.abs(this.value),
      Math.abs(other.getValue()),
    );
    if (denominator === 0) {
      // Sollte nur erreicht werden, wenn beide Werte 0 sind, was bereits abgedeckt ist.
      // Für den Fall, dass diese Logik geändert wird, ist es eine gute Absicherung.
      return true;
    }
    const relativeDifference =
      Math.abs(this.value - other.getValue()) / denominator;
    // Das äußere Math.abs(relativeDifference) ist redundant, da Zähler und Nenner schon positiv sind.
    return relativeDifference <= this.threshold;
  }

  isSignificantlyHigherThan(other: ComparableNumber): boolean {
    return this.value > other.getValue() * (1 + this.threshold);
  }

  isSignificantlyLowerThan(other: ComparableNumber): boolean {
    return this.value < other.getValue() * (1 - this.threshold);
  }

  getValue(): number {
    return this.value;
  }
}
