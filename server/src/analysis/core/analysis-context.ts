import { OHLCV } from '../../data-aggregation/ohlcv.entity';
import { AnalysisQueryDto } from '../analysis-query.dto';
import {
  AverageTrueRangeOptions,
  Options,
  SwingPointDetectionOptions,
  TrendDetectionOptions,
} from './analysis-options';
import { TrendDataMetadata } from './analysis.interface';
import { EnrichedDataPoint } from './enriched-data-point';

export type YValueAccessor = (dataPoint: EnrichedDataPoint) => number;

export class AnalysisContextClass {
  private enrichedDataPoints: EnrichedDataPoint[];
  private trends: TrendDataMetadata['trendData'][];
  private options: Options;

  constructor(query: AnalysisQueryDto, ohlcvs: OHLCV[]) {
    this.options = new Options({
      averageTrueRange: new AverageTrueRangeOptions({
        period: query.stepOptions?.averageTrueRange?.period,
      }),
      swingPointDetection: new SwingPointDetectionOptions({
        relativeThreshold:
          query.stepOptions?.swingPointDetection?.relativeThreshold,
        atrFactor: query.stepOptions?.swingPointDetection?.atrFactor,
        windowSize: query.stepOptions?.swingPointDetection?.windowSize,
      }),
      trendDetection: new TrendDetectionOptions({
        relativeThreshold: query.stepOptions?.trendDetection?.relativeThreshold,
        atrFactor: query.stepOptions?.trendDetection?.atrFactor,
      }),
      yValueSource: query.stepOptions?.yValueSource ?? 'close',
    });
    this.enrichedDataPoints = ohlcvs
      .map((ohlcv) => ohlcv.clone())
      .map((ohlcv) => new EnrichedDataPoint(ohlcv));
    this.trends = [];
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
}
