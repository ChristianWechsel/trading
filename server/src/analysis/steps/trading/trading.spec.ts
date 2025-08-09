import { AnalysisContextClass } from '../../../analysis/core/analysis-context';
import { SignalForTrade } from '../../../analysis/core/analysis.interface';
import { Trading } from './trading';

describe('Trading', () => {
  let trading: Trading;
  let context: AnalysisContextClass;
  let spyGetTradingSignals: jest.SpyInstance<SignalForTrade[], [], any>;

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
  });
});
