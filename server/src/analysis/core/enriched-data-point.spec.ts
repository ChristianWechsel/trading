import { OHLCV } from '../../data-aggregation/ohlcv.entity';
import { EnrichedDataPoint } from './enriched-data-point';

describe('EnrichedDataPoint', () => {
  const mockOHLCV: OHLCV = new OHLCV({
    priceDate: '2024-06-01T00:00:00Z',
    adjustedClosePrice: 100,
    closePrice: 100,
    highPrice: 105,
    lowPrice: 95,
    openPrice: 100,
    volume: 1000,
    securityId: 1,
  });

  it('should return the data point', () => {
    const edp = new EnrichedDataPoint(mockOHLCV);
    expect(edp.getDataPoint()).toBe(mockOHLCV);
  });

  it('should get and set swingPointType', () => {
    const edp = new EnrichedDataPoint(mockOHLCV);
    expect(edp.getSwingPointType()).toBeUndefined();

    edp.setSwingPointType('swingHigh');
    expect(edp.getSwingPointType()).toBe('swingHigh');

    edp.setSwingPointType(null);
    expect(edp.getSwingPointType()).toBeNull();
  });

  it('should get and set averageTrueRange', () => {
    const edp = new EnrichedDataPoint(mockOHLCV);
    expect(edp.getAverageTrueRange()).toBeUndefined();

    edp.setAverageTrueRange(12.34);
    expect(edp.getAverageTrueRange()).toBe(12.34);

    edp.setAverageTrueRange(0);
    expect(edp.getAverageTrueRange()).toBe(0);
  });
});
