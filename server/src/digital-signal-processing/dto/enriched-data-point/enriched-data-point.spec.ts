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

    enrichedDataPoint.setTrend('downward');
    expect(enrichedDataPoint.getTrend()).toBe('downward');

    enrichedDataPoint.setTrend(null);
    expect(enrichedDataPoint.getTrend()).toBeNull();
  });
});
