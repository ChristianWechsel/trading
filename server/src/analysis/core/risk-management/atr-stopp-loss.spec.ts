import { CreateTestData } from '../../../utils/test-utils';
import { YValueAccessor } from '../analysis-context';
import { EnrichedDataPoint } from '../enriched-data-points/enriched-data-point';
import { atrStopLoss } from './atr-stopp-loss';

describe('atrStopLoss', () => {
  const createTestData = new CreateTestData();
  let mockDataPoint: EnrichedDataPoint;
  let yValueAccessor: YValueAccessor;

  beforeEach(() => {
    mockDataPoint = createTestData.createEnrichedDataPoint({});
    yValueAccessor = () => 100; // The price for the calculation
  });

  it('should calculate the correct stop-loss price using the ATR value', () => {
    mockDataPoint.setAverageTrueRange(5);
    const strategy = atrStopLoss(2); // 2 * ATR
    const stopLossPrice = strategy(mockDataPoint, yValueAccessor);
    expect(stopLossPrice).toBe(90); // 100 - (5 * 2)
  });

  it('should return the entry price if multiplier is 0', () => {
    mockDataPoint.setAverageTrueRange(5);
    const strategy = atrStopLoss(0);
    const stopLossPrice = strategy(mockDataPoint, yValueAccessor);
    expect(stopLossPrice).toBe(100);
  });

  it('should throw an error if multiplier is negative', () => {
    expect(() => atrStopLoss(-1)(mockDataPoint, yValueAccessor)).toThrow(
      'Multiplier cannot be negative.',
    );
  });

  it('should throw an error if the ATR indicator is not available', () => {
    // No ATR value is set on mockDataPoint
    const strategy = atrStopLoss(2);
    expect(() => strategy(mockDataPoint, yValueAccessor)).toThrow(
      'ATR value is not available or not a number on the given data point.',
    );
  });
});
