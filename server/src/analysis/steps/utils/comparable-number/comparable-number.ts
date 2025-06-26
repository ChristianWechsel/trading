import { analysisConfig } from '../../../config/analysis.config';

export class ComparableNumber {
  constructor(
    private value: number,
    private threshold: number,
  ) {
    if (
      this.threshold < analysisConfig.comparableNumber.MIN_THRESHOLD ||
      this.threshold > analysisConfig.comparableNumber.MAX_THRESHOLD
    ) {
      throw new Error(
        `relativeThreshold must be between ${analysisConfig.comparableNumber.MIN_THRESHOLD} and ${analysisConfig.comparableNumber.MAX_THRESHOLD}`,
      );
    }
  }

  isCloseEnough(other: ComparableNumber): boolean {
    if (this.value === other.value) {
      return true;
    }
    // Wenn beide Werte 0 sind, wird oben true zurückgegeben.
    // Wenn einer 0 ist, der andere nicht, ist der Nenner der Betrag des Nicht-Null-Wertes.
    const denominator = Math.max(Math.abs(this.value), Math.abs(other.value));
    if (denominator === 0) {
      // Sollte nur erreicht werden, wenn beide Werte 0 sind, was bereits abgedeckt ist.
      // Für den Fall, dass diese Logik geändert wird, ist es eine gute Absicherung.
      return true;
    }
    const relativeDifference = Math.abs(this.value - other.value) / denominator;
    // Das äußere Math.abs(relativeDifference) ist redundant, da Zähler und Nenner schon positiv sind.
    return relativeDifference <= this.threshold;
  }

  isSignificantlyHigherThan(other: ComparableNumber): boolean {
    return this.value > other.value * (1 + this.threshold);
  }

  isSignificantlyLowerThan(other: ComparableNumber): boolean {
    return this.value < other.value * (1 - this.threshold);
  }

  getValue(): number {
    return this.value;
  }
}
