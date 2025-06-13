import { DataPoint } from '../../digital-signal-processing/digital-signal-processing.interface';
import { SwingPointData } from '../../digital-signal-processing/swing-points/swing-points.interface';
import { TrendData } from './trend.interface';

export class TrendTestData {
  /**
   * Weniger als die Mindestanzahl an SwingPoints (z.B. 2)
   */
  lessThanMinSwingPoints(): SwingPointData[] {
    return [
      { swingPointType: 'swingHigh', point: { x: 1, y: 1 } },
      { swingPointType: 'swingLow', point: { x: 2, y: 2 } },
    ];
  }

  /**
   * Genau die Mindestanzahl an SwingPoints (z.B. 3)
   */
  minSwingPoints(): SwingPointData[] {
    return [
      { swingPointType: 'swingHigh', point: { x: 1, y: 1 } },
      { swingPointType: 'swingLow', point: { x: 2, y: 2 } },
      { swingPointType: 'swingHigh', point: { x: 3, y: 3 } },
    ];
  }

  /**
   * Mehr als die Mindestanzahl an SwingPoints (z.B. 4)
   */
  moreThanMinSwingPoints(): SwingPointData[] {
    return [
      { swingPointType: 'swingHigh', point: { x: 1, y: 1 } },
      { swingPointType: 'swingLow', point: { x: 2, y: 2 } },
      { swingPointType: 'swingHigh', point: { x: 3, y: 3 } },
      { swingPointType: 'swingLow', point: { x: 4, y: 4 } },
    ];
  }

  /**
   * Datenpunkte für die Tests (mindestens MIN_SWING_POINTS)
   */
  minDataPoints(): DataPoint[] {
    return [
      { x: 1, y: 1 },
      { x: 2, y: 2 },
      { x: 3, y: 3 },
    ];
  }

  /**
   * Datenpunkte für die Tests (mehr als MIN_SWING_POINTS)
   */
  moreThanMinDataPoints(): DataPoint[] {
    return [
      { x: 1, y: 1 },
      { x: 2, y: 2 },
      { x: 3, y: 3 },
      { x: 4, y: 4 },
    ];
  }

  /**
   * Zu wenige Datenpunkte (weniger als MIN_SWING_POINTS)
   */
  lessThanMinDataPoints(): DataPoint[] {
    return [
      { x: 1, y: 1 },
      { x: 2, y: 2 },
    ];
  }

  // Aufwärtstrend
  upwardTrend(): {
    swingPoints: SwingPointData[];
    data: DataPoint[];
    result: TrendData[];
  } {
    return {
      swingPoints: [
        { swingPointType: 'swingLow', point: { x: 1, y: 1 } },
        { swingPointType: 'swingHigh', point: { x: 2, y: 2 } },
        { swingPointType: 'swingLow', point: { x: 3, y: 3 } },
      ],
      data: [
        { x: 1, y: 1 },
        { x: 2, y: 2 },
        { x: 3, y: 3 },
      ],
      result: [
        {
          trendType: 'upward',
          startPoint: { x: 1, y: 1 },
          endPoint: { x: 3, y: 3 },
        },
      ],
    };
  }

  // Abwärtstrend
  downwardTrend(): {
    swingPoints: SwingPointData[];
    data: DataPoint[];
    result: TrendData[];
  } {
    return {
      swingPoints: [
        { swingPointType: 'swingHigh', point: { x: 1, y: 3 } },
        { swingPointType: 'swingLow', point: { x: 2, y: 2 } },
        { swingPointType: 'swingHigh', point: { x: 3, y: 1 } },
      ],
      data: [
        { x: 1, y: 3 },
        { x: 2, y: 2 },
        { x: 3, y: 1 },
      ],
      result: [
        {
          trendType: 'downward',
          startPoint: { x: 1, y: 3 },
          endPoint: { x: 3, y: 1 },
        },
      ],
    };
  }

  // Aufwärtstrend hat sich nicht bestätigt
  upwardTrendNotConfirmed(): {
    swingPoints: SwingPointData[];
    data: DataPoint[];
    result: TrendData[];
  } {
    return {
      swingPoints: [
        { swingPointType: 'swingLow', point: { x: 1, y: 2 } },
        { swingPointType: 'swingHigh', point: { x: 2, y: 3 } },
        { swingPointType: 'swingLow', point: { x: 3, y: 1 } },
      ],
      data: [
        { x: 1, y: 2 },
        { x: 2, y: 3 },
        { x: 3, y: 1 },
      ],
      result: [],
    };
  }

  // Abwärtstrend hat sich nicht bestätigt
  downwardTrendNotConfirmed(): {
    swingPoints: SwingPointData[];
    data: DataPoint[];
    result: TrendData[];
  } {
    return {
      swingPoints: [
        { swingPointType: 'swingHigh', point: { x: 1, y: 3 } },
        { swingPointType: 'swingLow', point: { x: 2, y: 2 } },
        { swingPointType: 'swingHigh', point: { x: 3, y: 4 } },
      ],
      data: [
        { x: 1, y: 3 },
        { x: 2, y: 2 },
        { x: 3, y: 4 },
      ],
      result: [],
    };
  }
  // Aufwärtstrend hat sich nicht bestätigt - Grenzfall
  upwardTrendNotConfirmedEdgeCase(): {
    swingPoints: SwingPointData[];
    data: DataPoint[];
    result: TrendData[];
  } {
    return {
      swingPoints: [
        { swingPointType: 'swingLow', point: { x: 1, y: 2 } },
        { swingPointType: 'swingHigh', point: { x: 2, y: 3 } },
        { swingPointType: 'swingLow', point: { x: 3, y: 2 } },
      ],
      data: [
        { x: 1, y: 2 },
        { x: 2, y: 3 },
        { x: 3, y: 2 },
      ],
      result: [],
    };
  }

  // Abwärtstrend hat sich nicht bestätigt - Grenzfall
  downwardTrendNotConfirmedEdgeCase(): {
    swingPoints: SwingPointData[];
    data: DataPoint[];
    result: TrendData[];
  } {
    return {
      swingPoints: [
        { swingPointType: 'swingHigh', point: { x: 1, y: 3 } },
        { swingPointType: 'swingLow', point: { x: 2, y: 2 } },
        { swingPointType: 'swingHigh', point: { x: 3, y: 3 } },
      ],
      data: [
        { x: 1, y: 3 },
        { x: 2, y: 2 },
        { x: 3, y: 3 },
      ],
      result: [],
    };
  }

  // Aufwärtstrend bis Ende Datenreihe
  upwardTrendInfinite(): {
    swingPoints: SwingPointData[];
    data: DataPoint[];
    result: TrendData[];
  } {
    return {
      swingPoints: [
        { swingPointType: 'swingLow', point: { x: 1, y: 1 } },
        { swingPointType: 'swingHigh', point: { x: 2, y: 2 } },
        { swingPointType: 'swingLow', point: { x: 3, y: 3 } },
      ],
      data: [
        { x: 1, y: 1 },
        { x: 2, y: 2 },
        { x: 3, y: 3 },
        { x: 4, y: 4 },
        { x: 5, y: 5 },
        { x: 6, y: 6 },
        { x: 7, y: 7 },
      ],
      result: [
        {
          trendType: 'upward',
          startPoint: { x: 1, y: 1 },
          endPoint: { x: 7, y: 7 },
        },
      ],
    };
  }

  // Abwärtstrend bis Ende Datenreihe
  downwardTrendInfinite(): {
    swingPoints: SwingPointData[];
    data: DataPoint[];
    result: TrendData[];
  } {
    return {
      swingPoints: [
        { swingPointType: 'swingHigh', point: { x: 1, y: 3 } },
        { swingPointType: 'swingLow', point: { x: 2, y: 2 } },
        { swingPointType: 'swingHigh', point: { x: 3, y: 1 } },
      ],
      data: [
        { x: 1, y: 3 },
        { x: 2, y: 2 },
        { x: 3, y: 1 },
        { x: 4, y: 4 },
        { x: 5, y: 5 },
        { x: 6, y: 6 },
        { x: 7, y: 7 },
      ],
      result: [
        {
          trendType: 'downward',
          startPoint: { x: 1, y: 3 },
          endPoint: { x: 7, y: 7 },
        },
      ],
    };
  }

  // Fortgesetzter Aufwärtstrend ohne Endpunkt (Resultat ohne Endpunkt)
  upwardTrendContinuesWithoutEndpoint(): {
    swingPoints: SwingPointData[];
    data: DataPoint[];
    result: TrendData[];
  } {
    return {
      swingPoints: [
        { swingPointType: 'swingLow', point: { x: 1, y: 1 } },
        { swingPointType: 'swingHigh', point: { x: 2, y: 2 } },
        { swingPointType: 'swingLow', point: { x: 3, y: 3 } },
        { swingPointType: 'swingHigh', point: { x: 4, y: 4 } },
        { swingPointType: 'swingLow', point: { x: 5, y: 4 } },
        { swingPointType: 'swingHigh', point: { x: 6, y: 5 } },
        // Trend läuft weiter, kein bestätigendes Ende
      ],
      data: [
        { x: 1, y: 1 },
        { x: 2, y: 2 },
        { x: 3, y: 3 },
        { x: 4, y: 4 },
        { x: 5, y: 4 },
        { x: 6, y: 5 },
      ],
      result: [
        {
          trendType: 'upward',
          startPoint: { x: 1, y: 1 },
          endPoint: { x: 6, y: 5 },
        },
      ],
    };
  }

  // Fortgesetzter Aufwärtstrend, der mit tieferem Tief und tieferem Hoch endet
  upwardTrendBreaksWithLowerLowAndLowerHigh(): {
    swingPoints: SwingPointData[];
    data: DataPoint[];
    result: TrendData[];
  } {
    return {
      swingPoints: [
        { swingPointType: 'swingLow', point: { x: 1, y: 1 } },
        { swingPointType: 'swingHigh', point: { x: 2, y: 3 } },
        { swingPointType: 'swingLow', point: { x: 3, y: 2 } }, // Confirmed Up
        { swingPointType: 'swingHigh', point: { x: 4, y: 4 } }, // Continuation (Peak)
        { swingPointType: 'swingLow', point: { x: 5, y: 1 } }, // WARNING: tieferes Tief
        { swingPointType: 'swingHigh', point: { x: 6, y: 3 } }, // BROKEN: tieferes Hoch
      ],
      data: [
        { x: 1, y: 1 },
        { x: 2, y: 3 },
        { x: 3, y: 2 },
        { x: 4, y: 4 },
        { x: 5, y: 1 },
        { x: 6, y: 3 },
      ],
      result: [
        {
          trendType: 'upward',
          startPoint: { x: 1, y: 1 },
          endPoint: { x: 4, y: 4 },
        },
      ],
    };
  }

  // Fortgesetzter Abwärtstrend ohne Endpunkt (Trend läuft weiter, kein bestätigendes Ende)
  downwardTrendContinuesWithoutEndpoint(): {
    swingPoints: SwingPointData[];
    data: DataPoint[];
    result: TrendData[];
  } {
    return {
      swingPoints: [
        { swingPointType: 'swingHigh', point: { x: 1, y: 7 } },
        { swingPointType: 'swingLow', point: { x: 2, y: 6 } },
        { swingPointType: 'swingHigh', point: { x: 3, y: 5 } },
        { swingPointType: 'swingLow', point: { x: 4, y: 4 } },
        { swingPointType: 'swingHigh', point: { x: 5, y: 3 } },
        { swingPointType: 'swingLow', point: { x: 6, y: 2 } },
        // Trend läuft weiter, kein bestätigendes Ende
      ],
      data: [
        { x: 1, y: 7 },
        { x: 2, y: 6 },
        { x: 3, y: 5 },
        { x: 4, y: 4 },
        { x: 5, y: 3 },
        { x: 6, y: 2 },
      ],
      result: [
        {
          trendType: 'downward',
          startPoint: { x: 1, y: 7 },
          endPoint: { x: 6, y: 2 },
        },
      ],
    };
  }

  // Fortgesetzter Abwärtstrend, der mit höherem Hoch und höherem Tief endet (Trend bricht)
  downwardTrendBreaksWithHigherHighAndHigherLow(): {
    swingPoints: SwingPointData[];
    data: DataPoint[];
    result: TrendData[];
  } {
    return {
      swingPoints: [
        { swingPointType: 'swingHigh', point: { x: 1, y: 7 } },
        { swingPointType: 'swingLow', point: { x: 2, y: 2 } },
        { swingPointType: 'swingHigh', point: { x: 3, y: 6 } }, // Confirmed Down
        { swingPointType: 'swingLow', point: { x: 4, y: 1 } }, // Continuation (Talsohle)
        { swingPointType: 'swingHigh', point: { x: 5, y: 8 } }, // WARNING: höheres Hoch
        { swingPointType: 'swingLow', point: { x: 6, y: 3 } }, // BROKEN: höheres Tief
      ],
      data: [
        { x: 1, y: 7 },
        { x: 2, y: 2 },
        { x: 3, y: 6 },
        { x: 4, y: 1 },
        { x: 5, y: 8 },
        { x: 6, y: 3 },
      ],
      result: [
        {
          trendType: 'downward',
          startPoint: { x: 1, y: 7 },
          endPoint: { x: 4, y: 1 },
        },
      ],
    };
  }

  /**
   * Ein Aufwärtstrend wird verletzt (Warning), erholt sich aber wieder.
   */
  upwardTrendRecoversAfterWarning(): {
    swingPoints: SwingPointData[];
    data: DataPoint[];
    result: TrendData[];
  } {
    return {
      swingPoints: [
        { swingPointType: 'swingLow', point: { x: 1, y: 10 } }, // Start
        { swingPointType: 'swingHigh', point: { x: 2, y: 20 } },
        { swingPointType: 'swingLow', point: { x: 3, y: 12 } }, // Confirmed
        { swingPointType: 'swingHigh', point: { x: 4, y: 22 } },
        { swingPointType: 'swingLow', point: { x: 5, y: 11 } }, // WARNING: tieferes Tief
        { swingPointType: 'swingHigh', point: { x: 6, y: 25 } }, // RECOVER: höheres Hoch
        { swingPointType: 'swingLow', point: { x: 7, y: 15 } }, // Fortsetzung
      ],
      data: [
        { x: 1, y: 10 },
        { x: 2, y: 20 },
        { x: 3, y: 12 },
        { x: 4, y: 22 },
        { x: 5, y: 11 },
        { x: 6, y: 25 },
        { x: 7, y: 15 },
      ],
      result: [
        {
          trendType: 'upward',
          startPoint: { x: 1, y: 10 },
          endPoint: { x: 7, y: 15 },
        },
      ],
    };
  }

  /**
   * Ein Abwärtstrend wird verletzt (Warning), bricht dann aber endgültig.
   * Dieser Test existiert im Grunde schon: downwardTrendBreaksWithHigherHighAndHigherLow
   * Wir benennen ihn hier explizit, um die Logik klarer zu machen.
   */
  downwardTrendBreaksAfterWarning(): {
    swingPoints: SwingPointData[];
    data: DataPoint[];
    result: TrendData[];
  } {
    return {
      swingPoints: [
        { swingPointType: 'swingHigh', point: { x: 1, y: 20 } }, // Start
        { swingPointType: 'swingLow', point: { x: 2, y: 10 } },
        { swingPointType: 'swingHigh', point: { x: 3, y: 18 } }, // Confirmed
        { swingPointType: 'swingLow', point: { x: 4, y: 8 } }, // Continuation (Talsohle)
        { swingPointType: 'swingHigh', point: { x: 5, y: 19 } }, // WARNING: höheres Hoch
        { swingPointType: 'swingLow', point: { x: 6, y: 9 } }, // BROKEN: höheres Tief
      ],
      data: [
        { x: 1, y: 20 },
        { x: 2, y: 10 },
        { x: 3, y: 18 },
        { x: 4, y: 8 },
        { x: 5, y: 19 },
        { x: 6, y: 9 },
      ],
      result: [
        {
          trendType: 'downward',
          startPoint: { x: 1, y: 20 },
          endPoint: { x: 4, y: 8 },
        },
      ],
    };
  }

  /**
   * Ein Abwärtstrend wird verletzt (Warning), erholt sich aber wieder.
   */
  downwardTrendRecoversAfterWarning(): {
    swingPoints: SwingPointData[];
    data: DataPoint[];
    result: TrendData[];
  } {
    return {
      swingPoints: [
        { swingPointType: 'swingHigh', point: { x: 1, y: 20 } }, // Start
        { swingPointType: 'swingLow', point: { x: 2, y: 10 } },
        { swingPointType: 'swingHigh', point: { x: 3, y: 18 } }, // Confirmed
        { swingPointType: 'swingLow', point: { x: 4, y: 8 } },
        { swingPointType: 'swingHigh', point: { x: 5, y: 19 } }, // WARNING: höheres Hoch
        { swingPointType: 'swingLow', point: { x: 6, y: 5 } }, // RECOVER: tieferes Tief
        { swingPointType: 'swingHigh', point: { x: 7, y: 15 } }, // Fortsetzung
      ],
      data: [
        { x: 1, y: 20 },
        { x: 2, y: 10 },
        { x: 3, y: 18 },
        { x: 4, y: 8 },
        { x: 5, y: 19 },
        { x: 6, y: 5 },
        { x: 7, y: 15 },
      ],
      result: [
        {
          trendType: 'downward',
          startPoint: { x: 1, y: 20 },
          // Der Trend wurde nie gebrochen und läuft bis zum Ende
          endPoint: { x: 7, y: 15 },
        },
      ],
    };
  }

  /**
   * Ein sauberer Aufwärtstrend wird von einem sauberen Abwärtstrend gefolgt.
   */
  upwardTrendFollowedByDownwardTrend(): {
    swingPoints: SwingPointData[];
    data: DataPoint[];
    result: TrendData[];
  } {
    return {
      swingPoints: [
        // 1. Aufwärtstrend wird etabliert
        { swingPointType: 'swingLow', point: { x: 1, y: 10 } }, // Start Up
        { swingPointType: 'swingHigh', point: { x: 2, y: 20 } },
        { swingPointType: 'swingLow', point: { x: 3, y: 12 } }, // Confirmed Up
        { swingPointType: 'swingHigh', point: { x: 4, y: 22 } }, // Peak des Aufwärtstrends

        // 2. Bruch des Aufwärtstrends & Start des Abwärtstrends
        { swingPointType: 'swingLow', point: { x: 5, y: 11 } }, // Warning Up & Teil des Down-Musters
        { swingPointType: 'swingHigh', point: { x: 6, y: 18 } }, // Broken Up & Confirmed Down

        // 3. Fortsetzung des Abwärtstrends
        { swingPointType: 'swingLow', point: { x: 7, y: 9 } },
      ],
      data: [
        { x: 1, y: 10 },
        { x: 2, y: 20 },
        { x: 3, y: 12 },
        { x: 4, y: 22 },
        { x: 5, y: 11 },
        { x: 6, y: 18 },
        { x: 7, y: 9 },
      ],
      result: [
        {
          trendType: 'upward',
          startPoint: { x: 1, y: 10 },
          endPoint: { x: 4, y: 22 }, // Der Trend endet am letzten gültigen Hoch
        },
        {
          trendType: 'downward',
          startPoint: { x: 4, y: 22 }, // Der neue Trend startet am Ende des alten
          endPoint: { x: 7, y: 9 }, // Und läuft bis zum Ende der Daten
        },
      ],
    };
  }

  /**
   * Ein sauberer Abwärtstrend wird von einem sauberen Aufwärtstrend gefolgt.
   */
  downwardTrendFollowedByUpwardTrend(): {
    swingPoints: SwingPointData[];
    data: DataPoint[];
    result: TrendData[];
  } {
    return {
      swingPoints: [
        // 1. Abwärtstrend wird etabliert
        { swingPointType: 'swingHigh', point: { x: 1, y: 30 } }, // Start Down
        { swingPointType: 'swingLow', point: { x: 2, y: 20 } },
        { swingPointType: 'swingHigh', point: { x: 3, y: 28 } }, // Confirmed Down
        { swingPointType: 'swingLow', point: { x: 4, y: 18 } }, // Talsohle des Abwärtstrends

        // 2. Bruch des Abwärtstrends & Start des Aufwärtstrends
        { swingPointType: 'swingHigh', point: { x: 5, y: 29 } }, // Warning Down & Teil des Up-Musters
        { swingPointType: 'swingLow', point: { x: 6, y: 21 } }, // Broken Down & Confirmed Up

        // 3. Fortsetzung des Aufwärtstrends
        { swingPointType: 'swingHigh', point: { x: 7, y: 32 } },
      ],
      data: [
        { x: 1, y: 30 },
        { x: 2, y: 20 },
        { x: 3, y: 28 },
        { x: 4, y: 18 },
        { x: 5, y: 29 },
        { x: 6, y: 21 },
        { x: 7, y: 32 },
      ],
      result: [
        {
          trendType: 'downward',
          startPoint: { x: 1, y: 30 },
          endPoint: { x: 4, y: 18 }, // Der Trend endet am letzten gültigen Tief
        },
        {
          trendType: 'upward',
          startPoint: { x: 4, y: 18 }, // Der neue Trend startet am Ende des alten
          endPoint: { x: 7, y: 32 }, // Und läuft bis zum Ende der Daten
        },
      ],
    };
  }

  /**
   * Ein Trend bricht, aber es folgt eine unklare "Seitwärtsphase",
   * bevor ein neuer Trend beginnt.
   */
  trendFollowedByChoppyPeriodThenNewTrend(): {
    swingPoints: SwingPointData[];
    data: DataPoint[];
    result: TrendData[];
  } {
    return {
      swingPoints: [
        // 1. Aufwärtstrend
        { swingPointType: 'swingLow', point: { x: 1, y: 10 } },
        { swingPointType: 'swingHigh', point: { x: 2, y: 20 } },
        { swingPointType: 'swingLow', point: { x: 3, y: 12 } }, // Confirmed Up

        // 2. Unklare Phase (bricht den Aufwärtstrend, etabliert aber keinen neuen)
        { swingPointType: 'swingHigh', point: { x: 4, y: 15 } }, // kein höheres Hoch
        { swingPointType: 'swingLow', point: { x: 5, y: 13 } }, // kein höheres Tief

        // 3. Neuer Abwärtstrend beginnt
        { swingPointType: 'swingHigh', point: { x: 6, y: 16 } }, // Start Down
        { swingPointType: 'swingLow', point: { x: 7, y: 5 } },
        { swingPointType: 'swingHigh', point: { x: 8, y: 14 } }, // Confirmed Down
      ],
      data: [
        { x: 1, y: 10 },
        { x: 2, y: 20 },
        { x: 3, y: 12 },
        { x: 4, y: 15 },
        { x: 5, y: 13 },
        { x: 6, y: 16 },
        { x: 7, y: 5 },
        { x: 8, y: 14 },
      ],
      result: [
        {
          trendType: 'upward',
          startPoint: { x: 1, y: 10 },
          endPoint: { x: 3, y: 12 }, // Endet nach der Bestätigung, da er danach bricht
        },
        {
          trendType: 'downward',
          startPoint: { x: 6, y: 16 },
          endPoint: { x: 8, y: 14 },
        },
      ],
    };
  }
}
