import { DataPoint } from '../digital-signal-processing.interface';
import { SwingPointData } from './swing-points.interface';

type SwingPointAnalysis = {
  data: DataPoint[];
  result: SwingPointData[];
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
    };
  }
}
