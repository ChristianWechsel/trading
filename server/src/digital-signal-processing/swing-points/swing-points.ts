import { ComparableNumber } from '../comparable-number/comparable-number';
import {
  MAX_THRESHOLD,
  MIN_THRESHOLD,
  MIN_WINDOW_SIZE,
} from '../comparable-number/parameters';
import { DataPoint } from '../digital-signal-processing.interface';
import { SwingPointData } from './swing-points.interface';

// window einführen, um mehrere benachbarte Punkte zu prüfen
// Prüfungen, ob genügend Datensätze vorhanden sind, um wenigstens einen Swing
// Point zu erkennen
// siehe letzten EIntrag in Gemeni Chat "Umkehrpunkte in Zettreihen erkennen"

export class SwingPoints {
  /**
   * Creates an instance of SwingPoints.
   * @param data - Array of data points to analyze for swing points.
   * @param options - Object containing options for the SwingPoints instance.
   *   - relativeThreshold: A number between 0 and 1 that determines the sensitivity
   *     when comparing data points. A higher value makes the swing point detection
   *     less sensitive to small fluctuations, while a lower value increases sensitivity.
   *   - windowSize: A natural number >= 1. windowSize defines the range in which to search
   *     for a swingHigh or swingLow. This helps to smooth out small spikes and only detect
   *     significant turning points within a larger neighborhood.
   */
  constructor(
    private data: DataPoint[],
    private options: { relativeThreshold: number; windowSize: number },
  ) {
    const { relativeThreshold, windowSize } = options;
    if (
      relativeThreshold < MIN_THRESHOLD ||
      relativeThreshold > MAX_THRESHOLD
    ) {
      throw new Error(
        `relativeThreshold must be between ${MIN_THRESHOLD} and ${MAX_THRESHOLD}`,
      );
    }
    if (!Number.isInteger(windowSize) || windowSize < MIN_WINDOW_SIZE) {
      throw new Error(
        `windowSize must be a natural number >= ${MIN_WINDOW_SIZE}`,
      );
    }
    if (data.length < 2 * windowSize + 1) {
      throw new Error(
        `data must have at least ${2 * windowSize + 1} points for windowSize=${windowSize}`,
      );
    }
  }

  getSwingPoints(): SwingPointData[] {
    const swingPointDataList: SwingPointData[] = [];
    let idx = 1;
    while (idx < this.data.length - 1) {
      const previousPoint = this.data[idx - 1];
      const currentPoint = this.data[idx];
      const nextPoint = this.data[idx + 1];

      const previousComparableValue = new ComparableNumber(
        previousPoint.y,
        this.options.relativeThreshold,
      );
      const currentComparableNumber = new ComparableNumber(
        currentPoint.y,
        this.options.relativeThreshold,
      );
      const nextComparableNumber = new ComparableNumber(
        nextPoint.y,
        this.options.relativeThreshold,
      );

      if (
        this.isSwingHigh(
          currentComparableNumber,
          previousComparableValue,
          nextComparableNumber,
        )
      ) {
        swingPointDataList.push({
          swingPointType: 'swingHigh',
          point: currentPoint,
        });
      } else if (
        this.isSwingLow(
          currentComparableNumber,
          previousComparableValue,
          nextComparableNumber,
        )
      ) {
        swingPointDataList.push({
          swingPointType: 'swingLow',
          point: currentPoint,
        });
      } else if (
        this.isDownwardToPlateau(
          currentComparableNumber,
          previousComparableValue,
          nextComparableNumber,
        )
      ) {
        swingPointDataList.push({
          swingPointType: 'downwardToPlateau',
          point: currentPoint,
        });
      } else if (
        this.isUpwardToPlateau(
          currentComparableNumber,
          previousComparableValue,
          nextComparableNumber,
        )
      ) {
        swingPointDataList.push({
          swingPointType: 'upwardToPlateau',
          point: currentPoint,
        });
      } else if (
        this.isPlateauToUpward(
          currentComparableNumber,
          previousComparableValue,
          nextComparableNumber,
        )
      ) {
        swingPointDataList.push({
          swingPointType: 'plateauToUpward',
          point: currentPoint,
        });
      } else if (
        this.isPlateauToDownward(
          currentComparableNumber,
          previousComparableValue,
          nextComparableNumber,
        )
      ) {
        swingPointDataList.push({
          swingPointType: 'plateauToDownward',
          point: currentPoint,
        });
      }
      idx++;
    }
    return swingPointDataList;
  }

  private isSwingLow(
    curr: ComparableNumber,
    prev: ComparableNumber,
    next: ComparableNumber,
  ) {
    return (
      prev.isSignificantlyHigherThan(curr) &&
      curr.isSignificantlyLowerThan(next)
    );
  }

  private isSwingHigh(
    curr: ComparableNumber,
    prev: ComparableNumber,
    next: ComparableNumber,
  ) {
    return (
      prev.isSignificantlyLowerThan(curr) &&
      curr.isSignificantlyHigherThan(next)
    );
  }

  private isPlateauToUpward(
    curr: ComparableNumber,
    prev: ComparableNumber,
    next: ComparableNumber,
  ) {
    return prev.isCloseEnough(curr) && curr.isSignificantlyLowerThan(next);
  }

  private isPlateauToDownward(
    curr: ComparableNumber,
    prev: ComparableNumber,
    next: ComparableNumber,
  ) {
    return prev.isCloseEnough(curr) && curr.isSignificantlyHigherThan(next);
  }

  private isDownwardToPlateau(
    curr: ComparableNumber,
    prev: ComparableNumber,
    next: ComparableNumber,
  ) {
    return prev.isSignificantlyHigherThan(curr) && curr.isCloseEnough(next);
  }

  private isUpwardToPlateau(
    curr: ComparableNumber,
    prev: ComparableNumber,
    next: ComparableNumber,
  ) {
    return prev.isSignificantlyLowerThan(curr) && curr.isCloseEnough(next);
  }
}
