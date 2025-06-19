import { ComparableNumber } from '../comparable-number/comparable-number';
import {
  MAX_THRESHOLD,
  MIN_THRESHOLD,
  MIN_WINDOW_SIZE,
} from '../comparable-number/parameters';
import { EnrichedDataPoint } from '../dto/enriched-data-point/enriched-data-point';
import { SwingPointData } from './swing-points.interface';

export class SwingPoints {
  constructor(
    private data: EnrichedDataPoint[],
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

  getSwingPoints(): EnrichedDataPoint[] {
    const swingPointDataList: SwingPointData<number>[] = [];
    let idx = this.options.windowSize;
    while (idx < this.data.length - this.options.windowSize) {
      const { previousPoints, nextPoints } = this.getSurroundingPoints(idx);
      const currentPoint = this.data[idx];
      const currentComparableNumber = this.createComparableNumber(
        currentPoint.y,
      );

      if (
        this.isSwingHigh(previousPoints, currentComparableNumber, nextPoints)
      ) {
        currentPoint.setSwingPointType('swingHigh');
      } else if (
        this.isSwingLow(previousPoints, currentComparableNumber, nextPoints)
      ) {
        currentPoint.setSwingPointType('swingLow');
      } else if (
        this.isDownwardToPlateau(
          previousPoints,
          currentComparableNumber,
          nextPoints,
        )
      ) {
        swingPointDataList.push({
          swingPointType: 'downwardToPlateau',
          point: currentPoint,
        });
      } else if (
        this.isUpwardToPlateau(
          previousPoints,
          currentComparableNumber,
          nextPoints,
        )
      ) {
        swingPointDataList.push({
          swingPointType: 'upwardToPlateau',
          point: currentPoint,
        });
      } else if (
        this.isPlateauToUpward(
          previousPoints,
          currentComparableNumber,
          nextPoints,
        )
      ) {
        currentPoint.setSwingPointType('plateauToUpward');
      } else if (
        this.isPlateauToDownward(
          previousPoints,
          currentComparableNumber,
          nextPoints,
        )
      ) {
        swingPointDataList.push({
          swingPointType: 'plateauToDownward',
          point: currentPoint,
        });
      }
      idx++;
    }

    return this.data;
  }

  private getSurroundingPoints(idx: number) {
    const previousPoints = new Array<ComparableNumber>(this.options.windowSize);
    const nextPoints = new Array<ComparableNumber>(this.options.windowSize);

    let idxWindowSize = 0;
    while (idxWindowSize < this.options.windowSize) {
      previousPoints[idxWindowSize] = this.createComparableNumber(
        this.data[idx - this.options.windowSize + idxWindowSize].y,
      );
      nextPoints[idxWindowSize] = this.createComparableNumber(
        this.data[idx + idxWindowSize + 1].y,
      );
      idxWindowSize++;
    }
    return { previousPoints, nextPoints };
  }

  private createComparableNumber(value: number) {
    return new ComparableNumber(value, this.options.relativeThreshold);
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
    previousPoints: ComparableNumber[],
    curr: ComparableNumber,
    nextPoints: ComparableNumber[],
  ) {
    // return prev.isCloseEnough(curr) && curr.isSignificantlyLowerThan(next);
    for (const previousPoint of previousPoints) {
      if (!previousPoint.isCloseEnough(curr)) {
        return false;
      }
    }
    // Fallback for windowSize = 1
    if (nextPoints.length === 1) {
      return curr.isSignificantlyLowerThan(nextPoints[0]);
    }
    return this.isUpwardTrend([curr, ...nextPoints]);
  }

  private isPlateauToDownward(
    previousPoints: ComparableNumber[],
    curr: ComparableNumber,
    nextPoints: ComparableNumber[],
  ) {
    // return prev.isCloseEnough(curr) && curr.isSignificantlyHigherThan(next);
    for (const previousPoint of previousPoints) {
      if (!previousPoint.isCloseEnough(curr)) {
        return false;
      }
    }
    // Fallback for windowSize = 1
    if (nextPoints.length === 1) {
      return curr.isSignificantlyHigherThan(nextPoints[0]);
    }
    return this.isDownwardTrend([curr, ...nextPoints]);
  }

  private isDownwardToPlateau(
    previousPoints: ComparableNumber[],
    curr: ComparableNumber,
    nextPoints: ComparableNumber[],
  ) {
    // return prev.isSignificantlyHigherThan(curr) && curr.isCloseEnough(next);
    for (const nextPoint of nextPoints) {
      if (!nextPoint.isCloseEnough(curr)) {
        return false;
      }
    }
    // Fallback for windowSize = 1
    if (previousPoints.length === 1) {
      return previousPoints[0].isSignificantlyHigherThan(curr);
    }
    return this.isDownwardTrend([...previousPoints, curr]);
  }

  private isUpwardToPlateau(
    previousPoints: ComparableNumber[],
    curr: ComparableNumber,
    nextPoints: ComparableNumber[],
  ) {
    // return prev.isSignificantlyLowerThan(curr) && curr.isCloseEnough(next);
    for (const nextPoint of nextPoints) {
      if (!nextPoint.isCloseEnough(curr)) {
        return false;
      }
    }
    // Fallback for windowSize = 1
    if (previousPoints.length === 1) {
      return previousPoints[0].isSignificantlyLowerThan(curr);
    }
    return this.isUpwardTrend([...previousPoints, curr]);
  }

  private isUpwardTrend(points: ComparableNumber[]) {
    return points.reduce((isTrendConfirmed, point, idx, points) => {
      if (idx < points.length - 1 && isTrendConfirmed) {
        const nextPoint = points[idx + 1];
        if (!point.isSignificantlyLowerThan(nextPoint)) {
          return false;
        }
      }
      return isTrendConfirmed;
    }, true);
  }

  private isDownwardTrend(points: ComparableNumber[]) {
    return points.reduce((isTrendConfirmed, point, idx, points) => {
      if (idx < points.length - 1 && isTrendConfirmed) {
        const nextPoint = points[idx + 1];
        if (!point.isSignificantlyHigherThan(nextPoint)) {
          return false;
        }
      }
      return isTrendConfirmed;
    }, true);
  }
}
