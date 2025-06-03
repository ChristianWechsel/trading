import { SwingPoints } from './swing-points';
import { TestDataSwingPoints } from './Testdata';

describe('SwingPoints', () => {
  const testData = new TestDataSwingPoints();

  it('detect swing high', () => {
    const singleSwingHigh = testData.singleSwingHigh();
    const swingPoints = new SwingPoints(singleSwingHigh.data);
    expect(swingPoints.getSwingPoints()).toEqual([singleSwingHigh.result]);
  });

  it('detect swing low', () => {
    const singleSwingLow = testData.singleSwingLow();
    const swingPoints = new SwingPoints(singleSwingLow.data);
    expect(swingPoints.getSwingPoints()).toEqual([singleSwingLow.result]);
  });
});
