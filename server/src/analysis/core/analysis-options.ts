import { TickerDto } from 'src/data-aggregation/data-aggregation.dto';
import {
  AccountDto,
  AverageTrueRangeOptionsDto,
  MoneyManagementDto,
  RiskManagementDto,
  SwingPointDetectionOptionsDto,
  TrendDetectionOptionsDto,
  YValueSource,
} from '../analysis-query.dto';

export class Options {
  constructor(
    private options: {
      averageTrueRange: AverageTrueRangeOptions;
      swingPointDetection: SwingPointDetectionOptions;
      trendDetection: TrendDetectionOptions;
      yValueSource: YValueSource;
      account: AccountOptions;
      moneyManagement: MoneyManagementOptions;
      riskManagement: RiskManagementOptions;
      ticker: TickerOptions;
    },
  ) {}
  getTicker(): TickerOptions {
    return this.options.ticker;
  }

  getAverageTrueRange(): AverageTrueRangeOptions {
    return this.options.averageTrueRange;
  }

  getSwingPointDetection(): SwingPointDetectionOptions {
    return this.options.swingPointDetection;
  }

  getTrendDetection(): TrendDetectionOptions {
    return this.options.trendDetection;
  }

  getYValueSource(): YValueSource {
    return this.options.yValueSource;
  }

  getAccount(): AccountOptions {
    return this.options.account;
  }

  getMoneyManagement(): MoneyManagementOptions {
    return this.options.moneyManagement;
  }

  getRiskManagement(): RiskManagementOptions {
    return this.options.riskManagement;
  }
}

export class AverageTrueRangeOptions {
  constructor(
    private options: AverageTrueRangeOptionsDto,
    private defaults: Required<AverageTrueRangeOptionsDto>,
  ) {}

  getPeriod() {
    return this.options.period ?? this.defaults.period;
  }
}

export class SwingPointDetectionOptions {
  constructor(
    private options: SwingPointDetectionOptionsDto,
    private defaults: Required<
      Pick<SwingPointDetectionOptionsDto, 'relativeThreshold' | 'windowSize'>
    >,
  ) {}

  getRelativeThreshold() {
    return this.options.relativeThreshold ?? this.defaults.relativeThreshold;
  }

  getWindowSize() {
    return this.options.windowSize ?? this.defaults.windowSize;
  }

  getAtrFactor() {
    return this.options.atrFactor;
  }
}

export class TrendDetectionOptions {
  constructor(
    private options: TrendDetectionOptionsDto,
    private defaults: Required<
      Pick<TrendDetectionOptionsDto, 'relativeThreshold'>
    >,
  ) {}

  getRelativeThreshold() {
    return this.options.relativeThreshold ?? this.defaults.relativeThreshold;
  }

  getAtrFactor() {
    return this.options.atrFactor;
  }
}

export class AccountOptions {
  constructor(
    private options: AccountDto,
    private defaults: Required<AccountDto>,
  ) {}

  getInitialCapital() {
    return this.options.initialCapital ?? this.defaults.initialCapital;
  }
}

export class MoneyManagementOptions {
  constructor(
    private options: MoneyManagementDto,
    private defaults: Required<MoneyManagementDto>,
  ) {}

  getMoneyManagement() {
    return this.options.moneyManagement ?? this.defaults.moneyManagement;
  }

  getFixedFractional() {
    return this.options.fixedFractional ?? this.defaults.fixedFractional;
  }
}

export class RiskManagementOptions {
  constructor(
    private options: RiskManagementDto,
    private defaults: Required<RiskManagementDto>,
  ) {}

  getRiskManagement() {
    return this.options.riskManagement ?? this.defaults.riskManagement;
  }

  getAtrFactor() {
    return this.options.atrFactor ?? this.defaults.atrFactor;
  }

  getFixedFractional() {
    return this.options.fixedFractional ?? this.defaults.fixedFractional;
  }
}

export class TickerOptions {
  constructor(private options: TickerDto) {}

  getTicker() {
    return this.options;
  }
}
