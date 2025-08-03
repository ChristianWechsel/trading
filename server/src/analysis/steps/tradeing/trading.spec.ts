import { AnalysisContextClass } from '../../../analysis/core/analysis-context';
import { SignalForTrade } from '../../../analysis/core/analysis.interface';
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
  const spyAddTrade = jest.spyOn(context, 'addTrade');

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

  it('should do nothing if getTradingSignals returns an empty array', () => {
    spyGetTradingSignals.mockReturnValue([]);
    trading.execute(context);
    expect(spyGetTradingSignals).toHaveBeenCalled();
    expect(spyAddTrade).not.toHaveBeenCalled();
    expect(context.getTrades()).toHaveLength(0);
  });

  it('should not create a trade with only a buy signal', () => {
    const buySignal: SignalForTrade = {
      dataPoint: createTestData.createEnrichedDataPoint({
        priceDate: '2023-01-01',
        closePrice: 100,
      }),
      reason: 'Upward trend started',
      type: 'buy',
    };
    spyGetTradingSignals.mockReturnValue([buySignal]);
    trading.execute(context);
    expect(spyAddTrade).not.toHaveBeenCalled();
    expect(context.getTrades()).toHaveLength(0);
  });

  it('should create a trade from a buy and a subsequent sell signal', () => {
    const buySignal: SignalForTrade = {
      dataPoint: createTestData.createEnrichedDataPoint({
        priceDate: '2023-01-01',
        closePrice: 100,
      }),
      reason: 'Upward trend started',
      type: 'buy',
    };
    const sellSignal: SignalForTrade = {
      dataPoint: createTestData.createEnrichedDataPoint({
        priceDate: '2023-01-02',
        closePrice: 110,
      }),
      reason: 'Upward trend ended',
      type: 'sell',
    };
    spyGetTradingSignals.mockReturnValue([buySignal, sellSignal]);
    trading.execute(context);
    expect(spyAddTrade).toHaveBeenCalledTimes(1);
    expect(spyAddTrade).toHaveBeenCalledWith({
      entry: buySignal,
      exit: sellSignal,
    });
    expect(context.getTrades()).toHaveLength(1);
  });

  it('should ignore a sell signal without a preceding buy signal', () => {
    const sellSignal: SignalForTrade = {
      dataPoint: createTestData.createEnrichedDataPoint({
        priceDate: '2023-01-01',
        closePrice: 110,
      }),
      reason: 'Upward trend ended',
      type: 'sell',
    };
    spyGetTradingSignals.mockReturnValue([sellSignal]);
    trading.execute(context);
    expect(spyAddTrade).not.toHaveBeenCalled();
    expect(context.getTrades()).toHaveLength(0);
  });

  it('should ignore consecutive buy signals and use the first one', () => {
    const buySignal1: SignalForTrade = {
      dataPoint: createTestData.createEnrichedDataPoint({
        priceDate: '2023-01-01',
        closePrice: 100,
      }),
      reason: 'Upward trend started',
      type: 'buy',
    };
    const buySignal2: SignalForTrade = {
      dataPoint: createTestData.createEnrichedDataPoint({
        priceDate: '2023-01-02',
        closePrice: 105,
      }),
      reason: 'Upward trend started',
      type: 'buy',
    };
    const sellSignal: SignalForTrade = {
      dataPoint: createTestData.createEnrichedDataPoint({
        priceDate: '2023-01-03',
        closePrice: 110,
      }),
      reason: 'Upward trend ended',
      type: 'sell',
    };
    spyGetTradingSignals.mockReturnValue([buySignal1, buySignal2, sellSignal]);
    trading.execute(context);
    expect(spyAddTrade).toHaveBeenCalledTimes(1);
    expect(spyAddTrade).toHaveBeenCalledWith({
      entry: buySignal1,
      exit: sellSignal,
    });
    expect(context.getTrades()).toHaveLength(1);
  });

  it('should handle multiple completed trades', () => {
    const buySignal1: SignalForTrade = {
      dataPoint: createTestData.createEnrichedDataPoint({
        priceDate: '2023-01-01',
        closePrice: 100,
      }),
      reason: 'Upward trend started',
      type: 'buy',
    };
    const sellSignal1: SignalForTrade = {
      dataPoint: createTestData.createEnrichedDataPoint({
        priceDate: '2023-01-02',
        closePrice: 110,
      }),
      reason: 'Upward trend ended',
      type: 'sell',
    };
    const buySignal2: SignalForTrade = {
      dataPoint: createTestData.createEnrichedDataPoint({
        priceDate: '2023-01-03',
        closePrice: 95,
      }),
      reason: 'Upward trend started',
      type: 'buy',
    };
    const sellSignal2: SignalForTrade = {
      dataPoint: createTestData.createEnrichedDataPoint({
        priceDate: '2023-01-04',
        closePrice: 105,
      }),
      reason: 'Upward trend ended',
      type: 'sell',
    };
    spyGetTradingSignals.mockReturnValue([
      buySignal1,
      sellSignal1,
      buySignal2,
      sellSignal2,
    ]);
    trading.execute(context);
    expect(spyAddTrade).toHaveBeenCalledTimes(2);
    expect(spyAddTrade).toHaveBeenCalledWith({
      entry: buySignal1,
      exit: sellSignal1,
    });
    expect(spyAddTrade).toHaveBeenCalledWith({
      entry: buySignal2,
      exit: sellSignal2,
    });
    expect(context.getTrades()).toHaveLength(2);
  });
});
