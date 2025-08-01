import { TradingSignal } from './trading-signal';

describe('TradingSignal', () => {
  let tradingSignal: TradingSignal;
  let context: any;

  beforeEach(() => {
    tradingSignal = new TradingSignal();
    context = {
      getTrends: jest.fn(),
      addTradingSignals: jest.fn(),
    };
  });

  it('should do nothing if getTrends returns undefined', () => {
    context.getTrends.mockReturnValue(undefined);
    tradingSignal.execute(context);
    expect(context.addTradingSignals).not.toHaveBeenCalled();
  });

  it('should do nothing if getTrends returns empty array', () => {
    context.getTrends.mockReturnValue([]);
    tradingSignal.execute(context);
    expect(context.addTradingSignals).not.toHaveBeenCalled();
  });

  it('should add buy and sell signals for upward trend with endPoint', () => {
    const trend = {
      type: 'upward',
      startPoint: { x: 1, y: 2 },
      endPoint: { x: 3, y: 4 },
    };
    context.getTrends.mockReturnValue([trend]);
    tradingSignal.execute(context);

    expect(context.addTradingSignals).toHaveBeenCalledWith({
      type: 'buy',
      dataPoint: trend.startPoint,
      reason: 'Upward trend started',
    });
    expect(context.addTradingSignals).toHaveBeenCalledWith({
      type: 'sell',
      dataPoint: trend.endPoint,
      reason: 'Upward trend ended',
    });
    expect(context.addTradingSignals).toHaveBeenCalledTimes(2);
  });

  it('should add only buy signal for upward trend without endPoint', () => {
    const trend = {
      type: 'upward',
      startPoint: { x: 1, y: 2 },
      endPoint: undefined,
    };
    context.getTrends.mockReturnValue([trend]);
    tradingSignal.execute(context);

    expect(context.addTradingSignals).toHaveBeenCalledWith({
      type: 'buy',
      dataPoint: trend.startPoint,
      reason: 'Upward trend started',
    });
    expect(context.addTradingSignals).toHaveBeenCalledTimes(1);
  });

  it('should not add signals for non-upward trends', () => {
    const trend = {
      type: 'downward',
      startPoint: { x: 1, y: 2 },
      endPoint: { x: 3, y: 4 },
    };
    context.getTrends.mockReturnValue([trend]);
    tradingSignal.execute(context);

    expect(context.addTradingSignals).not.toHaveBeenCalled();
  });

  it('should handle multiple trends correctly', () => {
    const trends = [
      {
        type: 'upward',
        startPoint: { x: 1, y: 2 },
        endPoint: { x: 3, y: 4 },
      },
      {
        type: 'downward',
        startPoint: { x: 5, y: 6 },
        endPoint: { x: 7, y: 8 },
      },
      {
        type: 'upward',
        startPoint: { x: 9, y: 10 },
        endPoint: undefined,
      },
    ];
    context.getTrends.mockReturnValue(trends);
    tradingSignal.execute(context);

    expect(context.addTradingSignals).toHaveBeenCalledWith({
      type: 'buy',
      dataPoint: trends[0].startPoint,
      reason: 'Upward trend started',
    });
    expect(context.addTradingSignals).toHaveBeenCalledWith({
      type: 'sell',
      dataPoint: trends[0].endPoint,
      reason: 'Upward trend ended',
    });
    expect(context.addTradingSignals).toHaveBeenCalledWith({
      type: 'buy',
      dataPoint: trends[2].startPoint,
      reason: 'Upward trend started',
    });
    expect(context.addTradingSignals).toHaveBeenCalledTimes(3);
  });
});
