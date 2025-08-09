import { OHLCV } from '../../data-aggregation/ohlcv.entity';
import {
  AccountDto,
  AnalysisQueryDto,
  AverageTrueRangeOptionsDto,
  MoneyManagementDto,
  RiskManagementDto,
  SwingPointDetectionOptionsDto,
  TrendDetectionOptionsDto,
  YValueSource,
} from '../analysis-query.dto';
import { ATRComparableNumber } from '../steps/utils/comparable-number/atr-comparable-number';
import { ComparableNumber } from '../steps/utils/comparable-number/comparable-number';
import { RelativeComparableNumber } from '../steps/utils/comparable-number/relative-comparable-number';
import { Account } from './account/account';
import {
  AccountOptions,
  AverageTrueRangeOptions,
  MoneyManagementOptions,
  Options,
  RiskManagementOptions,
  SwingPointDetectionOptions,
  TickerOptions,
  TrendDetectionOptions,
} from './analysis-options';
import { SignalForTrade, Step, TrendDataMetadata } from './analysis.interface';
import { EnrichedDataPoint } from './enriched-data-points/enriched-data-point';
import { allInSizing } from './money-management/all-in';
import { fixedFractionalSizing } from './money-management/fixed-fractional';
import {
  MoneyManagement,
  SelectorMoneyManagement,
} from './money-management/money-management.interface';
import { Portfolio } from './portfolio/portfolio';
import { atrStopLoss } from './risk-management/atr-stopp-loss';
import { percentageStopLoss } from './risk-management/percentage-stop-loss';
import {
  RiskManagement,
  SelectorRiskManagement,
} from './risk-management/risk-management.interface';

export type YValueAccessor = (dataPoint: EnrichedDataPoint) => number;

export class AnalysisContextClass {
  private options: Options;
  private enrichedDataPoints: EnrichedDataPoint[];
  private trends: TrendDataMetadata['trendData'][];
  private tradingSignals: SignalForTrade[];
  private account: Account;
  private portfolio: Portfolio;

  private defaults: {
    averageTrueRangeOptions: Required<AverageTrueRangeOptionsDto>;
    swingPointDetectionOptions: Required<
      Pick<SwingPointDetectionOptionsDto, 'relativeThreshold' | 'windowSize'>
    >;
    trendDetectionOptions: Required<
      Pick<TrendDetectionOptionsDto, 'relativeThreshold'>
    >;
    accountOptions: Required<AccountDto>;
    moneyManagementOptions: Required<MoneyManagementDto>;
    riskManagementOptions: Required<RiskManagementDto>;
    yValueSource: YValueSource;
  };

  constructor(query: AnalysisQueryDto, ohlcvs: OHLCV[]) {
    const relativeThresholdValue = 0.01;
    this.defaults = {
      averageTrueRangeOptions: {
        period: 20,
      },
      swingPointDetectionOptions: {
        relativeThreshold: relativeThresholdValue,
        windowSize: 1,
      },
      trendDetectionOptions: {
        relativeThreshold: relativeThresholdValue,
      },
      accountOptions: {
        initialCapital: 10000,
      },
      moneyManagementOptions: {
        fixedFractional: 0.5,
        moneyManagement: 'fixed-fractional',
      },
      riskManagementOptions: {
        atrFactor: 2,
        fixedFractional: 10,
        riskManagement: 'fixed-percentage',
      },
      yValueSource: 'close',
    };

    this.options = new Options({
      ticker: new TickerOptions(query.dataAggregation.ticker),
      averageTrueRange: new AverageTrueRangeOptions(
        {
          period: query.stepOptions?.averageTrueRange?.period,
        },
        this.defaults.averageTrueRangeOptions,
      ),
      swingPointDetection: new SwingPointDetectionOptions(
        {
          relativeThreshold:
            query.stepOptions?.swingPointDetection?.relativeThreshold,
          atrFactor: query.stepOptions?.swingPointDetection?.atrFactor,
          windowSize: query.stepOptions?.swingPointDetection?.windowSize,
        },
        this.defaults.swingPointDetectionOptions,
      ),
      trendDetection: new TrendDetectionOptions(
        {
          relativeThreshold:
            query.stepOptions?.trendDetection?.relativeThreshold,
          atrFactor: query.stepOptions?.trendDetection?.atrFactor,
        },
        this.defaults.trendDetectionOptions,
      ),
      yValueSource:
        query.stepOptions?.yValueSource ?? this.defaults.yValueSource,
      account: new AccountOptions(
        { initialCapital: query.trading?.account?.initialCapital },
        this.defaults.accountOptions,
      ),
      moneyManagement: new MoneyManagementOptions(
        {
          fixedFractional: query.trading?.moneyManagement?.fixedFractional,
        },
        this.defaults.moneyManagementOptions,
      ),
      riskManagement: new RiskManagementOptions(
        {
          atrFactor: query.trading?.riskManagement?.atrFactor,
          fixedFractional: query.trading?.riskManagement?.fixedFractional,
        },
        this.defaults.riskManagementOptions,
      ),
    });

    this.enrichedDataPoints = ohlcvs
      .map((ohlcv) => ohlcv.clone())
      .map((ohlcv) => new EnrichedDataPoint(ohlcv));
    this.trends = [];
    this.tradingSignals = [];
    this.account = new Account(this.options.getAccount().getInitialCapital());
    this.portfolio = new Portfolio(this.account);
  }

  getOptions(): Options {
    return this.options;
  }

  getAccount(): Account {
    return this.account;
  }

  getPortfolio(): Portfolio {
    return this.portfolio;
  }

  getEnrichedDataPoints(): EnrichedDataPoint[] {
    return this.enrichedDataPoints;
  }

  getTrends(): TrendDataMetadata['trendData'][] {
    return this.trends;
  }

  setTrends(trends: TrendDataMetadata['trendData'][]): void {
    this.trends = trends;
  }

  addTradingSignals(signal: SignalForTrade): void {
    this.tradingSignals.push(signal);
  }

  getTradingSignals(): SignalForTrade[] {
    return this.tradingSignals;
  }

  buildYValueAccessor(): YValueAccessor {
    return (dataPoint: EnrichedDataPoint) => {
      switch (this.options.getYValueSource()) {
        case 'close':
          return dataPoint.getDataPoint().getClosePrice();
        case 'open':
          return dataPoint.getDataPoint().getOpenPrice();
        case 'high':
          return dataPoint.getDataPoint().getHighPrice();
        case 'low':
          return dataPoint.getDataPoint().getLowPrice();
        default:
          return dataPoint.getDataPoint().getClosePrice();
      }
    };
  }

  buildComparableNumber(params: {
    enrichedDataPoint: EnrichedDataPoint;
    step: Step;
  }): ComparableNumber {
    const value = this.buildYValueAccessor()(params.enrichedDataPoint);
    const atrFactor = this.getATRFactor(params.step);
    const atr = this.getATR(params.enrichedDataPoint);
    const relativeThreshold = this.getRelativeThreshold(params.step);

    if (atrFactor && atr) {
      return new ATRComparableNumber(value, atr, atrFactor);
    }
    return new RelativeComparableNumber(value, relativeThreshold);
  }

  buildMoneyManagement(): MoneyManagement {
    return this.selectMoneyManagement(
      this.options.getMoneyManagement().getMoneyManagement(),
    );
  }

  buildRiskManagement(): RiskManagement {
    return this.selectRiskManagement(
      this.options.getRiskManagement().getRiskManagement(),
    );
  }

  private getATRFactor(step: Step) {
    switch (step) {
      case 'SwingPointDetection':
        return this.options.getSwingPointDetection().getAtrFactor();

      case 'TrendDetection':
        return this.options.getTrendDetection().getAtrFactor();

      default:
        return;
    }
  }

  private getATR(enrichedDataPoint: EnrichedDataPoint) {
    return enrichedDataPoint.getAverageTrueRange();
  }

  private getRelativeThreshold(step: Step) {
    switch (step) {
      case 'SwingPointDetection':
        return this.options.getSwingPointDetection().getRelativeThreshold();

      case 'TrendDetection':
        return this.options.getTrendDetection().getRelativeThreshold();

      default:
        return this.defaults.swingPointDetectionOptions.relativeThreshold;
    }
  }

  private selectMoneyManagement(
    selector?: SelectorMoneyManagement,
  ): MoneyManagement {
    switch (selector) {
      case 'all-in':
        return allInSizing;

      default:
        return fixedFractionalSizing(
          this.options.getMoneyManagement().getFixedFractional(),
        );
    }
  }

  private selectRiskManagement(
    selector?: SelectorRiskManagement,
  ): RiskManagement {
    switch (selector) {
      case 'atr-based':
        return atrStopLoss(1);

      default:
        return percentageStopLoss(
          this.options.getRiskManagement().getFixedFractional(),
        );
    }
  }
}
