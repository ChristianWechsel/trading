import { DataPoint } from '../digital-signal-processing.interface';
import { SwingPointData } from './swing-points.interface';

type SwingPointAnalysis = {
  data: DataPoint[];
  result: SwingPointData[];
  windowSize: number;
};

export class TestDataSwingPoints {
  singleSwingHigh(): SwingPointAnalysis {
    return {
      data: [
        { x: 1, y: 2 },
        { x: 2, y: 3 },
        { x: 3, y: 2 },
      ],
      result: [
        {
          swingPointType: 'swingHigh',
          point: { x: 2, y: 3 },
        },
      ],
      windowSize: 1,
    };
  }

  singleSwingHigh_close(): SwingPointAnalysis {
    return {
      data: [
        { x: 1, y: 2 },
        { x: 2, y: 2.09 }, // close to 2
        { x: 3, y: 2 },
      ],
      result: [],
      windowSize: 1,
    };
  }

  singleSwingHigh_significant(): SwingPointAnalysis {
    return {
      data: [
        { x: 1, y: 2 },
        { x: 2, y: 3 },
        { x: 3, y: 1.5 },
      ],
      result: [
        {
          swingPointType: 'swingHigh',
          point: { x: 2, y: 3 },
        },
      ],
      windowSize: 1,
    };
  }

  singleSwingLow(): SwingPointAnalysis {
    return {
      data: [
        { x: 1, y: 3 },
        { x: 2, y: 2 },
        { x: 3, y: 3 },
      ],
      result: [
        {
          swingPointType: 'swingLow',
          point: { x: 2, y: 2 },
        },
      ],
      windowSize: 1,
    };
  }

  singleSwingLow_close(): SwingPointAnalysis {
    return {
      data: [
        { x: 1, y: 3 },
        { x: 2, y: 2.91 }, // close to 3
        { x: 3, y: 3 },
      ],
      result: [],
      windowSize: 1,
    };
  }

  singleSwingLow_significant(): SwingPointAnalysis {
    return {
      data: [
        { x: 1, y: 3 },
        { x: 2, y: 1.5 },
        { x: 3, y: 3 },
      ],
      result: [
        {
          swingPointType: 'swingLow',
          point: { x: 2, y: 1.5 },
        },
      ],
      windowSize: 1,
    };
  }

  multipleSwingPoints(): SwingPointAnalysis {
    return {
      data: [
        { x: 1, y: 1 },
        { x: 2, y: 3 },
        { x: 3, y: 2 },
        { x: 4, y: 4 },
        { x: 5, y: 3 },
      ],
      result: [
        { swingPointType: 'swingHigh', point: { x: 2, y: 3 } },
        { swingPointType: 'swingLow', point: { x: 3, y: 2 } },
        { swingPointType: 'swingHigh', point: { x: 4, y: 4 } },
      ],
      windowSize: 1,
    };
  }

  multipleSwingPoints_close(): SwingPointAnalysis {
    return {
      data: [
        { x: 1, y: 1 },
        { x: 2, y: 1.09 }, // close to 1
        { x: 3, y: 1.01 }, // close to 1.09
        { x: 4, y: 1.08 }, // close to 1.01
        { x: 5, y: 1.05 }, // close to 1.08
      ],
      result: [],
      windowSize: 1,
    };
  }

  multipleSwingPoints_significant(): SwingPointAnalysis {
    return {
      data: [
        { x: 1, y: 1 },
        { x: 2, y: 3 },
        { x: 3, y: 1 },
        { x: 4, y: 4 },
        { x: 5, y: 1 },
      ],
      result: [
        { swingPointType: 'swingHigh', point: { x: 2, y: 3 } },
        { swingPointType: 'swingLow', point: { x: 3, y: 1 } },
        { swingPointType: 'swingHigh', point: { x: 4, y: 4 } },
      ],
      windowSize: 1,
    };
  }

  noSwingPoint_FlatLine_equalValues(): SwingPointAnalysis {
    return {
      data: [
        { x: 1, y: 1 },
        { x: 2, y: 1 },
        { x: 3, y: 1 },
      ],
      result: [],
      windowSize: 1,
    };
  }

  noSwingPoint_FlatLine_closeValues(): SwingPointAnalysis {
    return {
      data: [
        { x: 1, y: 1 },
        { x: 2, y: 1.01 },
        { x: 3, y: 0.99 },
      ],
      result: [],
      windowSize: 1,
    };
  }

  noSwingPoint_Ascending(): SwingPointAnalysis {
    return {
      data: [
        { x: 1, y: 1 },
        { x: 2, y: 2 },
        { x: 3, y: 3 },
      ],
      result: [],
      windowSize: 1,
    };
  }

  noSwingPoint_Descending(): SwingPointAnalysis {
    return {
      data: [
        { x: 1, y: 3 },
        { x: 2, y: 2 },
        { x: 3, y: 1 },
      ],
      result: [],
      windowSize: 1,
    };
  }

  plateauToUpward(): SwingPointAnalysis {
    return {
      data: [
        { x: 1, y: 2 },
        { x: 2, y: 2 },
        { x: 3, y: 3 },
      ],
      result: [{ point: { x: 2, y: 2 }, swingPointType: 'plateauToUpward' }],
      windowSize: 1,
    };
  }

  plateauToDownward(): SwingPointAnalysis {
    return {
      data: [
        { x: 1, y: 2 },
        { x: 2, y: 2 },
        { x: 3, y: 1 },
      ],
      result: [{ point: { x: 2, y: 2 }, swingPointType: 'plateauToDownward' }],
      windowSize: 1,
    };
  }

  upwardToPlateau(): SwingPointAnalysis {
    return {
      data: [
        { x: 1, y: 1 },
        { x: 2, y: 2 },
        { x: 3, y: 2 },
      ],
      result: [{ point: { x: 2, y: 2 }, swingPointType: 'upwardToPlateau' }],
      windowSize: 1,
    };
  }

  downwardToPlateau(): SwingPointAnalysis {
    return {
      data: [
        { x: 1, y: 3 },
        { x: 2, y: 2 },
        { x: 3, y: 2 },
      ],
      result: [{ point: { x: 2, y: 2 }, swingPointType: 'downwardToPlateau' }],
      windowSize: 1,
    };
  }

  singleSwingHighWindow(): SwingPointAnalysis {
    return {
      data: [
        { x: 1, y: 6 },
        { x: 2, y: 2 },
        { x: 3, y: 4 },
        { x: 4, y: 2 },
        { x: 5, y: 5 },
        { x: 6, y: 2 },
        { x: 7, y: 3 },
        { x: 8, y: 4 },
        { x: 9, y: 2 },
      ],
      result: [
        {
          swingPointType: 'swingHigh',
          point: { x: 5, y: 5 },
        },
      ],
      windowSize: 3,
    };
  }

  swingHighWindow3_centeredPeak(): SwingPointAnalysis {
    return {
      data: [
        { x: 1, y: 1 },
        { x: 2, y: 2 },
        { x: 3, y: 3 },
        { x: 4, y: 10 }, // swing high
        { x: 5, y: 3 },
        { x: 6, y: 2 },
        { x: 7, y: 1 },
      ],
      result: [{ swingPointType: 'swingHigh', point: { x: 4, y: 10 } }],
      windowSize: 3,
    };
  }

  swingLowWindow3_centeredValley(): SwingPointAnalysis {
    return {
      data: [
        { x: 1, y: 10 },
        { x: 2, y: 7 },
        { x: 3, y: 5 },
        { x: 4, y: 1 }, // swing low
        { x: 5, y: 5 },
        { x: 6, y: 7 },
        { x: 7, y: 10 },
      ],
      result: [{ swingPointType: 'swingLow', point: { x: 4, y: 1 } }],
      windowSize: 3,
    };
  }

  swingHighWindow3_noPeak(): SwingPointAnalysis {
    return {
      data: [
        { x: 1, y: 1 },
        { x: 2, y: 2 },
        { x: 3, y: 4 },
        { x: 4, y: 3.1 }, // not highest
        { x: 5, y: 3 },
        { x: 6, y: 2 },
        { x: 7, y: 1 },
      ],
      result: [],
      windowSize: 3,
    };
  }

  swingLowWindow3_noValley(): SwingPointAnalysis {
    return {
      data: [
        { x: 1, y: 10 },
        { x: 2, y: 7 },
        { x: 3, y: 5 },
        { x: 4, y: 4.9 }, // not lowest
        { x: 5, y: 4.8 },
        { x: 6, y: 7 },
        { x: 7, y: 10 },
      ],
      result: [],
      windowSize: 3,
    };
  }
  // -------------------------------------------- //

  upwardToPlateau_window2(): SwingPointAnalysis {
    return {
      data: [
        { x: 0, y: 5 },
        { x: 1, y: 6 },
        { x: 2, y: 10 },
        { x: 3, y: 12 },
        { x: 4, y: 15 },
        { x: 5, y: 15.05 },
        { x: 6, y: 14.95 },
        { x: 7, y: 18 },
        { x: 8, y: 19 },
      ],
      result: [{ swingPointType: 'upwardToPlateau', point: { x: 4, y: 15 } }],
      windowSize: 2,
    };
  }

  downwardToPlateau_window2(): SwingPointAnalysis {
    return {
      data: [
        { x: 0, y: 25 },
        { x: 1, y: 24 },
        { x: 2, y: 20 },
        { x: 3, y: 18 },
        { x: 4, y: 15 },
        { x: 5, y: 15.05 },
        { x: 6, y: 14.95 },
        { x: 7, y: 12 },
        { x: 8, y: 11 },
      ],
      result: [{ swingPointType: 'downwardToPlateau', point: { x: 4, y: 15 } }],
      windowSize: 2,
    };
  }

  plateauToUpward_window2(): SwingPointAnalysis {
    return {
      data: [
        { x: 0, y: 5 },
        { x: 1, y: 6 },
        { x: 2, y: 9.95 },
        { x: 3, y: 10.05 },
        { x: 4, y: 10 },
        { x: 5, y: 12 },
        { x: 6, y: 14 },
        { x: 7, y: 18 },
        { x: 8, y: 19 },
      ],
      result: [
        { swingPointType: 'upwardToPlateau', point: { x: 2, y: 9.95 } },
        { swingPointType: 'plateauToUpward', point: { x: 4, y: 10 } },
      ],
      windowSize: 2,
    };
  }

  plateauToDownward_window2(): SwingPointAnalysis {
    return {
      data: [
        { x: 0, y: 20 },
        { x: 1, y: 19 },
        { x: 2, y: 15.05 },
        { x: 3, y: 14.95 },
        { x: 4, y: 15 },
        { x: 5, y: 13 },
        { x: 6, y: 11 },
        { x: 7, y: 8 },
        { x: 8, y: 7 },
      ],
      result: [{ swingPointType: 'plateauToDownward', point: { x: 4, y: 15 } }],
      windowSize: 2,
    };
  }

  upwardToPlateau_window2_trendFail(): SwingPointAnalysis {
    return {
      data: [
        { x: 0, y: 5 },
        { x: 1, y: 6 },
        { x: 2, y: 11.5 },
        { x: 3, y: 12 },
        { x: 4, y: 15 },
        { x: 5, y: 15.05 },
        { x: 6, y: 14.95 },
        { x: 7, y: 18 },
        { x: 8, y: 19 },
      ],
      result: [],
      windowSize: 2,
    };
  }

  upwardToPlateau_window2_plateauFail(): SwingPointAnalysis {
    return {
      data: [
        { x: 0, y: 5 },
        { x: 1, y: 6 },
        { x: 2, y: 10 },
        { x: 3, y: 12 },
        { x: 4, y: 15 },
        { x: 5, y: 15.05 },
        { x: 6, y: 17 },
        { x: 7, y: 18 },
        { x: 8, y: 19 },
      ],
      result: [],
      windowSize: 2,
    };
  }

  plateauToUpward_window1_but_fails_window2(): SwingPointAnalysis {
    return {
      data: [
        { x: 0, y: 1 },
        { x: 1, y: 1.5 },
        { x: 2, y: 2 },
        { x: 3, y: 2 },
        { x: 4, y: 3 },
        { x: 5, y: 4 },
        { x: 6, y: 5 },
      ],
      result: [],

      windowSize: 2,
    };
  }
}
