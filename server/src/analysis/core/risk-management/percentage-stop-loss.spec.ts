import { CreateTestData } from '../../../utils/test-utils';
import { YValueAccessor } from '../analysis-context';
import { EnrichedDataPoint } from '../enriched-data-points/enriched-data-point';
import { percentageStopLoss } from './percentage-stop-loss';

describe('percentageStopLoss', () => {
  const createTestData = new CreateTestData();
  let mockDataPoint: EnrichedDataPoint;
  let yValueAccessor: YValueAccessor;

  beforeEach(() => {
    mockDataPoint = createTestData.createEnrichedDataPoint({});
    // Simulate the accessor returning the closing price
    yValueAccessor = () => 100;
  });

  it('should calculate the correct stop-loss price for a given percentage', () => {
    const strategy = percentageStopLoss(5); // 5% stop-loss
    const stopLossPrice = strategy(mockDataPoint, yValueAccessor);
    expect(stopLossPrice).toBe(95); // 100 * (1 - 0.05)
  });

  it('should return the entry price if percentage is 0', () => {
    const strategy = percentageStopLoss(0);
    const stopLossPrice = strategy(mockDataPoint, yValueAccessor);
    expect(stopLossPrice).toBe(100);
  });

  it('should return 0 if percentage is 100', () => {
    const strategy = percentageStopLoss(100);
    const stopLossPrice = strategy(mockDataPoint, yValueAccessor);
    expect(stopLossPrice).toBe(0);
  });

  it('should throw an error if percentage is negative', () => {
    expect(() =>
      percentageStopLoss(-10)(mockDataPoint, yValueAccessor),
    ).toThrow('Percentage cannot be negative.');
  });
});
