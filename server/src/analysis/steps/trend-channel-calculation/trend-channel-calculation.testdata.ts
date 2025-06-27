import { DataPoint } from '../../core/analysis.interface';
import {
  EnrichedDataPoint,
  SwingPointType,
} from '../../core/enriched-data-point';
import { TrendChannelTestCase } from './trend-channel-calculation.spec';

export class TrendChannelCalculationTestdata {
  private createEnrichedDataPoint(
    dataPoint: DataPoint<number>,
    type: SwingPointType | null,
  ): EnrichedDataPoint {
    const enrichedDataPoint = new EnrichedDataPoint(dataPoint);
    if (type) {
      enrichedDataPoint.setSwingPointType(type);
    }
    return enrichedDataPoint;
  }

  private calcSlope(
    point1: DataPoint<number>,
    point2: DataPoint<number>,
  ): number {
    return (point2.y - point1.y) / (point2.x - point1.x);
  }

  private calcYIntercept(point: DataPoint<number>, slope: number): number {
    return point.y - slope * point.x;
  }

  noTrends(): TrendChannelTestCase {
    return {
      name: 'should do nothing if no trends are present',
      testcase: {
        initialContext: {
          enrichedDataPoints: [],
          trends: [],
        },
        expectedChannels: [],
      },
    };
  }

  simpleUpwardTrend(): TrendChannelTestCase {
    const pointA = { x: 1, y: 10 };
    const pointB = { x: 2, y: 20 };
    const pointC = { x: 3, y: 12 };
    const slope = this.calcSlope(pointC, pointA);

    return {
      name: 'should calculate channel for a simple upward trend',
      testcase: {
        initialContext: {
          enrichedDataPoints: [
            this.createEnrichedDataPoint(pointA, 'swingLow'),
            this.createEnrichedDataPoint(pointB, 'swingHigh'),
            this.createEnrichedDataPoint(pointC, 'swingLow'),
            this.createEnrichedDataPoint({ x: 4, y: 22 }, 'swingHigh'),
            this.createEnrichedDataPoint({ x: 5, y: 14 }, 'swingLow'),
          ],
          trends: [
            { type: 'upward', startPoint: { x: pointA.x }, endPoint: { x: 5 } },
          ],
        },
        expectedChannels: [
          {
            trendLine: {
              slope,
              yIntercept: this.calcYIntercept(pointA, slope),
            },
            returnLine: {
              slope,
              yIntercept: this.calcYIntercept(pointB, slope),
            },
          },
        ],
      },
    };
  }

  simpleDownwardTrend(): TrendChannelTestCase {
    const pointA = { x: 1, y: 20 };
    const pointB = { x: 2, y: 10 };
    const pointC = { x: 3, y: 18 };
    const slope = this.calcSlope(pointC, pointA);
    return {
      name: 'should calculate channel for a simple downward trend',
      testcase: {
        initialContext: {
          enrichedDataPoints: [
            this.createEnrichedDataPoint(pointA, 'swingHigh'),
            this.createEnrichedDataPoint(pointB, 'swingLow'),
            this.createEnrichedDataPoint(pointC, 'swingHigh'),
            this.createEnrichedDataPoint({ x: 4, y: 8 }, 'swingLow'),
            this.createEnrichedDataPoint({ x: 5, y: 16 }, 'swingHigh'),
          ],
          trends: [
            {
              type: 'downward',
              startPoint: { x: pointA.x },
              endPoint: { x: 5 },
            },
          ],
        },
        expectedChannels: [
          {
            trendLine: {
              slope,
              yIntercept: this.calcYIntercept(pointA, slope),
            },
            returnLine: {
              slope,
              yIntercept: this.calcYIntercept(pointB, slope),
            },
          },
        ],
      },
    };
  }

  // mehrere Trends, überlappend
  overlappingTrends(): TrendChannelTestCase {
    const pointA = { x: 1, y: 10 };
    const pointB = { x: 2, y: 20 };
    const pointC = { x: 3, y: 12 };
    const pointD = { x: 4, y: 22 };
    const pointE = { x: 5, y: 14 };
    const pointF = { x: 6, y: 24 };

    const slope1 = this.calcSlope(pointC, pointA);
    const slope2 = this.calcSlope(pointE, pointC);

    return {
      name: 'should handle overlapping trends',
      testcase: {
        initialContext: {
          enrichedDataPoints: [
            this.createEnrichedDataPoint(pointA, 'swingLow'),
            this.createEnrichedDataPoint(pointB, 'swingHigh'),
            this.createEnrichedDataPoint(pointC, 'swingLow'),
            this.createEnrichedDataPoint(pointD, 'swingHigh'),
            this.createEnrichedDataPoint(pointE, 'swingLow'),
            this.createEnrichedDataPoint(pointF, 'swingHigh'),
          ],
          trends: [
            {
              type: 'upward',
              startPoint: { x: pointA.x },
              endPoint: { x: pointE.x },
            },
            {
              type: 'upward',
              startPoint: { x: pointC.x },
              endPoint: { x: pointF.x },
            },
          ],
        },
        expectedChannels: [
          {
            trendLine: {
              slope: slope1,
              yIntercept: this.calcYIntercept(pointA, slope1),
            },
            returnLine: {
              slope: slope1,
              yIntercept: this.calcYIntercept(pointB, slope1),
            },
          },
          {
            trendLine: {
              slope: slope2,
              yIntercept: this.calcYIntercept(pointC, slope2),
            },
            returnLine: {
              slope: slope2,
              yIntercept: this.calcYIntercept(pointD, slope2),
            },
          },
        ],
      },
    };
  }

  // mehrere Trends, getrennt
  separatedTrends(): TrendChannelTestCase {
    // Erster Trend: drei SwingPoints
    const pointA1 = { x: 1, y: 10 };
    const pointB1 = { x: 2, y: 20 };
    const pointC1 = { x: 3, y: 12 };

    // Zweiter Trend: drei SwingPoints
    const pointA2 = { x: 10, y: 30 };
    const pointB2 = { x: 11, y: 40 };
    const pointC2 = { x: 12, y: 32 };

    const slope1 = this.calcSlope(pointC1, pointA1);
    const slope2 = this.calcSlope(pointC2, pointA2);

    return {
      name: 'should handle separated trends',
      testcase: {
        initialContext: {
          enrichedDataPoints: [
            this.createEnrichedDataPoint(pointA1, 'swingLow'),
            this.createEnrichedDataPoint(pointB1, 'swingHigh'),
            this.createEnrichedDataPoint(pointC1, 'swingLow'),
            this.createEnrichedDataPoint(pointA2, 'swingLow'),
            this.createEnrichedDataPoint(pointB2, 'swingHigh'),
            this.createEnrichedDataPoint(pointC2, 'swingLow'),
          ],
          trends: [
            {
              type: 'upward',
              startPoint: { x: pointA1.x },
              endPoint: { x: pointC1.x },
            },
            {
              type: 'upward',
              startPoint: { x: pointA2.x },
              endPoint: { x: pointC2.x },
            },
          ],
        },
        expectedChannels: [
          {
            trendLine: {
              slope: slope1,
              yIntercept: this.calcYIntercept(pointA1, slope1),
            },
            returnLine: {
              slope: slope1,
              yIntercept: this.calcYIntercept(pointB1, slope1),
            },
          },
          {
            trendLine: {
              slope: slope2,
              yIntercept: this.calcYIntercept(pointA2, slope2),
            },
            returnLine: {
              slope: slope2,
              yIntercept: this.calcYIntercept(pointB2, slope2),
            },
          },
        ],
      },
    };
  }

  // mehrere Datenpunkte zwischen swing points
  multiplePointsBetweenSwings(): TrendChannelTestCase {
    const pointA = { x: 1, y: 10 };
    const pointB = { x: 2, y: 20 };
    const pointC = { x: 3, y: 12 };
    const pointD = { x: 4, y: 22 };

    const slope = this.calcSlope(pointC, pointA);

    return {
      name: 'should handle multiple points between swing points',
      testcase: {
        initialContext: {
          enrichedDataPoints: [
            this.createEnrichedDataPoint(pointA, 'swingLow'),
            this.createEnrichedDataPoint({ x: 1.5, y: 15 }, null),
            this.createEnrichedDataPoint(pointB, 'swingHigh'),
            this.createEnrichedDataPoint({ x: 2.5, y: 16 }, null),
            this.createEnrichedDataPoint(pointC, 'swingLow'),
            this.createEnrichedDataPoint({ x: 3.5, y: 18 }, null),
            this.createEnrichedDataPoint(pointD, 'swingHigh'),
          ],
          trends: [
            {
              type: 'upward',
              startPoint: { x: pointA.x },
              endPoint: { x: pointD.x },
            },
          ],
        },
        expectedChannels: [
          {
            trendLine: {
              slope,
              yIntercept: this.calcYIntercept(pointA, slope),
            },
            returnLine: {
              slope,
              yIntercept: this.calcYIntercept(pointB, slope),
            },
          },
        ],
      },
    };
  }

  // Kommazahlen für x und y Werte
  decimalValues(): TrendChannelTestCase {
    const pointA = { x: 1.1, y: 10.5 };
    const pointB = { x: 2.2, y: 20.7 };
    const pointC = { x: 3.3, y: 12.9 };

    const slope = this.calcSlope(pointC, pointA);

    return {
      name: 'should handle decimal x and y values',
      testcase: {
        initialContext: {
          enrichedDataPoints: [
            this.createEnrichedDataPoint(pointA, 'swingLow'),
            this.createEnrichedDataPoint(pointB, 'swingHigh'),
            this.createEnrichedDataPoint(pointC, 'swingLow'),
          ],
          trends: [
            {
              type: 'upward',
              startPoint: { x: pointA.x },
              endPoint: { x: pointC.x },
            },
          ],
        },
        expectedChannels: [
          {
            trendLine: {
              slope,
              yIntercept: this.calcYIntercept(pointA, slope),
            },
            returnLine: {
              slope,
              yIntercept: this.calcYIntercept(pointB, slope),
            },
          },
        ],
      },
    };
  }

  // es vorauslaufende Points, welche aber nicht zum Trend gehören
  leadingPoints(): TrendChannelTestCase {
    const pointA = { x: 3, y: 10 };
    const pointB = { x: 4, y: 20 };
    const pointC = { x: 5, y: 12 };

    const slope = this.calcSlope(pointC, pointA);

    return {
      name: 'should ignore leading points not in trend',
      testcase: {
        initialContext: {
          enrichedDataPoints: [
            this.createEnrichedDataPoint({ x: 1, y: 99 }, null),
            this.createEnrichedDataPoint({ x: 2, y: 88 }, null),
            this.createEnrichedDataPoint(pointA, 'swingLow'),
            this.createEnrichedDataPoint(pointB, 'swingHigh'),
            this.createEnrichedDataPoint(pointC, 'swingLow'),
          ],
          trends: [
            {
              type: 'upward',
              startPoint: { x: pointA.x },
              endPoint: { x: pointC.x },
            },
          ],
        },
        expectedChannels: [
          {
            trendLine: {
              slope,
              yIntercept: this.calcYIntercept(pointA, slope),
            },
            returnLine: {
              slope,
              yIntercept: this.calcYIntercept(pointB, slope),
            },
          },
        ],
      },
    };
  }

  // es gibt nachlaufende Points, welche aber nicht zum Trend gehören
  trailingPoints(): TrendChannelTestCase {
    const pointA = { x: 1, y: 10 };
    const pointB = { x: 2, y: 20 };
    const pointC = { x: 3, y: 12 };

    const slope = this.calcSlope(pointC, pointA);

    return {
      name: 'should ignore trailing points not in trend',
      testcase: {
        initialContext: {
          enrichedDataPoints: [
            this.createEnrichedDataPoint(pointA, 'swingLow'),
            this.createEnrichedDataPoint(pointB, 'swingHigh'),
            this.createEnrichedDataPoint(pointC, 'swingLow'),
            this.createEnrichedDataPoint({ x: 4, y: 77 }, null),
            this.createEnrichedDataPoint({ x: 5, y: 66 }, null),
          ],
          trends: [
            {
              type: 'upward',
              startPoint: { x: pointA.x },
              endPoint: { x: pointC.x },
            },
          ],
        },
        expectedChannels: [
          {
            trendLine: {
              slope,
              yIntercept: this.calcYIntercept(pointA, slope),
            },
            returnLine: {
              slope,
              yIntercept: this.calcYIntercept(pointB, slope),
            },
          },
        ],
      },
    };
  }
}
