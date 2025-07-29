import { AnalysisQueryDto } from '../../../analysis/analysis-query.dto';
import { AnalysisContextClass } from '../../../analysis/core/analysis-context';
import { OHLCV, OHLCVEntity } from '../../../data-aggregation/ohlcv.entity';
import {
  EnrichedDataPoint,
  SwingPointType,
} from '../../core/enriched-data-point';
import { SwingPointDetection } from './swing-point-detection';
import { SwingPointDetectionTestdata } from './swing-point-detection.testdata';

export type SwingPointTestCase = {
  name: string;
  testcase: {
    expectedSwingPoints: { index: number; type: SwingPointType }[];
    settings: {
      relativeThreshold: number;
      windowSize: number;
    };
    context: AnalysisContextClass;
  };
};

describe('SwingPointDetection', () => {
  const testData = new SwingPointDetectionTestdata();

  it.each([
    testData.singleSwingHigh(),
    testData.singleSwingHigh_close(),
    testData.singleSwingHigh_significant(),
    testData.singleSwingLow(),
    testData.singleSwingLow_close(),
    testData.singleSwingLow_significant(),
    testData.multipleSwingPoints(),
    testData.multipleSwingPoints_close(),
    testData.multipleSwingPoints_significant(),
    testData.noSwingPoint_FlatLine_equalValues(),
    testData.noSwingPoint_FlatLine_closeValues(),
    testData.noSwingPoint_Ascending(),
    testData.noSwingPoint_Descending(),
    testData.plateauToUpward(),
    testData.plateauToDownward(),
    testData.upwardToPlateau(),
    testData.downwardToPlateau(),
    testData.singleSwingHighWindow(),
    testData.swingHighWindow3_centeredPeak(),
    testData.swingLowWindow3_centeredValley(),
    testData.swingHighWindow3_noPeak(),
    testData.swingLowWindow3_noValley(),
    testData.upwardToPlateau_window2(),
    testData.downwardToPlateau_window2(),
    testData.plateauToUpward_window2(),
    testData.plateauToDownward_window2(),
    testData.upwardToPlateau_window2_trendFail(),
    testData.upwardToPlateau_window2_plateauFail(),
    testData.plateauToUpward_window1_but_fails_window2(),
    testData.upwardPlateauUpward_window1(),
    testData.upwardPlateauUpward_window2(),
    testData.upwardPlateauDownward_window1(),
    testData.upwardPlateauDownward_window2(),
    testData.downwardPlateauUpward_window1(),
    testData.downwardPlateauUpward_window2(),
    testData.downwardPlateauDownward_window1(),
    testData.downwardPlateauDownward_window2(),
  ])('$name', ({ testcase }) => {
    const swingPointDetection = new SwingPointDetection(testcase.settings);
    swingPointDetection.execute(testcase.context);

    testcase.context.getEnrichedDataPoints().forEach((dp, idx) => {
      const actualSwingPointType = dp.getSwingPointType();
      const expectedSwingPoint = testcase.expectedSwingPoints.find(
        (esp) => esp.index === idx,
      );
      if (expectedSwingPoint) {
        expect(actualSwingPointType).toBe(expectedSwingPoint.type);
      } else {
        expect(actualSwingPointType).toBeUndefined();
      }
    });
  });

  it.each([0, 0.5, 1])(
    'does not throw for relativeThreshold=%p',
    (threshold) => {
      expect(
        () =>
          new SwingPointDetection({
            relativeThreshold: threshold,
            windowSize: 1,
          }),
      ).not.toThrow();
    },
  );

  it.each([-0.1, -1, 1.01, 2])(
    'throws error for out-of-bounds relativeThreshold=%p',
    (threshold) => {
      expect(
        () =>
          new SwingPointDetection({
            relativeThreshold: threshold,
            windowSize: 1,
          }),
      ).toThrow();
    },
  );

  it.each([1, 2, 10])(
    'does not throw for valid windowSize=%p',
    (windowSize) => {
      expect(
        () =>
          new SwingPointDetection({
            relativeThreshold: 0.1,
            windowSize,
          }),
      ).not.toThrow();
    },
  );

  it.each([0, -1, -5, 1.5, 2.7, 0.99])(
    'throws error for invalid windowSize=%p',
    (windowSize) => {
      expect(
        () =>
          new SwingPointDetection({
            relativeThreshold: 0.1,
            windowSize,
          }),
      ).toThrow();
    },
  );

  it.each([
    { windowSize: 1, dataLength: 3 },
    { windowSize: 2, dataLength: 5 },
  ])(
    'does not throw for minimum valid data length (windowSize=$windowSize, dataLength=$dataLength)',
    ({ windowSize, dataLength }) => {
      const context = new AnalysisContextClass(
        {} as AnalysisQueryDto,
        new Array<EnrichedDataPoint>(dataLength)
          .fill(createEnrichedDataPoint({}))
          .map<OHLCV>((dp) => dp.getDataPoint()),
      );
      expect(() =>
        new SwingPointDetection({ relativeThreshold: 0.1, windowSize }).execute(
          context,
        ),
      ).not.toThrow();
    },
  );

  it.each([
    { windowSize: 1, dataLength: 2 },
    { windowSize: 2, dataLength: 4 },
  ])(
    'throws error for too short data (windowSize=$windowSize, dataLength=$dataLength)',
    ({ windowSize, dataLength }) => {
      const context = new AnalysisContextClass(
        {} as AnalysisQueryDto,
        new Array<EnrichedDataPoint>(dataLength)
          .fill(createEnrichedDataPoint({}))
          .map<OHLCV>((dp) => dp.getDataPoint()),
      );

      expect(() =>
        new SwingPointDetection({ relativeThreshold: 0.1, windowSize }).execute(
          context,
        ),
      ).toThrow();
    },
  );
});

function createEnrichedDataPoint(
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
