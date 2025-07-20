import { CreateTestData } from 'src/utils/test-utils';
import { EnrichedDataPoint } from '../../core/enriched-data-point';
import { TrendChannelTestCase } from './trend-channel-calculation.spec';

export class TrendChannelCalculationTestdata extends CreateTestData {
  private calcSlope(
    point1: EnrichedDataPoint,
    point2: EnrichedDataPoint,
  ): number {
    return (
      (point2.getDataPoint().getClosePrice() -
        point1.getDataPoint().getClosePrice()) /
      (point2.getDataPoint().getPriceDateEpochTime() -
        point1.getDataPoint().getPriceDateEpochTime())
    );
  }

  private calcYIntercept(point: EnrichedDataPoint, slope: number): number {
    return (
      point.getDataPoint().getClosePrice() -
      slope * point.getDataPoint().getPriceDateEpochTime()
    );
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
    const primarySwingPointA = this.createEnrichedDataPointWithSwingPoints(
      { priceDate: '1', closePrice: 10 },
      'swingLow',
    );
    const secondarySwingPoint = this.createEnrichedDataPointWithSwingPoints(
      { priceDate: '2', closePrice: 20 },
      'swingHigh',
    );
    const primarySwingPointB = this.createEnrichedDataPointWithSwingPoints(
      { priceDate: '3', closePrice: 12 },
      'swingLow',
    );
    const endPoint = this.createEnrichedDataPointWithSwingPoints(
      { priceDate: '5', closePrice: 14 },
      'swingLow',
    );

    const slope = this.calcSlope(primarySwingPointB, primarySwingPointA);
    return {
      name: 'should calculate channel for a simple upward trend',
      testcase: {
        initialContext: {
          enrichedDataPoints: [
            primarySwingPointA,
            secondarySwingPoint,
            primarySwingPointB,
            this.createEnrichedDataPointWithSwingPoints(
              { priceDate: '4', closePrice: 22 },
              'swingHigh',
            ),
            endPoint,
          ],
          trends: [
            {
              type: 'upward',
              startPoint: primarySwingPointA,
              endPoint,
            },
          ],
        },
        expectedChannels: [
          {
            trendLine: {
              slope,
              yIntercept: this.calcYIntercept(primarySwingPointA, slope),
            },
            returnLine: {
              slope,
              yIntercept: this.calcYIntercept(secondarySwingPoint, slope),
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
            this.createEnrichedDataPointWithSwingPoints(pointA, 'swingHigh'),
            this.createEnrichedDataPointWithSwingPoints(pointB, 'swingLow'),
            this.createEnrichedDataPointWithSwingPoints(pointC, 'swingHigh'),
            this.createEnrichedDataPointWithSwingPoints(
              { x: 4, y: 8 },
              'swingLow',
            ),
            this.createEnrichedDataPointWithSwingPoints(
              { x: 5, y: 16 },
              'swingHigh',
            ),
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
            this.createEnrichedDataPointWithSwingPoints(pointA, 'swingLow'),
            this.createEnrichedDataPointWithSwingPoints(pointB, 'swingHigh'),
            this.createEnrichedDataPointWithSwingPoints(pointC, 'swingLow'),
            this.createEnrichedDataPointWithSwingPoints(pointD, 'swingHigh'),
            this.createEnrichedDataPointWithSwingPoints(pointE, 'swingLow'),
            this.createEnrichedDataPointWithSwingPoints(pointF, 'swingHigh'),
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
            this.createEnrichedDataPointWithSwingPoints(pointA1, 'swingLow'),
            this.createEnrichedDataPointWithSwingPoints(pointB1, 'swingHigh'),
            this.createEnrichedDataPointWithSwingPoints(pointC1, 'swingLow'),
            this.createEnrichedDataPointWithSwingPoints(pointA2, 'swingLow'),
            this.createEnrichedDataPointWithSwingPoints(pointB2, 'swingHigh'),
            this.createEnrichedDataPointWithSwingPoints(pointC2, 'swingLow'),
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
            this.createEnrichedDataPointWithSwingPoints(pointA, 'swingLow'),
            this.createEnrichedDataPointWithSwingPoints(
              { x: 1.5, y: 15 },
              null,
            ),
            this.createEnrichedDataPointWithSwingPoints(pointB, 'swingHigh'),
            this.createEnrichedDataPointWithSwingPoints(
              { x: 2.5, y: 16 },
              null,
            ),
            this.createEnrichedDataPointWithSwingPoints(pointC, 'swingLow'),
            this.createEnrichedDataPointWithSwingPoints(
              { x: 3.5, y: 18 },
              null,
            ),
            this.createEnrichedDataPointWithSwingPoints(pointD, 'swingHigh'),
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
            this.createEnrichedDataPointWithSwingPoints(pointA, 'swingLow'),
            this.createEnrichedDataPointWithSwingPoints(pointB, 'swingHigh'),
            this.createEnrichedDataPointWithSwingPoints(pointC, 'swingLow'),
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
            this.createEnrichedDataPointWithSwingPoints({ x: 1, y: 99 }, null),
            this.createEnrichedDataPointWithSwingPoints({ x: 2, y: 88 }, null),
            this.createEnrichedDataPointWithSwingPoints(pointA, 'swingLow'),
            this.createEnrichedDataPointWithSwingPoints(pointB, 'swingHigh'),
            this.createEnrichedDataPointWithSwingPoints(pointC, 'swingLow'),
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
            this.createEnrichedDataPointWithSwingPoints(pointA, 'swingLow'),
            this.createEnrichedDataPointWithSwingPoints(pointB, 'swingHigh'),
            this.createEnrichedDataPointWithSwingPoints(pointC, 'swingLow'),
            this.createEnrichedDataPointWithSwingPoints({ x: 4, y: 77 }, null),
            this.createEnrichedDataPointWithSwingPoints({ x: 5, y: 66 }, null),
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
