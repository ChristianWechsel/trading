import { CreateTestData } from '../../../utils/test-utils';
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
    const primarySwingPointA = this.createEnrichedDataPointWithSwingPoints(
      { priceDate: '1', closePrice: 20 },
      'swingHigh',
    );
    const secondarySwingPoint = this.createEnrichedDataPointWithSwingPoints(
      { priceDate: '2', closePrice: 10 },
      'swingLow',
    );
    const primarySwingPointB = this.createEnrichedDataPointWithSwingPoints(
      { priceDate: '3', closePrice: 18 },
      'swingHigh',
    );
    const endPoint = this.createEnrichedDataPointWithSwingPoints(
      { priceDate: '5', closePrice: 16 },
      'swingHigh',
    );

    const slope = this.calcSlope(primarySwingPointB, primarySwingPointA);
    return {
      name: 'should calculate channel for a simple downward trend',
      testcase: {
        initialContext: {
          enrichedDataPoints: [
            primarySwingPointA,
            secondarySwingPoint,
            primarySwingPointB,
            this.createEnrichedDataPointWithSwingPoints(
              { priceDate: '4', closePrice: 8 },
              'swingLow',
            ),
            endPoint,
          ],
          trends: [
            {
              type: 'downward',
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

  // mehrere Trends, überlappend
  overlappingTrends(): TrendChannelTestCase {
    const pointA = this.createEnrichedDataPointWithSwingPoints(
      { priceDate: '1', closePrice: 10 },
      'swingLow',
    );
    const pointB = this.createEnrichedDataPointWithSwingPoints(
      { priceDate: '2', closePrice: 20 },
      'swingHigh',
    );
    const pointC = this.createEnrichedDataPointWithSwingPoints(
      { priceDate: '3', closePrice: 12 },
      'swingLow',
    );
    const pointD = this.createEnrichedDataPointWithSwingPoints(
      { priceDate: '4', closePrice: 22 },
      'swingHigh',
    );
    const pointE = this.createEnrichedDataPointWithSwingPoints(
      { priceDate: '5', closePrice: 14 },
      'swingLow',
    );
    const pointF = this.createEnrichedDataPointWithSwingPoints(
      { priceDate: '6', closePrice: 24 },
      'swingHigh',
    );

    const slope1 = this.calcSlope(pointC, pointA);
    const slope2 = this.calcSlope(pointE, pointC);

    return {
      name: 'should handle overlapping trends',
      testcase: {
        initialContext: {
          enrichedDataPoints: [pointA, pointB, pointC, pointD, pointE, pointF],
          trends: [
            {
              type: 'upward',
              startPoint: pointA,
              endPoint: pointE,
            },
            {
              type: 'upward',
              startPoint: pointC,
              endPoint: pointF,
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
    const pointA1 = this.createEnrichedDataPointWithSwingPoints(
      { priceDate: '1', closePrice: 10 },
      'swingLow',
    );
    const pointB1 = this.createEnrichedDataPointWithSwingPoints(
      { priceDate: '2', closePrice: 20 },
      'swingHigh',
    );
    const pointC1 = this.createEnrichedDataPointWithSwingPoints(
      { priceDate: '3', closePrice: 12 },
      'swingLow',
    );

    // Zweiter Trend: drei SwingPoints
    const pointA2 = this.createEnrichedDataPointWithSwingPoints(
      { priceDate: '10', closePrice: 30 },
      'swingLow',
    );
    const pointB2 = this.createEnrichedDataPointWithSwingPoints(
      { priceDate: '11', closePrice: 40 },
      'swingHigh',
    );
    const pointC2 = this.createEnrichedDataPointWithSwingPoints(
      { priceDate: '12', closePrice: 32 },
      'swingLow',
    );

    const slope1 = this.calcSlope(pointC1, pointA1);
    const slope2 = this.calcSlope(pointC2, pointA2);

    return {
      name: 'should handle separated trends',
      testcase: {
        initialContext: {
          enrichedDataPoints: [
            pointA1,
            pointB1,
            pointC1,
            pointA2,
            pointB2,
            pointC2,
          ],
          trends: [
            {
              type: 'upward',
              startPoint: pointA1,
              endPoint: pointC1,
            },
            {
              type: 'upward',
              startPoint: pointA2,
              endPoint: pointC2,
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
    const pointA = this.createEnrichedDataPointWithSwingPoints(
      { priceDate: '1', closePrice: 10 },
      'swingLow',
    );
    const pointB = this.createEnrichedDataPointWithSwingPoints(
      { priceDate: '2', closePrice: 20 },
      'swingHigh',
    );
    const pointC = this.createEnrichedDataPointWithSwingPoints(
      { priceDate: '3', closePrice: 12 },
      'swingLow',
    );
    const pointD = this.createEnrichedDataPointWithSwingPoints(
      { priceDate: '4', closePrice: 22 },
      'swingHigh',
    );

    const slope = this.calcSlope(pointC, pointA);

    return {
      name: 'should handle multiple points between swing points',
      testcase: {
        initialContext: {
          enrichedDataPoints: [
            pointA,
            this.createEnrichedDataPointWithSwingPoints(
              { priceDate: '1.5', closePrice: 15 },
              null,
            ),
            pointB,
            this.createEnrichedDataPointWithSwingPoints(
              { priceDate: '2.5', closePrice: 16 },
              null,
            ),
            pointC,
            this.createEnrichedDataPointWithSwingPoints(
              { priceDate: '3.5', closePrice: 18 },
              null,
            ),
            pointD,
          ],
          trends: [
            {
              type: 'upward',
              startPoint: pointA,
              endPoint: pointD,
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
    const pointA = this.createEnrichedDataPointWithSwingPoints(
      { priceDate: '1.1', closePrice: 10.5 },
      'swingLow',
    );
    const pointB = this.createEnrichedDataPointWithSwingPoints(
      { priceDate: '2.2', closePrice: 20.7 },
      'swingHigh',
    );
    const pointC = this.createEnrichedDataPointWithSwingPoints(
      { priceDate: '3.3', closePrice: 12.9 },
      'swingLow',
    );

    const slope = this.calcSlope(pointC, pointA);

    return {
      name: 'should handle decimal x and y values',
      testcase: {
        initialContext: {
          enrichedDataPoints: [pointA, pointB, pointC],
          trends: [
            {
              type: 'upward',
              startPoint: pointA,
              endPoint: pointC,
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
    const pointA = this.createEnrichedDataPointWithSwingPoints(
      { priceDate: '3', closePrice: 10 },
      'swingLow',
    );
    const pointB = this.createEnrichedDataPointWithSwingPoints(
      { priceDate: '4', closePrice: 20 },
      'swingHigh',
    );
    const pointC = this.createEnrichedDataPointWithSwingPoints(
      { priceDate: '5', closePrice: 12 },
      'swingLow',
    );

    const slope = this.calcSlope(pointC, pointA);

    return {
      name: 'should ignore leading points not in trend',
      testcase: {
        initialContext: {
          enrichedDataPoints: [
            this.createEnrichedDataPointWithSwingPoints(
              { priceDate: '1', closePrice: 99 },
              null,
            ),
            this.createEnrichedDataPointWithSwingPoints(
              { priceDate: '2', closePrice: 88 },
              null,
            ),
            pointA,
            pointB,
            pointC,
          ],
          trends: [
            {
              type: 'upward',
              startPoint: pointA,
              endPoint: pointC,
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
    const pointA = this.createEnrichedDataPointWithSwingPoints(
      { priceDate: '1', closePrice: 10 },
      'swingLow',
    );
    const pointB = this.createEnrichedDataPointWithSwingPoints(
      { priceDate: '2', closePrice: 20 },
      'swingHigh',
    );
    const pointC = this.createEnrichedDataPointWithSwingPoints(
      { priceDate: '3', closePrice: 12 },
      'swingLow',
    );

    const slope = this.calcSlope(pointC, pointA);

    return {
      name: 'should ignore trailing points not in trend',
      testcase: {
        initialContext: {
          enrichedDataPoints: [
            pointA,
            pointB,
            pointC,
            this.createEnrichedDataPointWithSwingPoints(
              { priceDate: '4', closePrice: 77 },
              null,
            ),
            this.createEnrichedDataPointWithSwingPoints(
              { priceDate: '5', closePrice: 66 },
              null,
            ),
          ],
          trends: [
            {
              type: 'upward',
              startPoint: pointA,
              endPoint: pointC,
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
