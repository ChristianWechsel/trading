import { CreateTestData, OHLCVRecord } from '../../../utils/test-utils';
import { EnrichedDataPoint } from '../../core/enriched-data-point';
import { TrendTestCase } from './trend-detection.spec';

export class TrendDetectionTestdata extends CreateTestData {
  /**
   * Weniger als die Mindestanzahl an SwingPoints (z.B. 2)
   */
  lessThanMinSwingPoints(): TrendTestCase {
    const context = this.createContext(
      [
        {
          ohlcv: this.createOHLCV({ priceDate: '1', closePrice: 1 }),
          swingPointType: 'swingHigh',
        },
        {
          ohlcv: this.createOHLCV({ priceDate: '2', closePrice: 2 }),
          swingPointType: 'swingLow',
        },
      ],
      {
        stepOptions: { trendDetection: { relativeThreshold: 0.1 } },
        steps: [],
        dataAggregation: { ticker: { exchange: '', symbol: '' } },
      },
    );
    return {
      name: 'less than min swing points',
      testcase: {
        expectedTrends: [],
        context,
      },
    };
  }

  /**
   * Genau die Mindestanzahl an SwingPoints (z.B. 3)
   */
  minSwingPoints(): TrendTestCase {
    const context = this.createContext(
      [
        {
          ohlcv: this.createOHLCV({ priceDate: '1', closePrice: 1 }),
          swingPointType: 'swingHigh',
        },
        {
          ohlcv: this.createOHLCV({ priceDate: '2', closePrice: 2 }),
          swingPointType: 'swingLow',
        },
        {
          ohlcv: this.createOHLCV({ priceDate: '3', closePrice: 3 }),
          swingPointType: 'swingHigh',
        },
        {
          ohlcv: this.createOHLCV({ priceDate: '4', closePrice: 4 }),
          swingPointType: 'swingLow',
        },
      ],
      {
        stepOptions: { trendDetection: { relativeThreshold: 0.1 } },
        steps: [],
        dataAggregation: { ticker: { exchange: '', symbol: '' } },
      },
    );
    return {
      name: 'less than min swing points',
      testcase: {
        expectedTrends: [],
        context,
      },
    };
  }

  validateMaxSwingPoints(): TrendTestCase {
    const context = this.createContext(
      [
        {
          ohlcv: this.createOHLCV({ priceDate: '1', closePrice: 1 }),
          swingPointType: 'swingHigh',
        },
        {
          ohlcv: this.createOHLCV({ priceDate: '2', closePrice: 2 }),
          swingPointType: 'swingLow',
        },
        {
          ohlcv: this.createOHLCV({ priceDate: '3', closePrice: 3 }),
          swingPointType: 'swingHigh',
        },
        {
          ohlcv: this.createOHLCV({ priceDate: '4', closePrice: 4 }),
          swingPointType: 'swingLow',
        },
      ],
      {
        stepOptions: { trendDetection: { relativeThreshold: 0.1 } },
        steps: [],
        dataAggregation: { ticker: { exchange: '', symbol: '' } },
      },
    );
    return {
      name: 'less than min swing points',
      testcase: {
        expectedTrends: [],
        context,
      },
    };
  }
  validateMinSwingPoints(): TrendTestCase {
    const context = this.createContext(
      [
        {
          ohlcv: this.createOHLCV({ priceDate: '1', closePrice: 1 }),
          swingPointType: 'swingHigh',
        },
        {
          ohlcv: this.createOHLCV({ priceDate: '2', closePrice: 2 }),
          swingPointType: 'swingLow',
        },
        {
          ohlcv: this.createOHLCV({ priceDate: '3', closePrice: 3 }),
          swingPointType: 'swingHigh',
        },
        {
          ohlcv: this.createOHLCV({ priceDate: '4', closePrice: 4 }),
          swingPointType: 'swingLow',
        },
      ],
      {
        stepOptions: { trendDetection: { relativeThreshold: -0.1 } },
        steps: [],
        dataAggregation: { ticker: { exchange: '', symbol: '' } },
      },
    );
    return {
      name: 'less than min swing points',
      testcase: {
        expectedTrends: [],
        context,
      },
    };
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
    const startPoint: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '1', closePrice: 1 }),
      swingPointType: 'swingLow',
    };
    const endPoint: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '3', closePrice: 3 }),
      swingPointType: 'swingLow',
    };
    const context = this.createContext(
      [
        startPoint,
        {
          ohlcv: this.createOHLCV({ priceDate: '2', closePrice: 2 }),
          swingPointType: 'swingHigh',
        },
        endPoint,
      ],
      {
        stepOptions: { trendDetection: { relativeThreshold: 0.01 } },
        steps: [],
        dataAggregation: { ticker: { exchange: '', symbol: '' } },
      },
    );
    return {
      name: 'upward trend',
      testcase: {
        expectedTrends: [
          {
            type: 'upward',
            start: this.createEnrichedDataPointOf(startPoint),
            end: this.createEnrichedDataPointOf(endPoint),
            confirmation: this.createEnrichedDataPointOf(endPoint),
          },
        ],
        context,
      },
    };
  }

  downwardTrend(): TrendTestCase {
    const startPoint: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '1', closePrice: 3 }),
      swingPointType: 'swingHigh',
    };
    const endPoint: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '3', closePrice: 1 }),
      swingPointType: 'swingHigh',
    };
    const context = this.createContext(
      [
        startPoint,
        {
          ohlcv: this.createOHLCV({ priceDate: '2', closePrice: 2 }),
          swingPointType: 'swingLow',
        },
        endPoint,
      ],
      {
        stepOptions: { trendDetection: { relativeThreshold: 0.01 } },
        steps: [],
        dataAggregation: { ticker: { exchange: '', symbol: '' } },
      },
    );
    return {
      name: 'downward trend',
      testcase: {
        expectedTrends: [
          {
            type: 'downward',
            start: this.createEnrichedDataPointOf(startPoint),
            end: this.createEnrichedDataPointOf(endPoint),
            confirmation: this.createEnrichedDataPointOf(endPoint),
          },
        ],
        context,
      },
    };
  }

  // Aufwärtstrend hat sich nicht bestätigt
  upwardTrendNotConfirmed(): TrendTestCase {
    const context = this.createContext(
      [
        {
          ohlcv: this.createOHLCV({ priceDate: '1', closePrice: 2 }),
          swingPointType: 'swingLow',
        },
        {
          ohlcv: this.createOHLCV({ priceDate: '2', closePrice: 3 }),
          swingPointType: 'swingHigh',
        },
        {
          ohlcv: this.createOHLCV({ priceDate: '3', closePrice: 1 }),
          swingPointType: 'swingLow',
        },
      ],
      {
        stepOptions: { trendDetection: { relativeThreshold: 0.01 } },
        steps: [],
        dataAggregation: { ticker: { exchange: '', symbol: '' } },
      },
    );
    return {
      name: 'upward trend not confirmed',
      testcase: {
        expectedTrends: [],
        context,
      },
    };
  }

  // Abwärtstrend hat sich nicht bestätigt
  downwardTrendNotConfirmed(): TrendTestCase {
    const context = this.createContext(
      [
        {
          ohlcv: this.createOHLCV({ priceDate: '1', closePrice: 3 }),
          swingPointType: 'swingHigh',
        },
        {
          ohlcv: this.createOHLCV({ priceDate: '2', closePrice: 2 }),
          swingPointType: 'swingLow',
        },
        {
          ohlcv: this.createOHLCV({ priceDate: '3', closePrice: 4 }),
          swingPointType: 'swingHigh',
        },
      ],
      {
        stepOptions: { trendDetection: { relativeThreshold: 0.01 } },
        steps: [],
        dataAggregation: { ticker: { exchange: '', symbol: '' } },
      },
    );
    return {
      name: 'downward trend not confirmed',
      testcase: {
        expectedTrends: [],
        context,
      },
    };
  }
  // Aufwärtstrend hat sich nicht bestätigt - Grenzfall
  upwardTrendNotConfirmedEdgeCase(): TrendTestCase {
    const context = this.createContext(
      [
        {
          ohlcv: this.createOHLCV({ priceDate: '1', closePrice: 2 }),
          swingPointType: 'swingLow',
        },
        {
          ohlcv: this.createOHLCV({ priceDate: '2', closePrice: 3 }),
          swingPointType: 'swingHigh',
        },
        {
          ohlcv: this.createOHLCV({ priceDate: '3', closePrice: 2 }),
          swingPointType: 'swingLow',
        },
      ],
      {
        stepOptions: { trendDetection: { relativeThreshold: 0.01 } },
        steps: [],
        dataAggregation: { ticker: { exchange: '', symbol: '' } },
      },
    );
    return {
      name: 'upward trend not confirmed edge case',
      testcase: {
        expectedTrends: [],
        context,
      },
    };
  }

  // Abwärtstrend hat sich nicht bestätigt - Grenzfall
  downwardTrendNotConfirmedEdgeCase(): TrendTestCase {
    const context = this.createContext(
      [
        {
          ohlcv: this.createOHLCV({ priceDate: '1', closePrice: 3 }),
          swingPointType: 'swingHigh',
        },
        {
          ohlcv: this.createOHLCV({ priceDate: '2', closePrice: 2 }),
          swingPointType: 'swingLow',
        },
        {
          ohlcv: this.createOHLCV({ priceDate: '3', closePrice: 3 }),
          swingPointType: 'swingHigh',
        },
      ],
      {
        stepOptions: { trendDetection: { relativeThreshold: 0.01 } },
        steps: [],
        dataAggregation: { ticker: { exchange: '', symbol: '' } },
      },
    );
    return {
      name: 'downward trend not confirmed edge case',
      testcase: {
        expectedTrends: [],
        context,
      },
    };
  }

  // Aufwärtstrend bis Ende Datenreihe
  upwardTrendInfinite(): TrendTestCase {
    const startPoint: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '1', closePrice: 1 }),
      swingPointType: 'swingLow',
    };
    const confirmationPoint: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '3', closePrice: 3 }),
      swingPointType: 'swingLow',
    };
    const endPoint: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '7', closePrice: 7 }),
    };
    const context = this.createContext(
      [
        startPoint,
        {
          ohlcv: this.createOHLCV({ priceDate: '2', closePrice: 2 }),
          swingPointType: 'swingHigh',
        },
        confirmationPoint,
        {
          ohlcv: this.createOHLCV({ priceDate: '4', closePrice: 4 }),
        },
        {
          ohlcv: this.createOHLCV({ priceDate: '5', closePrice: 5 }),
        },
        {
          ohlcv: this.createOHLCV({ priceDate: '6', closePrice: 6 }),
        },
        endPoint,
      ],
      {
        stepOptions: { trendDetection: { relativeThreshold: 0.01 } },
        steps: [],
        dataAggregation: { ticker: { exchange: '', symbol: '' } },
      },
    );
    return {
      name: 'upward trend infinite',
      testcase: {
        expectedTrends: [
          {
            type: 'upward',
            start: this.createEnrichedDataPointOf(startPoint),
            end: this.createEnrichedDataPointOf(endPoint),
            confirmation: this.createEnrichedDataPointOf(confirmationPoint),
          },
        ],
        context,
      },
    };
  }

  // Abwärtstrend bis Ende Datenreihe
  downwardTrendInfinite(): TrendTestCase {
    const startPoint: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '1', closePrice: 7 }),
      swingPointType: 'swingHigh',
    };
    const confirmationPoint: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '3', closePrice: 5 }),
      swingPointType: 'swingHigh',
    };
    const endPoint: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '7', closePrice: 1 }),
    };
    const context = this.createContext(
      [
        startPoint,
        {
          ohlcv: this.createOHLCV({ priceDate: '2', closePrice: 6 }),
          swingPointType: 'swingLow',
        },
        confirmationPoint,
        {
          ohlcv: this.createOHLCV({ priceDate: '4', closePrice: 4 }),
        },
        {
          ohlcv: this.createOHLCV({ priceDate: '5', closePrice: 3 }),
        },
        {
          ohlcv: this.createOHLCV({ priceDate: '6', closePrice: 2 }),
        },
        endPoint,
      ],
      {
        stepOptions: { trendDetection: { relativeThreshold: 0.01 } },
        steps: [],
        dataAggregation: { ticker: { exchange: '', symbol: '' } },
      },
    );
    return {
      name: 'downward trend infinite',
      testcase: {
        expectedTrends: [
          {
            type: 'downward',
            start: this.createEnrichedDataPointOf(startPoint),
            end: this.createEnrichedDataPointOf(endPoint),
            confirmation: this.createEnrichedDataPointOf(confirmationPoint),
          },
        ],
        context,
      },
    };
  }

  // Fortgesetzter Aufwärtstrend ohne Endpunkt (Resultat ohne Endpunkt)
  upwardTrendContinuesWithoutEndpoint(): TrendTestCase {
    const startPoint: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '1', closePrice: 1 }),
      swingPointType: 'swingLow',
    };
    const confirmationPoint: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '3', closePrice: 3 }),
      swingPointType: 'swingLow',
    };
    const endPoint: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '6', closePrice: 5 }),
      swingPointType: 'swingHigh',
    };
    const context = this.createContext(
      [
        startPoint,
        {
          ohlcv: this.createOHLCV({ priceDate: '2', closePrice: 2 }),
          swingPointType: 'swingHigh',
        },
        confirmationPoint,
        {
          ohlcv: this.createOHLCV({ priceDate: '4', closePrice: 4 }),
          swingPointType: 'swingHigh',
        },
        {
          ohlcv: this.createOHLCV({ priceDate: '5', closePrice: 4 }),
          swingPointType: 'swingLow',
        },
        endPoint,
      ],
      {
        stepOptions: { trendDetection: { relativeThreshold: 0.01 } },
        steps: [],
        dataAggregation: { ticker: { exchange: '', symbol: '' } },
      },
    );
    return {
      name: 'upward trend continues without endpoint',
      testcase: {
        expectedTrends: [
          {
            type: 'upward',
            start: this.createEnrichedDataPointOf(startPoint),
            end: this.createEnrichedDataPointOf(endPoint),
            confirmation: this.createEnrichedDataPointOf(confirmationPoint),
          },
        ],
        context,
      },
    };
  }

  // Fortgesetzter Aufwärtstrend, der mit tieferem Tief und tieferem Hoch endet
  upwardTrendBreaksWithLowerLowAndLowerHigh(): TrendTestCase {
    const startPoint: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '1', closePrice: 1 }),
      swingPointType: 'swingLow',
    };
    const confirmationPoint: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '3', closePrice: 2 }),
      swingPointType: 'swingLow',
    };
    const endPoint: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '4', closePrice: 4 }),
      swingPointType: 'swingHigh',
    };
    const warningPoint: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '5', closePrice: 1 }),
      swingPointType: 'swingLow',
    };
    const context = this.createContext(
      [
        startPoint,
        {
          ohlcv: this.createOHLCV({ priceDate: '2', closePrice: 3 }),
          swingPointType: 'swingHigh',
        },
        confirmationPoint, // Confirmed Up
        endPoint, // Continuation (Peak)
        warningPoint, // WARNING: tieferes Tief
        {
          ohlcv: this.createOHLCV({ priceDate: '6', closePrice: 3 }),
          swingPointType: 'swingHigh',
        }, // BROKEN: tieferes Hoch
      ],
      {
        stepOptions: { trendDetection: { relativeThreshold: 0.01 } },
        steps: [],
        dataAggregation: { ticker: { exchange: '', symbol: '' } },
      },
    );
    return {
      name: 'upward trend breaks with lower low and lower high',
      testcase: {
        expectedTrends: [
          {
            type: 'upward',
            start: this.createEnrichedDataPointOf(startPoint),
            end: this.createEnrichedDataPointOf(endPoint),
            confirmation: this.createEnrichedDataPointOf(confirmationPoint),
            warnings: [this.createEnrichedDataPointOf(warningPoint)],
          },
        ],
        context,
      },
    };
  }

  // Fortgesetzter Abwärtstrend ohne Endpunkt (Trend läuft weiter, kein bestätigendes Ende)
  downwardTrendContinuesWithoutEndpoint(): TrendTestCase {
    const startPoint: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '1', closePrice: 7 }),
      swingPointType: 'swingHigh',
    };
    const confirmationPoint: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '3', closePrice: 5 }),
      swingPointType: 'swingHigh',
    };
    const endPoint: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '6', closePrice: 2 }),
      swingPointType: 'swingLow',
    };
    const context = this.createContext(
      [
        startPoint,
        {
          ohlcv: this.createOHLCV({ priceDate: '2', closePrice: 6 }),
          swingPointType: 'swingLow',
        },
        confirmationPoint,
        {
          ohlcv: this.createOHLCV({ priceDate: '4', closePrice: 4 }),
          swingPointType: 'swingLow',
        },
        {
          ohlcv: this.createOHLCV({ priceDate: '5', closePrice: 3 }),
          swingPointType: 'swingHigh',
        },
        endPoint,
      ],
      {
        stepOptions: { trendDetection: { relativeThreshold: 0.01 } },
        steps: [],
        dataAggregation: { ticker: { exchange: '', symbol: '' } },
      },
    );
    return {
      name: 'downward trend continues without endpoint',
      testcase: {
        expectedTrends: [
          {
            type: 'downward',
            start: this.createEnrichedDataPointOf(startPoint),
            end: this.createEnrichedDataPointOf(endPoint),
            confirmation: this.createEnrichedDataPointOf(confirmationPoint),
          },
        ],
        context,
      },
    };
  }

  // Fortgesetzter Abwärtstrend, der mit höherem Hoch und höherem Tief endet (Trend bricht)
  downwardTrendBreaksWithHigherHighAndHigherLow(): TrendTestCase {
    const startPoint: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '1', closePrice: 7 }),
      swingPointType: 'swingHigh',
    };
    const confirmationPoint: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '3', closePrice: 6 }),
      swingPointType: 'swingHigh',
    };
    const endPoint: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '4', closePrice: 1 }),
      swingPointType: 'swingLow',
    };
    const warningPoint: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '5', closePrice: 8 }),
      swingPointType: 'swingHigh',
    };
    const context = this.createContext(
      [
        startPoint,
        {
          ohlcv: this.createOHLCV({ priceDate: '2', closePrice: 2 }),
          swingPointType: 'swingLow',
        },
        confirmationPoint, // Confirmed Down
        endPoint, // Continuation (Talsohle)
        warningPoint, // WARNING: höheres Hoch
        {
          ohlcv: this.createOHLCV({ priceDate: '6', closePrice: 3 }),
          swingPointType: 'swingLow',
        }, // BROKEN: höheres Tief
      ],
      {
        stepOptions: { trendDetection: { relativeThreshold: 0.01 } },
        steps: [],
        dataAggregation: { ticker: { exchange: '', symbol: '' } },
      },
    );
    return {
      name: 'downward trend breaks with higher high and higher low',
      testcase: {
        expectedTrends: [
          {
            type: 'downward',
            start: this.createEnrichedDataPointOf(startPoint),
            end: this.createEnrichedDataPointOf(endPoint),
            confirmation: this.createEnrichedDataPointOf(confirmationPoint),
            warnings: [this.createEnrichedDataPointOf(warningPoint)],
          },
        ],
        context,
      },
    };
  }

  /**
   * Ein Aufwärtstrend wird verletzt (Warning), erholt sich aber wieder.
   */
  upwardTrendRecoversAfterWarning(): TrendTestCase {
    const startPoint: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '1', closePrice: 10 }),
      swingPointType: 'swingLow',
    };
    const confirmationPoint: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '3', closePrice: 12 }),
      swingPointType: 'swingLow',
    };
    const warningPoint: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '5', closePrice: 11 }),
      swingPointType: 'swingLow',
    };
    const endPoint: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '7', closePrice: 15 }),
      swingPointType: 'swingLow',
    };
    const context = this.createContext(
      [
        startPoint,
        {
          ohlcv: this.createOHLCV({ priceDate: '2', closePrice: 20 }),
          swingPointType: 'swingHigh',
        },
        confirmationPoint,
        {
          ohlcv: this.createOHLCV({ priceDate: '4', closePrice: 22 }),
          swingPointType: 'swingHigh',
        },
        warningPoint, // WARNING: tieferes Tief
        {
          ohlcv: this.createOHLCV({ priceDate: '6', closePrice: 25 }),
          swingPointType: 'swingHigh',
        }, // RECOVER: höheres Hoch
        endPoint, // Fortsetzung
      ],
      {
        stepOptions: { trendDetection: { relativeThreshold: 0.01 } },
        steps: [],
        dataAggregation: { ticker: { exchange: '', symbol: '' } },
      },
    );
    return {
      name: 'upward trend recovers after warning',
      testcase: {
        expectedTrends: [
          {
            type: 'upward',
            start: this.createEnrichedDataPointOf(startPoint),
            end: this.createEnrichedDataPointOf(endPoint),
            confirmation: this.createEnrichedDataPointOf(confirmationPoint),
            warnings: [this.createEnrichedDataPointOf(warningPoint)],
          },
        ],
        context,
      },
    };
  }

  /**
   * Ein Abwärtstrend wird verletzt (Warning), bricht dann aber endgültig.
   * Dieser Test existiert im Grunde schon: downwardTrendBreaksWithHigherHighAndHigherLow
   * Wir benennen ihn hier explizit, um die Logik klarer zu machen.
   */
  downwardTrendBreaksAfterWarning(): TrendTestCase {
    const startPoint: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '1', closePrice: 20 }),
      swingPointType: 'swingHigh',
    };
    const confirmationPoint: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '3', closePrice: 18 }),
      swingPointType: 'swingHigh',
    };
    const endPoint: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '4', closePrice: 8 }),
      swingPointType: 'swingLow',
    };
    const warningPoint: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '5', closePrice: 19 }),
      swingPointType: 'swingHigh',
    };
    const context = this.createContext(
      [
        startPoint,
        {
          ohlcv: this.createOHLCV({ priceDate: '2', closePrice: 10 }),
          swingPointType: 'swingLow',
        },
        confirmationPoint, // Confirmed
        endPoint, // Continuation (Talsohle)
        warningPoint, // WARNING: höheres Hoch
        {
          ohlcv: this.createOHLCV({ priceDate: '6', closePrice: 9 }),
          swingPointType: 'swingLow',
        }, // BROKEN: höheres Tief
      ],
      {
        stepOptions: { trendDetection: { relativeThreshold: 0.01 } },
        steps: [],
        dataAggregation: { ticker: { exchange: '', symbol: '' } },
      },
    );
    return {
      name: 'downward trend breaks after warning',
      testcase: {
        expectedTrends: [
          {
            type: 'downward',
            start: this.createEnrichedDataPointOf(startPoint),
            end: this.createEnrichedDataPointOf(endPoint),
            confirmation: this.createEnrichedDataPointOf(confirmationPoint),
            warnings: [this.createEnrichedDataPointOf(warningPoint)],
          },
        ],
        context,
      },
    };
  }

  /**
   * Ein Abwärtstrend wird verletzt (Warning), erholt sich aber wieder.
   */
  downwardTrendRecoversAfterWarning(): TrendTestCase {
    const startPoint: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '1', closePrice: 20 }),
      swingPointType: 'swingHigh',
    };
    const confirmationPoint: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '3', closePrice: 18 }),
      swingPointType: 'swingHigh',
    };
    const warningPoint: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '5', closePrice: 19 }),
      swingPointType: 'swingHigh',
    };
    const endPoint: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '7', closePrice: 15 }),
      swingPointType: 'swingHigh',
    };
    const context = this.createContext(
      [
        startPoint,
        {
          ohlcv: this.createOHLCV({ priceDate: '2', closePrice: 10 }),
          swingPointType: 'swingLow',
        },
        confirmationPoint,
        {
          ohlcv: this.createOHLCV({ priceDate: '4', closePrice: 8 }),
          swingPointType: 'swingLow',
        },
        warningPoint, // WARNING: höheres Hoch
        {
          ohlcv: this.createOHLCV({ priceDate: '6', closePrice: 5 }),
          swingPointType: 'swingLow',
        }, // RECOVER: tieferes Tief
        endPoint, // Fortsetzung
      ],
      {
        stepOptions: { trendDetection: { relativeThreshold: 0.01 } },
        steps: [],
        dataAggregation: { ticker: { exchange: '', symbol: '' } },
      },
    );
    return {
      name: 'downward trend recovers after warning',
      testcase: {
        expectedTrends: [
          {
            type: 'downward',
            start: this.createEnrichedDataPointOf(startPoint),
            end: this.createEnrichedDataPointOf(endPoint),
            confirmation: this.createEnrichedDataPointOf(confirmationPoint),
            warnings: [this.createEnrichedDataPointOf(warningPoint)],
          },
        ],
        context,
      },
    };
  }

  /**
   * Ein sauberer Aufwärtstrend wird von einem sauberen Abwärtstrend gefolgt.
   */
  upwardTrendFollowedByDownwardTrend(): TrendTestCase {
    const startPoint1: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '1', closePrice: 10 }),
      swingPointType: 'swingLow',
    };
    const confirmationPoint1: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '3', closePrice: 12 }),
      swingPointType: 'swingLow',
    };
    const swingPoint: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '4', closePrice: 22 }),
      swingPointType: 'swingHigh',
    };
    const confirmationPoint2: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '6', closePrice: 18 }),
      swingPointType: 'swingHigh',
    };
    const endPoint: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '7', closePrice: 9 }),
      swingPointType: 'swingLow',
    };
    const warning: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '5', closePrice: 11 }),
      swingPointType: 'swingLow',
    };
    const context = this.createContext(
      [
        startPoint1,
        {
          ohlcv: this.createOHLCV({ priceDate: '2', closePrice: 20 }),
          swingPointType: 'swingHigh',
        },
        confirmationPoint1,
        swingPoint,
        warning,
        confirmationPoint2,
        endPoint,
      ],
      {
        stepOptions: { trendDetection: { relativeThreshold: 0.01 } },
        steps: [],
        dataAggregation: { ticker: { exchange: '', symbol: '' } },
      },
    );
    return {
      name: 'upward trend followed by downward trend',
      testcase: {
        expectedTrends: [
          {
            type: 'upward',
            start: this.createEnrichedDataPointOf(startPoint1),
            end: this.createEnrichedDataPointOf(swingPoint),
            confirmation: this.createEnrichedDataPointOf(confirmationPoint1),
            warnings: [this.createEnrichedDataPointOf(warning)],
          },
          {
            type: 'downward',
            start: this.createEnrichedDataPointOf(swingPoint),
            end: this.createEnrichedDataPointOf(endPoint),
            confirmation: this.createEnrichedDataPointOf(confirmationPoint2),
          },
        ],
        context,
      },
    };
  }

  /**
   * Ein sauberer Abwärtstrend wird von einem sauberen Aufwärtstrend gefolgt.
   */
  downwardTrendFollowedByUpwardTrend(): TrendTestCase {
    const startPoint1: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '1', closePrice: 30 }),
      swingPointType: 'swingHigh',
    };
    const confirmationPoint1: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '3', closePrice: 28 }),
      swingPointType: 'swingHigh',
    };
    const swingPoint: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '4', closePrice: 18 }),
      swingPointType: 'swingLow',
    };
    const confirmationPoint2: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '6', closePrice: 21 }),
      swingPointType: 'swingLow',
    };
    const endPoint: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '7', closePrice: 32 }),
      swingPointType: 'swingHigh',
    };
    const warning: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '5', closePrice: 29 }),
      swingPointType: 'swingHigh',
    };
    const context = this.createContext(
      [
        startPoint1,
        {
          ohlcv: this.createOHLCV({ priceDate: '2', closePrice: 20 }),
          swingPointType: 'swingLow',
        },
        confirmationPoint1,
        swingPoint,
        warning,
        confirmationPoint2,
        endPoint,
      ],
      {
        stepOptions: { trendDetection: { relativeThreshold: 0.01 } },
        steps: [],
        dataAggregation: { ticker: { exchange: '', symbol: '' } },
      },
    );
    return {
      name: 'downward trend followed by upward trend',
      testcase: {
        expectedTrends: [
          {
            type: 'downward',
            start: this.createEnrichedDataPointOf(startPoint1),
            end: this.createEnrichedDataPointOf(swingPoint),
            confirmation: this.createEnrichedDataPointOf(confirmationPoint1),
            warnings: [this.createEnrichedDataPointOf(warning)],
          },
          {
            type: 'upward',
            start: this.createEnrichedDataPointOf(swingPoint),
            end: this.createEnrichedDataPointOf(endPoint),
            confirmation: this.createEnrichedDataPointOf(confirmationPoint2),
          },
        ],
        context,
      },
    };
  }

  /**
   * Ein Trend bricht, aber es folgt eine unklare "Seitwärtsphase",
   * bevor ein neuer Trend beginnt. Sonderfall, da der neue Trend exakt am
   * bestätigtem Ende des alten Trend startet.
   */
  trendFollowedByChoppyPeriodThenNewTrend(): TrendTestCase {
    const startPoint1: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '1', closePrice: 10 }),
      swingPointType: 'swingLow',
    };

    const endPoint1: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '3', closePrice: 12 }),
      swingPointType: 'swingLow',
    };
    const startPoint2: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '6', closePrice: 16 }),
      swingPointType: 'swingHigh',
    };

    const endPoint2: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '8', closePrice: 14 }),
      swingPointType: 'swingHigh',
    };
    const warning1: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '4', closePrice: 15 }),
      swingPointType: 'swingHigh',
    };
    const context = this.createContext(
      [
        // 1. Aufwärtstrend
        startPoint1,
        {
          ohlcv: this.createOHLCV({ priceDate: '2', closePrice: 20 }),
          swingPointType: 'swingHigh',
        },
        endPoint1, // Confirmed Up

        // 2. Unklare Phase (bricht den Aufwärtstrend, etabliert aber keinen neuen)
        warning1, // Warning: tieferes Hoch
        {
          ohlcv: this.createOHLCV({ priceDate: '5', closePrice: 11 }),
          swingPointType: 'swingLow',
        }, // Broken: tieferes Tief

        // 3. Neuer Abwärtstrend beginnt
        startPoint2, // Start Down
        {
          ohlcv: this.createOHLCV({ priceDate: '7', closePrice: 5 }),
          swingPointType: 'swingLow',
        },
        endPoint2, // Confirmed Down
      ],
      {
        stepOptions: { trendDetection: { relativeThreshold: 0.01 } },
        steps: [],
        dataAggregation: { ticker: { exchange: '', symbol: '' } },
      },
    );
    return {
      name: 'trend followed by choppy period then new trend. Special Case.',
      testcase: {
        expectedTrends: [
          {
            type: 'upward',
            start: this.createEnrichedDataPointOf(startPoint1),
            end: this.createEnrichedDataPointOf(endPoint1),
            confirmation: this.createEnrichedDataPointOf(endPoint1),
            warnings: [this.createEnrichedDataPointOf(warning1)],
          },
          {
            type: 'downward',
            start: this.createEnrichedDataPointOf(startPoint2),
            end: this.createEnrichedDataPointOf(endPoint2),
            confirmation: this.createEnrichedDataPointOf(endPoint2),
          },
        ],
        context,
      },
    };
  }

  /**
   * Ein Trend bricht, gefolgt von einer unklaren "Lücke",
   * bevor ein neuer Trend beginnt.
   */
  trendBreaksFollowedByGapThenNewTrend(): TrendTestCase {
    const startPoint1: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '1', closePrice: 10 }),
      swingPointType: 'swingLow',
    };

    const endPoint1: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '3', closePrice: 12 }),
      swingPointType: 'swingLow',
    };
    const warningPoint1: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '4', closePrice: 11 }),
      swingPointType: 'swingHigh',
    };
    const startPoint2: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '10', closePrice: 25 }),
      swingPointType: 'swingHigh',
    };
    const endPoint2: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '12', closePrice: 22 }),
      swingPointType: 'swingHigh',
    };
    const context = this.createContext(
      [
        // 1. Aufwärtstrend wird etabliert
        startPoint1,
        {
          ohlcv: this.createOHLCV({ priceDate: '2', closePrice: 20 }),
          swingPointType: 'swingHigh',
        },
        endPoint1, // Confirmed Up, Peak
        // 2. Bruch des Aufwärtstrends
        warningPoint1, // Warning
        {
          ohlcv: this.createOHLCV({ priceDate: '5', closePrice: 8 }),
          swingPointType: 'swingLow',
        }, // Broken

        // 3. "GAP": Unklare, chaotische Phase ohne klaren Trend
        {
          ohlcv: this.createOHLCV({ priceDate: '6', closePrice: 11 }),
          swingPointType: 'swingHigh',
        },
        {
          ohlcv: this.createOHLCV({ priceDate: '7', closePrice: 7 }),
          swingPointType: 'swingLow',
        },
        {
          ohlcv: this.createOHLCV({ priceDate: '8', closePrice: 19 }),
          swingPointType: 'swingHigh',
        },
        {
          ohlcv: this.createOHLCV({ priceDate: '9', closePrice: 7 }),
          swingPointType: 'swingLow',
        },

        // 4. Ein neuer, sauberer Abwärtstrend beginnt hier
        startPoint2, // Start Down
        {
          ohlcv: this.createOHLCV({ priceDate: '11', closePrice: 7 }),
          swingPointType: 'swingLow',
        },
        endPoint2, // Confirmed Down
      ],
      {
        stepOptions: { trendDetection: { relativeThreshold: 0.01 } },
        steps: [],
        dataAggregation: { ticker: { exchange: '', symbol: '' } },
      },
    );
    return {
      name: 'trend followed by choppy period then new trend',
      testcase: {
        expectedTrends: [
          {
            type: 'upward',
            start: this.createEnrichedDataPointOf(startPoint1),
            end: this.createEnrichedDataPointOf(endPoint1),
            confirmation: this.createEnrichedDataPointOf(endPoint1),
            warnings: [this.createEnrichedDataPointOf(warningPoint1)],
          },
          {
            type: 'downward',
            start: this.createEnrichedDataPointOf(startPoint2),
            end: this.createEnrichedDataPointOf(endPoint2),
            confirmation: this.createEnrichedDataPointOf(endPoint2),
          },
        ],
        context,
      },
    };
  }

  /**
   * Ein Aufwärtstrend wird NICHT bestätigt, weil das zweite Tief
   * zwar höher, aber nicht *signifikant* höher ist.
   * Dies testet: isSignificantlyHigherThan()
   */
  upwardTrendFailsDueToInsufficientlyHigherLow(): TrendTestCase {
    const context = this.createContext(
      [
        {
          ohlcv: this.createOHLCV({ priceDate: '1', closePrice: 100 }),
          swingPointType: 'swingLow',
        },
        {
          ohlcv: this.createOHLCV({ priceDate: '2', closePrice: 110 }),
          swingPointType: 'swingHigh',
        },
        {
          ohlcv: this.createOHLCV({ priceDate: '3', closePrice: 101 }),
          swingPointType: 'swingLow',
        },
      ],
      {
        stepOptions: { trendDetection: { relativeThreshold: 0.01 } },
        steps: [],
        dataAggregation: { ticker: { exchange: '', symbol: '' } },
      },
    );
    return {
      name: 'should NOT confirm upward trend if low is not significantly higher',
      testcase: {
        expectedTrends: [],
        context,
      },
    };
  }

  /**
   * Ein Abwärtstrend wird NICHT bestätigt, weil das zweite Hoch
   * zwar tiefer, aber nicht *signifikant* tiefer ist.
   * Dies testet: isSignificantlyLowerThan()
   */
  downwardTrendFailsDueToInsufficientlyLowerHigh(): TrendTestCase {
    const context = this.createContext(
      [
        {
          ohlcv: this.createOHLCV({ priceDate: '1', closePrice: 100 }),
          swingPointType: 'swingHigh',
        },
        {
          ohlcv: this.createOHLCV({ priceDate: '2', closePrice: 90 }),
          swingPointType: 'swingLow',
        },
        {
          ohlcv: this.createOHLCV({ priceDate: '3', closePrice: 99 }),
          swingPointType: 'swingHigh',
        },
      ],
      {
        stepOptions: { trendDetection: { relativeThreshold: 0.01 } },
        steps: [],
        dataAggregation: { ticker: { exchange: '', symbol: '' } },
      },
    );
    return {
      name: 'should NOT confirm downward trend if high is not significantly lower',
      testcase: {
        expectedTrends: [],
        context,
      },
    };
  }

  /**
   * Ein laufender Aufwärtstrend bricht, weil ein neues Hoch
   * nicht signifikant höher ist (Stagnation).
   * Dies testet die Fortsetzungslogik.
   */
  upwardTrendBreaksDueToStallingHigh(): TrendTestCase {
    const startPoint: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '1', closePrice: 100 }),
      swingPointType: 'swingLow',
    };
    const confirmationPoint: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '3', closePrice: 105 }),
      swingPointType: 'swingLow',
    };
    const endPoint: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '5', closePrice: 108 }),
      swingPointType: 'swingLow',
    };
    const warningPoint: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '6', closePrice: 116 }),
      swingPointType: 'swingHigh',
    };

    const context = this.createContext(
      [
        startPoint,
        {
          ohlcv: this.createOHLCV({ priceDate: '2', closePrice: 110 }),
          swingPointType: 'swingHigh',
        },
        confirmationPoint,
        {
          ohlcv: this.createOHLCV({ priceDate: '4', closePrice: 115 }),
          swingPointType: 'swingHigh',
        }, // Continuation, Peak
        endPoint, // Confirmed
        warningPoint,
        {
          ohlcv: this.createOHLCV({ priceDate: '7', closePrice: 109 }),
          swingPointType: 'swingLow',
        }, // WARNING: stagnating Low
      ],
      {
        stepOptions: { trendDetection: { relativeThreshold: 0.01 } },
        steps: [],
        dataAggregation: { ticker: { exchange: '', symbol: '' } },
      },
    );
    return {
      name: 'should BREAK upward trend if new high is not significantly higher',
      testcase: {
        expectedTrends: [
          {
            type: 'upward',
            start: this.createEnrichedDataPointOf(startPoint),
            end: this.createEnrichedDataPointOf(endPoint),
            confirmation: this.createEnrichedDataPointOf(confirmationPoint),
            warnings: [this.createEnrichedDataPointOf(warningPoint)],
          },
        ],
        context,
      },
    };
  }

  /**
   * Ein laufender Abwärtstrend bricht, weil ein neues Tief
   * nicht signifikant tiefer ist (Stagnation).
   * Dies testet die Fortsetzungslogik.
   */
  downwardTrendBreaksDueToStallingLow(): TrendTestCase {
    const startPoint: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '1', closePrice: 100 }),
      swingPointType: 'swingHigh',
    };
    const confirmationPoint: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '3', closePrice: 95 }),
      swingPointType: 'swingHigh',
    };
    const endPoint: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '5', closePrice: 92 }),
      swingPointType: 'swingHigh',
    };
    const warningPoint: OHLCVRecord = {
      ohlcv: this.createOHLCV({ priceDate: '6', closePrice: 84.5 }),
      swingPointType: 'swingLow',
    };
    const context = this.createContext(
      [
        // 1. Abwärtstrend wird etabliert
        startPoint,
        {
          ohlcv: this.createOHLCV({ priceDate: '2', closePrice: 90 }),
          swingPointType: 'swingLow',
        },
        {
          ohlcv: this.createOHLCV({ priceDate: '3', closePrice: 95 }),
          swingPointType: 'swingHigh',
        }, // Confirmed Down (95 < 100)

        // 2. Trend wird fortgesetzt
        {
          ohlcv: this.createOHLCV({ priceDate: '4', closePrice: 85 }),
          swingPointType: 'swingLow',
        }, // Continuation (Talsohle), da 85 < 90
        endPoint, // Continuation, da 92 < 95

        // 3. Bruch durch Stagnation
        // 84.5 ist zwar < 85, aber nicht signifikant tiefer. Momentum ist weg -> Warning/Break.
        {
          ohlcv: this.createOHLCV({ priceDate: '6', closePrice: 84.5 }),
          swingPointType: 'swingLow',
        },
        {
          ohlcv: this.createOHLCV({ priceDate: '7', closePrice: 91.5 }),
          swingPointType: 'swingHigh',
        },
      ],
      {
        stepOptions: { trendDetection: { relativeThreshold: 0.01 } },
        steps: [],
        dataAggregation: { ticker: { exchange: '', symbol: '' } },
      },
    );
    return {
      name: 'should BREAK downward trend if new low is not significantly lower',
      testcase: {
        expectedTrends: [
          {
            type: 'downward',
            start: this.createEnrichedDataPointOf(startPoint),
            end: this.createEnrichedDataPointOf(endPoint),
            confirmation: this.createEnrichedDataPointOf(confirmationPoint),
            warnings: [this.createEnrichedDataPointOf(warningPoint)],
          },
        ],
        context,
      },
    };
  }

  /**
   * Ein Seitwärtstrend, bei dem Hochs und Tiefs nahe genug beieinander liegen.
   * Dies testet: isCloseEnough()
   */
  sidewaysTrendRecognizedAsNoUpDownTrend(): TrendTestCase {
    const context = this.createContext(
      [
        {
          ohlcv: this.createOHLCV({ priceDate: '1', closePrice: 99 }),
          swingPointType: 'swingLow',
        },
        {
          ohlcv: this.createOHLCV({ priceDate: '2', closePrice: 101 }),
          swingPointType: 'swingHigh',
        },
        {
          ohlcv: this.createOHLCV({ priceDate: '3', closePrice: 99.8 }),
          swingPointType: 'swingLow',
        },
        {
          ohlcv: this.createOHLCV({ priceDate: '4', closePrice: 101.5 }),
          swingPointType: 'swingHigh',
        },
      ],
      {
        stepOptions: { trendDetection: { relativeThreshold: 0.01 } },
        steps: [],
        dataAggregation: { ticker: { exchange: '', symbol: '' } },
      },
    );
    return {
      name: 'should NOT detect up/down trend during sideways movement',
      testcase: {
        expectedTrends: [],
        context,
      },
    };
  }
}
