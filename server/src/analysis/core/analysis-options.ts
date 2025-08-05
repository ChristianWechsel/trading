import {
  MoneyManagementDto,
  RiskManagementDto,
  YValueSource,
} from '../analysis-query.dto';
import { MoneyManagement } from './money-management/money-management.interface';
import { RiskManagement } from './risk-management/risk-management.interface';

export class Options {
  constructor(
    private options: {
      averageTrueRange: AverageTrueRangeOptions;
      swingPointDetection: SwingPointDetectionOptions;
      trendDetection: TrendDetectionOptions;
      yValueSource: YValueSource;
      account: AccountOptions;
      moneyManagement: MoneyManagementDto;
      riskManagement: RiskManagementDto;
    },
  ) {}

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

  getMoneyManagement(): MoneyManagement {
    return this.options.moneyManagement;
  }

  getRiskManagement(): RiskManagement {
    return this.options.riskManagement;
  }
}

export class AverageTrueRangeOptions {
  constructor(
    private options: Partial<{ period: number }>,
    private defaults: { period: number },
  ) {}

  getPeriod() {
    return this.options.period ?? this.defaults.period;
  }
}

export class SwingPointDetectionOptions {
  constructor(
    private options: Partial<{
      relativeThreshold: number;
      windowSize: number;
      atrFactor: number;
    }>,
    private defaults: {
      relativeThreshold: number;
      windowSize: number;
    },
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
    private options: Partial<{
      relativeThreshold: number;
      atrFactor: number;
    }>,
    private defaults: {
      relativeThreshold: number;
    },
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
    private options: Partial<{
      initialCapital: number;
    }>,
    private defaults: {
      initialCapital: number;
    },
  ) {}

  getInitialCapital() {
    return this.options.initialCapital ?? this.defaults.initialCapital;
  }
}
