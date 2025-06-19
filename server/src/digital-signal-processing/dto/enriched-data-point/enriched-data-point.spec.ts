import { DataPoint } from 'src/digital-signal-processing/digital-signal-processing.interface';
import { EnrichedDataPoint } from './enriched-data-point';

describe('EnrichedDataPoint', () => {
  it('should return the correct x value', () => {
    const mockDataPoint: DataPoint<number> = { x: 11, y: 20 };
    const enrichedDataPoint = new EnrichedDataPoint(mockDataPoint);

    expect(enrichedDataPoint.x).toBe(11);
  });

  it('should return the correct y value', () => {
    const mockDataPoint: DataPoint<number> = { x: 10, y: 20 };
    const enrichedDataPoint = new EnrichedDataPoint(mockDataPoint);

    expect(enrichedDataPoint.y).toBe(20);
  });

  it('should set and get the swingPointType correctly', () => {
    const mockDataPoint: DataPoint<number> = { x: 10, y: 20 };
    const enrichedDataPoint = new EnrichedDataPoint(mockDataPoint);

    enrichedDataPoint.setSwingPointType('swingHigh');
    expect(enrichedDataPoint.getSwingPointType()).toBe('swingHigh');

    enrichedDataPoint.setSwingPointType('swingLow');
    expect(enrichedDataPoint.getSwingPointType()).toBe('swingLow');
  });

  it('should set and get the trend correctly', () => {
    const mockDataPoint: DataPoint<number> = { x: 10, y: 20 };
    const enrichedDataPoint = new EnrichedDataPoint(mockDataPoint);

    enrichedDataPoint.setTrend('upward');
    expect(enrichedDataPoint.getTrend()).toBe('upward');
  });

  it('should set and get the trend correctly - double tap', () => {
    const mockDataPoint: DataPoint<number> = { x: 10, y: 20 };
    const enrichedDataPoint = new EnrichedDataPoint(mockDataPoint);

    enrichedDataPoint.setTrend('upward');
    enrichedDataPoint.setTrend('downward');
    expect(enrichedDataPoint.getTrend()).toEqual(['upward', 'downward']);
  });

  it('should set and get the trend correctly - triple tap', () => {
    const mockDataPoint: DataPoint<number> = { x: 10, y: 20 };
    const enrichedDataPoint = new EnrichedDataPoint(mockDataPoint);

    enrichedDataPoint.setTrend('upward');
    enrichedDataPoint.setTrend('downward');
    enrichedDataPoint.setTrend('upward');
    expect(enrichedDataPoint.getTrend()).toEqual(['upward', 'downward']);
  });

  it('should set and get the trendChannel correctly', () => {
    const mockDataPoint: DataPoint<number> = { x: 10, y: 20 };
    const enrichedDataPoint = new EnrichedDataPoint(mockDataPoint);

    const channel = { upper: 100, lower: 90 };
    enrichedDataPoint.setTrendChannel(channel);
    expect(enrichedDataPoint.getTrendChannel()).toEqual(channel);
  });

  it('should set and get the trendChannel correctly - double tap', () => {
    const mockDataPoint: DataPoint<number> = { x: 10, y: 20 };
    const enrichedDataPoint = new EnrichedDataPoint(mockDataPoint);

    const channel1 = { upper: 100, lower: 90 };
    const channel2 = { upper: 110, lower: 95 };
    enrichedDataPoint.setTrendChannel(channel1);
    enrichedDataPoint.setTrendChannel(channel2);
    expect(enrichedDataPoint.getTrendChannel()).toEqual([channel1, channel2]);
  });

  it('should set and get the trendChannel correctly - triple tap', () => {
    const mockDataPoint: DataPoint<number> = { x: 10, y: 20 };
    const enrichedDataPoint = new EnrichedDataPoint(mockDataPoint);

    const channel1 = { upper: 100, lower: 90 };
    const channel2 = { upper: 110, lower: 95 };
    const channel3 = { upper: 120, lower: 100 };
    enrichedDataPoint.setTrendChannel(channel1);
    enrichedDataPoint.setTrendChannel(channel2);
    enrichedDataPoint.setTrendChannel(channel3);
    expect(enrichedDataPoint.getTrendChannel()).toEqual([channel1, channel2]);
  });
});
