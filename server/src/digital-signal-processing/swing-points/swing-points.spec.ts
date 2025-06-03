import { SwingPoints } from './swing-points';
import { TestDataSwingPoints } from './Testdata';

describe('SwingPoints', () => {
  const testData = new TestDataSwingPoints();

  it('detect swing high', () => {
    const singleSwingHigh = testData.singleSwingHigh();
    const swingPoints = new SwingPoints(singleSwingHigh.data);
    expect(swingPoints.getSwingPoints()).toEqual(singleSwingHigh.result);
  });

  it('detect swing low', () => {
    const singleSwingLow = testData.singleSwingLow();
    const swingPoints = new SwingPoints(singleSwingLow.data);
    expect(swingPoints.getSwingPoints()).toEqual(singleSwingLow.result);
  });

  it('detect no swing points', () => {
    const noSwingPoint = testData.noSwingPoint();
    const swingPoints = new SwingPoints(noSwingPoint.data);
    expect(swingPoints.getSwingPoints()).toEqual(noSwingPoint.result);
  });

  it('detect multiple swing points', () => {
    const multipleSwingPoints = testData.multipleSwingPoints();
    const swingPoints = new SwingPoints(multipleSwingPoints.data);
    expect(swingPoints.getSwingPoints()).toEqual(multipleSwingPoints.result);
  });
});
