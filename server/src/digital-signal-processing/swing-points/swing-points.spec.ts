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
      data: testData.plateauHigh(),
    },
    {
      name: 'detect plateau low',
      data: testData.plateauLow(),
    },
    {
      name: 'detect high plateau',
      data: testData.highPlateau(),
    },
    {
      name: 'detect low plateau',
      data: testData.lowPlateau(),
    },
  ];

  it.each(cases)('$name', ({ data }) => {
    const swingPoints = new SwingPoints(data.data);
    expect(swingPoints.getSwingPoints()).toEqual(data.result);
  });
});
