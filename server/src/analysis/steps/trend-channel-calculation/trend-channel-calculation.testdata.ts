import { OHLCV } from 'src/data-aggregation/ohlcv.entity';
import { CreateTestData, OHLCVRecord } from '../../../utils/test-utils';
import { TrendChannelTestCase } from './trend-channel-calculation.spec';

export class TrendChannelCalculationTestdata extends CreateTestData {
  private calcSlope(point1: OHLCV, point2: OHLCV): number {
    return (
      (point2.getClosePrice() - point1.getClosePrice()) /
      (point2.getPriceDateEpochTime() - point1.getPriceDateEpochTime())
    );
  }

  private calcYIntercept(point: OHLCV, slope: number): number {
    return point.getClosePrice() - slope * point.getPriceDateEpochTime();
  }

  noTrends(): TrendChannelTestCase {
    const context = this.createContext([]);
    return {
      name: 'should do nothing if no trends are present',
      testcase: {
        expectedChannels: [],
        context,
      },
    };
  }

  simpleUpwardTrend(): TrendChannelTestCase {
    const primarySwingPointA: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '1', closePrice: 10 }),
      swingPointType: 'swingLow',
    };
    const secondarySwingPoint: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '2', closePrice: 20 }),
      swingPointType: 'swingHigh',
    };
    const primarySwingPointB: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '3', closePrice: 12 }),
      swingPointType: 'swingLow',
    };
    const endPoint: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '5', closePrice: 14 }),
      swingPointType: 'swingLow',
    };
    const context = this.createContext([
      primarySwingPointA,
      secondarySwingPoint,
      primarySwingPointB,
      {
        ohlcv: this.createOHLCV({ priceDate: '4', closePrice: 22 }),
        swingPointType: 'swingHigh',
      },
      endPoint,
    ]);
    context.setTrends([
      {
        type: 'upward',
        start: this.createEnrichedDataPointOf(primarySwingPointA),
        end: this.createEnrichedDataPointOf(endPoint),
      },
    ]);

    const slope = this.calcSlope(
      primarySwingPointB.ohlcv,
      primarySwingPointA.ohlcv,
    );
    return {
      name: 'should calculate channel for a simple upward trend',
      testcase: {
        expectedChannels: [
          {
            trendLine: {
              slope,
              yIntercept: this.calcYIntercept(primarySwingPointA.ohlcv, slope),
            },
            returnLine: {
              slope,
              yIntercept: this.calcYIntercept(secondarySwingPoint.ohlcv, slope),
            },
          },
        ],
        context,
      },
    };
  }

  simpleDownwardTrend(): TrendChannelTestCase {
    const primarySwingPointA: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '1', closePrice: 20 }),
      swingPointType: 'swingHigh',
    };
    const secondarySwingPoint: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '2', closePrice: 10 }),
      swingPointType: 'swingLow',
    };
    const primarySwingPointB: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '3', closePrice: 18 }),
      swingPointType: 'swingHigh',
    };
    const endPoint: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '5', closePrice: 16 }),
      swingPointType: 'swingHigh',
    };

    const context = this.createContext([
      primarySwingPointA,
      secondarySwingPoint,
      primarySwingPointB,
      {
        ohlcv: this.createOHLCV({ priceDate: '4', closePrice: 8 }),
        swingPointType: 'swingLow',
      },
      endPoint,
    ]);
    context.setTrends([
      {
        type: 'downward',
        start: this.createEnrichedDataPointOf(primarySwingPointA),
        end: this.createEnrichedDataPointOf(endPoint),
      },
    ]);

    const slope = this.calcSlope(
      primarySwingPointB.ohlcv,
      primarySwingPointA.ohlcv,
    );
    return {
      name: 'should calculate channel for a simple downward trend',
      testcase: {
        expectedChannels: [
          {
            trendLine: {
              slope,
              yIntercept: this.calcYIntercept(primarySwingPointA.ohlcv, slope),
            },
            returnLine: {
              slope,
              yIntercept: this.calcYIntercept(secondarySwingPoint.ohlcv, slope),
            },
          },
        ],
        context,
      },
    };
  }

  // mehrere Trends, überlappend
  overlappingTrends(): TrendChannelTestCase {
    const pointA: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '1', closePrice: 10 }),
      swingPointType: 'swingLow',
    };
    const pointB: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '2', closePrice: 20 }),
      swingPointType: 'swingHigh',
    };
    const pointC: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '3', closePrice: 12 }),
      swingPointType: 'swingLow',
    };
    const pointD: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '4', closePrice: 22 }),
      swingPointType: 'swingHigh',
    };
    const pointE: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '5', closePrice: 14 }),
      swingPointType: 'swingLow',
    };
    const pointF: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '6', closePrice: 24 }),
      swingPointType: 'swingHigh',
    };

    const context = this.createContext([
      pointA,
      pointB,
      pointC,
      pointD,
      pointE,
      pointF,
    ]);
    context.setTrends([
      {
        type: 'upward',
        start: this.createEnrichedDataPointOf(pointA),
        end: this.createEnrichedDataPointOf(pointE),
      },
      {
        type: 'upward',
        start: this.createEnrichedDataPointOf(pointC),
        end: this.createEnrichedDataPointOf(pointF),
      },
    ]);

    const slope1 = this.calcSlope(pointC.ohlcv, pointA.ohlcv);
    const slope2 = this.calcSlope(pointE.ohlcv, pointC.ohlcv);

    return {
      name: 'should handle overlapping trends',
      testcase: {
        expectedChannels: [
          {
            trendLine: {
              slope: slope1,
              yIntercept: this.calcYIntercept(pointA.ohlcv, slope1),
            },
            returnLine: {
              slope: slope1,
              yIntercept: this.calcYIntercept(pointB.ohlcv, slope1),
            },
          },
          {
            trendLine: {
              slope: slope2,
              yIntercept: this.calcYIntercept(pointC.ohlcv, slope2),
            },
            returnLine: {
              slope: slope2,
              yIntercept: this.calcYIntercept(pointD.ohlcv, slope2),
            },
          },
        ],
        context,
      },
    };
  }

  // mehrere Trends, getrennt
  separatedTrends(): TrendChannelTestCase {
    // Erster Trend: drei SwingPoints
    const pointA1: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '1', closePrice: 10 }),
      swingPointType: 'swingLow',
    };
    const pointB1: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '2', closePrice: 20 }),
      swingPointType: 'swingHigh',
    };
    const pointC1: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '3', closePrice: 12 }),
      swingPointType: 'swingLow',
    };

    // Zweiter Trend: drei SwingPoints
    const pointA2: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '10', closePrice: 30 }),
      swingPointType: 'swingLow',
    };
    const pointB2: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '11', closePrice: 40 }),
      swingPointType: 'swingHigh',
    };
    const pointC2: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '12', closePrice: 32 }),
      swingPointType: 'swingLow',
    };

    const context = this.createContext([
      pointA1,
      pointB1,
      pointC1,
      pointA2,
      pointB2,
      pointC2,
    ]);
    context.setTrends([
      {
        type: 'upward',
        start: this.createEnrichedDataPointOf(pointA1),
        end: this.createEnrichedDataPointOf(pointC1),
      },
      {
        type: 'upward',
        start: this.createEnrichedDataPointOf(pointA2),
        end: this.createEnrichedDataPointOf(pointC2),
      },
    ]);

    const slope1 = this.calcSlope(pointC1.ohlcv, pointA1.ohlcv);
    const slope2 = this.calcSlope(pointC2.ohlcv, pointA2.ohlcv);

    return {
      name: 'should handle separated trends',
      testcase: {
        expectedChannels: [
          {
            trendLine: {
              slope: slope1,
              yIntercept: this.calcYIntercept(pointA1.ohlcv, slope1),
            },
            returnLine: {
              slope: slope1,
              yIntercept: this.calcYIntercept(pointB1.ohlcv, slope1),
            },
          },
          {
            trendLine: {
              slope: slope2,
              yIntercept: this.calcYIntercept(pointA2.ohlcv, slope2),
            },
            returnLine: {
              slope: slope2,
              yIntercept: this.calcYIntercept(pointB2.ohlcv, slope2),
            },
          },
        ],
        context,
      },
    };
  }

  // mehrere Datenpunkte zwischen swing points
  multiplePointsBetweenSwings(): TrendChannelTestCase {
    const pointA: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '1', closePrice: 10 }),
      swingPointType: 'swingLow',
    };
    const pointB: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '2', closePrice: 20 }),
      swingPointType: 'swingHigh',
    };
    const pointC: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '3', closePrice: 12 }),
      swingPointType: 'swingLow',
    };
    const pointD: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '4', closePrice: 22 }),
      swingPointType: 'swingHigh',
    };

    const context = this.createContext([
      pointA,
      {
        ohlcv: this.createOHLCV({ priceDate: '1.5', closePrice: 15 }),
      },
      pointB,
      {
        ohlcv: this.createOHLCV({ priceDate: '2.5', closePrice: 16 }),
      },
      pointC,
      {
        ohlcv: this.createOHLCV({ priceDate: '3.5', closePrice: 18 }),
      },
      pointD,
    ]);
    context.setTrends([
      {
        type: 'upward',
        start: this.createEnrichedDataPointOf(pointA),
        end: this.createEnrichedDataPointOf(pointD),
      },
    ]);

    const slope = this.calcSlope(pointC.ohlcv, pointA.ohlcv);

    return {
      name: 'should handle multiple points between swing points',
      testcase: {
        expectedChannels: [
          {
            trendLine: {
              slope,
              yIntercept: this.calcYIntercept(pointA.ohlcv, slope),
            },
            returnLine: {
              slope,
              yIntercept: this.calcYIntercept(pointB.ohlcv, slope),
            },
          },
        ],
        context,
      },
    };
  }

  // Kommazahlen für x und y Werte
  decimalValues(): TrendChannelTestCase {
    const pointA: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '1.1', closePrice: 10.5 }),
      swingPointType: 'swingLow',
    };
    const pointB: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '2.2', closePrice: 20.7 }),
      swingPointType: 'swingHigh',
    };
    const pointC: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '3.3', closePrice: 12.9 }),
      swingPointType: 'swingLow',
    };

    const context = this.createContext([pointA, pointB, pointC]);
    context.setTrends([
      {
        type: 'upward',
        start: this.createEnrichedDataPointOf(pointA),
        end: this.createEnrichedDataPointOf(pointC),
      },
    ]);

    const slope = this.calcSlope(pointC.ohlcv, pointA.ohlcv);

    return {
      name: 'should handle decimal x and y values',
      testcase: {
        expectedChannels: [
          {
            trendLine: {
              slope,
              yIntercept: this.calcYIntercept(pointA.ohlcv, slope),
            },
            returnLine: {
              slope,
              yIntercept: this.calcYIntercept(pointB.ohlcv, slope),
            },
          },
        ],
        context,
      },
    };
  }

  // es vorauslaufende Points, welche aber nicht zum Trend gehören
  leadingPoints(): TrendChannelTestCase {
    const pointA: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '3', closePrice: 10 }),
      swingPointType: 'swingLow',
    };
    const pointB: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '4', closePrice: 20 }),
      swingPointType: 'swingHigh',
    };
    const pointC: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '5', closePrice: 12 }),
      swingPointType: 'swingLow',
    };

    const context = this.createContext([
      {
        ohlcv: this.createOHLCV({ priceDate: '1', closePrice: 99 }),
      },
      {
        ohlcv: this.createOHLCV({ priceDate: '2', closePrice: 88 }),
      },
      pointA,
      pointB,
      pointC,
    ]);
    context.setTrends([
      {
        type: 'upward',
        start: this.createEnrichedDataPointOf(pointA),
        end: this.createEnrichedDataPointOf(pointC),
      },
    ]);

    const slope = this.calcSlope(pointC.ohlcv, pointA.ohlcv);

    return {
      name: 'should ignore leading points not in trend',
      testcase: {
        expectedChannels: [
          {
            trendLine: {
              slope,
              yIntercept: this.calcYIntercept(pointA.ohlcv, slope),
            },
            returnLine: {
              slope,
              yIntercept: this.calcYIntercept(pointB.ohlcv, slope),
            },
          },
        ],
        context,
      },
    };
  }

  // es gibt nachlaufende Points, welche aber nicht zum Trend gehören
  trailingPoints(): TrendChannelTestCase {
    const pointA: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '1', closePrice: 10 }),
      swingPointType: 'swingLow',
    };
    const pointB: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '2', closePrice: 20 }),
      swingPointType: 'swingHigh',
    };
    const pointC: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '3', closePrice: 12 }),
      swingPointType: 'swingLow',
    };

    const context = this.createContext([
      pointA,
      pointB,
      pointC,
      {
        ohlcv: this.createOHLCV({ priceDate: '4', closePrice: 77 }),
      },
      {
        ohlcv: this.createOHLCV({ priceDate: '5', closePrice: 66 }),
      },
    ]);
    context.setTrends([
      {
        type: 'upward',
        start: this.createEnrichedDataPointOf(pointA),
        end: this.createEnrichedDataPointOf(pointC),
      },
    ]);

    const slope = this.calcSlope(pointC.ohlcv, pointA.ohlcv);

    return {
      name: 'should ignore trailing points not in trend',
      testcase: {
        expectedChannels: [
          {
            trendLine: {
              slope,
              yIntercept: this.calcYIntercept(pointA.ohlcv, slope),
            },
            returnLine: {
              slope,
              yIntercept: this.calcYIntercept(pointB.ohlcv, slope),
            },
          },
        ],
        context,
      },
    };
  }
}
