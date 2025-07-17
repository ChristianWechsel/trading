import {
  AnalysisContext,
  AnalysisStep,
  Step,
} from 'src/analysis/core/analysis.interface';
import { analysisConfig } from '../../../analysis/config/analysis.config';
import {
  EnrichedDataPoint,
  SwingPointType,
} from '../../core/enriched-data-point';
import { ComparableNumber } from '../utils/comparable-number/comparable-number';

export class SwingPointDetection implements AnalysisStep {
  name: Step = 'SwingPointDetection';
  dependsOn: Step[] = [];
  private unconfirmedSwingPoint: {
    point: EnrichedDataPoint;
    type: SwingPointType;
  } | null;

  constructor(
    private options: { relativeThreshold: number; windowSize: number },
  ) {
    const { relativeThreshold, windowSize } = options;
    if (
      relativeThreshold < analysisConfig.comparableNumber.MIN_THRESHOLD ||
      relativeThreshold > analysisConfig.comparableNumber.MAX_THRESHOLD
    ) {
      throw new Error(
        `relativeThreshold must be between ${analysisConfig.comparableNumber.MIN_THRESHOLD} and ${analysisConfig.comparableNumber.MAX_THRESHOLD}`,
      );
    }
    if (
      !Number.isInteger(windowSize) ||
      windowSize < analysisConfig.swingPointDetection.MIN_WINDOW_SIZE
    ) {
      throw new Error(
        `windowSize must be a natural number >= ${analysisConfig.swingPointDetection.MIN_WINDOW_SIZE}`,
      );
    }
  }

  execute(context: AnalysisContext): void {
    const data = context.enrichedDataPoints;
    this.checkData(data);
    this.getSwingPoints(data);
  }

  private checkData(data: EnrichedDataPoint[]) {
    if (data.length < 2 * this.options.windowSize + 1) {
      throw new Error(
        `data must have at least ${2 * this.options.windowSize + 1} points for windowSize=${this.options.windowSize}`,
      );
    }
  }

  private getSwingPoints(data: EnrichedDataPoint[]) {
    let idx = this.options.windowSize;
    while (idx < data.length - this.options.windowSize) {
      const { previousPoints, nextPoints } = this.getSurroundingPoints(
        idx,
        data,
      );
      const currentPoint = data[idx];
      const currentComparableNumber = this.createComparableNumber(
        currentPoint.y,
      );

      if (
        this.isSwingHigh(previousPoints, currentComparableNumber, nextPoints)
      ) {
        this.setSwingPoint(currentPoint, 'swingHigh');
      } else if (
        this.isSwingLow(previousPoints, currentComparableNumber, nextPoints)
      ) {
        this.setSwingPoint(currentPoint, 'swingLow');
      } else if (
        this.isDownwardToPlateau(
          previousPoints,
          currentComparableNumber,
          nextPoints,
        )
      ) {
        this.setSwingPoint(currentPoint, 'downwardToPlateau');
      } else if (
        this.isUpwardToPlateau(
          previousPoints,
          currentComparableNumber,
          nextPoints,
        )
      ) {
        this.setSwingPoint(currentPoint, 'upwardToPlateau');
      } else if (
        this.isPlateauToUpward(
          previousPoints,
          currentComparableNumber,
          nextPoints,
        )
      ) {
        this.setSwingPoint(currentPoint, 'plateauToUpward');
      } else if (
        this.isPlateauToDownward(
          previousPoints,
          currentComparableNumber,
          nextPoints,
        )
      ) {
        this.setSwingPoint(currentPoint, 'plateauToDownward');
      }
      idx++;
    }
  }

  private getSurroundingPoints(idx: number, data: EnrichedDataPoint[]) {
    const previousPoints = new Array<ComparableNumber>(this.options.windowSize);
    const nextPoints = new Array<ComparableNumber>(this.options.windowSize);

    let idxWindowSize = 0;
    while (idxWindowSize < this.options.windowSize) {
      previousPoints[idxWindowSize] = this.createComparableNumber(
        data[idx - this.options.windowSize + idxWindowSize].y,
      );
      nextPoints[idxWindowSize] = this.createComparableNumber(
        data[idx + idxWindowSize + 1].y,
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

  private setSwingPoint(point: EnrichedDataPoint, swingPoint: SwingPointType) {
    if (swingPoint === 'swingHigh' || swingPoint === 'swingLow') {
      point.setSwingPointType(swingPoint);
      this.unconfirmedSwingPoint = null;
    } else if (
      swingPoint === 'downwardToPlateau' ||
      swingPoint === 'upwardToPlateau'
    ) {
      this.unconfirmedSwingPoint = { point, type: swingPoint };
    } else if (
      this.unconfirmedSwingPoint?.type === 'upwardToPlateau' &&
      swingPoint === 'plateauToDownward'
    ) {
      this.unconfirmedSwingPoint.point.setSwingPointType('swingHigh');
      this.unconfirmedSwingPoint = null;
    } else if (
      this.unconfirmedSwingPoint?.type === 'downwardToPlateau' &&
      swingPoint === 'plateauToUpward'
    ) {
      this.unconfirmedSwingPoint.point.setSwingPointType('swingLow');
      this.unconfirmedSwingPoint = null;
    } else {
      this.unconfirmedSwingPoint = null;
    }
  }
}
