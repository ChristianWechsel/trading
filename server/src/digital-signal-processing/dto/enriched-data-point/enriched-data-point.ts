import { DataPoint } from '../../digital-signal-processing.interface';

export class EnrichedDataPoint {
  private swingPointType: SwingPointType = null;
  private trend: TrendType = null;
  private trendChannel: TrendChannel = null;

  constructor(private dataPoint: DataPoint<number>) {}

  get x(): number {
    return this.dataPoint.x;
  }

  get y(): number {
    return this.dataPoint.y;
  }

  getSwingPointType(): SwingPointType {
    return this.swingPointType;
  }

  setSwingPointType(type: SwingPointType): void {
    this.swingPointType = type;
  }

  getTrend(): TrendType {
    return this.trend;
  }

  setTrend(trend: TrendDirection): void {
    if (this.trend === null) {
      this.trend = trend;
    } else if (!Array.isArray(this.trend)) {
      this.trend = [this.trend, trend];
    }
  }

  getTrendChannel(): TrendChannel {
    return this.trendChannel;
  }

  setTrendChannel(channel: Channel): void {
    if (this.trendChannel === null) {
      this.trendChannel = channel;
    } else if (!Array.isArray(this.trendChannel)) {
      this.trendChannel = [this.trendChannel, channel];
    }
  }

  clone(): EnrichedDataPoint {
    const clone = new EnrichedDataPoint({
      x: this.dataPoint.x,
      y: this.dataPoint.y,
    });

    clone.swingPointType = this.swingPointType;

    clone.trend = Array.isArray(this.trend) ? [...this.trend] : this.trend;

    if (this.trendChannel === null) {
      clone.trendChannel = null;
    } else if (
      Array.isArray(this.trendChannel) &&
      this.trendChannel.length === 2
    ) {
      clone.trendChannel = [
        { ...this.trendChannel[0] },
        { ...this.trendChannel[1] },
      ];
    } else {
      clone.trendChannel = { ...this.trendChannel };
    }

    return clone;
  }
}

export type SwingPointType =
  | 'swingHigh' // previous < current > next
  | 'swingLow' // previous > current < next
  | 'plateauToUpward' // previous == current < next
  | 'plateauToDownward' // previous == current > next
  | 'upwardToPlateau' // previous < current == next
  | 'downwardToPlateau' // previous > current == next;
  | null; // no swing point detected

export type TrendDirection = 'upward' | 'downward';
export type TrendType =
  | TrendDirection
  | [TrendDirection, TrendDirection]
  | null;

type Channel = { upper: number; lower: number };
type TrendChannel = Channel | [Channel, Channel] | null;
