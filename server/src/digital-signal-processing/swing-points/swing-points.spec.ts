import { DataPoint } from '../digital-signal-processing.interface';
import { SwingPoints } from './swing-points';
import { TestDataSwingPoints } from './testdata';

describe('SwingPoints', () => {
  const testData = new TestDataSwingPoints();

  const cases = [
    {
      name: 'detect swing high',
      data: testData.singleSwingHigh(),
    },
    {
      name: 'detect swing high (close values)',
      data: testData.singleSwingHigh_close(),
    },
    {
      name: 'detect swing high (significant difference)',
      data: testData.singleSwingHigh_significant(),
    },
    {
      name: 'detect swing low',
      data: testData.singleSwingLow(),
    },
    {
      name: 'detect swing low (close values)',
      data: testData.singleSwingLow_close(),
    },
    {
      name: 'detect swing low (significant difference)',
      data: testData.singleSwingLow_significant(),
    },
    {
      name: 'detect multiple swing points',
      data: testData.multipleSwingPoints(),
    },
    {
      name: 'detect multiple swing points (close values)',
      data: testData.multipleSwingPoints_close(),
    },
    {
      name: 'detect multiple swing points (significant difference)',
      data: testData.multipleSwingPoints_significant(),
    },
    {
      name: 'detect no swing points - flatline - equal values',
      data: testData.noSwingPoint_FlatLine_equalValues(),
    },
    {
      name: 'detect no swing points - flatline - close values',
      data: testData.noSwingPoint_FlatLine_closeValues(),
    },
    {
      name: 'detect no swing points - ascending',
      data: testData.noSwingPoint_Ascending(),
    },
    {
      name: 'detect no swing points - descending',
      data: testData.noSwingPoint_Descending(),
    },
    {
      name: 'detect plateau high',
      data: testData.plateauToUpward(),
    },
    {
      name: 'detect plateau low',
      data: testData.plateauToDownward(),
    },
    {
      name: 'detect high plateau',
      data: testData.downwardToPlateau(),
    },
    {
      name: 'detect low plateau',
      data: testData.upwardToPlateau(),
    },
    {
      name: 'detect swing high with window size',
      data: testData.singleSwingHighWindow(),
    },
    {
      name: 'detect swing high with windowSize=3 (centered peak)',
      data: testData.swingHighWindow3_centeredPeak(),
    },
    {
      name: 'detect swing low with windowSize=3 (centered valley)',
      data: testData.swingLowWindow3_centeredValley(),
    },
    {
      name: 'no swing high with windowSize=3 (peak not high enough)',
      data: testData.swingHighWindow3_noPeak(),
    },
    {
      name: 'no swing low with windowSize=3 (valley not low enough)',
      data: testData.swingLowWindow3_noValley(),
    },
    {
      name: 'detect upwardToPlateau with windowSize=2',
      data: testData.upwardToPlateau_window2(),
    },
    {
      name: 'detect downwardToPlateau with windowSize=2',
      data: testData.downwardToPlateau_window2(),
    },
    {
      name: 'detect plateauToUpward with windowSize=2',
      data: testData.plateauToUpward_window2(),
    },
    {
      name: 'detect plateauToDownward with windowSize=2',
      data: testData.plateauToDownward_window2(),
    },
    {
      name: 'fail upwardToPlateau with windowSize=2 (trend fail)',
      data: testData.upwardToPlateau_window2_trendFail(),
    },
    {
      name: 'fail upwardToPlateau with windowSize=2 (plateau fail)',
      data: testData.upwardToPlateau_window2_plateauFail(),
    },
    {
      name: 'fail plateauToUpward with windowSize=2 (trend fail)',
      data: testData.plateauToUpward_window1_but_fails_window2(),
    },
  ];

  it.each(cases)('$name', ({ data }) => {
    const swingPoints = new SwingPoints(data.data, {
      relativeThreshold: 0.1,
      windowSize: data.windowSize,
    });
    expect(swingPoints.getSwingPoints()).toEqual(data.result);
  });

  it.each([0, 0.5, 1])(
    'does not throw for relativeThreshold=%p',
    (threshold) => {
      expect(
        () =>
          new SwingPoints(
            new Array<DataPoint<number>>(25).fill({ x: 1, y: 1 }),
            {
              relativeThreshold: threshold,
              windowSize: 1,
            },
          ),
      ).not.toThrow();
    },
  );

  it.each([-0.1, -1, 1.01, 2])(
    'throws error for out-of-bounds relativeThreshold=%p',
    (threshold) => {
      expect(
        () =>
          new SwingPoints(
            new Array<DataPoint<number>>(25).fill({ x: 1, y: 1 }),
            {
              relativeThreshold: threshold,
              windowSize: 1,
            },
          ),
      ).toThrow();
    },
  );

  it.each([1, 2, 10])(
    'does not throw for valid windowSize=%p',
    (windowSize) => {
      expect(
        () =>
          new SwingPoints(
            new Array<DataPoint<number>>(25).fill({ x: 1, y: 1 }),
            {
              relativeThreshold: 0.1,
              windowSize,
            },
          ),
      ).not.toThrow();
    },
  );

  it.each([0, -1, -5, 1.5, 2.7, 0.99])(
    'throws error for invalid windowSize=%p',
    (windowSize) => {
      expect(
        () =>
          new SwingPoints(
            new Array<DataPoint<number>>(25).fill({ x: 1, y: 1 }),
            {
              relativeThreshold: 0.1,
              windowSize,
            },
          ),
      ).toThrow();
    },
  );

  it.each([
    { windowSize: 1, dataLength: 3 },
    { windowSize: 2, dataLength: 5 },
  ])(
    'does not throw for minimum valid data length (windowSize=$windowSize, dataLength=$dataLength)',
    ({ windowSize, dataLength }) => {
      const data = new Array<DataPoint<number>>(dataLength).fill({
        x: 1,
        y: 1,
      });

      expect(
        () => new SwingPoints(data, { relativeThreshold: 0.1, windowSize }),
      ).not.toThrow();
    },
  );

  it.each([
    { windowSize: 1, dataLength: 2 },
    { windowSize: 2, dataLength: 4 },
  ])(
    'throws error for too short data (windowSize=$windowSize, dataLength=$dataLength)',
    ({ windowSize, dataLength }) => {
      const data = new Array<DataPoint<number>>(dataLength).fill({
        x: 1,
        y: 1,
      });
      expect(
        () => new SwingPoints(data, { relativeThreshold: 0.1, windowSize }),
      ).toThrow();
    },
  );
});
