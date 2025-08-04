import { CreateTestData } from '../../../utils/test-utils';
import { percentageStopLoss } from './percentage-stop-loss';

describe('percentageStopLoss', () => {
  const entryPrice = 100;
  // Mock dataPoint, as it's not used by this strategy
  const createTestData = new CreateTestData();

  it('should calculate the correct stop-loss price for a given percentage', () => {
    const mockDataPoint = createTestData.createEnrichedDataPoint({});
    const strategy = percentageStopLoss(5); // 5% stop-loss
    const stopLossPrice = strategy(entryPrice, mockDataPoint);
    expect(stopLossPrice).toBe(95);
  });

  it('should return the entry price if percentage is 0', () => {
    const mockDataPoint = createTestData.createEnrichedDataPoint({});
    const strategy = percentageStopLoss(0);
    const stopLossPrice = strategy(entryPrice, mockDataPoint);
    expect(stopLossPrice).toBe(100);
  });

  it('should return 0 if percentage is 100', () => {
    const mockDataPoint = createTestData.createEnrichedDataPoint({});
    const strategy = percentageStopLoss(100);
    const stopLossPrice = strategy(entryPrice, mockDataPoint);
    expect(stopLossPrice).toBe(0);
  });

  it('should throw an error if percentage is negative', () => {
    const mockDataPoint = createTestData.createEnrichedDataPoint({});
    expect(() => percentageStopLoss(-10)(entryPrice, mockDataPoint)).toThrow(
      'Percentage cannot be negative.',
    );
  });
});
