import { OHLCV } from '../../data-aggregation/ohlcv.entity';
import { AnalysisQueryDto, YValueSource } from '../analysis-query.dto';
import { ATRComparableNumber } from '../steps/utils/comparable-number/atr-comparable-number';
import { ComparableNumber } from '../steps/utils/comparable-number/comparable-number';
import { RelativeComparableNumber } from '../steps/utils/comparable-number/relative-comparable-number';
import { Account } from './account/account';
import {
  AccountOptions,
  AverageTrueRangeOptions,
  Options,
  SwingPointDetectionOptions,
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
import { atrStopLoss } from './risk-management/atr-stopp-loss';
import { percentageStopLoss } from './risk-management/percentage-stop-loss';
import {
  RiskManagement,
  SelectorRiskManagement,
} from './risk-management/risk-management.interface';

import { Trade } from './trade/trade';

export type YValueAccessor = (dataPoint: EnrichedDataPoint) => number;

export class AnalysisContextClass {
  private options: Options;
  private enrichedDataPoints: EnrichedDataPoint[];
  private trends: TrendDataMetadata['trendData'][];
  private tradingSignals: SignalForTrade[];
  private trades: Trade[];
  private account: Account;

  private defaults: {
    yValueSource: YValueSource;
    relativeThreshold: number;
    windowSize: number;
    period: number;
    initialCapital: number;
    moneyManagement: MoneyManagement;
    riskManagement: RiskManagement;
  };

  constructor(query: AnalysisQueryDto, ohlcvs: OHLCV[]) {
    this.defaults = {
      yValueSource: 'close',
      relativeThreshold: 0.01,
      windowSize: 1,
      period: 20,
      initialCapital: 10000,
      moneyManagement: fixedFractionalSizing(0.5),
      riskManagement: atrStopLoss(2),
    };

    this.options = new Options({
      averageTrueRange: new AverageTrueRangeOptions(
        {
          period: query.stepOptions?.averageTrueRange?.period,
        },
        this.defaults,
      ),
      swingPointDetection: new SwingPointDetectionOptions(
        {
          relativeThreshold:
            query.stepOptions?.swingPointDetection?.relativeThreshold,
          atrFactor: query.stepOptions?.swingPointDetection?.atrFactor,
          windowSize: query.stepOptions?.swingPointDetection?.windowSize,
        },
        this.defaults,
      ),
      trendDetection: new TrendDetectionOptions(
        {
          relativeThreshold:
            query.stepOptions?.trendDetection?.relativeThreshold,
          atrFactor: query.stepOptions?.trendDetection?.atrFactor,
        },
        this.defaults,
      ),
      yValueSource:
        query.stepOptions?.yValueSource ?? this.defaults.yValueSource,
      account: new AccountOptions(
        { initialCapital: query.trading?.initialCapital },
        this.defaults,
      ),
      moneyManagement: this.selectMoneyManagement(
        query.trading?.moneyManagement,
      ),
      riskManagement: this.selectRiskManagement(query.trading?.riskManagement),
    });

    this.enrichedDataPoints = ohlcvs
      .map((ohlcv) => ohlcv.clone())
      .map((ohlcv) => new EnrichedDataPoint(ohlcv));
    this.trends = [];
    this.tradingSignals = [];
    this.trades = [];
    this.account = new Account(this.options.getAccount().getInitialCapital());
  }

  getOptions(): Options {
    return this.options;
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

  addTrade(trade: Trade): void {
    this.trades.push(trade);
  }

  getTrades(): Trade[] {
    return this.trades;
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

  buildMoneyManagement(): MoneyManagement {}

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
        return this.defaults.relativeThreshold;
    }
  }

  private selectMoneyManagement(
    selector?: SelectorMoneyManagement,
  ): MoneyManagement {
    switch (selector) {
      case 'all-in':
        return allInSizing;

      case 'fixed-fractional':
        return fixedFractionalSizing(1);

      default:
        return this.defaults.moneyManagement;
    }
  }

  private selectRiskManagement(
    selector?: SelectorRiskManagement,
  ): RiskManagement {
    switch (selector) {
      case 'atr-based':
        return atrStopLoss(1);

      case 'fixed-percentage':
        return percentageStopLoss(1);

      default:
        return this.defaults.riskManagement;
    }
  }
}
