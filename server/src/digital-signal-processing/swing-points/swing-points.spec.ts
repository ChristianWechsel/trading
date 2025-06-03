import { SwingPoints } from './swing-points';
import { TestDataSwingPoints } from './Testdata';

describe('SwingPoints', () => {
  const testData = new TestDataSwingPoints();

  const cases = [
    {
      name: 'detect swing high',
      data: testData.singleSwingHigh(),
    },
    {
      name: 'detect swing low',
      data: testData.singleSwingLow(),
    },
    {
      name: 'detect multiple swing points',
      data: testData.multipleSwingPoints(),
    },
    {
      name: 'detect no swing points - flatline',
      data: testData.noSwingPoint_FlatLine(),
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
    const swingPoints = new SwingPoints(data.data, 0);
    expect(swingPoints.getSwingPoints()).toEqual(data.result);
  });

  it.each([0, 0.5, 1])(
    'does not throw for relativeThreshold=%p',
    (threshold) => {
      expect(() => new SwingPoints([], threshold)).not.toThrow();
    },
  );

  it.each([-0.1, -1, 1.01, 2])(
    'throws error for out-of-bounds relativeThreshold=%p',
    (threshold) => {
      expect(() => new SwingPoints([], threshold)).toThrow();
    },
  );
});
