import { AnalysisQueryDto } from 'src/analysis/analysis-query.dto';
import { AnalysisContextClass } from '../analysis/core/analysis-context';
import {
  EnrichedDataPoint,
  SwingPointType,
} from '../analysis/core/enriched-data-point';
import { OHLCV, OHLCVEntity } from '../data-aggregation/ohlcv.entity';

export type OHLCVRecord = {
  ohlcv: OHLCV;
  swingPointType?: SwingPointType;
};

export class CreateTestData {
  protected createEnrichedDataPoint(
    ohlcv: Partial<OHLCVEntity>,
  ): EnrichedDataPoint {
    const defaultData: OHLCVEntity = {
      securityId: 0,
      priceDate: '1970-01-01',
      openPrice: 0,
      highPrice: 0,
      lowPrice: 0,
      closePrice: 0,
      adjustedClosePrice: 0,
      volume: 0,
    };
    return new EnrichedDataPoint(new OHLCV({ ...defaultData, ...ohlcv }));
  }

  protected createEnrichedDataPointWithSwingPoints(
    ohlcv: Partial<OHLCVEntity>,
    type: SwingPointType | null,
  ): EnrichedDataPoint {
    const enrichedDataPoint = this.createEnrichedDataPoint(ohlcv);
    if (type) {
      enrichedDataPoint.setSwingPointType(type);
    }
    return enrichedDataPoint;
  }

  protected createOHLCV(ohlcv: Partial<OHLCVEntity>): OHLCV {
    const defaultData: OHLCVEntity = {
      securityId: 0,
      priceDate: '1970-01-01',
      openPrice: 0,
      highPrice: 0,
      lowPrice: 0,
      closePrice: 0,
      adjustedClosePrice: 0,
      volume: 0,
    };
    return new OHLCV({ ...defaultData, ...ohlcv });
  }

  protected createContextOf(
    ohlcvs: Partial<OHLCVEntity>[],
    options: AnalysisQueryDto = {
      steps: [],
      dataAggregation: { ticker: { exchange: '', symbol: '' } },
    },
  ): AnalysisContextClass {
    const context = new AnalysisContextClass(
      options,
      ohlcvs.map<OHLCV>((item) => this.createOHLCV(item)),
    );

    return context;
  }
  protected createContext(ohlcvs: OHLCVRecord[]): AnalysisContextClass {
    const context = new AnalysisContextClass(
      {
        steps: [],
        dataAggregation: { ticker: { exchange: '', symbol: '' } },
      },
      ohlcvs.map<OHLCV>((item) => item.ohlcv),
    );
    const enrichedDataPoints = context.getEnrichedDataPoints();
    ohlcvs.forEach((item, index) => {
      if (item.swingPointType) {
        const enrichedDataPoint = enrichedDataPoints[index];
        enrichedDataPoint.setSwingPointType(item.swingPointType);
      }
    });
    return context;
  }

  protected createEnrichedDataPointOf(ohlcv: OHLCVRecord): EnrichedDataPoint {
    const edp = new EnrichedDataPoint(ohlcv.ohlcv);
    if (ohlcv.swingPointType) {
      edp.setSwingPointType(ohlcv.swingPointType);
    }
    return edp;
  }
}
