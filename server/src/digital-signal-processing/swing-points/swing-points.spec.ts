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
  ];

  it.each(cases)('$name', ({ data }) => {
    const swingPoints = new SwingPoints(data.data, { relativeThreshold: 0.1 });
    expect(swingPoints.getSwingPoints()).toEqual(data.result);
  });

  it.each([0, 0.5, 1])(
    'does not throw for relativeThreshold=%p',
    (threshold) => {
      expect(
        () => new SwingPoints([], { relativeThreshold: threshold }),
      ).not.toThrow();
    },
  );

  it.each([-0.1, -1, 1.01, 2])(
    'throws error for out-of-bounds relativeThreshold=%p',
    (threshold) => {
      expect(
        () => new SwingPoints([], { relativeThreshold: threshold }),
      ).toThrow();
    },
  );
});
