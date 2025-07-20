import { OHLCV, OHLCVEntity } from './ohlcv.entity';

describe('OHLCV.clone', () => {
  const sampleData: OHLCVEntity = {
    securityId: 1,
    priceDate: '2024-06-01',
    openPrice: 100.1234,
    highPrice: 110.5678,
    lowPrice: 99.8765,
    closePrice: 105.4321,
    adjustedClosePrice: 104.9876,
    volume: 123456789,
  };

  it('should return a new OHLCV instance with identical data', () => {
    const original = new OHLCV(sampleData);
    const clone = original.clone();

    expect(clone).not.toBe(original);
    expect(clone.getSecurityId()).toBe(original.getSecurityId());
    expect(clone.getPriceDateIsoDate()).toBe(original.getPriceDateIsoDate());
    expect(clone.getOpenPrice()).toBe(original.getOpenPrice());
    expect(clone.getHighPrice()).toBe(original.getHighPrice());
    expect(clone.getLowPrice()).toBe(original.getLowPrice());
    expect(clone.getClosePrice()).toBe(original.getClosePrice());
    expect(clone.getAdjustedClosePrice()).toBe(
      original.getAdjustedClosePrice(),
    );
    expect(clone.getVolume()).toBe(original.getVolume());
  });

  it('should not affect the original when modifying the clone', () => {
    const original = new OHLCV(sampleData);
    const clone = original.clone();

    // @ts-expect-error: Accessing private property for test purposes
    clone.ohlcvData.openPrice = 200.0;

    expect(original.getOpenPrice()).toBe(100.1234);
    expect(clone.getOpenPrice()).toBe(200.0);
  });
});
