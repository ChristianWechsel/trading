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
    let idx = this.options.windowSize;
    while (idx < this.data.length - this.options.windowSize) {
      const previousPoints = new Array<ComparableNumber>(
        this.options.windowSize,
      );
      const nextPoints = new Array<ComparableNumber>(this.options.windowSize);

      let idxWindowSize = 0;
      while (idxWindowSize < this.options.windowSize) {
        previousPoints[idxWindowSize] = this.createComparableNumber(
          this.data[idx - this.options.windowSize + idxWindowSize],
        );
        nextPoints[idxWindowSize] = this.createComparableNumber(
          this.data[idx + idxWindowSize + 1],
        );
        idxWindowSize++;
      }

      const previousPoint = previousPoints[previousPoints.length - 1];
      const currentPoint = this.data[idx];
      const nextPoint = nextPoints[0];

      const previousComparableValue = previousPoint;
      const currentComparableNumber = this.createComparableNumber(currentPoint);
      const nextComparableNumber = nextPoint;

      if (
        this.isSwingHigh(previousPoints, currentComparableNumber, nextPoints)
      ) {
        swingPointDataList.push({
          swingPointType: 'swingHigh',
          point: currentPoint,
        });
      } else if (
        this.isSwingLow(previousPoints, currentComparableNumber, nextPoints)
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

  private createComparableNumber(dataPoint: DataPoint) {
    return new ComparableNumber(dataPoint.y, this.options.relativeThreshold);
  }

  private isSwingHigh(
    previousPoints: ComparableNumber[],
    curr: ComparableNumber,
    nextPoints: ComparableNumber[],
  ) {
    for (const previousPoint of previousPoints) {
      if (!previousPoint.isSignificantlyLowerThan(curr)) {
        return false;
      }
    }
    for (const nextPoint of nextPoints) {
      if (!nextPoint.isSignificantlyLowerThan(curr)) {
        return false;
      }
    }
    return true;
  }

  private isSwingLow(
    previousPoints: ComparableNumber[],
    curr: ComparableNumber,
    nextPoints: ComparableNumber[],
  ) {
    for (const previousPoint of previousPoints) {
      if (!previousPoint.isSignificantlyHigherThan(curr)) {
        return false;
      }
    }
    for (const nextPoint of nextPoints) {
      if (!nextPoint.isSignificantlyHigherThan(curr)) {
        return false;
      }
    }
    return true;
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
