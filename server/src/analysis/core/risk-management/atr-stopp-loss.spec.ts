import { CreateTestData } from '../../../utils/test-utils';
import { atrStopLoss } from './atr-stopp-loss';

describe('atrStopLoss', () => {
  const entryPrice = 100;
  const createTestData = new CreateTestData();

  it('should calculate the correct stop-loss price using the ATR value', () => {
    const mockDataPoint = createTestData.createEnrichedDataPoint({});
    mockDataPoint.setAverageTrueRange(5);
    const strategy = atrStopLoss(2); // 2 * ATR
    const stopLossPrice = strategy(entryPrice, mockDataPoint);
    expect(stopLossPrice).toBe(90); // 100 - (5 * 2)
  });

  it('should return the entry price if multiplier is 0', () => {
    const mockDataPoint = createTestData.createEnrichedDataPoint({});
    mockDataPoint.setAverageTrueRange(5);
    const strategy = atrStopLoss(0);
    const stopLossPrice = strategy(entryPrice, mockDataPoint);
    expect(stopLossPrice).toBe(100);
  });

  it('should throw an error if multiplier is negative', () => {
    const mockDataPoint = createTestData.createEnrichedDataPoint({});
    expect(() => atrStopLoss(-1)(entryPrice, mockDataPoint)).toThrow(
      'Multiplier cannot be negative.',
    );
  });

  it('should throw an error if the ATR indicator is not available', () => {
    const mockDataPoint = createTestData.createEnrichedDataPoint({});

    const strategy = atrStopLoss(2);
    expect(() => strategy(entryPrice, mockDataPoint)).toThrow(
      'ATR value is not available or not a number on the given data point.',
    );
  });
});
