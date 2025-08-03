import { AnalysisContextClass } from '../../../analysis/core/analysis-context';
import {
  SignalForTrade,
  TrendDataMetadata,
} from '../../../analysis/core/analysis.interface';
import { CreateTestData } from '../../../utils/test-utils';
import { TradingSignal } from './trading-signal';

describe('TradingSignal', () => {
  let tradingSignal: TradingSignal;
  const context: AnalysisContextClass = new AnalysisContextClass(
    {
      dataAggregation: { ticker: { exchange: '', symbol: '' } },
      steps: ['TradingSignal'],
    },
    [],
  );
  const createTestData = new CreateTestData();

  const spyGetTrends = jest.spyOn(context, 'getTrends');
  const spyAddTradingSignals = jest.spyOn(context, 'addTradingSignals');

  beforeEach(() => {
    tradingSignal = new TradingSignal();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should do nothing if getTrends returns undefined', () => {
    spyGetTrends.mockReturnValue([]);
    tradingSignal.execute(context);
    expect(spyAddTradingSignals).not.toHaveBeenCalled();
  });

  it('should do nothing if getTrends returns empty array', () => {
    spyGetTrends.mockReturnValue([]);
    tradingSignal.execute(context);
    expect(spyAddTradingSignals).not.toHaveBeenCalled();
  });

  it('should add buy signal at confirmation point and sell signal for upward trend with end', () => {
    const trend: TrendDataMetadata['trendData'] = {
      type: 'upward',
      start: createTestData.createEnrichedDataPoint({
        priceDate: '1',
        closePrice: 2,
      }),
      confirmation: createTestData.createEnrichedDataPoint({
        priceDate: '2',
        closePrice: 3,
      }),
      end: createTestData.createEnrichedDataPoint({
        priceDate: '4',
        closePrice: 5,
      }),
    };
    spyGetTrends.mockReturnValue([trend]);
    tradingSignal.execute(context);

    expect(spyAddTradingSignals).toHaveBeenCalledWith<[SignalForTrade]>({
      type: 'buy',
      dataPoint: trend.confirmation!,
      reason: 'Upward trend started',
    });
    expect(spyAddTradingSignals).toHaveBeenCalledWith<[SignalForTrade]>({
      type: 'sell',
      dataPoint: trend.end!,
      reason: 'Upward trend ended',
    });
    expect(spyAddTradingSignals).toHaveBeenCalledTimes(2);
  });

  it('should add buy signal at start point when no confirmation point exists', () => {
    const trend: TrendDataMetadata['trendData'] = {
      type: 'upward',
      start: createTestData.createEnrichedDataPoint({
        priceDate: '1',
        closePrice: 2,
      }),
      end: createTestData.createEnrichedDataPoint({
        priceDate: '3',
        closePrice: 4,
      }),
    };
    spyGetTrends.mockReturnValue([trend]);
    tradingSignal.execute(context);

    expect(spyAddTradingSignals).toHaveBeenCalledWith<[SignalForTrade]>({
      type: 'buy',
      dataPoint: trend.start,
      reason: 'Upward trend started',
    });
    expect(spyAddTradingSignals).toHaveBeenCalledWith<[SignalForTrade]>({
      type: 'sell',
      dataPoint: trend.end!,
      reason: 'Upward trend ended',
    });
    expect(spyAddTradingSignals).toHaveBeenCalledTimes(2);
  });

  it('should add only buy signal at confirmation point for upward trend without end', () => {
    const trend: TrendDataMetadata['trendData'] = {
      type: 'upward',
      start: createTestData.createEnrichedDataPoint({
        priceDate: '1',
        closePrice: 2,
      }),
      confirmation: createTestData.createEnrichedDataPoint({
        priceDate: '2',
        closePrice: 3,
      }),
      end: undefined,
    };
    spyGetTrends.mockReturnValue([trend]);
    tradingSignal.execute(context);

    expect(spyAddTradingSignals).toHaveBeenCalledWith({
      type: 'buy',
      dataPoint: trend.confirmation!,
      reason: 'Upward trend started',
    });
    expect(spyAddTradingSignals).toHaveBeenCalledTimes(1);
  });

  it('should not add signals for non-upward trends', () => {
    const trend: TrendDataMetadata['trendData'] = {
      type: 'downward',
      start: createTestData.createEnrichedDataPoint({
        priceDate: '1',
        closePrice: 2,
      }),
      end: createTestData.createEnrichedDataPoint({
        priceDate: '3',
        closePrice: 4,
      }),
    };
    spyGetTrends.mockReturnValue([trend]);
    tradingSignal.execute(context);

    expect(spyAddTradingSignals).not.toHaveBeenCalled();
  });

  it('should handle multiple trends correctly', () => {
    const trends: TrendDataMetadata['trendData'][] = [
      {
        type: 'upward',
        start: createTestData.createEnrichedDataPoint({
          priceDate: '1',
          closePrice: 2,
        }),
        confirmation: createTestData.createEnrichedDataPoint({
          priceDate: '2',
          closePrice: 2.5,
        }),
        end: createTestData.createEnrichedDataPoint({
          priceDate: '3',
          closePrice: 4,
        }),
      },
      {
        type: 'downward',
        start: createTestData.createEnrichedDataPoint({
          priceDate: '5',
          closePrice: 6,
        }),
        end: createTestData.createEnrichedDataPoint({
          priceDate: '7',
          closePrice: 8,
        }),
      },
      {
        type: 'upward',
        start: createTestData.createEnrichedDataPoint({
          priceDate: '9',
          closePrice: 10,
        }),
        confirmation: createTestData.createEnrichedDataPoint({
          priceDate: '10',
          closePrice: 11,
        }),
        end: undefined,
      },
    ];
    spyGetTrends.mockReturnValue(trends);
    tradingSignal.execute(context);

    expect(spyAddTradingSignals).toHaveBeenCalledWith<[SignalForTrade]>({
      type: 'buy',
      dataPoint: trends[0].confirmation!,
      reason: 'Upward trend started',
    });
    expect(spyAddTradingSignals).toHaveBeenCalledWith<[SignalForTrade]>({
      type: 'sell',
      dataPoint: trends[0].end!,
      reason: 'Upward trend ended',
    });
    expect(spyAddTradingSignals).toHaveBeenCalledWith<[SignalForTrade]>({
      type: 'buy',
      dataPoint: trends[2].confirmation!,
      reason: 'Upward trend started',
    });
    expect(spyAddTradingSignals).toHaveBeenCalledTimes(3);
  });
});
