import { YValueSource } from '../analysis-query.dto';

export class Options {
  constructor(
    private options: {
      averageTrueRange: AverageTrueRangeOptions;
      swingPointDetection: SwingPointDetectionOptions;
      trendDetection: TrendDetectionOptions;
      yValueSource: YValueSource;
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
      atrFactor: number;
    },
  ) {}

  getRelativeThreshold() {
    return this.options.relativeThreshold ?? this.defaults.relativeThreshold;
  }

  getWindowSize() {
    return this.options.windowSize ?? this.defaults.windowSize;
  }

  getAtrFactor() {
    return this.options.atrFactor ?? this.defaults.atrFactor;
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
      atrFactor: number;
    },
  ) {}

  getRelativeThreshold() {
    return this.options.relativeThreshold ?? this.defaults.relativeThreshold;
  }

  getAtrFactor() {
    return this.options.atrFactor ?? this.defaults.atrFactor;
  }
}
