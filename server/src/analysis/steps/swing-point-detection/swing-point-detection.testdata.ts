import { DataPoint } from '../../core/analysis.interface';
import { EnrichedDataPoint } from '../../core/enriched-data-point';
import { SwingPointTestCase } from './swing-point-detection.spec';

export class SwingPointDetectionTestdata {
  private createEnrichedDataPoint(dataPoint: DataPoint<number>) {
    return new EnrichedDataPoint(dataPoint);
  }

  singleSwingHigh(): SwingPointTestCase {
    return {
      name: 'detect swing high',
      testcase: {
        data: [
          this.createEnrichedDataPoint({ x: 1, y: 2 }),
          this.createEnrichedDataPoint({ x: 2, y: 3 }),
          this.createEnrichedDataPoint({ x: 3, y: 2 }),
        ],
        expectedSwingPoints: [{ index: 1, type: 'swingHigh' }],
        settings: { relativeThreshold: 0.1, windowSize: 1 },
      },
    };
  }

  singleSwingHigh_close(): SwingPointTestCase {
    return {
      name: 'detect swing high (close values)',
      testcase: {
        data: [
          this.createEnrichedDataPoint({ x: 1, y: 2 }),
          this.createEnrichedDataPoint({ x: 2, y: 2.09 }), // close to 2
          this.createEnrichedDataPoint({ x: 3, y: 2 }),
        ],
        expectedSwingPoints: [],
        settings: { relativeThreshold: 0.1, windowSize: 1 },
      },
    };
  }

  singleSwingHigh_significant(): SwingPointTestCase {
    return {
      name: 'detect swing high (significant difference)',
      testcase: {
        data: [
          this.createEnrichedDataPoint({ x: 1, y: 2 }),
          this.createEnrichedDataPoint({ x: 2, y: 3 }),
          this.createEnrichedDataPoint({ x: 3, y: 1.5 }),
        ],
        expectedSwingPoints: [{ index: 1, type: 'swingHigh' }],
        settings: { relativeThreshold: 0.1, windowSize: 1 },
      },
    };
  }

  singleSwingLow(): SwingPointTestCase {
    return {
      name: 'detect swing low',
      testcase: {
        data: [
          this.createEnrichedDataPoint({ x: 1, y: 3 }),
          this.createEnrichedDataPoint({ x: 2, y: 2 }),
          this.createEnrichedDataPoint({ x: 3, y: 3 }),
        ],
        expectedSwingPoints: [{ index: 1, type: 'swingLow' }],
        settings: { relativeThreshold: 0.1, windowSize: 1 },
      },
    };
  }

  singleSwingLow_close(): SwingPointTestCase {
    return {
      name: 'detect swing low (close values)',
      testcase: {
        data: [
          this.createEnrichedDataPoint({ x: 1, y: 3 }),
          this.createEnrichedDataPoint({ x: 2, y: 2.91 }), // close to 3
          this.createEnrichedDataPoint({ x: 3, y: 3 }),
        ],
        expectedSwingPoints: [],
        settings: { relativeThreshold: 0.1, windowSize: 1 },
      },
    };
  }

  singleSwingLow_significant(): SwingPointTestCase {
    return {
      name: 'detect swing low (significant difference)',
      testcase: {
        data: [
          this.createEnrichedDataPoint({ x: 1, y: 3 }),
          this.createEnrichedDataPoint({ x: 2, y: 1.5 }),
          this.createEnrichedDataPoint({ x: 3, y: 3 }),
        ],
        expectedSwingPoints: [
          {
            index: 1,
            type: 'swingLow',
          },
        ],
        settings: { relativeThreshold: 0.1, windowSize: 1 },
      },
    };
  }
  multipleSwingPoints(): SwingPointTestCase {
    return {
      name: 'detect multiple swing points',
      testcase: {
        data: [
          this.createEnrichedDataPoint({ x: 1, y: 1 }),
          this.createEnrichedDataPoint({ x: 2, y: 3 }),
          this.createEnrichedDataPoint({ x: 3, y: 2 }),
          this.createEnrichedDataPoint({ x: 4, y: 4 }),
          this.createEnrichedDataPoint({ x: 5, y: 3 }),
        ],
        expectedSwingPoints: [
          { index: 1, type: 'swingHigh' },
          { index: 2, type: 'swingLow' },
          { index: 3, type: 'swingHigh' },
        ],
        settings: { relativeThreshold: 0.1, windowSize: 1 },
      },
    };
  }

  multipleSwingPoints_close(): SwingPointTestCase {
    return {
      name: 'detect multiple swing points (close values)',
      testcase: {
        data: [
          new EnrichedDataPoint({ x: 1, y: 1 }),
          new EnrichedDataPoint({ x: 2, y: 1.09 }), // close to 1
          new EnrichedDataPoint({ x: 3, y: 1.01 }), // close to 1.09
          new EnrichedDataPoint({ x: 4, y: 1.08 }), // close to 1.01
          new EnrichedDataPoint({ x: 5, y: 1.05 }), // close to 1.08
        ],
        expectedSwingPoints: [],
        settings: { relativeThreshold: 0.1, windowSize: 1 },
      },
    };
  }
  multipleSwingPoints_significant(): SwingPointTestCase {
    return {
      name: 'detect multiple swing points (significant difference)',
      testcase: {
        data: [
          new EnrichedDataPoint({ x: 1, y: 1 }),
          new EnrichedDataPoint({ x: 2, y: 3 }),
          new EnrichedDataPoint({ x: 3, y: 1 }),
          new EnrichedDataPoint({ x: 4, y: 4 }),
          new EnrichedDataPoint({ x: 5, y: 1 }),
        ],
        expectedSwingPoints: [
          { index: 1, type: 'swingHigh' },
          { index: 2, type: 'swingLow' },
          { index: 3, type: 'swingHigh' },
        ],
        settings: { relativeThreshold: 0.1, windowSize: 1 },
      },
    };
  }

  noSwingPoint_FlatLine_equalValues(): SwingPointTestCase {
    return {
      name: 'detect no swing points - flatline - equal values',
      testcase: {
        data: [
          new EnrichedDataPoint({ x: 1, y: 1 }),
          new EnrichedDataPoint({ x: 2, y: 1 }),
          new EnrichedDataPoint({ x: 3, y: 1 }),
        ],
        expectedSwingPoints: [],
        settings: { relativeThreshold: 0.1, windowSize: 1 },
      },
    };
  }

  noSwingPoint_FlatLine_closeValues(): SwingPointTestCase {
    return {
      name: 'detect no swing points - flatline - close values',
      testcase: {
        data: [
          new EnrichedDataPoint({ x: 1, y: 1 }),
          new EnrichedDataPoint({ x: 2, y: 1.01 }),
          new EnrichedDataPoint({ x: 3, y: 0.99 }),
        ],
        expectedSwingPoints: [],
        settings: { relativeThreshold: 0.1, windowSize: 1 },
      },
    };
  }

  noSwingPoint_Ascending(): SwingPointTestCase {
    return {
      name: 'detect no swing points - ascending',
      testcase: {
        data: [
          new EnrichedDataPoint({ x: 1, y: 1 }),
          new EnrichedDataPoint({ x: 2, y: 2 }),
          new EnrichedDataPoint({ x: 3, y: 3 }),
        ],
        expectedSwingPoints: [],
        settings: { relativeThreshold: 0.1, windowSize: 1 },
      },
    };
  }

  noSwingPoint_Descending(): SwingPointTestCase {
    return {
      name: 'detect no swing points - descending',
      testcase: {
        data: [
          new EnrichedDataPoint({ x: 1, y: 3 }),
          new EnrichedDataPoint({ x: 2, y: 2 }),
          new EnrichedDataPoint({ x: 3, y: 1 }),
        ],
        expectedSwingPoints: [],
        settings: { relativeThreshold: 0.1, windowSize: 1 },
      },
    };
  }

  plateauToUpward(): SwingPointTestCase {
    return {
      name: 'detect plateau high',
      testcase: {
        data: [
          new EnrichedDataPoint({ x: 1, y: 2 }),
          new EnrichedDataPoint({ x: 2, y: 2 }),
          new EnrichedDataPoint({ x: 3, y: 3 }),
        ],
        expectedSwingPoints: [{ index: 1, type: 'plateauToUpward' }],
        settings: { relativeThreshold: 0.1, windowSize: 1 },
      },
    };
  }

  plateauToDownward(): SwingPointTestCase {
    return {
      name: 'detect plateau low',
      testcase: {
        data: [
          new EnrichedDataPoint({ x: 1, y: 2 }),
          new EnrichedDataPoint({ x: 2, y: 2 }),
          new EnrichedDataPoint({ x: 3, y: 1 }),
        ],
        expectedSwingPoints: [{ index: 1, type: 'plateauToDownward' }],
        settings: { relativeThreshold: 0.1, windowSize: 1 },
      },
    };
  }

  upwardToPlateau(): SwingPointTestCase {
    return {
      name: 'detect low plateau',
      testcase: {
        data: [
          new EnrichedDataPoint({ x: 1, y: 1 }),
          new EnrichedDataPoint({ x: 2, y: 2 }),
          new EnrichedDataPoint({ x: 3, y: 2 }),
        ],
        expectedSwingPoints: [{ index: 1, type: 'upwardToPlateau' }],
        settings: { relativeThreshold: 0.1, windowSize: 1 },
      },
    };
  }

  downwardToPlateau(): SwingPointTestCase {
    return {
      name: 'detect high plateau',
      testcase: {
        data: [
          new EnrichedDataPoint({ x: 1, y: 3 }),
          new EnrichedDataPoint({ x: 2, y: 2 }),
          new EnrichedDataPoint({ x: 3, y: 2 }),
        ],
        expectedSwingPoints: [{ index: 1, type: 'downwardToPlateau' }],
        settings: { relativeThreshold: 0.1, windowSize: 1 },
      },
    };
  }

  singleSwingHighWindow(): SwingPointTestCase {
    return {
      name: 'detect swing high with window size',
      testcase: {
        data: [
          new EnrichedDataPoint({ x: 1, y: 6 }),
          new EnrichedDataPoint({ x: 2, y: 2 }),
          new EnrichedDataPoint({ x: 3, y: 4 }),
          new EnrichedDataPoint({ x: 4, y: 2 }),
          new EnrichedDataPoint({ x: 5, y: 5 }),
          new EnrichedDataPoint({ x: 6, y: 2 }),
          new EnrichedDataPoint({ x: 7, y: 3 }),
          new EnrichedDataPoint({ x: 8, y: 4 }),
          new EnrichedDataPoint({ x: 9, y: 2 }),
        ],
        expectedSwingPoints: [{ index: 4, type: 'swingHigh' }],
        settings: { relativeThreshold: 0.1, windowSize: 3 },
      },
    };
  }

  swingHighWindow3_centeredPeak(): SwingPointTestCase {
    return {
      name: 'detect swing high with windowSize=3 (centered peak)',
      testcase: {
        data: [
          new EnrichedDataPoint({ x: 1, y: 1 }),
          new EnrichedDataPoint({ x: 2, y: 2 }),
          new EnrichedDataPoint({ x: 3, y: 3 }),
          new EnrichedDataPoint({ x: 4, y: 10 }), // swing high
          new EnrichedDataPoint({ x: 5, y: 3 }),
          new EnrichedDataPoint({ x: 6, y: 2 }),
          new EnrichedDataPoint({ x: 7, y: 1 }),
        ],
        expectedSwingPoints: [{ index: 3, type: 'swingHigh' }],
        settings: { relativeThreshold: 0.1, windowSize: 3 },
      },
    };
  }

  swingLowWindow3_centeredValley(): SwingPointTestCase {
    return {
      name: 'detect swing low with windowSize=3 (centered valley)',
      testcase: {
        data: [
          new EnrichedDataPoint({ x: 1, y: 10 }),
          new EnrichedDataPoint({ x: 2, y: 7 }),
          new EnrichedDataPoint({ x: 3, y: 5 }),
          new EnrichedDataPoint({ x: 4, y: 1 }), // swing low
          new EnrichedDataPoint({ x: 5, y: 5 }),
          new EnrichedDataPoint({ x: 6, y: 7 }),
          new EnrichedDataPoint({ x: 7, y: 10 }),
        ],
        expectedSwingPoints: [{ index: 3, type: 'swingLow' }],
        settings: { relativeThreshold: 0.1, windowSize: 3 },
      },
    };
  }

  swingHighWindow3_noPeak(): SwingPointTestCase {
    return {
      name: 'no swing high with windowSize=3 (peak not high enough)',
      testcase: {
        data: [
          new EnrichedDataPoint({ x: 1, y: 1 }),
          new EnrichedDataPoint({ x: 2, y: 2 }),
          new EnrichedDataPoint({ x: 3, y: 4 }),
          new EnrichedDataPoint({ x: 4, y: 3.1 }), // not highest
          new EnrichedDataPoint({ x: 5, y: 3 }),
          new EnrichedDataPoint({ x: 6, y: 2 }),
          new EnrichedDataPoint({ x: 7, y: 1 }),
        ],
        expectedSwingPoints: [],
        settings: { relativeThreshold: 0.1, windowSize: 3 },
      },
    };
  }

  swingLowWindow3_noValley(): SwingPointTestCase {
    return {
      name: 'no swing low with windowSize=3 (valley not low enough)',
      testcase: {
        data: [
          new EnrichedDataPoint({ x: 1, y: 10 }),
          new EnrichedDataPoint({ x: 2, y: 7 }),
          new EnrichedDataPoint({ x: 3, y: 5 }),
          new EnrichedDataPoint({ x: 4, y: 4.9 }), // not lowest
          new EnrichedDataPoint({ x: 5, y: 4.8 }),
          new EnrichedDataPoint({ x: 6, y: 7 }),
          new EnrichedDataPoint({ x: 7, y: 10 }),
        ],
        expectedSwingPoints: [],
        settings: { relativeThreshold: 0.1, windowSize: 3 },
      },
    };
  }

  upwardToPlateau_window2(): SwingPointTestCase {
    return {
      name: 'detect upward to plateau with windowSize=2',
      testcase: {
        data: [
          new EnrichedDataPoint({ x: 0, y: 5 }),
          new EnrichedDataPoint({ x: 1, y: 6 }),
          new EnrichedDataPoint({ x: 2, y: 10 }),
          new EnrichedDataPoint({ x: 3, y: 12 }),
          new EnrichedDataPoint({ x: 4, y: 15 }),
          new EnrichedDataPoint({ x: 5, y: 15.05 }),
          new EnrichedDataPoint({ x: 6, y: 14.95 }),
          new EnrichedDataPoint({ x: 7, y: 18 }),
          new EnrichedDataPoint({ x: 8, y: 19 }),
        ],
        expectedSwingPoints: [{ index: 4, type: 'upwardToPlateau' }],
        settings: { relativeThreshold: 0.1, windowSize: 2 },
      },
    };
  }

  downwardToPlateau_window2(): SwingPointTestCase {
    return {
      name: 'detect downwardToPlateau with windowSize=2',
      testcase: {
        data: [
          new EnrichedDataPoint({ x: 0, y: 25 }),
          new EnrichedDataPoint({ x: 1, y: 24 }),
          new EnrichedDataPoint({ x: 2, y: 20 }),
          new EnrichedDataPoint({ x: 3, y: 18 }),
          new EnrichedDataPoint({ x: 4, y: 15 }),
          new EnrichedDataPoint({ x: 5, y: 15.05 }),
          new EnrichedDataPoint({ x: 6, y: 14.95 }),
          new EnrichedDataPoint({ x: 7, y: 12 }),
          new EnrichedDataPoint({ x: 8, y: 11 }),
        ],
        expectedSwingPoints: [{ index: 4, type: 'downwardToPlateau' }],
        settings: { relativeThreshold: 0.1, windowSize: 2 },
      },
    };
  }

  plateauToUpward_window2(): SwingPointTestCase {
    return {
      name: 'detect plateauToUpward with windowSize=2',
      testcase: {
        data: [
          new EnrichedDataPoint({ x: 0, y: 5 }),
          new EnrichedDataPoint({ x: 1, y: 6 }),
          new EnrichedDataPoint({ x: 2, y: 9.95 }),
          new EnrichedDataPoint({ x: 3, y: 10.05 }),
          new EnrichedDataPoint({ x: 4, y: 10 }),
          new EnrichedDataPoint({ x: 5, y: 12 }),
          new EnrichedDataPoint({ x: 6, y: 14 }),
          new EnrichedDataPoint({ x: 7, y: 18 }),
          new EnrichedDataPoint({ x: 8, y: 19 }),
        ],
        expectedSwingPoints: [
          { index: 2, type: 'upwardToPlateau' },
          { index: 4, type: 'plateauToUpward' },
        ],
        settings: { relativeThreshold: 0.1, windowSize: 2 },
      },
    };
  }

  plateauToDownward_window2(): SwingPointTestCase {
    return {
      name: 'detect plateauToDownward with windowSize=2',
      testcase: {
        data: [
          new EnrichedDataPoint({ x: 0, y: 20 }),
          new EnrichedDataPoint({ x: 1, y: 19 }),
          new EnrichedDataPoint({ x: 2, y: 15.05 }),
          new EnrichedDataPoint({ x: 3, y: 14.95 }),
          new EnrichedDataPoint({ x: 4, y: 15 }),
          new EnrichedDataPoint({ x: 5, y: 13 }),
          new EnrichedDataPoint({ x: 6, y: 11 }),
          new EnrichedDataPoint({ x: 7, y: 8 }),
          new EnrichedDataPoint({ x: 8, y: 7 }),
        ],
        expectedSwingPoints: [{ index: 4, type: 'plateauToDownward' }],
        settings: { relativeThreshold: 0.1, windowSize: 2 },
      },
    };
  }

  upwardToPlateau_window2_trendFail(): SwingPointTestCase {
    return {
      name: 'fail upwardToPlateau with windowSize=2 (trend fail)',
      testcase: {
        data: [
          new EnrichedDataPoint({ x: 0, y: 5 }),
          new EnrichedDataPoint({ x: 1, y: 6 }),
          new EnrichedDataPoint({ x: 2, y: 11.5 }),
          new EnrichedDataPoint({ x: 3, y: 12 }),
          new EnrichedDataPoint({ x: 4, y: 15 }),
          new EnrichedDataPoint({ x: 5, y: 15.05 }),
          new EnrichedDataPoint({ x: 6, y: 14.95 }),
          new EnrichedDataPoint({ x: 7, y: 18 }),
          new EnrichedDataPoint({ x: 8, y: 19 }),
        ],
        expectedSwingPoints: [],
        settings: { relativeThreshold: 0.1, windowSize: 2 },
      },
    };
  }

  upwardToPlateau_window2_plateauFail(): SwingPointTestCase {
    return {
      name: 'fail upwardToPlateau with windowSize=2 (plateau fail)',
      testcase: {
        data: [
          new EnrichedDataPoint({ x: 0, y: 5 }),
          new EnrichedDataPoint({ x: 1, y: 6 }),
          new EnrichedDataPoint({ x: 2, y: 10 }),
          new EnrichedDataPoint({ x: 3, y: 12 }),
          new EnrichedDataPoint({ x: 4, y: 15 }),
          new EnrichedDataPoint({ x: 5, y: 15.05 }),
          new EnrichedDataPoint({ x: 6, y: 17 }),
          new EnrichedDataPoint({ x: 7, y: 18 }),
          new EnrichedDataPoint({ x: 8, y: 19 }),
        ],
        expectedSwingPoints: [],
        settings: { relativeThreshold: 0.1, windowSize: 2 },
      },
    };
  }

  plateauToUpward_window1_but_fails_window2(): SwingPointTestCase {
    return {
      name: 'fail plateauToUpward with windowSize=2 (trend fail)',
      testcase: {
        data: [
          new EnrichedDataPoint({ x: 0, y: 1 }),
          new EnrichedDataPoint({ x: 1, y: 1.5 }),
          new EnrichedDataPoint({ x: 2, y: 2 }),
          new EnrichedDataPoint({ x: 3, y: 2 }),
          new EnrichedDataPoint({ x: 4, y: 3 }),
          new EnrichedDataPoint({ x: 5, y: 4 }),
          new EnrichedDataPoint({ x: 6, y: 5 }),
        ],
        expectedSwingPoints: [],
        settings: { relativeThreshold: 0.1, windowSize: 2 },
      },
    };
  }

  upwardPlateauUpward_window1(): SwingPointTestCase {
    return {
      name: 'no swingpoint - upward to plateau followed by upward trend - windowSize=1',
      testcase: {
        data: [
          this.createEnrichedDataPoint({ x: 1, y: 2 }),
          this.createEnrichedDataPoint({ x: 2, y: 3 }),
          this.createEnrichedDataPoint({ x: 3, y: 3 }),
          this.createEnrichedDataPoint({ x: 4, y: 4 }),
        ],
        expectedSwingPoints: [],
        settings: { relativeThreshold: 0.1, windowSize: 1 },
      },
    };
  }
  upwardPlateauUpward_window2(): SwingPointTestCase {
    return {
      name: 'no swingpoint - upward to plateau followed by upward trend - windowSize=2',
      testcase: {
        data: [
          this.createEnrichedDataPoint({ x: 1, y: 1 }),
          this.createEnrichedDataPoint({ x: 2, y: 2 }),
          this.createEnrichedDataPoint({ x: 3, y: 3 }),
          this.createEnrichedDataPoint({ x: 4, y: 3 }),
          this.createEnrichedDataPoint({ x: 5, y: 3 }),
          this.createEnrichedDataPoint({ x: 6, y: 3 }),
          this.createEnrichedDataPoint({ x: 7, y: 4 }),
          this.createEnrichedDataPoint({ x: 8, y: 5 }),
        ],
        expectedSwingPoints: [],
        settings: { relativeThreshold: 0.1, windowSize: 2 },
      },
    };
  }
  upwardPlateauDownward_window1(): SwingPointTestCase {
    return {
      name: 'swingpoint - upward plateau followed by downward trend - windowSize=1',
      testcase: {
        data: [
          this.createEnrichedDataPoint({ x: 1, y: 2 }),
          this.createEnrichedDataPoint({ x: 2, y: 3 }),
          this.createEnrichedDataPoint({ x: 3, y: 3 }),
          this.createEnrichedDataPoint({ x: 4, y: 2 }),
        ],
        expectedSwingPoints: [{ index: 1, type: 'swingHigh' }],
        settings: { relativeThreshold: 0.1, windowSize: 1 },
      },
    };
  }
  upwardPlateauDownward_window2(): SwingPointTestCase {
    return {
      name: 'swingHigh - upward to plateau followed by downward trend - windowSize=2',
      testcase: {
        data: [
          this.createEnrichedDataPoint({ x: 1, y: 1 }),
          this.createEnrichedDataPoint({ x: 2, y: 2 }),
          this.createEnrichedDataPoint({ x: 3, y: 3 }),
          this.createEnrichedDataPoint({ x: 4, y: 3 }),
          this.createEnrichedDataPoint({ x: 5, y: 3 }),
          this.createEnrichedDataPoint({ x: 6, y: 3 }),
          this.createEnrichedDataPoint({ x: 7, y: 2 }),
          this.createEnrichedDataPoint({ x: 8, y: 1 }),
        ],
        expectedSwingPoints: [{ index: 2, type: 'swingHigh' }],
        settings: { relativeThreshold: 0.1, windowSize: 2 },
      },
    };
  }
  downwardPlateauUpward_window1(): SwingPointTestCase {
    return {
      name: 'swingLow - downward to plateau followed by upward trend - windowSize=1',
      testcase: {
        data: [
          this.createEnrichedDataPoint({ x: 1, y: 4 }),
          this.createEnrichedDataPoint({ x: 2, y: 3 }),
          this.createEnrichedDataPoint({ x: 3, y: 3 }),
          this.createEnrichedDataPoint({ x: 4, y: 4 }),
        ],
        expectedSwingPoints: [{ index: 1, type: 'swingLow' }],
        settings: { relativeThreshold: 0.1, windowSize: 1 },
      },
    };
  }
  downwardPlateauUpward_window2(): SwingPointTestCase {
    return {
      name: 'swingLow - downward to plateau followed by upward trend - windowSize=2',
      testcase: {
        data: [
          this.createEnrichedDataPoint({ x: 1, y: 5 }),
          this.createEnrichedDataPoint({ x: 2, y: 4 }),
          this.createEnrichedDataPoint({ x: 3, y: 3 }),
          this.createEnrichedDataPoint({ x: 4, y: 3 }),
          this.createEnrichedDataPoint({ x: 5, y: 3 }),
          this.createEnrichedDataPoint({ x: 6, y: 3 }),
          this.createEnrichedDataPoint({ x: 7, y: 4 }),
          this.createEnrichedDataPoint({ x: 8, y: 5 }),
        ],
        expectedSwingPoints: [{ index: 2, type: 'swingLow' }],
        settings: { relativeThreshold: 0.1, windowSize: 2 },
      },
    };
  }
  downwardPlateauDownward_window1(): SwingPointTestCase {
    return {
      name: 'no swingpoint - downward to plateau followed by downward trend - windowSize=1',
      testcase: {
        data: [
          this.createEnrichedDataPoint({ x: 1, y: 4 }),
          this.createEnrichedDataPoint({ x: 2, y: 3 }),
          this.createEnrichedDataPoint({ x: 3, y: 3 }),
          this.createEnrichedDataPoint({ x: 4, y: 1 }),
        ],
        expectedSwingPoints: [],
        settings: { relativeThreshold: 0.1, windowSize: 1 },
      },
    };
  }
  downwardPlateauDownward_window2(): SwingPointTestCase {
    return {
      name: 'no swingpoint - downward to plateau followed by downward trend - windowSize=2',
      testcase: {
        data: [
          this.createEnrichedDataPoint({ x: 1, y: 5 }),
          this.createEnrichedDataPoint({ x: 2, y: 4 }),
          this.createEnrichedDataPoint({ x: 3, y: 3 }),
          this.createEnrichedDataPoint({ x: 4, y: 3 }),
          this.createEnrichedDataPoint({ x: 5, y: 3 }),
          this.createEnrichedDataPoint({ x: 6, y: 3 }),
          this.createEnrichedDataPoint({ x: 7, y: 2 }),
          this.createEnrichedDataPoint({ x: 8, y: 1 }),
        ],
        expectedSwingPoints: [],
        settings: { relativeThreshold: 0.1, windowSize: 2 },
      },
    };
  }
}
