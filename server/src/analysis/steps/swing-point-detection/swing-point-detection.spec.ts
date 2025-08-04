import { AnalysisContextClass } from '../../../analysis/core/analysis-context';
import { SwingPointType } from '../../../analysis/core/enriched-data-points/enriched-data-point';
import { SwingPointDetection } from './swing-point-detection';
import { SwingPointDetectionTestdata } from './swing-point-detection.testdata';

export type SwingPointTestCase = {
  name: string;
  testcase: {
    expectedSwingPoints: { index: number; type: SwingPointType }[];
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
    new SwingPointDetection().execute(testcase.context);

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
});
