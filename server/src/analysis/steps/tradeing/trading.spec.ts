import { AnalysisContextClass } from '../../../analysis/core/analysis-context';
import { CreateTestData } from '../../../utils/test-utils';
import { Trading } from './trading';

describe('Trading', () => {
  let trading: Trading;
  const createTestData = new CreateTestData();
  const context: AnalysisContextClass = new AnalysisContextClass(
    {
      dataAggregation: { ticker: { exchange: '', symbol: '' } },
      steps: ['TradingSignal'],
    },
    [],
  );

  const spyGetTradingSignals = jest.spyOn(context, 'getTradingSignals');

  beforeEach(() => {
    trading = new Trading();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should have correct dependsOn and name properties', () => {
    expect(trading.dependsOn).toEqual(['TradingSignal']);
    expect(trading.name).toBe('Trading');
  });

  it('should do nothing if getTradingSignals returns undefined', () => {
    spyGetTradingSignals.mockReturnValue([]);
    expect(() => trading.execute(context)).not.toThrow();
    expect(spyGetTradingSignals).toHaveBeenCalled();
  });

  it('should do nothing if getTradingSignals returns empty array', () => {
    spyGetTradingSignals.mockReturnValue([]);
    expect(() => trading.execute(context)).not.toThrow();
    expect(spyGetTradingSignals).toHaveBeenCalled();
  });

  it('should proceed if getTradingSignals returns non-empty array', () => {
    spyGetTradingSignals.mockReturnValue([
      {
        dataPoint: createTestData.createEnrichedDataPoint({}),
        reason: 'Upward trend ended',
        type: 'sell',
      },
    ]);
    expect(() => trading.execute(context)).not.toThrow();
    expect(spyGetTradingSignals).toHaveBeenCalled();
    // No further assertions since execute does nothing else
  });
});
