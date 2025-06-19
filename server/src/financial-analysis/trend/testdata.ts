import { DataPoint } from '../../digital-signal-processing/digital-signal-processing.interface';
import {
  EnrichedDataPoint,
  SwingPointType,
} from '../../digital-signal-processing/dto/enriched-data-point/enriched-data-point';
import { TrendTestCase } from './trend.spec';

export class TrendTestData {
  private createEnrichedDataPoint(
    dataPoint: DataPoint<number>,
    type: SwingPointType | null,
  ) {
    const enrichedDataPoint = new EnrichedDataPoint(dataPoint);
    if (type) {
      enrichedDataPoint.setSwingPointType(type);
    }
    return enrichedDataPoint;
  }
  /**
   * Weniger als die Mindestanzahl an SwingPoints (z.B. 2)
   */
  lessThanMinSwingPoints(): EnrichedDataPoint[] {
    return [
      this.createEnrichedDataPoint({ x: 1, y: 1 }, 'swingHigh'),
      this.createEnrichedDataPoint({ x: 2, y: 2 }, 'swingLow'),
      this.createEnrichedDataPoint({ x: 3, y: 3 }, null),
    ];
  }

  /**
   * Genau die Mindestanzahl an SwingPoints (z.B. 3)
   */
  minSwingPoints(): EnrichedDataPoint[] {
    return [
      this.createEnrichedDataPoint({ x: 1, y: 1 }, 'swingHigh'),
      this.createEnrichedDataPoint({ x: 2, y: 2 }, 'swingLow'),
      this.createEnrichedDataPoint({ x: 3, y: 3 }, 'swingHigh'),
      this.createEnrichedDataPoint({ x: 4, y: 4 }, null),
    ];
  }

  /**
   * Mehr als die Mindestanzahl an SwingPoints (z.B. 4)
   */
  moreThanMinSwingPoints(): EnrichedDataPoint[] {
    return [
      this.createEnrichedDataPoint({ x: 1, y: 1 }, 'swingHigh'),
      this.createEnrichedDataPoint({ x: 2, y: 2 }, 'swingLow'),
      this.createEnrichedDataPoint({ x: 3, y: 3 }, 'swingHigh'),
      this.createEnrichedDataPoint({ x: 4, y: 4 }, 'swingLow'),
    ];
  }

  upwardTrend(): TrendTestCase {
    return {
      name: 'upward trend',
      testcase: {
        data: [
          this.createEnrichedDataPoint({ x: 1, y: 1 }, 'swingLow'),
          this.createEnrichedDataPoint({ x: 2, y: 2 }, 'swingHigh'),
          this.createEnrichedDataPoint({ x: 3, y: 3 }, 'swingLow'),
        ],
        expectedTrend: [
          { index: 0, type: 'upward' },
          { index: 1, type: 'upward' },
          { index: 2, type: 'upward' },
        ],
        settings: { relativeThreshold: 0.01 },
      },
    };
  }

  downwardTrend(): TrendTestCase {
    return {
      name: 'downward trend',
      testcase: {
        data: [
          this.createEnrichedDataPoint({ x: 1, y: 3 }, 'swingHigh'),
          this.createEnrichedDataPoint({ x: 2, y: 2 }, 'swingLow'),
          this.createEnrichedDataPoint({ x: 3, y: 1 }, 'swingHigh'),
        ],
        expectedTrend: [
          { index: 0, type: 'downward' },
          { index: 1, type: 'downward' },
          { index: 2, type: 'downward' },
        ],
        settings: { relativeThreshold: 0.01 },
      },
    };
  }

  // Aufwärtstrend hat sich nicht bestätigt
  upwardTrendNotConfirmed(): TrendTestCase {
    return {
      name: 'upward trend not confirmed',
      testcase: {
        data: [
          this.createEnrichedDataPoint({ x: 1, y: 2 }, 'swingLow'),
          this.createEnrichedDataPoint({ x: 2, y: 3 }, 'swingHigh'),
          this.createEnrichedDataPoint({ x: 3, y: 1 }, 'swingLow'),
        ],
        expectedTrend: [],
        settings: { relativeThreshold: 0.01 },
      },
    };
  }

  // Abwärtstrend hat sich nicht bestätigt
  downwardTrendNotConfirmed(): TrendTestCase {
    return {
      name: 'downward trend not confirmed',
      testcase: {
        data: [
          this.createEnrichedDataPoint({ x: 1, y: 3 }, 'swingHigh'),
          this.createEnrichedDataPoint({ x: 2, y: 2 }, 'swingLow'),
          this.createEnrichedDataPoint({ x: 3, y: 4 }, 'swingHigh'),
        ],
        expectedTrend: [],
        settings: { relativeThreshold: 0.01 },
      },
    };
  }
  // Aufwärtstrend hat sich nicht bestätigt - Grenzfall
  upwardTrendNotConfirmedEdgeCase(): TrendTestCase {
    return {
      name: 'upward trend not confirmed edge case',
      testcase: {
        data: [
          this.createEnrichedDataPoint({ x: 1, y: 2 }, 'swingLow'),
          this.createEnrichedDataPoint({ x: 2, y: 3 }, 'swingHigh'),
          this.createEnrichedDataPoint({ x: 3, y: 2 }, 'swingLow'),
        ],
        expectedTrend: [],
        settings: { relativeThreshold: 0.01 },
      },
    };
  }

  // Abwärtstrend hat sich nicht bestätigt - Grenzfall
  downwardTrendNotConfirmedEdgeCase(): TrendTestCase {
    return {
      name: 'downward trend not confirmed edge case',
      testcase: {
        data: [
          this.createEnrichedDataPoint({ x: 1, y: 3 }, 'swingHigh'),
          this.createEnrichedDataPoint({ x: 2, y: 2 }, 'swingLow'),
          this.createEnrichedDataPoint({ x: 3, y: 3 }, 'swingHigh'),
        ],
        expectedTrend: [],
        settings: { relativeThreshold: 0.01 },
      },
    };
  }

  // Aufwärtstrend bis Ende Datenreihe
  upwardTrendInfinite(): TrendTestCase {
    return {
      name: 'upward trend infinite',
      testcase: {
        data: [
          this.createEnrichedDataPoint({ x: 1, y: 1 }, 'swingLow'),
          this.createEnrichedDataPoint({ x: 2, y: 2 }, 'swingHigh'),
          this.createEnrichedDataPoint({ x: 3, y: 3 }, 'swingLow'),
          this.createEnrichedDataPoint({ x: 4, y: 4 }, null),
          this.createEnrichedDataPoint({ x: 5, y: 5 }, null),
          this.createEnrichedDataPoint({ x: 6, y: 6 }, null),
          this.createEnrichedDataPoint({ x: 7, y: 7 }, null),
        ],
        expectedTrend: [
          { index: 0, type: 'upward' },
          { index: 1, type: 'upward' },
          { index: 2, type: 'upward' },
          { index: 3, type: 'upward' },
          { index: 4, type: 'upward' },
          { index: 5, type: 'upward' },
          { index: 6, type: 'upward' },
        ],
        settings: { relativeThreshold: 0.01 },
      },
    };
  }

  // Abwärtstrend bis Ende Datenreihe
  downwardTrendInfinite(): TrendTestCase {
    return {
      name: 'downward trend infinite',
      testcase: {
        data: [
          this.createEnrichedDataPoint({ x: 1, y: 3 }, 'swingHigh'),
          this.createEnrichedDataPoint({ x: 2, y: 2 }, 'swingLow'),
          this.createEnrichedDataPoint({ x: 3, y: 1 }, 'swingHigh'),
          this.createEnrichedDataPoint({ x: 4, y: 4 }, null),
          this.createEnrichedDataPoint({ x: 5, y: 5 }, null),
          this.createEnrichedDataPoint({ x: 6, y: 6 }, null),
          this.createEnrichedDataPoint({ x: 7, y: 7 }, null),
        ],
        expectedTrend: [
          { index: 0, type: 'downward' },
          { index: 1, type: 'downward' },
          { index: 2, type: 'downward' },
          { index: 3, type: 'downward' },
          { index: 4, type: 'downward' },
          { index: 5, type: 'downward' },
          { index: 6, type: 'downward' },
        ],
        settings: { relativeThreshold: 0.01 },
      },
    };
  }

  // Fortgesetzter Aufwärtstrend ohne Endpunkt (Resultat ohne Endpunkt)
  upwardTrendContinuesWithoutEndpoint(): TrendTestCase {
    return {
      name: 'upward trend continues without endpoint',
      testcase: {
        data: [
          this.createEnrichedDataPoint({ x: 1, y: 1 }, 'swingLow'),
          this.createEnrichedDataPoint({ x: 2, y: 2 }, 'swingHigh'),
          this.createEnrichedDataPoint({ x: 3, y: 3 }, 'swingLow'),
          this.createEnrichedDataPoint({ x: 4, y: 4 }, 'swingHigh'),
          this.createEnrichedDataPoint({ x: 5, y: 4 }, 'swingLow'),
          this.createEnrichedDataPoint({ x: 6, y: 5 }, 'swingHigh'),
        ],
        expectedTrend: [
          { index: 0, type: 'upward' },
          { index: 1, type: 'upward' },
          { index: 2, type: 'upward' },
          { index: 3, type: 'upward' },
          { index: 4, type: 'upward' },
          { index: 5, type: 'upward' },
        ],
        settings: { relativeThreshold: 0.01 },
      },
    };
  }

  // Fortgesetzter Aufwärtstrend, der mit tieferem Tief und tieferem Hoch endet
  upwardTrendBreaksWithLowerLowAndLowerHigh(): TrendTestCase {
    return {
      name: 'upward trend breaks with lower low and lower high',
      testcase: {
        data: [
          this.createEnrichedDataPoint({ x: 1, y: 1 }, 'swingLow'),
          this.createEnrichedDataPoint({ x: 2, y: 3 }, 'swingHigh'),
          this.createEnrichedDataPoint({ x: 3, y: 2 }, 'swingLow'), // Confirmed Up
          this.createEnrichedDataPoint({ x: 4, y: 4 }, 'swingHigh'), // Continuation (Peak)
          this.createEnrichedDataPoint({ x: 5, y: 1 }, 'swingLow'), // WARNING: tieferes Tief
          this.createEnrichedDataPoint({ x: 6, y: 3 }, 'swingHigh'), // BROKEN: tieferes Hoch
        ],
        expectedTrend: [
          { index: 0, type: 'upward' },
          { index: 1, type: 'upward' },
          { index: 2, type: 'upward' },
          { index: 3, type: 'upward' },
        ],
        settings: { relativeThreshold: 0.01 },
      },
    };
  }

  // Fortgesetzter Abwärtstrend ohne Endpunkt (Trend läuft weiter, kein bestätigendes Ende)
  downwardTrendContinuesWithoutEndpoint(): TrendTestCase {
    return {
      name: 'downward trend continues without endpoint',
      testcase: {
        data: [
          this.createEnrichedDataPoint({ x: 1, y: 7 }, 'swingHigh'),
          this.createEnrichedDataPoint({ x: 2, y: 6 }, 'swingLow'),
          this.createEnrichedDataPoint({ x: 3, y: 5 }, 'swingHigh'),
          this.createEnrichedDataPoint({ x: 4, y: 4 }, 'swingLow'),
          this.createEnrichedDataPoint({ x: 5, y: 3 }, 'swingHigh'),
          this.createEnrichedDataPoint({ x: 6, y: 2 }, 'swingLow'),
        ],
        expectedTrend: [
          { index: 0, type: 'downward' },
          { index: 1, type: 'downward' },
          { index: 2, type: 'downward' },
          { index: 3, type: 'downward' },
          { index: 4, type: 'downward' },
          { index: 5, type: 'downward' },
        ],
        settings: { relativeThreshold: 0.01 },
      },
    };
  }

  // Fortgesetzter Abwärtstrend, der mit höherem Hoch und höherem Tief endet (Trend bricht)
  downwardTrendBreaksWithHigherHighAndHigherLow(): TrendTestCase {
    return {
      name: 'downward trend breaks with higher high and higher low',
      testcase: {
        data: [
          this.createEnrichedDataPoint({ x: 1, y: 7 }, 'swingHigh'),
          this.createEnrichedDataPoint({ x: 2, y: 2 }, 'swingLow'),
          this.createEnrichedDataPoint({ x: 3, y: 6 }, 'swingHigh'), // Confirmed Down
          this.createEnrichedDataPoint({ x: 4, y: 1 }, 'swingLow'), // Continuation (Talsohle)
          this.createEnrichedDataPoint({ x: 5, y: 8 }, 'swingHigh'), // WARNING: höheres Hoch
          this.createEnrichedDataPoint({ x: 6, y: 3 }, 'swingLow'), // BROKEN: höheres Tief
        ],
        expectedTrend: [
          { index: 0, type: 'downward' },
          { index: 1, type: 'downward' },
          { index: 2, type: 'downward' },
          { index: 3, type: 'downward' },
        ],
        settings: { relativeThreshold: 0.01 },
      },
    };
  }

  /**
   * Ein Aufwärtstrend wird verletzt (Warning), erholt sich aber wieder.
   */
  upwardTrendRecoversAfterWarning(): TrendTestCase {
    return {
      name: 'upward trend recovers after warning',
      testcase: {
        data: [
          this.createEnrichedDataPoint({ x: 1, y: 10 }, 'swingLow'),
          this.createEnrichedDataPoint({ x: 2, y: 20 }, 'swingHigh'),
          this.createEnrichedDataPoint({ x: 3, y: 12 }, 'swingLow'),
          this.createEnrichedDataPoint({ x: 4, y: 22 }, 'swingHigh'),
          this.createEnrichedDataPoint({ x: 5, y: 11 }, 'swingLow'), // WARNING: tieferes Tief
          this.createEnrichedDataPoint({ x: 6, y: 25 }, 'swingHigh'), // RECOVER: höheres Hoch
          this.createEnrichedDataPoint({ x: 7, y: 15 }, 'swingLow'), // Fortsetzung
        ],
        expectedTrend: [
          { index: 0, type: 'upward' },
          { index: 1, type: 'upward' },
          { index: 2, type: 'upward' },
          { index: 3, type: 'upward' },
          { index: 4, type: 'upward' },
          { index: 5, type: 'upward' },
          { index: 6, type: 'upward' },
        ],
        settings: { relativeThreshold: 0.01 },
      },
    };
  }

  /**
   * Ein Abwärtstrend wird verletzt (Warning), bricht dann aber endgültig.
   * Dieser Test existiert im Grunde schon: downwardTrendBreaksWithHigherHighAndHigherLow
   * Wir benennen ihn hier explizit, um die Logik klarer zu machen.
   */
  downwardTrendBreaksAfterWarning(): TrendTestCase {
    return {
      name: 'downward trend breaks after warning',
      testcase: {
        data: [
          this.createEnrichedDataPoint({ x: 1, y: 20 }, 'swingHigh'),
          this.createEnrichedDataPoint({ x: 2, y: 10 }, 'swingLow'),
          this.createEnrichedDataPoint({ x: 3, y: 18 }, 'swingHigh'), // Confirmed
          this.createEnrichedDataPoint({ x: 4, y: 8 }, 'swingLow'), // Continuation (Talsohle)
          this.createEnrichedDataPoint({ x: 5, y: 19 }, 'swingHigh'), // WARNING: höheres Hoch
          this.createEnrichedDataPoint({ x: 6, y: 9 }, 'swingLow'), // BROKEN: höheres Tief
        ],
        expectedTrend: [
          { index: 0, type: 'downward' },
          { index: 1, type: 'downward' },
          { index: 2, type: 'downward' },
          { index: 3, type: 'downward' },
        ],
        settings: { relativeThreshold: 0.01 },
      },
    };
  }

  /**
   * Ein Abwärtstrend wird verletzt (Warning), erholt sich aber wieder.
   */
  downwardTrendRecoversAfterWarning(): TrendTestCase {
    return {
      name: 'downward trend recovers after warning',
      testcase: {
        data: [
          this.createEnrichedDataPoint({ x: 1, y: 20 }, 'swingHigh'),
          this.createEnrichedDataPoint({ x: 2, y: 10 }, 'swingLow'),
          this.createEnrichedDataPoint({ x: 3, y: 18 }, 'swingHigh'),
          this.createEnrichedDataPoint({ x: 4, y: 8 }, 'swingLow'),
          this.createEnrichedDataPoint({ x: 5, y: 19 }, 'swingHigh'), // WARNING: höheres Hoch
          this.createEnrichedDataPoint({ x: 6, y: 5 }, 'swingLow'), // RECOVER: tieferes Tief
          this.createEnrichedDataPoint({ x: 7, y: 15 }, 'swingHigh'), // Fortsetzung
        ],
        expectedTrend: [
          { index: 0, type: 'downward' },
          { index: 1, type: 'downward' },
          { index: 2, type: 'downward' },
          { index: 3, type: 'downward' },
          { index: 4, type: 'downward' },
          { index: 5, type: 'downward' },
          { index: 6, type: 'downward' },
        ],
        settings: { relativeThreshold: 0.01 },
      },
    };
  }

  /**
   * Ein sauberer Aufwärtstrend wird von einem sauberen Abwärtstrend gefolgt.
   */
  upwardTrendFollowedByDownwardTrend(): TrendTestCase {
    return {
      name: 'upward trend followed by downward trend',
      testcase: {
        data: [
          this.createEnrichedDataPoint({ x: 1, y: 10 }, 'swingLow'),
          this.createEnrichedDataPoint({ x: 2, y: 20 }, 'swingHigh'),
          this.createEnrichedDataPoint({ x: 3, y: 12 }, 'swingLow'),
          this.createEnrichedDataPoint({ x: 4, y: 22 }, 'swingHigh'),
          this.createEnrichedDataPoint({ x: 5, y: 11 }, 'swingLow'),
          this.createEnrichedDataPoint({ x: 6, y: 18 }, 'swingHigh'),
          this.createEnrichedDataPoint({ x: 7, y: 9 }, 'swingLow'),
        ],
        expectedTrend: [
          { index: 0, type: 'upward' },
          { index: 1, type: 'upward' },
          { index: 2, type: 'upward' },
          { index: 3, type: ['upward', 'downward'] },
          { index: 4, type: 'downward' },
          { index: 5, type: 'downward' },
          { index: 6, type: 'downward' },
        ],
        settings: { relativeThreshold: 0.01 },
      },
    };
  }

  /**
   * Ein sauberer Abwärtstrend wird von einem sauberen Aufwärtstrend gefolgt.
   */
  downwardTrendFollowedByUpwardTrend(): TrendTestCase {
    return {
      name: 'downward trend followed by upward trend',
      testcase: {
        data: [
          this.createEnrichedDataPoint({ x: 1, y: 30 }, 'swingHigh'),
          this.createEnrichedDataPoint({ x: 2, y: 20 }, 'swingLow'),
          this.createEnrichedDataPoint({ x: 3, y: 28 }, 'swingHigh'),
          this.createEnrichedDataPoint({ x: 4, y: 18 }, 'swingLow'),
          this.createEnrichedDataPoint({ x: 5, y: 29 }, 'swingHigh'),
          this.createEnrichedDataPoint({ x: 6, y: 21 }, 'swingLow'),
          this.createEnrichedDataPoint({ x: 7, y: 32 }, 'swingHigh'),
        ],
        expectedTrend: [
          { index: 0, type: 'downward' },
          { index: 1, type: 'downward' },
          { index: 2, type: 'downward' },
          { index: 3, type: ['downward', 'upward'] },
          { index: 4, type: 'upward' },
          { index: 5, type: 'upward' },
          { index: 6, type: 'upward' },
        ],
        settings: { relativeThreshold: 0.01 },
      },
    };
  }

  /**
   * Ein Trend bricht, aber es folgt eine unklare "Seitwärtsphase",
   * bevor ein neuer Trend beginnt. Sonderfall, da der neue Trend exakt am
   * bestätigtem Ende des alten Trend startet.
   */
  trendFollowedByChoppyPeriodThenNewTrend(): TrendTestCase {
    return {
      name: 'trend followed by choppy period then new trend. Special Case.',
      testcase: {
        data: [
          // 1. Aufwärtstrend
          this.createEnrichedDataPoint({ x: 1, y: 10 }, 'swingLow'),
          this.createEnrichedDataPoint({ x: 2, y: 20 }, 'swingHigh'),
          this.createEnrichedDataPoint({ x: 3, y: 12 }, 'swingLow'), // Confirmed Up

          // 2. Unklare Phase (bricht den Aufwärtstrend, etabliert aber keinen neuen)
          this.createEnrichedDataPoint({ x: 4, y: 15 }, 'swingHigh'), // Warning: tieferes Hoch
          this.createEnrichedDataPoint({ x: 5, y: 11 }, 'swingLow'), // Broken: tieferes Tief

          // 3. Neuer Abwärtstrend beginnt
          this.createEnrichedDataPoint({ x: 6, y: 16 }, 'swingHigh'), // Start Down
          this.createEnrichedDataPoint({ x: 7, y: 5 }, 'swingLow'),
          this.createEnrichedDataPoint({ x: 8, y: 14 }, 'swingHigh'), // Confirmed Down
        ],
        expectedTrend: [
          { index: 0, type: 'upward' },
          { index: 1, type: 'upward' },
          { index: 2, type: 'upward' },
          { index: 5, type: 'downward' },
          { index: 6, type: 'downward' },
          { index: 7, type: 'downward' },
        ],
        settings: { relativeThreshold: 0.01 },
      },
    };
  }

  /**
   * Ein Trend bricht, gefolgt von einer unklaren "Lücke",
   * bevor ein neuer Trend beginnt.
   */
  trendBreaksFollowedByGapThenNewTrend(): TrendTestCase {
    return {
      name: 'trend followed by choppy period then new trend',
      testcase: {
        data: [
          // 1. Aufwärtstrend wird etabliert
          this.createEnrichedDataPoint({ x: 1, y: 10 }, 'swingLow'),
          this.createEnrichedDataPoint({ x: 2, y: 20 }, 'swingHigh'),
          this.createEnrichedDataPoint({ x: 3, y: 12 }, 'swingLow'), // Confirmed Up, Peak
          // 2. Bruch des Aufwärtstrends
          this.createEnrichedDataPoint({ x: 4, y: 11 }, 'swingHigh'), // Warning
          this.createEnrichedDataPoint({ x: 5, y: 8 }, 'swingLow'), // Broken

          // 3. "GAP": Unklare, chaotische Phase ohne klaren Trend
          this.createEnrichedDataPoint({ x: 6, y: 11 }, 'swingHigh'),
          this.createEnrichedDataPoint({ x: 7, y: 7 }, 'swingLow'),
          this.createEnrichedDataPoint({ x: 8, y: 19 }, 'swingHigh'),
          this.createEnrichedDataPoint({ x: 9, y: 7 }, 'swingLow'),

          // 4. Ein neuer, sauberer Abwärtstrend beginnt hier
          this.createEnrichedDataPoint({ x: 10, y: 25 }, 'swingHigh'), // Start Down
          this.createEnrichedDataPoint({ x: 11, y: 7 }, 'swingLow'),
          this.createEnrichedDataPoint({ x: 12, y: 22 }, 'swingHigh'), // Confirmed Down
        ],
        expectedTrend: [
          { index: 0, type: 'upward' },
          { index: 1, type: 'upward' },
          { index: 2, type: 'upward' },
          { index: 9, type: 'downward' },
          { index: 10, type: 'downward' },
          { index: 11, type: 'downward' },
          { index: 12, type: 'downward' },
        ],
        settings: { relativeThreshold: 0.01 },
      },
    };
  }

  /**
   * Ein Aufwärtstrend wird NICHT bestätigt, weil das zweite Tief
   * zwar höher, aber nicht *signifikant* höher ist.
   * Dies testet: isSignificantlyHigherThan()
   */
  upwardTrendFailsDueToInsufficientlyHigherLow(): TrendTestCase {
    return {
      name: 'should NOT confirm upward trend if low is not significantly higher',
      testcase: {
        data: [
          this.createEnrichedDataPoint({ x: 1, y: 100 }, 'swingLow'),
          this.createEnrichedDataPoint({ x: 2, y: 110 }, 'swingHigh'),
          this.createEnrichedDataPoint({ x: 3, y: 101 }, 'swingLow'),
        ],
        expectedTrend: [],
        settings: { relativeThreshold: 0.01 },
      },
    };
  }

  /**
   * Ein Abwärtstrend wird NICHT bestätigt, weil das zweite Hoch
   * zwar tiefer, aber nicht *signifikant* tiefer ist.
   * Dies testet: isSignificantlyLowerThan()
   */
  downwardTrendFailsDueToInsufficientlyLowerHigh(): TrendTestCase {
    return {
      name: 'should NOT confirm downward trend if high is not significantly lower',
      testcase: {
        data: [
          this.createEnrichedDataPoint({ x: 1, y: 100 }, 'swingHigh'),
          this.createEnrichedDataPoint({ x: 2, y: 90 }, 'swingLow'),
          this.createEnrichedDataPoint({ x: 3, y: 99 }, 'swingHigh'),
        ],
        expectedTrend: [],
        settings: { relativeThreshold: 0.01 },
      },
    };
  }

  /**
   * Ein laufender Aufwärtstrend bricht, weil ein neues Hoch
   * nicht signifikant höher ist (Stagnation).
   * Dies testet die Fortsetzungslogik.
   */
  upwardTrendBreaksDueToStallingHigh(): TrendTestCase {
    return {
      name: 'should BREAK upward trend if new high is not significantly higher',
      testcase: {
        data: [
          this.createEnrichedDataPoint({ x: 1, y: 100 }, 'swingLow'),
          this.createEnrichedDataPoint({ x: 2, y: 110 }, 'swingHigh'),
          this.createEnrichedDataPoint({ x: 3, y: 105 }, 'swingLow'), // Confirmed
          this.createEnrichedDataPoint({ x: 4, y: 115 }, 'swingHigh'), // Continuation, Peak
          this.createEnrichedDataPoint({ x: 5, y: 108 }, 'swingLow'), // Confirmed
          this.createEnrichedDataPoint({ x: 6, y: 116 }, 'swingHigh'), // WARNING: stagnating High
          this.createEnrichedDataPoint({ x: 7, y: 109 }, 'swingLow'), // WARNING: stagnating Low
        ],
        expectedTrend: [
          { index: 0, type: 'upward' },
          { index: 1, type: 'upward' },
          { index: 2, type: 'upward' },
          { index: 3, type: 'upward' },
          { index: 4, type: 'upward' },
        ],
        settings: { relativeThreshold: 0.01 },
      },
    };
  }

  /**
   * Ein laufender Abwärtstrend bricht, weil ein neues Tief
   * nicht signifikant tiefer ist (Stagnation).
   * Dies testet die Fortsetzungslogik.
   */
  downwardTrendBreaksDueToStallingLow(): TrendTestCase {
    return {
      name: 'should BREAK downward trend if new low is not significantly lower',
      testcase: {
        data: [
          // 1. Abwärtstrend wird etabliert
          this.createEnrichedDataPoint({ x: 1, y: 100 }, 'swingHigh'),
          this.createEnrichedDataPoint({ x: 2, y: 90 }, 'swingLow'),
          this.createEnrichedDataPoint({ x: 3, y: 95 }, 'swingHigh'), // Confirmed Down (95 < 100)

          // 2. Trend wird fortgesetzt
          this.createEnrichedDataPoint({ x: 4, y: 85 }, 'swingLow'), // Continuation (Talsohle), da 85 < 90
          this.createEnrichedDataPoint({ x: 5, y: 92 }, 'swingHigh'), // Continuation, da 92 < 95

          // 3. Bruch durch Stagnation
          // 84.5 ist zwar < 85, aber nicht signifikant tiefer. Momentum ist weg -> Warning/Break.
          this.createEnrichedDataPoint({ x: 6, y: 84.5 }, 'swingLow'),
          this.createEnrichedDataPoint({ x: 7, y: 91.5 }, 'swingHigh'),
        ],
        expectedTrend: [
          { index: 0, type: 'downward' },
          { index: 1, type: 'downward' },
          { index: 2, type: 'downward' },
          { index: 3, type: 'downward' },
          { index: 4, type: 'downward' },
        ],
        settings: { relativeThreshold: 0.01 },
      },
    };
  }

  /**
   * Ein Seitwärtstrend, bei dem Hochs und Tiefs nahe genug beieinander liegen.
   * Dies testet: isCloseEnough()
   */
  sidewaysTrendRecognizedAsNoUpDownTrend(): TrendTestCase {
    return {
      name: 'should NOT detect up/down trend during sideways movement',
      testcase: {
        data: [
          this.createEnrichedDataPoint({ x: 1, y: 99 }, 'swingLow'),
          this.createEnrichedDataPoint({ x: 2, y: 101 }, 'swingHigh'),
          this.createEnrichedDataPoint({ x: 3, y: 99.8 }, 'swingLow'),
          this.createEnrichedDataPoint({ x: 4, y: 101.5 }, 'swingHigh'),
        ],
        expectedTrend: [],
        settings: { relativeThreshold: 0.01 },
      },
    };
  }
}
