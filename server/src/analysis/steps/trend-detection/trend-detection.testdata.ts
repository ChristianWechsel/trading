import { CreateTestData } from '../../../utils/test-utils';
import { EnrichedDataPoint } from '../../core/enriched-data-point';
import { TrendTestCase } from './trend-detection.spec';

export class TrendDetectionTestdata extends CreateTestData {
  /**
   * Weniger als die Mindestanzahl an SwingPoints (z.B. 2)
   */
  lessThanMinSwingPoints(): EnrichedDataPoint[] {
    return [
      this.createEnrichedDataPointWithSwingPoints(
        { priceDate: '1', closePrice: 1 },
        'swingHigh',
      ),
      this.createEnrichedDataPointWithSwingPoints(
        { priceDate: '2', closePrice: 2 },
        'swingLow',
      ),
      this.createEnrichedDataPointWithSwingPoints(
        { priceDate: '3', closePrice: 3 },
        null,
      ),
    ];
  }

  /**
   * Genau die Mindestanzahl an SwingPoints (z.B. 3)
   */
  minSwingPoints(): EnrichedDataPoint[] {
    return [
      this.createEnrichedDataPointWithSwingPoints(
        { priceDate: '1', closePrice: 1 },
        'swingHigh',
      ),
      this.createEnrichedDataPointWithSwingPoints(
        { priceDate: '2', closePrice: 2 },
        'swingLow',
      ),
      this.createEnrichedDataPointWithSwingPoints(
        { priceDate: '3', closePrice: 3 },
        'swingHigh',
      ),
      this.createEnrichedDataPointWithSwingPoints(
        { priceDate: '4', closePrice: 4 },
        null,
      ),
    ];
  }

  /**
   * Mehr als die Mindestanzahl an SwingPoints (z.B. 4)
   */
  moreThanMinSwingPoints(): EnrichedDataPoint[] {
    return [
      this.createEnrichedDataPointWithSwingPoints(
        { priceDate: '1', closePrice: 1 },
        'swingHigh',
      ),
      this.createEnrichedDataPointWithSwingPoints(
        { priceDate: '2', closePrice: 2 },
        'swingLow',
      ),
      this.createEnrichedDataPointWithSwingPoints(
        { priceDate: '3', closePrice: 3 },
        'swingHigh',
      ),
      this.createEnrichedDataPointWithSwingPoints(
        { priceDate: '4', closePrice: 4 },
        'swingLow',
      ),
    ];
  }

  upwardTrend(): TrendTestCase {
    return {
      name: 'upward trend',
      testcase: {
        data: [
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '1', closePrice: 1 },
            'swingLow',
          ),
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '2', closePrice: 2 },
            'swingHigh',
          ),
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '3', closePrice: 3 },
            'swingLow',
          ),
        ],
        expectedTrends: [
          { type: 'upward', startPoint: { x: 1 }, endPoint: { x: 3 } },
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
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '1', closePrice: 3 },
            'swingHigh',
          ),
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '2', closePrice: 2 },
            'swingLow',
          ),
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '3', closePrice: 1 },
            'swingHigh',
          ),
        ],
        expectedTrends: [
          { type: 'downward', startPoint: { x: 1 }, endPoint: { x: 3 } },
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
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '1', closePrice: 2 },
            'swingLow',
          ),
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '2', closePrice: 3 },
            'swingHigh',
          ),
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '3', closePrice: 1 },
            'swingLow',
          ),
        ],
        expectedTrends: [],
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
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '1', closePrice: 3 },
            'swingHigh',
          ),
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '2', closePrice: 2 },
            'swingLow',
          ),
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '3', closePrice: 4 },
            'swingHigh',
          ),
        ],
        expectedTrends: [],
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
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '1', closePrice: 2 },
            'swingLow',
          ),
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '2', closePrice: 3 },
            'swingHigh',
          ),
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '3', closePrice: 2 },
            'swingLow',
          ),
        ],
        expectedTrends: [],
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
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '1', closePrice: 3 },
            'swingHigh',
          ),
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '2', closePrice: 2 },
            'swingLow',
          ),
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '3', closePrice: 3 },
            'swingHigh',
          ),
        ],
        expectedTrends: [],
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
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '1', closePrice: 1 },
            'swingLow',
          ),
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '2', closePrice: 2 },
            'swingHigh',
          ),
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '3', closePrice: 3 },
            'swingLow',
          ),
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '4', closePrice: 4 },
            null,
          ),
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '5', closePrice: 5 },
            null,
          ),
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '6', closePrice: 6 },
            null,
          ),
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '7', closePrice: 7 },
            null,
          ),
        ],
        expectedTrends: [
          { type: 'upward', startPoint: { x: 1 }, endPoint: { x: 7 } },
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
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '1', closePrice: 3 },
            'swingHigh',
          ),
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '2', closePrice: 2 },
            'swingLow',
          ),
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '3', closePrice: 1 },
            'swingHigh',
          ),
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '4', closePrice: 4 },
            null,
          ),
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '5', closePrice: 5 },
            null,
          ),
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '6', closePrice: 6 },
            null,
          ),
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '7', closePrice: 7 },
            null,
          ),
        ],
        expectedTrends: [
          { type: 'downward', startPoint: { x: 1 }, endPoint: { x: 7 } },
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
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '1', closePrice: 1 },
            'swingLow',
          ),
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '2', closePrice: 2 },
            'swingHigh',
          ),
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '3', closePrice: 3 },
            'swingLow',
          ),
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '4', closePrice: 4 },
            'swingHigh',
          ),
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '5', closePrice: 4 },
            'swingLow',
          ),
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '6', closePrice: 5 },
            'swingHigh',
          ),
        ],
        expectedTrends: [
          { type: 'upward', startPoint: { x: 1 }, endPoint: { x: 6 } },
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
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '1', closePrice: 1 },
            'swingLow',
          ),
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '2', closePrice: 3 },
            'swingHigh',
          ),
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '3', closePrice: 2 },
            'swingLow',
          ), // Confirmed Up
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '4', closePrice: 4 },
            'swingHigh',
          ), // Continuation (Peak)
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '5', closePrice: 1 },
            'swingLow',
          ), // WARNING: tieferes Tief
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '6', closePrice: 3 },
            'swingHigh',
          ), // BROKEN: tieferes Hoch
        ],
        expectedTrends: [
          { type: 'upward', startPoint: { x: 1 }, endPoint: { x: 4 } },
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
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '1', closePrice: 7 },
            'swingHigh',
          ),
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '2', closePrice: 6 },
            'swingLow',
          ),
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '3', closePrice: 5 },
            'swingHigh',
          ),
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '4', closePrice: 4 },
            'swingLow',
          ),
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '5', closePrice: 3 },
            'swingHigh',
          ),
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '6', closePrice: 2 },
            'swingLow',
          ),
        ],
        expectedTrends: [
          { type: 'downward', startPoint: { x: 1 }, endPoint: { x: 6 } },
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
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '1', closePrice: 7 },
            'swingHigh',
          ),
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '2', closePrice: 2 },
            'swingLow',
          ),
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '3', closePrice: 6 },
            'swingHigh',
          ), // Confirmed Down
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '4', closePrice: 1 },
            'swingLow',
          ), // Continuation (Talsohle)
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '5', closePrice: 8 },
            'swingHigh',
          ), // WARNING: höheres Hoch
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '6', closePrice: 3 },
            'swingLow',
          ), // BROKEN: höheres Tief
        ],
        expectedTrends: [
          { type: 'downward', startPoint: { x: 1 }, endPoint: { x: 4 } },
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
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '1', closePrice: 10 },
            'swingLow',
          ),
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '2', closePrice: 20 },
            'swingHigh',
          ),
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '3', closePrice: 12 },
            'swingLow',
          ),
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '4', closePrice: 22 },
            'swingHigh',
          ),
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '5', closePrice: 11 },
            'swingLow',
          ), // WARNING: tieferes Tief
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '6', closePrice: 25 },
            'swingHigh',
          ), // RECOVER: höheres Hoch
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '7', closePrice: 15 },
            'swingLow',
          ), // Fortsetzung
        ],
        expectedTrends: [
          { type: 'upward', startPoint: { x: 1 }, endPoint: { x: 7 } },
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
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '1', closePrice: 20 },
            'swingHigh',
          ),
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '2', closePrice: 10 },
            'swingLow',
          ),
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '3', closePrice: 18 },
            'swingHigh',
          ), // Confirmed
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '4', closePrice: 8 },
            'swingLow',
          ), // Continuation (Talsohle)
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '5', closePrice: 19 },
            'swingHigh',
          ), // WARNING: höheres Hoch
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '6', closePrice: 9 },
            'swingLow',
          ), // BROKEN: höheres Tief
        ],
        expectedTrends: [
          { type: 'downward', startPoint: { x: 1 }, endPoint: { x: 4 } },
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
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '1', closePrice: 20 },
            'swingHigh',
          ),
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '2', closePrice: 10 },
            'swingLow',
          ),
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '3', closePrice: 18 },
            'swingHigh',
          ),
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '4', closePrice: 8 },
            'swingLow',
          ),
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '5', closePrice: 19 },
            'swingHigh',
          ), // WARNING: höheres Hoch
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '6', closePrice: 5 },
            'swingLow',
          ), // RECOVER: tieferes Tief
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '7', closePrice: 15 },
            'swingHigh',
          ), // Fortsetzung
        ],
        expectedTrends: [
          { type: 'downward', startPoint: { x: 1 }, endPoint: { x: 7 } },
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
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '1', closePrice: 10 },
            'swingLow',
          ),
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '2', closePrice: 20 },
            'swingHigh',
          ),
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '3', closePrice: 12 },
            'swingLow',
          ),
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '4', closePrice: 22 },
            'swingHigh',
          ),
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '5', closePrice: 11 },
            'swingLow',
          ),
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '6', closePrice: 18 },
            'swingHigh',
          ),
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '7', closePrice: 9 },
            'swingLow',
          ),
        ],
        expectedTrends: [
          { type: 'upward', startPoint: { x: 1 }, endPoint: { x: 4 } },
          { type: 'downward', startPoint: { x: 4 }, endPoint: { x: 7 } },
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
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '1', closePrice: 30 },
            'swingHigh',
          ),
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '2', closePrice: 20 },
            'swingLow',
          ),
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '3', closePrice: 28 },
            'swingHigh',
          ),
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '4', closePrice: 18 },
            'swingLow',
          ),
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '5', closePrice: 29 },
            'swingHigh',
          ),
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '6', closePrice: 21 },
            'swingLow',
          ),
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '7', closePrice: 32 },
            'swingHigh',
          ),
        ],
        expectedTrends: [
          { type: 'downward', startPoint: { x: 1 }, endPoint: { x: 4 } },
          { type: 'upward', startPoint: { x: 4 }, endPoint: { x: 7 } },
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
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '1', closePrice: 10 },
            'swingLow',
          ),
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '2', closePrice: 20 },
            'swingHigh',
          ),
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '3', closePrice: 12 },
            'swingLow',
          ), // Confirmed Up

          // 2. Unklare Phase (bricht den Aufwärtstrend, etabliert aber keinen neuen)
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '4', closePrice: 15 },
            'swingHigh',
          ), // Warning: tieferes Hoch
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '5', closePrice: 11 },
            'swingLow',
          ), // Broken: tieferes Tief

          // 3. Neuer Abwärtstrend beginnt
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '6', closePrice: 16 },
            'swingHigh',
          ), // Start Down
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '7', closePrice: 5 },
            'swingLow',
          ),
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '8', closePrice: 14 },
            'swingHigh',
          ), // Confirmed Down
        ],
        expectedTrends: [
          { type: 'upward', startPoint: { x: 1 }, endPoint: { x: 3 } },
          { type: 'downward', startPoint: { x: 6 }, endPoint: { x: 8 } },
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
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '1', closePrice: 10 },
            'swingLow',
          ),
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '2', closePrice: 20 },
            'swingHigh',
          ),
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '3', closePrice: 12 },
            'swingLow',
          ), // Confirmed Up, Peak
          // 2. Bruch des Aufwärtstrends
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '4', closePrice: 11 },
            'swingHigh',
          ), // Warning
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '5', closePrice: 8 },
            'swingLow',
          ), // Broken

          // 3. "GAP": Unklare, chaotische Phase ohne klaren Trend
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '6', closePrice: 11 },
            'swingHigh',
          ),
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '7', closePrice: 7 },
            'swingLow',
          ),
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '8', closePrice: 19 },
            'swingHigh',
          ),
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '9', closePrice: 7 },
            'swingLow',
          ),

          // 4. Ein neuer, sauberer Abwärtstrend beginnt hier
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '10', closePrice: 25 },
            'swingHigh',
          ), // Start Down
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '11', closePrice: 7 },
            'swingLow',
          ),
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '12', closePrice: 22 },
            'swingHigh',
          ), // Confirmed Down
        ],
        expectedTrends: [
          { type: 'upward', startPoint: { x: 1 }, endPoint: { x: 3 } },
          { type: 'downward', startPoint: { x: 10 }, endPoint: { x: 12 } },
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
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '1', closePrice: 100 },
            'swingLow',
          ),
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '2', closePrice: 110 },
            'swingHigh',
          ),
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '3', closePrice: 101 },
            'swingLow',
          ),
        ],
        expectedTrends: [],
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
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '1', closePrice: 100 },
            'swingHigh',
          ),
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '2', closePrice: 90 },
            'swingLow',
          ),
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '3', closePrice: 99 },
            'swingHigh',
          ),
        ],
        expectedTrends: [],
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
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '1', closePrice: 100 },
            'swingLow',
          ),
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '2', closePrice: 110 },
            'swingHigh',
          ),
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '3', closePrice: 105 },
            'swingLow',
          ), // Confirmed
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '4', closePrice: 115 },
            'swingHigh',
          ), // Continuation, Peak
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '5', closePrice: 108 },
            'swingLow',
          ), // Confirmed
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '6', closePrice: 116 },
            'swingHigh',
          ), // WARNING: stagnating High
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '7', closePrice: 109 },
            'swingLow',
          ), // WARNING: stagnating Low
        ],
        expectedTrends: [
          { type: 'upward', startPoint: { x: 1 }, endPoint: { x: 5 } },
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
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '1', closePrice: 100 },
            'swingHigh',
          ),
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '2', closePrice: 90 },
            'swingLow',
          ),
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '3', closePrice: 95 },
            'swingHigh',
          ), // Confirmed Down (95 < 100)

          // 2. Trend wird fortgesetzt
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '4', closePrice: 85 },
            'swingLow',
          ), // Continuation (Talsohle), da 85 < 90
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '5', closePrice: 92 },
            'swingHigh',
          ), // Continuation, da 92 < 95

          // 3. Bruch durch Stagnation
          // 84.5 ist zwar < 85, aber nicht signifikant tiefer. Momentum ist weg -> Warning/Break.
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '6', closePrice: 84.5 },
            'swingLow',
          ),
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '7', closePrice: 91.5 },
            'swingHigh',
          ),
        ],
        expectedTrends: [
          { type: 'downward', startPoint: { x: 1 }, endPoint: { x: 5 } },
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
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '1', closePrice: 99 },
            'swingLow',
          ),
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '2', closePrice: 101 },
            'swingHigh',
          ),
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '3', closePrice: 99.8 },
            'swingLow',
          ),
          this.createEnrichedDataPointWithSwingPoints(
            { priceDate: '4', closePrice: 101.5 },
            'swingHigh',
          ),
        ],
        expectedTrends: [],
        settings: { relativeThreshold: 0.01 },
      },
    };
  }
}
