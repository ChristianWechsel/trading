import { DataPoint } from '../digital-signal-processing.interface';
import { EnrichedDataPoint } from '../dto/enriched-data-point/enriched-data-point';
import { SwingPointTestCase } from './swing-points.spec';

export class TestDataSwingPoints {
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
      name: '',
      testcase: {
        data: [],
        expectedSwingPoints: [],
        settings: { relativeThreshold: 0.1, windowSize: 1 },
      },
    };
  }
  // plateauToDownward(): SwingPointAnalysis {
  //   return {
  //     data: [
  //       new EnrichedDataPoint({ x: 1, y: 2 }),
  //       new EnrichedDataPoint({ x: 2, y: 2 }),
  //       new EnrichedDataPoint({ x: 3, y: 1 }),
  //     ],
  //     result: [{ point: { x: 2, y: 2 }, swingPointType: 'plateauToDownward' }],
  //     windowSize: 1,
  //   };
  // }

  upwardToPlateau(): SwingPointTestCase {
    return {
      name: '',
      testcase: {
        data: [],
        expectedSwingPoints: [],
        settings: { relativeThreshold: 0.1, windowSize: 1 },
      },
    };
  }
  // upwardToPlateau(): SwingPointAnalysis {
  //   return {
  //     data: [
  //       new EnrichedDataPoint({ x: 1, y: 1 }),
  //       new EnrichedDataPoint({ x: 2, y: 2 }),
  //       new EnrichedDataPoint({ x: 3, y: 2 }),
  //     ],
  //     result: [{ point: { x: 2, y: 2 }, swingPointType: 'upwardToPlateau' }],
  //     windowSize: 1,
  //   };
  // }

  downwardToPlateau(): SwingPointTestCase {
    return {
      name: '',
      testcase: {
        data: [],
        expectedSwingPoints: [],
        settings: { relativeThreshold: 0.1, windowSize: 1 },
      },
    };
  }
  // downwardToPlateau(): SwingPointAnalysis {
  //   return {
  //     data: [
  //       new EnrichedDataPoint({ x: 1, y: 3 }),
  //       new EnrichedDataPoint({ x: 2, y: 2 }),
  //       new EnrichedDataPoint({ x: 3, y: 2 }),
  //     ],
  //     result: [{ point: { x: 2, y: 2 }, swingPointType: 'downwardToPlateau' }],
  //     windowSize: 1,
  //   };
  // }

  singleSwingHighWindow(): SwingPointTestCase {
    return {
      name: '',
      testcase: {
        data: [],
        expectedSwingPoints: [],
        settings: { relativeThreshold: 0.1, windowSize: 1 },
      },
    };
  }
  // singleSwingHighWindow(): SwingPointAnalysis {
  //   return {
  //     data: [
  //       new EnrichedDataPoint({ x: 1, y: 6 }),
  //       new EnrichedDataPoint({ x: 2, y: 2 }),
  //       new EnrichedDataPoint({ x: 3, y: 4 }),
  //       new EnrichedDataPoint({ x: 4, y: 2 }),
  //       new EnrichedDataPoint({ x: 5, y: 5 }),
  //       new EnrichedDataPoint({ x: 6, y: 2 }),
  //       new EnrichedDataPoint({ x: 7, y: 3 }),
  //       new EnrichedDataPoint({ x: 8, y: 4 }),
  //       new EnrichedDataPoint({ x: 9, y: 2 }),
  //     ],
  //     result: [
  //       {
  //         swingPointType: 'swingHigh',
  //         point: { x: 5, y: 5 },
  //       },
  //     ],
  //     windowSize: 3,
  //   };
  // }

  swingHighWindow3_centeredPeak(): SwingPointTestCase {
    return {
      name: '',
      testcase: {
        data: [],
        expectedSwingPoints: [],
        settings: { relativeThreshold: 0.1, windowSize: 1 },
      },
    };
  }
  // swingHighWindow3_centeredPeak(): SwingPointAnalysis {
  //   return {
  //     data: [
  //       new EnrichedDataPoint({ x: 1, y: 1 }),
  //       new EnrichedDataPoint({ x: 2, y: 2 }),
  //       new EnrichedDataPoint({ x: 3, y: 3 }),
  //       new EnrichedDataPoint({ x: 4, y: 10 }), // swing high
  //       new EnrichedDataPoint({ x: 5, y: 3 }),
  //       new EnrichedDataPoint({ x: 6, y: 2 }),
  //       new EnrichedDataPoint({ x: 7, y: 1 }),
  //     ],
  //     result: [{ swingPointType: 'swingHigh', point: { x: 4, y: 10 } }],
  //     windowSize: 3,
  //   };
  // }

  swingLowWindow3_centeredValley(): SwingPointTestCase {
    return {
      name: '',
      testcase: {
        data: [],
        expectedSwingPoints: [],
        settings: { relativeThreshold: 0.1, windowSize: 1 },
      },
    };
  }
  // swingLowWindow3_centeredValley(): SwingPointAnalysis {
  //   return {
  //     data: [
  //       new EnrichedDataPoint({ x: 1, y: 10 }),
  //       new EnrichedDataPoint({ x: 2, y: 7 }),
  //       new EnrichedDataPoint({ x: 3, y: 5 }),
  //       new EnrichedDataPoint({ x: 4, y: 1 }), // swing low
  //       new EnrichedDataPoint({ x: 5, y: 5 }),
  //       new EnrichedDataPoint({ x: 6, y: 7 }),
  //       new EnrichedDataPoint({ x: 7, y: 10 }),
  //     ],
  //     result: [{ swingPointType: 'swingLow', point: { x: 4, y: 1 } }],
  //     windowSize: 3,
  //   };
  // }

  swingHighWindow3_noPeak(): SwingPointTestCase {
    return {
      name: '',
      testcase: {
        data: [],
        expectedSwingPoints: [],
        settings: { relativeThreshold: 0.1, windowSize: 1 },
      },
    };
  }
  // swingHighWindow3_noPeak(): SwingPointAnalysis {
  //   return {
  //     data: [
  //       new EnrichedDataPoint({ x: 1, y: 1 }),
  //       new EnrichedDataPoint({ x: 2, y: 2 }),
  //       new EnrichedDataPoint({ x: 3, y: 4 }),
  //       new EnrichedDataPoint({ x: 4, y: 3.1 }), // not highest
  //       new EnrichedDataPoint({ x: 5, y: 3 }),
  //       new EnrichedDataPoint({ x: 6, y: 2 }),
  //       new EnrichedDataPoint({ x: 7, y: 1 }),
  //     ],
  //     result: [],
  //     windowSize: 3,
  //   };
  // }

  swingLowWindow3_noValley(): SwingPointTestCase {
    return {
      name: '',
      testcase: {
        data: [],
        expectedSwingPoints: [],
        settings: { relativeThreshold: 0.1, windowSize: 1 },
      },
    };
  }
  // swingLowWindow3_noValley(): SwingPointAnalysis {
  //   return {
  //     data: [
  //       new EnrichedDataPoint({ x: 1, y: 10 }),
  //       new EnrichedDataPoint({ x: 2, y: 7 }),
  //       new EnrichedDataPoint({ x: 3, y: 5 }),
  //       new EnrichedDataPoint({ x: 4, y: 4.9 }), // not lowest
  //       new EnrichedDataPoint({ x: 5, y: 4.8 }),
  //       new EnrichedDataPoint({ x: 6, y: 7 }),
  //       new EnrichedDataPoint({ x: 7, y: 10 }),
  //     ],
  //     result: [],
  //     windowSize: 3,
  //   };
  // }
  // // -------------------------------------------- //

  upwardToPlateau_window2(): SwingPointTestCase {
    return {
      name: '',
      testcase: {
        data: [],
        expectedSwingPoints: [],
        settings: { relativeThreshold: 0.1, windowSize: 1 },
      },
    };
  }
  // upwardToPlateau_window2(): SwingPointAnalysis {
  //   return {
  //     data: [
  //       new EnrichedDataPoint({ x: 0, y: 5 }),
  //       new EnrichedDataPoint({ x: 1, y: 6 }),
  //       new EnrichedDataPoint({ x: 2, y: 10 }),
  //       new EnrichedDataPoint({ x: 3, y: 12 }),
  //       new EnrichedDataPoint({ x: 4, y: 15 }),
  //       new EnrichedDataPoint({ x: 5, y: 15.05 }),
  //       new EnrichedDataPoint({ x: 6, y: 14.95 }),
  //       new EnrichedDataPoint({ x: 7, y: 18 }),
  //       new EnrichedDataPoint({ x: 8, y: 19 }),
  //     ],
  //     result: [{ swingPointType: 'upwardToPlateau', point: { x: 4, y: 15 } }],
  //     windowSize: 2,
  //   };
  // }

  downwardToPlateau_window2(): SwingPointTestCase {
    return {
      name: '',
      testcase: {
        data: [],
        expectedSwingPoints: [],
        settings: { relativeThreshold: 0.1, windowSize: 1 },
      },
    };
  }
  // downwardToPlateau_window2(): SwingPointAnalysis {
  //   return {
  //     data: [
  //       new EnrichedDataPoint({ x: 0, y: 25 }),
  //       new EnrichedDataPoint({ x: 1, y: 24 }),
  //       new EnrichedDataPoint({ x: 2, y: 20 }),
  //       new EnrichedDataPoint({ x: 3, y: 18 }),
  //       new EnrichedDataPoint({ x: 4, y: 15 }),
  //       new EnrichedDataPoint({ x: 5, y: 15.05 }),
  //       new EnrichedDataPoint({ x: 6, y: 14.95 }),
  //       new EnrichedDataPoint({ x: 7, y: 12 }),
  //       new EnrichedDataPoint({ x: 8, y: 11 }),
  //     ],
  //     result: [{ swingPointType: 'downwardToPlateau', point: { x: 4, y: 15 } }],
  //     windowSize: 2,
  //   };
  // }

  plateauToUpward_window2(): SwingPointTestCase {
    return {
      name: '',
      testcase: {
        data: [],
        expectedSwingPoints: [],
        settings: { relativeThreshold: 0.1, windowSize: 1 },
      },
    };
  }
  // plateauToUpward_window2(): SwingPointAnalysis {
  //   return {
  //     data: [
  //       new EnrichedDataPoint({ x: 0, y: 5 }),
  //       new EnrichedDataPoint({ x: 1, y: 6 }),
  //       new EnrichedDataPoint({ x: 2, y: 9.95 }),
  //       new EnrichedDataPoint({ x: 3, y: 10.05 }),
  //       new EnrichedDataPoint({ x: 4, y: 10 }),
  //       new EnrichedDataPoint({ x: 5, y: 12 }),
  //       new EnrichedDataPoint({ x: 6, y: 14 }),
  //       new EnrichedDataPoint({ x: 7, y: 18 }),
  //       new EnrichedDataPoint({ x: 8, y: 19 }),
  //     ],
  //     result: [
  //       { swingPointType: 'upwardToPlateau', point: { x: 2, y: 9.95 } },
  //       { swingPointType: 'plateauToUpward', point: { x: 4, y: 10 } },
  //     ],
  //     windowSize: 2,
  //   };
  // }

  plateauToDownward_window2(): SwingPointTestCase {
    return {
      name: '',
      testcase: {
        data: [],
        expectedSwingPoints: [],
        settings: { relativeThreshold: 0.1, windowSize: 1 },
      },
    };
  }
  // plateauToDownward_window2(): SwingPointAnalysis {
  //   return {
  //     data: [
  //       new EnrichedDataPoint({ x: 0, y: 20 }),
  //       new EnrichedDataPoint({ x: 1, y: 19 }),
  //       new EnrichedDataPoint({ x: 2, y: 15.05 }),
  //       new EnrichedDataPoint({ x: 3, y: 14.95 }),
  //       new EnrichedDataPoint({ x: 4, y: 15 }),
  //       new EnrichedDataPoint({ x: 5, y: 13 }),
  //       new EnrichedDataPoint({ x: 6, y: 11 }),
  //       new EnrichedDataPoint({ x: 7, y: 8 }),
  //       new EnrichedDataPoint({ x: 8, y: 7 }),
  //     ],
  //     result: [{ swingPointType: 'plateauToDownward', point: { x: 4, y: 15 } }],
  //     windowSize: 2,
  //   };
  // }

  upwardToPlateau_window2_trendFail(): SwingPointTestCase {
    return {
      name: '',
      testcase: {
        data: [],
        expectedSwingPoints: [],
        settings: { relativeThreshold: 0.1, windowSize: 1 },
      },
    };
  }
  // upwardToPlateau_window2_trendFail(): SwingPointAnalysis {
  //   return {
  //     data: [
  //       new EnrichedDataPoint({ x: 0, y: 5 }),
  //       new EnrichedDataPoint({ x: 1, y: 6 }),
  //       new EnrichedDataPoint({ x: 2, y: 11.5 }),
  //       new EnrichedDataPoint({ x: 3, y: 12 }),
  //       new EnrichedDataPoint({ x: 4, y: 15 }),
  //       new EnrichedDataPoint({ x: 5, y: 15.05 }),
  //       new EnrichedDataPoint({ x: 6, y: 14.95 }),
  //       new EnrichedDataPoint({ x: 7, y: 18 }),
  //       new EnrichedDataPoint({ x: 8, y: 19 }),
  //     ],
  //     result: [],
  //     windowSize: 2,
  //   };
  // }

  upwardToPlateau_window2_plateauFail(): SwingPointTestCase {
    return {
      name: '',
      testcase: {
        data: [],
        expectedSwingPoints: [],
        settings: { relativeThreshold: 0.1, windowSize: 1 },
      },
    };
  }
  // upwardToPlateau_window2_plateauFail(): SwingPointAnalysis {
  //   return {
  //     data: [
  //       new EnrichedDataPoint({ x: 0, y: 5 }),
  //       new EnrichedDataPoint({ x: 1, y: 6 }),
  //       new EnrichedDataPoint({ x: 2, y: 10 }),
  //       new EnrichedDataPoint({ x: 3, y: 12 }),
  //       new EnrichedDataPoint({ x: 4, y: 15 }),
  //       new EnrichedDataPoint({ x: 5, y: 15.05 }),
  //       new EnrichedDataPoint({ x: 6, y: 17 }),
  //       new EnrichedDataPoint({ x: 7, y: 18 }),
  //       new EnrichedDataPoint({ x: 8, y: 19 }),
  //     ],
  //     result: [],
  //     windowSize: 2,
  //   };
  // }

  plateauToUpward_window1_but_fails_window2(): SwingPointTestCase {
    return {
      name: '',
      testcase: {
        data: [],
        expectedSwingPoints: [],
        settings: { relativeThreshold: 0.1, windowSize: 1 },
      },
    };
  }
  // plateauToUpward_window1_but_fails_window2(): SwingPointAnalysis {
  //   return {
  //     data: [
  //       new EnrichedDataPoint({ x: 0, y: 1 }),
  //       new EnrichedDataPoint({ x: 1, y: 1.5 }),
  //       new EnrichedDataPoint({ x: 2, y: 2 }),
  //       new EnrichedDataPoint({ x: 3, y: 2 }),
  //       new EnrichedDataPoint({ x: 4, y: 3 }),
  //       new EnrichedDataPoint({ x: 5, y: 4 }),
  //       new EnrichedDataPoint({ x: 6, y: 5 }),
  //     ],
  //     result: [],

  //     windowSize: 2,
  //   };
  // }
}
