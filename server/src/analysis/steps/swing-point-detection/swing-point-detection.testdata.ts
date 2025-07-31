import { CreateTestData } from '../../../utils/test-utils';
import { SwingPointTestCase } from './swing-point-detection.spec';

export class SwingPointDetectionTestdata extends CreateTestData {
  singleSwingHigh(): SwingPointTestCase {
    return {
      name: 'detect swing high',
      testcase: {
        expectedSwingPoints: [{ index: 1, type: 'swingHigh' }],
        context: this.createContextOf(
          [
            { priceDate: '1', closePrice: 2 },
            { priceDate: '2', closePrice: 3 },
            { priceDate: '3', closePrice: 2 },
          ],
          {
            steps: [],
            dataAggregation: { ticker: { exchange: '', symbol: '' } },
            stepOptions: {
              swingPointDetection: { relativeThreshold: 0.1, windowSize: 1 },
            },
          },
        ),
      },
    };
  }

  singleSwingHigh_close(): SwingPointTestCase {
    return {
      name: 'detect swing high (close values)',
      testcase: {
        expectedSwingPoints: [],
        context: this.createContextOf(
          [
            { priceDate: '1', closePrice: 2 },
            { priceDate: '2', closePrice: 2.09 }, // close to 2
            { priceDate: '3', closePrice: 2 },
          ],
          {
            steps: [],
            dataAggregation: { ticker: { exchange: '', symbol: '' } },
            stepOptions: {
              swingPointDetection: { relativeThreshold: 0.1, windowSize: 1 },
            },
          },
        ),
      },
    };
  }

  singleSwingHigh_significant(): SwingPointTestCase {
    return {
      name: 'detect swing high (significant difference)',
      testcase: {
        expectedSwingPoints: [{ index: 1, type: 'swingHigh' }],
        context: this.createContextOf(
          [
            { priceDate: '1', closePrice: 2 },
            { priceDate: '2', closePrice: 3 },
            { priceDate: '3', closePrice: 1.5 },
          ],
          {
            steps: [],
            dataAggregation: { ticker: { exchange: '', symbol: '' } },
            stepOptions: {
              swingPointDetection: { relativeThreshold: 0.1, windowSize: 1 },
            },
          },
        ),
      },
    };
  }

  singleSwingLow(): SwingPointTestCase {
    return {
      name: 'detect swing low',
      testcase: {
        expectedSwingPoints: [{ index: 1, type: 'swingLow' }],
        context: this.createContextOf(
          [
            { priceDate: '1', closePrice: 3 },
            { priceDate: '2', closePrice: 2 },
            { priceDate: '3', closePrice: 3 },
          ],
          {
            steps: [],
            dataAggregation: { ticker: { exchange: '', symbol: '' } },
            stepOptions: {
              swingPointDetection: { relativeThreshold: 0.1, windowSize: 1 },
            },
          },
        ),
      },
    };
  }

  singleSwingLow_close(): SwingPointTestCase {
    return {
      name: 'detect swing low (close values)',
      testcase: {
        expectedSwingPoints: [],
        context: this.createContextOf(
          [
            { priceDate: '1', closePrice: 3 },
            { priceDate: '2', closePrice: 2.91 }, // close to 3
            { priceDate: '3', closePrice: 3 },
          ],
          {
            steps: [],
            dataAggregation: { ticker: { exchange: '', symbol: '' } },
            stepOptions: {
              swingPointDetection: { relativeThreshold: 0.1, windowSize: 1 },
            },
          },
        ),
      },
    };
  }

  singleSwingLow_significant(): SwingPointTestCase {
    return {
      name: 'detect swing low (significant difference)',
      testcase: {
        expectedSwingPoints: [
          {
            index: 1,
            type: 'swingLow',
          },
        ],
        context: this.createContextOf(
          [
            { priceDate: '1', closePrice: 3 },
            { priceDate: '2', closePrice: 1.5 },
            { priceDate: '3', closePrice: 3 },
          ],
          {
            steps: [],
            dataAggregation: { ticker: { exchange: '', symbol: '' } },
            stepOptions: {
              swingPointDetection: { relativeThreshold: 0.1, windowSize: 1 },
            },
          },
        ),
      },
    };
  }

  multipleSwingPoints(): SwingPointTestCase {
    return {
      name: 'detect multiple swing points',
      testcase: {
        expectedSwingPoints: [
          { index: 1, type: 'swingHigh' },
          { index: 2, type: 'swingLow' },
          { index: 3, type: 'swingHigh' },
        ],
        context: this.createContextOf(
          [
            { priceDate: '1', closePrice: 1 },
            { priceDate: '2', closePrice: 3 },
            { priceDate: '3', closePrice: 2 },
            { priceDate: '4', closePrice: 4 },
            { priceDate: '5', closePrice: 3 },
          ],
          {
            steps: [],
            dataAggregation: { ticker: { exchange: '', symbol: '' } },
            stepOptions: {
              swingPointDetection: { relativeThreshold: 0.1, windowSize: 1 },
            },
          },
        ),
      },
    };
  }

  multipleSwingPoints_close(): SwingPointTestCase {
    return {
      name: 'detect multiple swing points (close values)',
      testcase: {
        expectedSwingPoints: [],
        context: this.createContextOf(
          [
            { priceDate: '1', closePrice: 1 },
            { priceDate: '2', closePrice: 1.09 }, // close to 1
            { priceDate: '3', closePrice: 1.01 }, // close to 1.09
            { priceDate: '4', closePrice: 1.08 }, // close to 1.01
            { priceDate: '5', closePrice: 1.05 }, // close to 1.08
          ],
          {
            steps: [],
            dataAggregation: { ticker: { exchange: '', symbol: '' } },
            stepOptions: {
              swingPointDetection: { relativeThreshold: 0.1, windowSize: 1 },
            },
          },
        ),
      },
    };
  }

  multipleSwingPoints_significant(): SwingPointTestCase {
    return {
      name: 'detect multiple swing points (significant difference)',
      testcase: {
        expectedSwingPoints: [
          { index: 1, type: 'swingHigh' },
          { index: 2, type: 'swingLow' },
          { index: 3, type: 'swingHigh' },
        ],
        context: this.createContextOf(
          [
            { priceDate: '1', closePrice: 1 },
            { priceDate: '2', closePrice: 3 },
            { priceDate: '3', closePrice: 1 },
            { priceDate: '4', closePrice: 4 },
            { priceDate: '5', closePrice: 1 },
          ],
          {
            steps: [],
            dataAggregation: { ticker: { exchange: '', symbol: '' } },
            stepOptions: {
              swingPointDetection: { relativeThreshold: 0.1, windowSize: 1 },
            },
          },
        ),
      },
    };
  }

  noSwingPoint_FlatLine_equalValues(): SwingPointTestCase {
    return {
      name: 'detect no swing points - flatline - equal values',
      testcase: {
        expectedSwingPoints: [],
        context: this.createContextOf(
          [
            { priceDate: '1', closePrice: 1 },
            { priceDate: '2', closePrice: 1 },
            { priceDate: '3', closePrice: 1 },
          ],
          {
            steps: [],
            dataAggregation: { ticker: { exchange: '', symbol: '' } },
            stepOptions: {
              swingPointDetection: { relativeThreshold: 0.1, windowSize: 1 },
            },
          },
        ),
      },
    };
  }

  noSwingPoint_FlatLine_closeValues(): SwingPointTestCase {
    return {
      name: 'detect no swing points - flatline - close values',
      testcase: {
        expectedSwingPoints: [],
        context: this.createContextOf(
          [
            { priceDate: '1', closePrice: 1 },
            { priceDate: '2', closePrice: 1.01 },
            { priceDate: '3', closePrice: 0.99 },
          ],
          {
            steps: [],
            dataAggregation: { ticker: { exchange: '', symbol: '' } },
            stepOptions: {
              swingPointDetection: { relativeThreshold: 0.1, windowSize: 1 },
            },
          },
        ),
      },
    };
  }

  noSwingPoint_Ascending(): SwingPointTestCase {
    return {
      name: 'detect no swing points - ascending',
      testcase: {
        expectedSwingPoints: [],
        context: this.createContextOf(
          [
            { priceDate: '1', closePrice: 1 },
            { priceDate: '2', closePrice: 2 },
            { priceDate: '3', closePrice: 3 },
          ],
          {
            steps: [],
            dataAggregation: { ticker: { exchange: '', symbol: '' } },
            stepOptions: {
              swingPointDetection: { relativeThreshold: 0.1, windowSize: 1 },
            },
          },
        ),
      },
    };
  }

  noSwingPoint_Descending(): SwingPointTestCase {
    return {
      name: 'detect no swing points - descending',
      testcase: {
        expectedSwingPoints: [],
        context: this.createContextOf(
          [
            { priceDate: '1', closePrice: 3 },
            { priceDate: '2', closePrice: 2 },
            { priceDate: '3', closePrice: 1 },
          ],
          {
            steps: [],
            dataAggregation: { ticker: { exchange: '', symbol: '' } },
            stepOptions: {
              swingPointDetection: { relativeThreshold: 0.1, windowSize: 1 },
            },
          },
        ),
      },
    };
  }

  plateauToUpward(): SwingPointTestCase {
    return {
      name: 'detect plateau high',
      testcase: {
        expectedSwingPoints: [],
        context: this.createContextOf(
          [
            { priceDate: '1', closePrice: 2 },
            { priceDate: '2', closePrice: 2 },
            { priceDate: '3', closePrice: 3 },
          ],
          {
            steps: [],
            dataAggregation: { ticker: { exchange: '', symbol: '' } },
            stepOptions: {
              swingPointDetection: { relativeThreshold: 0.1, windowSize: 1 },
            },
          },
        ),
      },
    };
  }

  plateauToDownward(): SwingPointTestCase {
    return {
      name: 'detect plateau low',
      testcase: {
        expectedSwingPoints: [],
        context: this.createContextOf(
          [
            { priceDate: '1', closePrice: 2 },
            { priceDate: '2', closePrice: 2 },
            { priceDate: '3', closePrice: 1 },
          ],
          {
            steps: [],
            dataAggregation: { ticker: { exchange: '', symbol: '' } },
            stepOptions: {
              swingPointDetection: { relativeThreshold: 0.1, windowSize: 1 },
            },
          },
        ),
      },
    };
  }

  upwardToPlateau(): SwingPointTestCase {
    return {
      name: 'detect low plateau',
      testcase: {
        expectedSwingPoints: [],
        context: this.createContextOf(
          [
            { priceDate: '1', closePrice: 1 },
            { priceDate: '2', closePrice: 2 },
            { priceDate: '3', closePrice: 2 },
          ],
          {
            steps: [],
            dataAggregation: { ticker: { exchange: '', symbol: '' } },
            stepOptions: {
              swingPointDetection: { relativeThreshold: 0.1, windowSize: 1 },
            },
          },
        ),
      },
    };
  }

  downwardToPlateau(): SwingPointTestCase {
    return {
      name: 'detect high plateau',
      testcase: {
        expectedSwingPoints: [],
        context: this.createContextOf(
          [
            { priceDate: '1', closePrice: 3 },
            { priceDate: '2', closePrice: 2 },
            { priceDate: '3', closePrice: 2 },
          ],
          {
            steps: [],
            dataAggregation: { ticker: { exchange: '', symbol: '' } },
            stepOptions: {
              swingPointDetection: { relativeThreshold: 0.1, windowSize: 1 },
            },
          },
        ),
      },
    };
  }

  singleSwingHighWindow(): SwingPointTestCase {
    return {
      name: 'detect swing high with window size',
      testcase: {
        expectedSwingPoints: [{ index: 4, type: 'swingHigh' }],
        context: this.createContextOf(
          [
            { priceDate: '1', closePrice: 6 },
            { priceDate: '2', closePrice: 2 },
            { priceDate: '3', closePrice: 4 },
            { priceDate: '4', closePrice: 2 },
            { priceDate: '5', closePrice: 5 },
            { priceDate: '6', closePrice: 2 },
            { priceDate: '7', closePrice: 3 },
            { priceDate: '8', closePrice: 4 },
            { priceDate: '9', closePrice: 2 },
          ],
          {
            steps: [],
            dataAggregation: { ticker: { exchange: '', symbol: '' } },
            stepOptions: {
              swingPointDetection: { relativeThreshold: 0.1, windowSize: 3 },
            },
          },
        ),
      },
    };
  }

  swingHighWindow3_centeredPeak(): SwingPointTestCase {
    return {
      name: 'detect swing high with windowSize=3 (centered peak)',
      testcase: {
        expectedSwingPoints: [{ index: 3, type: 'swingHigh' }],
        context: this.createContextOf(
          [
            { priceDate: '1', closePrice: 1 },
            { priceDate: '2', closePrice: 2 },
            { priceDate: '3', closePrice: 3 },
            { priceDate: '4', closePrice: 10 }, // swing high
            { priceDate: '5', closePrice: 3 },
            { priceDate: '6', closePrice: 2 },
            { priceDate: '7', closePrice: 1 },
          ],
          {
            steps: [],
            dataAggregation: { ticker: { exchange: '', symbol: '' } },
            stepOptions: {
              swingPointDetection: { relativeThreshold: 0.1, windowSize: 3 },
            },
          },
        ),
      },
    };
  }

  swingLowWindow3_centeredValley(): SwingPointTestCase {
    return {
      name: 'detect swing low with windowSize=3 (centered valley)',
      testcase: {
        expectedSwingPoints: [{ index: 3, type: 'swingLow' }],
        context: this.createContextOf(
          [
            { priceDate: '1', closePrice: 10 },
            { priceDate: '2', closePrice: 7 },
            { priceDate: '3', closePrice: 5 },
            { priceDate: '4', closePrice: 1 }, // swing low
            { priceDate: '5', closePrice: 5 },
            { priceDate: '6', closePrice: 7 },
            { priceDate: '7', closePrice: 10 },
          ],
          {
            steps: [],
            dataAggregation: { ticker: { exchange: '', symbol: '' } },
            stepOptions: {
              swingPointDetection: { relativeThreshold: 0.1, windowSize: 3 },
            },
          },
        ),
      },
    };
  }

  swingHighWindow3_noPeak(): SwingPointTestCase {
    return {
      name: 'no swing high with windowSize=3 (peak not high enough)',
      testcase: {
        expectedSwingPoints: [],
        context: this.createContextOf(
          [
            { priceDate: '1', closePrice: 1 },
            { priceDate: '2', closePrice: 2 },
            { priceDate: '3', closePrice: 4 },
            { priceDate: '4', closePrice: 3.1 }, // not highest
            { priceDate: '5', closePrice: 3 },
            { priceDate: '6', closePrice: 2 },
            { priceDate: '7', closePrice: 1 },
          ],
          {
            steps: [],
            dataAggregation: { ticker: { exchange: '', symbol: '' } },
            stepOptions: {
              swingPointDetection: { relativeThreshold: 0.1, windowSize: 3 },
            },
          },
        ),
      },
    };
  }

  swingLowWindow3_noValley(): SwingPointTestCase {
    return {
      name: 'no swing low with windowSize=3 (valley not low enough)',
      testcase: {
        expectedSwingPoints: [],
        context: this.createContextOf(
          [
            { priceDate: '1', closePrice: 10 },
            { priceDate: '2', closePrice: 7 },
            { priceDate: '3', closePrice: 5 },
            { priceDate: '4', closePrice: 4.9 }, // not lowest
            { priceDate: '5', closePrice: 4.8 },
            { priceDate: '6', closePrice: 7 },
            { priceDate: '7', closePrice: 10 },
          ],
          {
            steps: [],
            dataAggregation: { ticker: { exchange: '', symbol: '' } },
            stepOptions: {
              swingPointDetection: { relativeThreshold: 0.1, windowSize: 3 },
            },
          },
        ),
      },
    };
  }

  upwardToPlateau_window2(): SwingPointTestCase {
    return {
      name: 'detect upward to plateau with windowSize=2',
      testcase: {
        expectedSwingPoints: [],
        context: this.createContextOf(
          [
            { priceDate: '0', closePrice: 5 },
            { priceDate: '1', closePrice: 6 },
            { priceDate: '2', closePrice: 10 },
            { priceDate: '3', closePrice: 12 },
            { priceDate: '4', closePrice: 15 },
            { priceDate: '5', closePrice: 15.05 },
            { priceDate: '6', closePrice: 14.95 },
            { priceDate: '7', closePrice: 18 },
            { priceDate: '8', closePrice: 19 },
          ],
          {
            steps: [],
            dataAggregation: { ticker: { exchange: '', symbol: '' } },
            stepOptions: {
              swingPointDetection: { relativeThreshold: 0.1, windowSize: 2 },
            },
          },
        ),
      },
    };
  }

  downwardToPlateau_window2(): SwingPointTestCase {
    return {
      name: 'detect downwardToPlateau with windowSize=2',
      testcase: {
        expectedSwingPoints: [],
        context: this.createContextOf(
          [
            { priceDate: '0', closePrice: 25 },
            { priceDate: '1', closePrice: 24 },
            { priceDate: '2', closePrice: 20 },
            { priceDate: '3', closePrice: 18 },
            { priceDate: '4', closePrice: 15 },
            { priceDate: '5', closePrice: 15.05 },
            { priceDate: '6', closePrice: 14.95 },
            { priceDate: '7', closePrice: 12 },
            { priceDate: '8', closePrice: 11 },
          ],
          {
            steps: [],
            dataAggregation: { ticker: { exchange: '', symbol: '' } },
            stepOptions: {
              swingPointDetection: { relativeThreshold: 0.1, windowSize: 2 },
            },
          },
        ),
      },
    };
  }

  plateauToUpward_window2(): SwingPointTestCase {
    return {
      name: 'detect plateauToUpward with windowSize=2',
      testcase: {
        expectedSwingPoints: [],
        context: this.createContextOf(
          [
            { priceDate: '0', closePrice: 5 },
            { priceDate: '1', closePrice: 6 },
            { priceDate: '2', closePrice: 9.95 },
            { priceDate: '3', closePrice: 10.05 },
            { priceDate: '4', closePrice: 10 },
            { priceDate: '5', closePrice: 12 },
            { priceDate: '6', closePrice: 14 },
            { priceDate: '7', closePrice: 18 },
            { priceDate: '8', closePrice: 19 },
          ],
          {
            steps: [],
            dataAggregation: { ticker: { exchange: '', symbol: '' } },
            stepOptions: {
              swingPointDetection: { relativeThreshold: 0.1, windowSize: 2 },
            },
          },
        ),
      },
    };
  }

  plateauToDownward_window2(): SwingPointTestCase {
    return {
      name: 'detect plateauToDownward with windowSize=2',
      testcase: {
        expectedSwingPoints: [],
        context: this.createContextOf(
          [
            { priceDate: '0', closePrice: 20 },
            { priceDate: '1', closePrice: 19 },
            { priceDate: '2', closePrice: 15.05 },
            { priceDate: '3', closePrice: 14.95 },
            { priceDate: '4', closePrice: 15 },
            { priceDate: '5', closePrice: 13 },
            { priceDate: '6', closePrice: 11 },
            { priceDate: '7', closePrice: 8 },
            { priceDate: '8', closePrice: 7 },
          ],
          {
            steps: [],
            dataAggregation: { ticker: { exchange: '', symbol: '' } },
            stepOptions: {
              swingPointDetection: { relativeThreshold: 0.1, windowSize: 2 },
            },
          },
        ),
      },
    };
  }

  upwardToPlateau_window2_trendFail(): SwingPointTestCase {
    return {
      name: 'fail upwardToPlateau with windowSize=2 (trend fail)',
      testcase: {
        expectedSwingPoints: [],
        context: this.createContextOf(
          [
            { priceDate: '0', closePrice: 5 },
            { priceDate: '1', closePrice: 6 },
            { priceDate: '2', closePrice: 11.5 },
            { priceDate: '3', closePrice: 12 },
            { priceDate: '4', closePrice: 15 },
            { priceDate: '5', closePrice: 15.05 },
            { priceDate: '6', closePrice: 14.95 },
            { priceDate: '7', closePrice: 18 },
            { priceDate: '8', closePrice: 19 },
          ],
          {
            steps: [],
            dataAggregation: { ticker: { exchange: '', symbol: '' } },
            stepOptions: {
              swingPointDetection: { relativeThreshold: 0.1, windowSize: 2 },
            },
          },
        ),
      },
    };
  }

  upwardToPlateau_window2_plateauFail(): SwingPointTestCase {
    return {
      name: 'fail upwardToPlateau with windowSize=2 (plateau fail)',
      testcase: {
        expectedSwingPoints: [],
        context: this.createContextOf(
          [
            { priceDate: '0', closePrice: 5 },
            { priceDate: '1', closePrice: 6 },
            { priceDate: '2', closePrice: 10 },
            { priceDate: '3', closePrice: 12 },
            { priceDate: '4', closePrice: 15 },
            { priceDate: '5', closePrice: 15.05 },
            { priceDate: '6', closePrice: 17 },
            { priceDate: '7', closePrice: 18 },
            { priceDate: '8', closePrice: 19 },
          ],
          {
            steps: [],
            dataAggregation: { ticker: { exchange: '', symbol: '' } },
            stepOptions: {
              swingPointDetection: { relativeThreshold: 0.1, windowSize: 2 },
            },
          },
        ),
      },
    };
  }

  plateauToUpward_window1_but_fails_window2(): SwingPointTestCase {
    return {
      name: 'fail plateauToUpward with windowSize=2 (trend fail)',
      testcase: {
        expectedSwingPoints: [],
        context: this.createContextOf(
          [
            { priceDate: '0', closePrice: 1 },
            { priceDate: '1', closePrice: 1.5 },
            { priceDate: '2', closePrice: 2 },
            { priceDate: '3', closePrice: 2 },
            { priceDate: '4', closePrice: 3 },
            { priceDate: '5', closePrice: 4 },
            { priceDate: '6', closePrice: 5 },
          ],
          {
            steps: [],
            dataAggregation: { ticker: { exchange: '', symbol: '' } },
            stepOptions: {
              swingPointDetection: { relativeThreshold: 0.1, windowSize: 2 },
            },
          },
        ),
      },
    };
  }

  upwardPlateauUpward_window1(): SwingPointTestCase {
    return {
      name: 'no swingpoint - upward to plateau followed by upward trend - windowSize=1',
      testcase: {
        expectedSwingPoints: [],
        context: this.createContextOf(
          [
            { priceDate: '1', closePrice: 2 },
            { priceDate: '2', closePrice: 3 },
            { priceDate: '3', closePrice: 3 },
            { priceDate: '4', closePrice: 4 },
          ],
          {
            steps: [],
            dataAggregation: { ticker: { exchange: '', symbol: '' } },
            stepOptions: {
              swingPointDetection: { relativeThreshold: 0.1, windowSize: 1 },
            },
          },
        ),
      },
    };
  }
  upwardPlateauUpward_window2(): SwingPointTestCase {
    return {
      name: 'no swingpoint - upward to plateau followed by upward trend - windowSize=2',
      testcase: {
        expectedSwingPoints: [],
        context: this.createContextOf(
          [
            { priceDate: '1', closePrice: 1 },
            { priceDate: '2', closePrice: 2 },
            { priceDate: '3', closePrice: 3 },
            { priceDate: '4', closePrice: 3 },
            { priceDate: '5', closePrice: 3 },
            { priceDate: '6', closePrice: 3 },
            { priceDate: '7', closePrice: 4 },
            { priceDate: '8', closePrice: 5 },
          ],
          {
            steps: [],
            dataAggregation: { ticker: { exchange: '', symbol: '' } },
            stepOptions: {
              swingPointDetection: { relativeThreshold: 0.1, windowSize: 2 },
            },
          },
        ),
      },
    };
  }
  upwardPlateauDownward_window1(): SwingPointTestCase {
    return {
      name: 'swingpoint - upward plateau followed by downward trend - windowSize=1',
      testcase: {
        expectedSwingPoints: [{ index: 1, type: 'swingHigh' }],
        context: this.createContextOf(
          [
            { priceDate: '1', closePrice: 2 },
            { priceDate: '2', closePrice: 3 },
            { priceDate: '3', closePrice: 3 },
            { priceDate: '4', closePrice: 2 },
          ],
          {
            steps: [],
            dataAggregation: { ticker: { exchange: '', symbol: '' } },
            stepOptions: {
              swingPointDetection: { relativeThreshold: 0.1, windowSize: 1 },
            },
          },
        ),
      },
    };
  }
  upwardPlateauDownward_window2(): SwingPointTestCase {
    return {
      name: 'swingHigh - upward to plateau followed by downward trend - windowSize=2',
      testcase: {
        expectedSwingPoints: [{ index: 2, type: 'swingHigh' }],
        context: this.createContextOf(
          [
            { priceDate: '1', closePrice: 1 },
            { priceDate: '2', closePrice: 2 },
            { priceDate: '3', closePrice: 3 },
            { priceDate: '4', closePrice: 3 },
            { priceDate: '5', closePrice: 3 },
            { priceDate: '6', closePrice: 3 },
            { priceDate: '7', closePrice: 2 },
            { priceDate: '8', closePrice: 1 },
          ],
          {
            steps: [],
            dataAggregation: { ticker: { exchange: '', symbol: '' } },
            stepOptions: {
              swingPointDetection: { relativeThreshold: 0.1, windowSize: 2 },
            },
          },
        ),
      },
    };
  }
  downwardPlateauUpward_window1(): SwingPointTestCase {
    return {
      name: 'swingLow - downward to plateau followed by upward trend - windowSize=1',
      testcase: {
        expectedSwingPoints: [{ index: 1, type: 'swingLow' }],
        context: this.createContextOf(
          [
            { priceDate: '1', closePrice: 4 },
            { priceDate: '2', closePrice: 3 },
            { priceDate: '3', closePrice: 3 },
            { priceDate: '4', closePrice: 4 },
          ],
          {
            steps: [],
            dataAggregation: { ticker: { exchange: '', symbol: '' } },
            stepOptions: {
              swingPointDetection: { relativeThreshold: 0.1, windowSize: 1 },
            },
          },
        ),
      },
    };
  }
  downwardPlateauUpward_window2(): SwingPointTestCase {
    return {
      name: 'swingLow - downward to plateau followed by upward trend - windowSize=2',
      testcase: {
        expectedSwingPoints: [{ index: 2, type: 'swingLow' }],
        context: this.createContextOf(
          [
            { priceDate: '1', closePrice: 5 },
            { priceDate: '2', closePrice: 4 },
            { priceDate: '3', closePrice: 3 },
            { priceDate: '4', closePrice: 3 },
            { priceDate: '5', closePrice: 3 },
            { priceDate: '6', closePrice: 3 },
            { priceDate: '7', closePrice: 4 },
            { priceDate: '8', closePrice: 5 },
          ],
          {
            steps: [],
            dataAggregation: { ticker: { exchange: '', symbol: '' } },
            stepOptions: {
              swingPointDetection: { relativeThreshold: 0.1, windowSize: 2 },
            },
          },
        ),
      },
    };
  }
  downwardPlateauDownward_window1(): SwingPointTestCase {
    return {
      name: 'no swingpoint - downward to plateau followed by downward trend - windowSize=1',
      testcase: {
        expectedSwingPoints: [],
        context: this.createContextOf(
          [
            { priceDate: '1', closePrice: 4 },
            { priceDate: '2', closePrice: 3 },
            { priceDate: '3', closePrice: 3 },
            { priceDate: '4', closePrice: 1 },
          ],
          {
            steps: [],
            dataAggregation: { ticker: { exchange: '', symbol: '' } },
            stepOptions: {
              swingPointDetection: { relativeThreshold: 0.1, windowSize: 1 },
            },
          },
        ),
      },
    };
  }
  downwardPlateauDownward_window2(): SwingPointTestCase {
    return {
      name: 'no swingpoint - downward to plateau followed by downward trend - windowSize=2',
      testcase: {
        expectedSwingPoints: [],
        context: this.createContextOf(
          [
            { priceDate: '1', closePrice: 5 },
            { priceDate: '2', closePrice: 4 },
            { priceDate: '3', closePrice: 3 },
            { priceDate: '4', closePrice: 3 },
            { priceDate: '5', closePrice: 3 },
            { priceDate: '6', closePrice: 3 },
            { priceDate: '7', closePrice: 2 },
            { priceDate: '8', closePrice: 1 },
          ],
          {
            steps: [],
            dataAggregation: { ticker: { exchange: '', symbol: '' } },
            stepOptions: {
              swingPointDetection: { relativeThreshold: 0.1, windowSize: 2 },
            },
          },
        ),
      },
    };
  }
}
