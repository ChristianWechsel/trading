import {
  EnrichedDataPoint,
  SwingPointType,
} from '../dto/enriched-data-point/enriched-data-point';
import { SwingPoints } from './swing-points';
import { TestDataSwingPoints } from './testdata';

export type SwingPointTestCase = {
  name: string;
  testcase: {
    data: EnrichedDataPoint[];
    expectedSwingPoints: { index: number; type: SwingPointType }[];
    settings: {
      relativeThreshold: number;
      windowSize: number;
    };
  };
};

describe('SwingPoints', () => {
  const testData = new TestDataSwingPoints();

  const cases = [
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
  ];

  it.each(cases)('$name', ({ testcase }) => {
    const swingPoints = new SwingPoints(testcase.data, testcase.settings);
    const result = swingPoints.getSwingPoints();
    expect(result).toHaveLength(testcase.data.length);

    const areSwingPointsAsExpected = result.every(
      (elementResult, idxResult) => {
        const idxExpectedSwingPoint = testcase.expectedSwingPoints.findIndex(
          (expected) => expected.index === idxResult,
        );
        if (idxExpectedSwingPoint > -1) {
          return (
            elementResult.getSwingPointType() ===
            testcase.expectedSwingPoints[idxExpectedSwingPoint].type
          );
        }
        return elementResult.getSwingPointType() === null;
      },
    );

    expect(areSwingPointsAsExpected).toEqual(true);
  });

  // it.each([0, 0.5, 1])(
  //   'does not throw for relativeThreshold=%p',
  //   (threshold) => {
  //     expect(
  //       () =>
  //         new SwingPoints(
  //           new Array<DataPoint<number>>(25).fill({ x: 1, y: 1 }),
  //           {
  //             relativeThreshold: threshold,
  //             windowSize: 1,
  //           },
  //         ),
  //     ).not.toThrow();
  //   },
  // );

  // it.each([-0.1, -1, 1.01, 2])(
  //   'throws error for out-of-bounds relativeThreshold=%p',
  //   (threshold) => {
  //     expect(
  //       () =>
  //         new SwingPoints(
  //           new Array<DataPoint<number>>(25).fill({ x: 1, y: 1 }),
  //           {
  //             relativeThreshold: threshold,
  //             windowSize: 1,
  //           },
  //         ),
  //     ).toThrow();
  //   },
  // );

  // it.each([1, 2, 10])(
  //   'does not throw for valid windowSize=%p',
  //   (windowSize) => {
  //     expect(
  //       () =>
  //         new SwingPoints(
  //           new Array<DataPoint<number>>(25).fill({ x: 1, y: 1 }),
  //           {
  //             relativeThreshold: 0.1,
  //             windowSize,
  //           },
  //         ),
  //     ).not.toThrow();
  //   },
  // );

  // it.each([0, -1, -5, 1.5, 2.7, 0.99])(
  //   'throws error for invalid windowSize=%p',
  //   (windowSize) => {
  //     expect(
  //       () =>
  //         new SwingPoints(
  //           new Array<DataPoint<number>>(25).fill({ x: 1, y: 1 }),
  //           {
  //             relativeThreshold: 0.1,
  //             windowSize,
  //           },
  //         ),
  //     ).toThrow();
  //   },
  // );

  // it.each([
  //   { windowSize: 1, dataLength: 3 },
  //   { windowSize: 2, dataLength: 5 },
  // ])(
  //   'does not throw for minimum valid data length (windowSize=$windowSize, dataLength=$dataLength)',
  //   ({ windowSize, dataLength }) => {
  //     const data = new Array<DataPoint<number>>(dataLength).fill({
  //       x: 1,
  //       y: 1,
  //     });

  //     expect(
  //       () => new SwingPoints(data, { relativeThreshold: 0.1, windowSize }),
  //     ).not.toThrow();
  //   },
  // );

  // it.each([
  //   { windowSize: 1, dataLength: 2 },
  //   { windowSize: 2, dataLength: 4 },
  // ])(
  //   'throws error for too short data (windowSize=$windowSize, dataLength=$dataLength)',
  //   ({ windowSize, dataLength }) => {
  //     const data = new Array<DataPoint<number>>(dataLength).fill({
  //       x: 1,
  //       y: 1,
  //     });
  //     expect(
  //       () => new SwingPoints(data, { relativeThreshold: 0.1, windowSize }),
  //     ).toThrow();
  //   },
  // );
});
