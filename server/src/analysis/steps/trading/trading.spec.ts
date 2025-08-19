import { Account } from '../../../analysis/core/account/account';
import { AnalysisContextClass } from '../../../analysis/core/analysis-context';
import { SignalForTrade } from '../../../analysis/core/analysis.interface';
import { EnrichedDataPoint } from '../../../analysis/core/enriched-data-points/enriched-data-point';
import { TickerDto } from '../../../data-aggregation/data-aggregation.dto';
import { OHLCV } from '../../../data-aggregation/ohlcv.entity';
import { Trading } from './trading';

describe('Trading', () => {
  let trading: Trading;
  let context: AnalysisContextClass;
  let spyGetTradingSignals: jest.SpyInstance;
  let mockAccount: Account;
  let mockPortfolio: {
    addPosition: jest.Mock;
    placeOrder: jest.Mock;
    setStops: jest.Mock;
    calc: jest.Mock;
    getCurrentShares: jest.Mock;
    getTransactions: jest.Mock;
  };
  let mockOHLCV: OHLCV;
  let mockEnrichedDataPoint: EnrichedDataPoint;
  const testDate = new Date('2025-08-19');
  const ticker: TickerDto = { symbol: 'AAPL', exchange: 'NASDAQ' };

  beforeEach(() => {
    trading = new Trading();

    // Mock Account erstellen
    mockAccount = {
      getCash: jest.fn().mockReturnValue(10000),
      credit: jest.fn(),
      debit: jest.fn(),
    } as unknown as Account;

    // Mock Portfolio erstellen mit expliziten Jest-Mock-Funktionen
    mockPortfolio = {
      addPosition: jest.fn(),
      placeOrder: jest.fn(),
      setStops: jest.fn(),
      calc: jest.fn(),
      getCurrentShares: jest.fn().mockReturnValue(10),
      getTransactions: jest.fn(),
    };

    // Mock OHLCV (DataPoint) erstellen
    mockOHLCV = {
      getPriceDate: jest.fn().mockReturnValue(testDate),
      getPriceDateIsoDate: jest.fn().mockReturnValue('2025-08-19'),
    } as unknown as OHLCV;

    // Mock EnrichedDataPoint erstellen
    mockEnrichedDataPoint = {
      getDataPoint: jest.fn().mockReturnValue(mockOHLCV),
    } as unknown as EnrichedDataPoint;

    // Mock Options erstellen
    const mockOptions = {
      getTicker: jest.fn().mockReturnValue({
        getTicker: jest.fn().mockReturnValue(ticker),
      }),
    };

    // Context erstellen
    context = {
      getTradingSignals: jest.fn(),
      getEnrichedDataPoints: jest.fn().mockReturnValue([mockEnrichedDataPoint]),
      buildYValueAccessor: jest.fn().mockReturnValue(() => 150),
      getOptions: jest.fn().mockReturnValue(mockOptions),
      getAccount: jest.fn().mockReturnValue(mockAccount),
      buildMoneyManagement: jest.fn().mockReturnValue(() => 5),
      buildRiskManagement: jest.fn().mockReturnValue(() => 140),
      getPortfolio: jest.fn().mockReturnValue(mockPortfolio),
    } as unknown as AnalysisContextClass;

    spyGetTradingSignals = jest.spyOn(context, 'getTradingSignals');
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
    expect(mockPortfolio.placeOrder).not.toHaveBeenCalled();
  });

  it('should place buy order when receiving buy signal', () => {
    // Trading-Signal mit dem korrekten Format (inkl. reason)
    const tradingSignals: SignalForTrade[] = [
      {
        type: 'buy',
        dataPoint: mockEnrichedDataPoint,
        reason: 'Upward trend started',
      },
    ];

    spyGetTradingSignals.mockReturnValue(tradingSignals);

    trading.execute(context);

    expect(mockPortfolio.addPosition).toHaveBeenCalledWith(ticker);
    expect(mockPortfolio.placeOrder).toHaveBeenCalledWith(
      ticker,
      expect.objectContaining({
        type: 'buy',
        price: 150,
        shares: 5,
        reason: 'Upward trend started',
        date: testDate,
      }),
    );
    expect(mockPortfolio.setStops).toHaveBeenCalledWith(ticker, { loss: 140 });
  });

  it('should place sell order when receiving sell signal', () => {
    // Trading-Signal mit dem korrekten Format (inkl. reason)
    const tradingSignals: SignalForTrade[] = [
      {
        type: 'sell',
        dataPoint: mockEnrichedDataPoint,
        reason: 'Upward trend ended',
      },
    ];

    spyGetTradingSignals.mockReturnValue(tradingSignals);

    trading.execute(context);

    expect(mockPortfolio.addPosition).toHaveBeenCalledWith(ticker);
    expect(mockPortfolio.getCurrentShares).toHaveBeenCalledWith(ticker);
    expect(mockPortfolio.placeOrder).toHaveBeenCalledWith(
      ticker,
      expect.objectContaining({
        type: 'sell',
        price: 150,
        shares: 10, // verwendet den aktuellen Aktienbestand
        reason: 'Upward trend ended',
        date: testDate,
      }),
    );
  });
});
