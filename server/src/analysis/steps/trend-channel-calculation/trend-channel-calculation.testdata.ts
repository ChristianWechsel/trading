import { DataPoint, TrendDataMetadata } from '../../core/analysis.interface';
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
    const initialTrends: TrendDataMetadata[] = [
      {
        trendData: {
          type: 'downward',
          startPoint: { x: 1 },
          endPoint: { x: 5 },
        },
        metaddata: { statusTrend: 'finished' },
      },
    ];

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
  // mehrere Trends, getrennt
  // mehrere Datenpunkte zwischen swing points
  // Kommazahlen für x und y Werte
  // es vorauslaufende Points, welche aber nicht zum Trend gehören
  // es gibt nachlaufende Points, welche aber nicht zum Trend gehören
}
