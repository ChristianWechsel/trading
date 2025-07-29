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
  constructor(private options: Partial<{ period: number }>) {}

  getPeriod() {
    return this.options.period;
  }
}

export class SwingPointDetectionOptions {
  constructor(
    private options: Partial<{
      relativeThreshold: number;
      windowSize: number;
      atrFactor: number;
    }>,
  ) {}

  getRelativeThreshold() {
    return this.options.relativeThreshold;
  }

  getWindowSize() {
    return this.options.windowSize;
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
  ) {}

  getRelativeThreshold() {
    return this.options.relativeThreshold;
  }

  getAtrFactor() {
    return this.options.atrFactor;
  }
}
