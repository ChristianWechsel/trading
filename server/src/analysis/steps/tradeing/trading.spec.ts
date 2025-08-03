import { AnalysisContextClass } from '../../../analysis/core/analysis-context';
import { SignalForTrade } from '../../../analysis/core/analysis.interface';
import { Trade } from '../../../analysis/core/trade';
import { CreateTestData } from '../../../utils/test-utils';
import { Trading } from './trading';

describe('Trading', () => {
  let trading: Trading;
  const createTestData = new CreateTestData();
  let context: AnalysisContextClass;
  let spyGetTradingSignals: jest.SpyInstance<SignalForTrade[], [], any>;
  let spyAddTrade: jest.SpyInstance<void, [trade: Trade], any>;

  beforeEach(() => {
    trading = new Trading();
    context = new AnalysisContextClass(
      {
        dataAggregation: { ticker: { exchange: '', symbol: '' } },
        steps: ['TradingSignal'],
      },
      [],
    );
    spyGetTradingSignals = jest.spyOn(context, 'getTradingSignals');
    spyAddTrade = jest.spyOn(context, 'addTrade');
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

    expect(spyAddTrade).toHaveBeenCalledWith(
      new Trade({
        entry: {
          date: buySignal.dataPoint.getDataPoint().getPriceDateIsoDate(),
          price: context.buildYValueAccessor()(buySignal.dataPoint),
        },
        exit: {
          date: sellSignal.dataPoint.getDataPoint().getPriceDateIsoDate(),
          price: context.buildYValueAccessor()(sellSignal.dataPoint),
        },
      }),
    );
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

    expect(spyAddTrade).toHaveBeenCalledWith(
      new Trade({
        entry: {
          date: buySignal1.dataPoint.getDataPoint().getPriceDateIsoDate(),
          price: context.buildYValueAccessor()(buySignal1.dataPoint),
        },
        exit: {
          date: sellSignal.dataPoint.getDataPoint().getPriceDateIsoDate(),
          price: context.buildYValueAccessor()(sellSignal.dataPoint),
        },
      }),
    );
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

    expect(spyAddTrade).toHaveBeenNthCalledWith(
      1,
      new Trade({
        entry: {
          date: buySignal1.dataPoint.getDataPoint().getPriceDateIsoDate(),
          price: context.buildYValueAccessor()(buySignal1.dataPoint),
        },
        exit: {
          date: sellSignal1.dataPoint.getDataPoint().getPriceDateIsoDate(),
          price: context.buildYValueAccessor()(sellSignal1.dataPoint),
        },
      }),
    );
    expect(spyAddTrade).toHaveBeenNthCalledWith(
      2,
      new Trade({
        entry: {
          date: buySignal2.dataPoint.getDataPoint().getPriceDateIsoDate(),
          price: context.buildYValueAccessor()(buySignal2.dataPoint),
        },
        exit: {
          date: sellSignal2.dataPoint.getDataPoint().getPriceDateIsoDate(),
          price: context.buildYValueAccessor()(sellSignal2.dataPoint),
        },
      }),
    );
    expect(context.getTrades()).toHaveLength(2);
  });
});
