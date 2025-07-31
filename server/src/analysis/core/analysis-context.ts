import { OHLCV } from '../../data-aggregation/ohlcv.entity';
import { AnalysisQueryDto } from '../analysis-query.dto';
import { ATRComparableNumber } from '../steps/utils/comparable-number/atr-comparable-number';
import { ComparableNumber } from '../steps/utils/comparable-number/comparable-number';
import { RelativeComparableNumber } from '../steps/utils/comparable-number/relative-comparable-number';
import {
  AverageTrueRangeOptions,
  Options,
  SwingPointDetectionOptions,
  TrendDetectionOptions,
} from './analysis-options';
import { Step, TrendDataMetadata } from './analysis.interface';
import { EnrichedDataPoint } from './enriched-data-point';

export type YValueAccessor = (dataPoint: EnrichedDataPoint) => number;

export class AnalysisContextClass {
  private enrichedDataPoints: EnrichedDataPoint[];
  private trends: TrendDataMetadata['trendData'][];
  private options: Options;

  private defaults: {
    relativeThreshold: number;
    windowSize: number;
    period: number;
  };

  constructor(query: AnalysisQueryDto, ohlcvs: OHLCV[]) {
    this.defaults = {
      relativeThreshold: 0.01,
      windowSize: 1,
      period: 20,
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
      yValueSource: query.stepOptions?.yValueSource ?? 'close',
    });
    this.enrichedDataPoints = ohlcvs
      .map((ohlcv) => ohlcv.clone())
      .map((ohlcv) => new EnrichedDataPoint(ohlcv));
    this.trends = [];
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
}
