import { OHLCV, OHLCVEntity } from '../data-aggregation/ohlcv.entity';
import { TestData } from './analysis.int.testdata';
import { TrendDataMetadata } from './core/analysis.interface';
import { EnrichedDataPoint, SwingPointType } from './core/enriched-data-point';
import { Trade } from './core/trade';

type TestDataSource = {
  points: {
    datum: OHLCVEntity;
    swingPoint?: SwingPointType;
    averageTrueRange: number;
  }[];
  trends: TrendDataMetadata['trendData'][];
  trades?: Trade[];
};

export class TestDatasets {
  getMCD_US_19800317_19800601(): Pick<TestData, 'data' | 'expected'> {
    return {
      data: MCD_US_19800317_19800601.points.map<OHLCV>((item) =>
        this.mapRawEodToEodPrice(item.datum),
      ),
      expected: MCD_US_19800317_19800601.points.map<EnrichedDataPoint>(
        this.getExpected(),
      ),
    };
  }

  getMCD_US_19800601_19801231(): Pick<TestData, 'data' | 'expected'> {
    return {
      data: MCD_US_19800601_19801231.points.map<OHLCV>((item) =>
        this.mapRawEodToEodPrice(item.datum),
      ),
      expected: MCD_US_19800601_19801231.points.map<EnrichedDataPoint>(
        this.getExpected(),
      ),
    };
  }

  getYValueSourceClose(): Pick<TestData, 'data' | 'expected'> {
    return {
      data: YValueSourceClose.points.map<OHLCV>((item) =>
        this.mapRawEodToEodPrice(item.datum),
      ),
      expected: YValueSourceClose.points.map<EnrichedDataPoint>(
        this.getExpected(),
      ),
    };
  }

  getYValueSourceOpen(): Pick<TestData, 'data' | 'expected'> {
    return {
      data: YValueSourceOpen.points.map<OHLCV>((item) =>
        this.mapRawEodToEodPrice(item.datum),
      ),
      expected: YValueSourceOpen.points.map<EnrichedDataPoint>(
        this.getExpected(),
      ),
    };
  }

  getYValueSourceHigh(): Pick<TestData, 'data' | 'expected'> {
    return {
      data: YValueSourceHigh.points.map<OHLCV>((item) =>
        this.mapRawEodToEodPrice(item.datum),
      ),
      expected: YValueSourceHigh.points.map<EnrichedDataPoint>(
        this.getExpected(),
      ),
    };
  }

  getYValueSourceLow(): Pick<TestData, 'data' | 'expected'> {
    return {
      data: YValueSourceLow.points.map<OHLCV>((item) =>
        this.mapRawEodToEodPrice(item.datum),
      ),
      expected: YValueSourceLow.points.map<EnrichedDataPoint>(
        this.getExpected(),
      ),
    };
  }

  getFullAnalysisWithATRData(): Pick<
    TestData,
    'data' | 'expected' | 'expectedTrends' | 'expectedTrades'
  > {
    return {
      data: FullAnalysisWithATR.points.map<OHLCV>((item) =>
        this.mapRawEodToEodPrice(item.datum),
      ),
      expected: FullAnalysisWithATR.points.map<EnrichedDataPoint>(
        this.getExpected(),
      ),
      expectedTrends: FullAnalysisWithATR.trends,
      expectedTrades: FullAnalysisWithATR.trades,
    };
  }

  private getExpected(): (item: {
    datum: OHLCVEntity;
    swingPoint: SwingPointType;
    averageTrueRange: number;
  }) => EnrichedDataPoint {
    return (item) => {
      const enrichedDataPoint = new EnrichedDataPoint(
        this.mapRawEodToEodPrice(item.datum),
      );
      if (item.swingPoint) {
        enrichedDataPoint.setSwingPointType(item.swingPoint);
      }
      if (item.averageTrueRange) {
        enrichedDataPoint.setAverageTrueRange(item.averageTrueRange);
      }
      return enrichedDataPoint;
    };
  }

  private mapRawEodToEodPrice(raw: OHLCVEntity): OHLCV {
    return new OHLCV(raw);
  }
}

const MCD_US_19800317_19800601: TestDataSource = {
  points: [
    // 0
    {
      datum: {
        securityId: 1,
        priceDate: '1980-03-17',
        openPrice: 124.9008,
        highPrice: 126.9856,
        lowPrice: 124.044,
        closePrice: 124.9008,
        adjustedClosePrice: 0.3792,
        volume: 1422012,
      },

      averageTrueRange: 0,
    },
    // 1
    {
      datum: {
        securityId: 1,
        priceDate: '1980-03-18',
        openPrice: 126.576,
        highPrice: 127.428,
        lowPrice: 124.4544,
        closePrice: 126.576,
        adjustedClosePrice: 0.3843,
        volume: 3517212,
      },

      averageTrueRange: 0,
    },
    // 2 swingHigh
    {
      datum: {
        securityId: 1,
        priceDate: '1980-03-19',
        openPrice: 127.84,
        highPrice: 128.6928,
        lowPrice: 126.1656,
        closePrice: 127.84,
        adjustedClosePrice: 0.3882,
        volume: 1078812,
      },
      swingPoint: 'swingHigh',
      averageTrueRange: 0,
    },
    // 3
    {
      datum: {
        securityId: 1,
        priceDate: '1980-03-20',
        openPrice: 126.576,
        highPrice: 128.6928,
        lowPrice: 125.308,
        closePrice: 126.576,
        adjustedClosePrice: 0.3843,
        volume: 750012,
      },

      averageTrueRange: 0,
    },
    // 4
    {
      datum: {
        securityId: 1,
        priceDate: '1980-03-21',
        openPrice: 125.308,
        highPrice: 126.9856,
        lowPrice: 125.308,
        closePrice: 125.308,
        adjustedClosePrice: 0.3805,
        volume: 586812,
      },

      averageTrueRange: 0,
    },
    // 5 swingLow
    {
      datum: {
        securityId: 1,
        priceDate: '1980-03-24',
        openPrice: 122.3736,
        highPrice: 126.1656,
        lowPrice: 122.3736,
        closePrice: 122.3736,
        adjustedClosePrice: 0.3716,
        volume: 613212,
      },
      swingPoint: 'swingLow',
      averageTrueRange: 0,
    },
    // 6
    {
      datum: {
        securityId: 1,
        priceDate: '1980-03-25',
        openPrice: 124.4544,
        highPrice: 125.308,
        lowPrice: 122.3736,
        closePrice: 124.4544,
        adjustedClosePrice: 0.3779,
        volume: 672000,
      },

      averageTrueRange: 0,
    },
    // 7
    {
      datum: {
        securityId: 1,
        priceDate: '1980-03-26',
        openPrice: 125.7216,
        highPrice: 127.84,
        lowPrice: 125.308,
        closePrice: 125.7216,
        adjustedClosePrice: 0.3817,
        volume: 963612,
      },

      averageTrueRange: 0,
    },
    // 8
    {
      datum: {
        securityId: 1,
        priceDate: '1980-03-27',
        openPrice: 126.576,
        highPrice: 127.428,
        lowPrice: 125.308,
        closePrice: 126.576,
        adjustedClosePrice: 0.3843,
        volume: 342012,
      },

      averageTrueRange: 0,
    },
    // 9
    {
      datum: {
        securityId: 1,
        priceDate: '1980-03-28',
        openPrice: 134.604,
        highPrice: 135.8704,
        lowPrice: 132.8944,
        closePrice: 134.604,
        adjustedClosePrice: 0.4087,
        volume: 1294812,
      },

      averageTrueRange: 0,
    },
    // 10 swingHigh
    {
      datum: {
        securityId: 1,
        priceDate: '1980-03-31',
        openPrice: 140.0712,
        highPrice: 140.0712,
        lowPrice: 133.308,
        closePrice: 140.0712,
        adjustedClosePrice: 0.4253,
        volume: 615612,
      },
      swingPoint: 'swingHigh',
      averageTrueRange: 0,
    },
    // 11 swingLow
    {
      datum: {
        securityId: 1,
        priceDate: '1980-04-01',
        openPrice: 139.216,
        highPrice: 140.0712,
        lowPrice: 138.808,
        closePrice: 139.216,
        adjustedClosePrice: 0.4227,
        volume: 550812,
      },
      swingPoint: 'swingLow',
      averageTrueRange: 0,
    },
    // 12
    {
      datum: {
        securityId: 1,
        priceDate: '1980-04-02',
        openPrice: 140.0712,
        highPrice: 140.9296,
        lowPrice: 136.6888,
        closePrice: 140.0712,
        adjustedClosePrice: 0.4253,
        volume: 668412,
      },

      averageTrueRange: 0,
    },
    // 13 swingHigh
    {
      datum: {
        securityId: 1,
        priceDate: '1980-04-03',
        openPrice: 141.7824,
        highPrice: 141.7824,
        lowPrice: 139.216,
        closePrice: 141.7824,
        adjustedClosePrice: 0.4305,
        volume: 474012,
      },
      swingPoint: 'swingHigh',
      averageTrueRange: 0,
    },
    // 14 swingLow
    {
      datum: {
        securityId: 1,
        priceDate: '1980-04-07',
        openPrice: 138.808,
        highPrice: 140.9296,
        lowPrice: 138.808,
        closePrice: 138.808,
        adjustedClosePrice: 0.4215,
        volume: 1135212,
      },
      swingPoint: 'swingLow',
      averageTrueRange: 0,
    },
    // 15 swingHigh
    {
      datum: {
        securityId: 1,
        priceDate: '1980-04-08',
        openPrice: 139.6608,
        highPrice: 140.0712,
        lowPrice: 137.544,
        closePrice: 139.6608,
        adjustedClosePrice: 0.4241,
        volume: 489600,
      },
      swingPoint: 'swingHigh',
      averageTrueRange: 0,
    },
    // 16
    {
      datum: {
        securityId: 1,
        priceDate: '1980-04-09',
        openPrice: 140.0712,
        highPrice: 140.9296,
        lowPrice: 138.808,
        closePrice: 140.0712,
        adjustedClosePrice: 0.4253,
        volume: 670812,
      },

      averageTrueRange: 0,
    },
    // 17
    {
      datum: {
        securityId: 1,
        priceDate: '1980-04-10',
        openPrice: 139.6608,
        highPrice: 140.4856,
        lowPrice: 139.216,
        closePrice: 139.6608,
        adjustedClosePrice: 0.4241,
        volume: 1220412,
      },

      averageTrueRange: 0,
    },
    // 18
    {
      datum: {
        securityId: 1,
        priceDate: '1980-04-11',
        openPrice: 137.9584,
        highPrice: 140.0712,
        lowPrice: 137.9584,
        closePrice: 137.9584,
        adjustedClosePrice: 0.4189,
        volume: 818412,
      },

      averageTrueRange: 0,
    },
    // 19 swingLow
    {
      datum: {
        securityId: 1,
        priceDate: '1980-04-14',
        openPrice: 136.6888,
        highPrice: 137.544,
        lowPrice: 136.2808,
        closePrice: 136.6888,
        adjustedClosePrice: 0.415,
        volume: 390012,
      },
      swingPoint: 'swingLow',
      averageTrueRange: 0,
    },
    // 20
    {
      datum: {
        securityId: 1,
        priceDate: '1980-04-15',
        openPrice: 136.2808,
        highPrice: 137.1336,
        lowPrice: 135.4248,
        closePrice: 136.2808,
        adjustedClosePrice: 0.4138,
        volume: 682812,
      },

      averageTrueRange: 0,
    },
    // 21
    {
      datum: {
        securityId: 1,
        priceDate: '1980-04-16',
        openPrice: 136.2808,
        highPrice: 137.544,
        lowPrice: 136.2808,
        closePrice: 136.2808,
        adjustedClosePrice: 0.4138,
        volume: 933612,
      },

      averageTrueRange: 0,
    },
    // 22
    {
      datum: {
        securityId: 1,
        priceDate: '1980-04-17',
        openPrice: 136.2808,
        highPrice: 136.2808,
        lowPrice: 135.0168,
        closePrice: 136.2808,
        adjustedClosePrice: 0.4138,
        volume: 378012,
      },

      averageTrueRange: 0,
    },
    // 23
    {
      datum: {
        securityId: 1,
        priceDate: '1980-04-18',
        openPrice: 136.2808,
        highPrice: 137.9584,
        lowPrice: 135.8704,
        closePrice: 136.2808,
        adjustedClosePrice: 0.4138,
        volume: 429612,
      },

      averageTrueRange: 0,
    },
    // 24
    {
      datum: {
        securityId: 1,
        priceDate: '1980-04-21',
        openPrice: 135.8704,
        highPrice: 136.6888,
        lowPrice: 135.0168,
        closePrice: 135.8704,
        adjustedClosePrice: 0.4126,
        volume: 706812,
      },

      averageTrueRange: 0,
    },
    // 25
    {
      datum: {
        securityId: 1,
        priceDate: '1980-04-22',
        openPrice: 141.7824,
        highPrice: 142.188,
        lowPrice: 137.544,
        closePrice: 141.7824,
        adjustedClosePrice: 0.4305,
        volume: 1513212,
      },

      averageTrueRange: 0,
    },
    // 26 swingHigh
    {
      datum: {
        securityId: 1,
        priceDate: '1980-04-23',
        openPrice: 144.72,
        highPrice: 148.5112,
        lowPrice: 144.3096,
        closePrice: 144.72,
        adjustedClosePrice: 0.4394,
        volume: 1548012,
      },
      swingPoint: 'swingHigh',
      averageTrueRange: 0,
    },
    // 27
    {
      datum: {
        securityId: 1,
        priceDate: '1980-04-24',
        openPrice: 144.3096,
        highPrice: 146.3976,
        lowPrice: 144.3096,
        closePrice: 144.3096,
        adjustedClosePrice: 0.4382,
        volume: 1382400,
      },

      averageTrueRange: 0,
    },
    // 28
    {
      datum: {
        securityId: 1,
        priceDate: '1980-04-25',
        openPrice: 142.6024,
        highPrice: 142.6024,
        lowPrice: 140.9296,
        closePrice: 142.6024,
        adjustedClosePrice: 0.433,
        volume: 1390812,
      },

      averageTrueRange: 0,
    },
    // 29 swingLow
    {
      datum: {
        securityId: 1,
        priceDate: '1980-04-28',
        openPrice: 139.6608,
        highPrice: 142.188,
        lowPrice: 139.6608,
        closePrice: 139.6608,
        adjustedClosePrice: 0.4241,
        volume: 70812,
      },
      swingPoint: 'swingLow',
      averageTrueRange: 0,
    },
    // 30
    {
      datum: {
        securityId: 1,
        priceDate: '1980-04-29',
        openPrice: 140.0712,
        highPrice: 140.9296,
        lowPrice: 138.808,
        closePrice: 140.0712,
        adjustedClosePrice: 0.4253,
        volume: 508800,
      },

      averageTrueRange: 0,
    },
    // 31
    {
      datum: {
        securityId: 1,
        priceDate: '1980-04-30',
        openPrice: 143.8656,
        highPrice: 144.3096,
        lowPrice: 140.0712,
        closePrice: 143.8656,
        adjustedClosePrice: 0.4368,
        volume: 2659200,
      },

      averageTrueRange: 0,
    },
    // 32
    {
      datum: {
        securityId: 1,
        priceDate: '1980-05-01',
        openPrice: 145.1296,
        highPrice: 145.1296,
        lowPrice: 143.8656,
        closePrice: 145.1296,
        adjustedClosePrice: 0.4407,
        volume: 997212,
      },

      averageTrueRange: 0,
    },
    // 33
    {
      datum: {
        securityId: 1,
        priceDate: '1980-05-02',
        openPrice: 148.1008,
        highPrice: 148.5112,
        lowPrice: 144.3096,
        closePrice: 148.1008,
        adjustedClosePrice: 0.4497,
        volume: 462012,
      },

      averageTrueRange: 0,
    },
    // 34 swingHigh
    {
      datum: {
        securityId: 1,
        priceDate: '1980-05-05',
        openPrice: 151.4848,
        highPrice: 151.4848,
        lowPrice: 146.8368,
        closePrice: 151.4848,
        adjustedClosePrice: 0.46,
        volume: 1033212,
      },
      swingPoint: 'swingHigh',
      averageTrueRange: 0,
    },
    // 35 swingLow
    {
      datum: {
        securityId: 1,
        priceDate: '1980-05-06',
        openPrice: 149.7784,
        highPrice: 152.3056,
        lowPrice: 149.364,
        closePrice: 149.7784,
        adjustedClosePrice: 0.4548,
        volume: 2758812,
      },
      swingPoint: 'swingLow',
      averageTrueRange: 0,
    },
    // 36 swingHigh
    {
      datum: {
        securityId: 1,
        priceDate: '1980-05-07',
        openPrice: 151.0416,
        highPrice: 152.3056,
        lowPrice: 148.5112,
        closePrice: 151.0416,
        adjustedClosePrice: 0.4586,
        volume: 1207212,
      },
      swingPoint: 'swingHigh',
      averageTrueRange: 0,
    },
    // 37 swingLow
    {
      datum: {
        securityId: 1,
        priceDate: '1980-05-08',
        openPrice: 148.5112,
        highPrice: 151.8976,
        lowPrice: 147.6568,
        closePrice: 148.5112,
        adjustedClosePrice: 0.4509,
        volume: 1141212,
      },
      swingPoint: 'swingLow', // kam von oben und macht Knick zur Seite
      averageTrueRange: 0,
    },
    // 38
    {
      datum: {
        securityId: 1,
        priceDate: '1980-05-09',
        openPrice: 148.5112,
        highPrice: 148.5112,
        lowPrice: 147.2512,
        closePrice: 148.5112,
        adjustedClosePrice: 0.4509,
        volume: 217212,
      },

      averageTrueRange: 0,
    },
    // 39
    {
      datum: {
        securityId: 1,
        priceDate: '1980-05-12',
        openPrice: 150.1888,
        highPrice: 150.1888,
        lowPrice: 146.8368,
        closePrice: 150.1888,
        adjustedClosePrice: 0.456,
        volume: 559212,
      },

      averageTrueRange: 0,
    },
    // 40
    {
      datum: {
        securityId: 1,
        priceDate: '1980-05-13',
        openPrice: 154.4248,
        highPrice: 155.692,
        lowPrice: 150.1888,
        closePrice: 154.4248,
        adjustedClosePrice: 0.4689,
        volume: 2302812,
      },

      averageTrueRange: 0,
    },
    // 41
    {
      datum: {
        securityId: 1,
        priceDate: '1980-05-14',
        openPrice: 157.3656,
        highPrice: 158.6296,
        lowPrice: 155.2776,
        closePrice: 157.3656,
        adjustedClosePrice: 0.4778,
        volume: 1814400,
      },

      averageTrueRange: 0,
    },
    // 42
    {
      datum: {
        securityId: 1,
        priceDate: '1980-05-15',
        openPrice: 157.8048,
        highPrice: 158.6296,
        lowPrice: 156.5464,
        closePrice: 157.8048,
        adjustedClosePrice: 0.4792,
        volume: 1215612,
      },

      averageTrueRange: 0,
    },
    // 43
    {
      datum: {
        securityId: 1,
        priceDate: '1980-05-16',
        openPrice: 157.8048,
        highPrice: 158.2192,
        lowPrice: 156.5464,
        closePrice: 157.8048,
        adjustedClosePrice: 0.4792,
        volume: 993600,
      },

      averageTrueRange: 0,
    },
    // 44
    {
      datum: {
        securityId: 1,
        priceDate: '1980-05-19',
        openPrice: 158.2192,
        highPrice: 159.4824,
        lowPrice: 156.952,
        closePrice: 158.2192,
        adjustedClosePrice: 0.4804,
        volume: 709212,
      },

      averageTrueRange: 0,
    },
    // 45
    {
      datum: {
        securityId: 1,
        priceDate: '1980-05-20',
        openPrice: 159.8928,
        highPrice: 160.3368,
        lowPrice: 156.5464,
        closePrice: 159.8928,
        adjustedClosePrice: 0.4855,
        volume: 1104000,
      },

      averageTrueRange: 0,
    },
    // 46
    {
      datum: {
        securityId: 1,
        priceDate: '1980-05-21',
        openPrice: 159.4824,
        highPrice: 160.3368,
        lowPrice: 158.2192,
        closePrice: 159.4824,
        adjustedClosePrice: 0.4842,
        volume: 1617600,
      },

      averageTrueRange: 0,
    },
    // 47
    {
      datum: {
        securityId: 1,
        priceDate: '1980-05-22',
        openPrice: 159.0736,
        highPrice: 160.3368,
        lowPrice: 158.6296,
        closePrice: 159.0736,
        adjustedClosePrice: 0.483,
        volume: 1095612,
      },

      averageTrueRange: 0,
    },
    // 48 swingHigh
    {
      datum: {
        securityId: 1,
        priceDate: '1980-05-23',
        openPrice: 161.6008,
        highPrice: 161.6008,
        lowPrice: 159.8928,
        closePrice: 161.6008,
        adjustedClosePrice: 0.4907,
        volume: 1662012,
      },
      swingPoint: 'swingHigh',
      averageTrueRange: 0,
    },
    // 49
    {
      datum: {
        securityId: 1,
        priceDate: '1980-05-27',
        openPrice: 159.0736,
        highPrice: 161.6008,
        lowPrice: 158.6296,
        closePrice: 159.0736,
        adjustedClosePrice: 0.483,
        volume: 1569600,
      },

      averageTrueRange: 0,
    },
    // 50
    {
      datum: {
        securityId: 1,
        priceDate: '1980-05-28',
        openPrice: 159.4824,
        highPrice: 160.3368,
        lowPrice: 159.0736,
        closePrice: 159.4824,
        adjustedClosePrice: 0.4842,
        volume: 598812,
      },

      averageTrueRange: 0,
    },
    // 51
    {
      datum: {
        securityId: 1,
        priceDate: '1980-05-29',
        openPrice: 157.8048,
        highPrice: 160.3368,
        lowPrice: 157.3656,
        closePrice: 157.8048,
        adjustedClosePrice: 0.4792,
        volume: 2584812,
      },

      averageTrueRange: 0,
    },
    // 52
    {
      datum: {
        securityId: 1,
        priceDate: '1980-05-30',
        openPrice: 158.2192,
        highPrice: 158.2192,
        lowPrice: 154.8328,
        closePrice: 158.2192,
        adjustedClosePrice: 0.4804,
        volume: 721212,
      },

      averageTrueRange: 0,
    },
  ],
  trends: [],
};

const MCD_US_19800601_19801231: TestDataSource = {
  points: [
    // 0
    {
      datum: {
        securityId: 1,
        priceDate: '1980-06-02',
        openPrice: 157.8048,
        highPrice: 158.2192,
        lowPrice: 155.2776,
        closePrice: 157.8048,
        adjustedClosePrice: 0.4792,
        volume: 1486812,
      },

      averageTrueRange: 0,
    },
    // 1
    {
      datum: {
        securityId: 1,
        priceDate: '1980-06-03',
        openPrice: 156.5464,
        highPrice: 156.5464,
        lowPrice: 155.692,
        closePrice: 156.5464,
        adjustedClosePrice: 0.4753,
        volume: 800412,
      },

      averageTrueRange: 0,
    },
    // 2
    {
      datum: {
        securityId: 1,
        priceDate: '1980-06-04',
        openPrice: 159.4824,
        highPrice: 159.4824,
        lowPrice: 156.1024,
        closePrice: 159.4824,
        adjustedClosePrice: 0.4842,
        volume: 871212,
      },

      averageTrueRange: 0,
    },
    // 3
    {
      datum: {
        securityId: 1,
        priceDate: '1980-06-05',
        openPrice: 158.2192,
        highPrice: 161.1576,
        lowPrice: 158.2192,
        closePrice: 158.2192,
        adjustedClosePrice: 0.481,
        volume: 1708800,
      },

      averageTrueRange: 0,
    },
    // 4
    {
      datum: {
        securityId: 1,
        priceDate: '1980-06-06',
        openPrice: 159.0736,
        highPrice: 159.0736,
        lowPrice: 157.8048,
        closePrice: 159.0736,
        adjustedClosePrice: 0.4836,
        volume: 902400,
      },

      averageTrueRange: 0,
    },
    // 5
    {
      datum: {
        securityId: 1,
        priceDate: '1980-06-09',
        openPrice: 161.6008,
        highPrice: 162.0144,
        lowPrice: 160.7464,
        closePrice: 161.6008,
        adjustedClosePrice: 0.5177,
        volume: 637212,
      },

      averageTrueRange: 0,
    },
    // 6
    {
      datum: {
        securityId: 1,
        priceDate: '1980-06-10',
        openPrice: 162.42,
        highPrice: 162.864,
        lowPrice: 159.8928,
        closePrice: 162.42,
        adjustedClosePrice: 0.5203,
        volume: 620412,
      },

      averageTrueRange: 0,
    },
    // 7
    {
      datum: {
        securityId: 1,
        priceDate: '1980-06-11',
        openPrice: 165.8056,
        highPrice: 166.2448,
        lowPrice: 162.0144,
        closePrice: 165.8056,
        adjustedClosePrice: 0.5311,
        volume: 1572012,
      },

      averageTrueRange: 0,
    },
    // 8
    {
      datum: {
        securityId: 1,
        priceDate: '1980-06-12',
        openPrice: 166.6584,
        highPrice: 168.7776,
        lowPrice: 164.9488,
        closePrice: 166.6584,
        adjustedClosePrice: 0.5339,
        volume: 661212,
      },

      averageTrueRange: 0,
    },
    // 9
    {
      datum: {
        securityId: 1,
        priceDate: '1980-06-13',
        openPrice: 167.0688,
        highPrice: 168.7776,
        lowPrice: 167.0688,
        closePrice: 167.0688,
        adjustedClosePrice: 0.5352,
        volume: 954012,
      },

      averageTrueRange: 0,
    },
    // 10 swingHigh
    {
      datum: {
        securityId: 1,
        priceDate: '1980-06-16',
        openPrice: 170.0416,
        highPrice: 170.4552,
        lowPrice: 167.4816,
        closePrice: 170.0416,
        adjustedClosePrice: 0.5447,
        volume: 1267200,
      },
      swingPoint: 'swingHigh',
      averageTrueRange: 0,
    },
    // 11
    {
      datum: {
        securityId: 1,
        priceDate: '1980-06-17',
        openPrice: 171.3088,
        highPrice: 173.836,
        lowPrice: 170.8624,
        closePrice: 171.3088,
        adjustedClosePrice: 0.5487,
        volume: 2350812,
      },

      averageTrueRange: 0,
    },
    // 12
    {
      datum: {
        securityId: 1,
        priceDate: '1980-06-18',
        openPrice: 167.9224,
        highPrice: 170.8624,
        lowPrice: 167.0688,
        closePrice: 167.9224,
        adjustedClosePrice: 0.5379,
        volume: 3193212,
      },

      averageTrueRange: 0,
    },
    // 13 swingLow
    {
      datum: {
        securityId: 1,
        priceDate: '1980-06-19',
        openPrice: 162.864,
        highPrice: 168.3328,
        lowPrice: 162.864,
        closePrice: 162.864,
        adjustedClosePrice: 0.5217,
        volume: 420012,
      },
      swingPoint: 'swingLow',
      averageTrueRange: 0,
    },
    // 14
    {
      datum: {
        securityId: 1,
        priceDate: '1980-06-20',
        openPrice: 164.9488,
        highPrice: 165.3952,
        lowPrice: 162.42,
        closePrice: 164.9488,
        adjustedClosePrice: 0.5284,
        volume: 358812,
      },

      averageTrueRange: 0,
    },
    // 15
    {
      datum: {
        securityId: 1,
        priceDate: '1980-06-23',
        openPrice: 167.0688,
        highPrice: 167.0688,
        lowPrice: 164.9488,
        closePrice: 167.0688,
        adjustedClosePrice: 0.5352,
        volume: 975612,
      },

      averageTrueRange: 0,
    },
    // 16
    {
      datum: {
        securityId: 1,
        priceDate: '1980-06-24',
        openPrice: 167.0688,
        highPrice: 167.4816,
        lowPrice: 165.3952,
        closePrice: 167.0688,
        adjustedClosePrice: 0.5352,
        volume: 390012,
      },

      averageTrueRange: 0,
    },
    // 17 swingHigh
    {
      datum: {
        securityId: 1,
        priceDate: '1980-06-25',
        openPrice: 169.1856,
        highPrice: 169.1856,
        lowPrice: 166.6584,
        closePrice: 169.1856,
        adjustedClosePrice: 0.5419,
        volume: 810012,
      },
      swingPoint: 'swingHigh',
      averageTrueRange: 0,
    },
    // 18
    {
      datum: {
        securityId: 1,
        priceDate: '1980-06-26',
        openPrice: 165.8056,
        highPrice: 169.596,
        lowPrice: 165.8056,
        closePrice: 165.8056,
        adjustedClosePrice: 0.5311,
        volume: 961212,
      },

      averageTrueRange: 0,
    },
    // 19
    {
      datum: {
        securityId: 1,
        priceDate: '1980-06-27',
        openPrice: 165.8056,
        highPrice: 166.6584,
        lowPrice: 164.128,
        closePrice: 165.8056,
        adjustedClosePrice: 0.5311,
        volume: 924012,
      },

      averageTrueRange: 0,
    },
    // 20 swingLow
    {
      datum: {
        securityId: 1,
        priceDate: '1980-06-30',
        openPrice: 162.864,
        highPrice: 164.9488,
        lowPrice: 162.864,
        closePrice: 162.864,
        adjustedClosePrice: 0.5217,
        volume: 421212,
      },
      swingPoint: 'swingLow',
      averageTrueRange: 0,
    },
    // 21 swingHigh
    {
      datum: {
        securityId: 1,
        priceDate: '1980-07-01',
        openPrice: 164.5416,
        highPrice: 164.5416,
        lowPrice: 162.0144,
        closePrice: 164.5416,
        adjustedClosePrice: 0.5271,
        volume: 346812,
      },
      swingPoint: 'swingHigh',
      averageTrueRange: 0,
    },
    // 22
    {
      datum: {
        securityId: 1,
        priceDate: '1980-07-02',
        openPrice: 162.0144,
        highPrice: 164.5416,
        lowPrice: 162.0144,
        closePrice: 162.0144,
        adjustedClosePrice: 0.519,
        volume: 2052012,
      },

      averageTrueRange: 0,
    },
    // 23
    {
      datum: {
        securityId: 1,
        priceDate: '1980-07-03',
        openPrice: 162.864,
        highPrice: 162.864,
        lowPrice: 161.1576,
        closePrice: 162.864,
        adjustedClosePrice: 0.5217,
        volume: 194412,
      },

      averageTrueRange: 0,
    },
    // 24
    {
      datum: {
        securityId: 1,
        priceDate: '1980-07-04',
        openPrice: 163.6848,
        highPrice: 164.128,
        lowPrice: 162.0144,
        closePrice: 163.6848,
        adjustedClosePrice: 0.5243,
        volume: 1056120,
      },

      averageTrueRange: 0,
    },
    // 25
    {
      datum: {
        securityId: 1,
        priceDate: '1980-07-07',
        openPrice: 163.6848,
        highPrice: 164.128,
        lowPrice: 160.7464,
        closePrice: 163.6848,
        adjustedClosePrice: 0.5243,
        volume: 1611612,
      },

      averageTrueRange: 0,
    },
    // 26
    {
      datum: {
        securityId: 1,
        priceDate: '1980-07-08',
        openPrice: 164.9488,
        highPrice: 165.8056,
        lowPrice: 163.2736,
        closePrice: 164.9488,
        adjustedClosePrice: 0.5284,
        volume: 1155612,
      },

      averageTrueRange: 0,
    },
    // 27
    {
      datum: {
        securityId: 1,
        priceDate: '1980-07-09',
        openPrice: 164.5416,
        highPrice: 166.2448,
        lowPrice: 164.128,
        closePrice: 164.5416,
        adjustedClosePrice: 0.5271,
        volume: 750012,
      },

      averageTrueRange: 0,
    },
    // 28 swingLow
    {
      datum: {
        securityId: 1,
        priceDate: '1980-07-10',
        openPrice: 161.1576,
        highPrice: 163.2736,
        lowPrice: 161.1576,
        closePrice: 161.1576,
        adjustedClosePrice: 0.5162,
        volume: 580800,
      },
      swingPoint: 'swingLow',
      averageTrueRange: 0,
    },
    // 29
    {
      datum: {
        securityId: 1,
        priceDate: '1980-07-11',
        openPrice: 162.0144,
        highPrice: 163.6848,
        lowPrice: 161.1576,
        closePrice: 162.0144,
        adjustedClosePrice: 0.519,
        volume: 370812,
      },

      averageTrueRange: 0,
    },
    // 30
    {
      datum: {
        securityId: 1,
        priceDate: '1980-07-14',
        openPrice: 165.8056,
        highPrice: 166.2448,
        lowPrice: 161.6008,
        closePrice: 165.8056,
        adjustedClosePrice: 0.5311,
        volume: 579612,
      },

      averageTrueRange: 0,
    },
    // 31 swingHigh
    {
      datum: {
        securityId: 1,
        priceDate: '1980-07-15',
        openPrice: 167.4816,
        highPrice: 169.596,
        lowPrice: 167.4816,
        closePrice: 167.4816,
        adjustedClosePrice: 0.5365,
        volume: 1521600,
      },
      swingPoint: 'swingHigh',
      averageTrueRange: 0,
    },
    // 32
    {
      datum: {
        securityId: 1,
        priceDate: '1980-07-16',
        openPrice: 166.6584,
        highPrice: 168.7776,
        lowPrice: 165.3952,
        closePrice: 166.6584,
        adjustedClosePrice: 0.5339,
        volume: 1860012,
      },

      averageTrueRange: 0,
    },
    // 33
    {
      datum: {
        securityId: 1,
        priceDate: '1980-07-17',
        openPrice: 165.3952,
        highPrice: 165.8056,
        lowPrice: 163.6848,
        closePrice: 165.3952,
        adjustedClosePrice: 0.5298,
        volume: 900012,
      },

      averageTrueRange: 0,
    },
    // 34
    {
      datum: {
        securityId: 1,
        priceDate: '1980-07-18',
        openPrice: 163.2736,
        highPrice: 164.9488,
        lowPrice: 162.0144,
        closePrice: 163.2736,
        adjustedClosePrice: 0.523,
        volume: 2251200,
      },

      averageTrueRange: 0,
    },
    // 35 swingLow
    {
      datum: {
        securityId: 1,
        priceDate: '1980-07-21',
        openPrice: 159.4824,
        highPrice: 163.2736,
        lowPrice: 157.8048,
        closePrice: 159.4824,
        adjustedClosePrice: 0.5109,
        volume: 1123200,
      },
      swingPoint: 'swingLow',
      averageTrueRange: 0,
    },
    // 36
    {
      datum: {
        securityId: 1,
        priceDate: '1980-07-22',
        openPrice: 160.3368,
        highPrice: 161.6008,
        lowPrice: 159.8928,
        closePrice: 160.3368,
        adjustedClosePrice: 0.5136,
        volume: 676800,
      },

      averageTrueRange: 0,
    },
    // 37 swingHigh
    {
      datum: {
        securityId: 1,
        priceDate: '1980-07-23',
        openPrice: 162.0144,
        highPrice: 162.0144,
        lowPrice: 159.0736,
        closePrice: 162.0144,
        adjustedClosePrice: 0.519,
        volume: 1017600,
      },
      swingPoint: 'swingHigh',
      averageTrueRange: 0,
    },
    // 38
    {
      datum: {
        securityId: 1,
        priceDate: '1980-07-24',
        openPrice: 156.1024,
        highPrice: 160.3368,
        lowPrice: 154.0144,
        closePrice: 156.1024,
        adjustedClosePrice: 0.5007,
        volume: 1918812,
      },

      averageTrueRange: 0,
    },
    // 39 swingLow
    {
      datum: {
        securityId: 1,
        priceDate: '1980-07-25',
        openPrice: 152.7184,
        highPrice: 156.5464,
        lowPrice: 150.1888,
        closePrice: 152.7184,
        adjustedClosePrice: 0.4898,
        volume: 1327212,
      },
      swingPoint: 'swingLow',
      averageTrueRange: 0,
    },
    // 40
    {
      datum: {
        securityId: 1,
        priceDate: '1980-07-28',
        openPrice: 153.5688,
        highPrice: 153.5688,
        lowPrice: 152.3056,
        closePrice: 153.5688,
        adjustedClosePrice: 0.5201,
        volume: 1450812,
      },

      averageTrueRange: 0,
    },
    // 41 swingHigh
    {
      datum: {
        securityId: 1,
        priceDate: '1980-07-29',
        openPrice: 161.6008,
        highPrice: 162.42,
        lowPrice: 153.5688,
        closePrice: 161.6008,
        adjustedClosePrice: 0.5473,
        volume: 1045212,
      },
      swingPoint: 'swingHigh',
      averageTrueRange: 0,
    },
    // 42
    {
      datum: {
        securityId: 1,
        priceDate: '1980-07-30',
        openPrice: 161.6008,
        highPrice: 162.0144,
        lowPrice: 157.8048,
        closePrice: 161.6008,
        adjustedClosePrice: 0.5473,
        volume: 1236012,
      },

      averageTrueRange: 0,
    },
    // 43
    {
      datum: {
        securityId: 1,
        priceDate: '1980-07-31',
        openPrice: 157.8048,
        highPrice: 160.3368,
        lowPrice: 156.5464,
        closePrice: 157.8048,
        adjustedClosePrice: 0.5345,
        volume: 1462812,
      },

      averageTrueRange: 0,
    },
    // 44 swingLow
    {
      datum: {
        securityId: 1,
        priceDate: '1980-08-01',
        openPrice: 154.4248,
        highPrice: 157.8048,
        lowPrice: 153.5688,
        closePrice: 154.4248,
        adjustedClosePrice: 0.523,
        volume: 1170012,
      },
      swingPoint: 'swingLow',
      averageTrueRange: 0,
    },
    // 45
    {
      datum: {
        securityId: 1,
        priceDate: '1980-08-04',
        openPrice: 154.4248,
        highPrice: 155.2776,
        lowPrice: 153.5688,
        closePrice: 154.4248,
        adjustedClosePrice: 0.523,
        volume: 2540412,
      },

      averageTrueRange: 0,
    },
    // 46
    {
      datum: {
        securityId: 1,
        priceDate: '1980-08-05',
        openPrice: 154.4248,
        highPrice: 156.952,
        lowPrice: 153.1608,
        closePrice: 154.4248,
        adjustedClosePrice: 0.523,
        volume: 1375212,
      },

      averageTrueRange: 0,
    },
    // 47
    {
      datum: {
        securityId: 1,
        priceDate: '1980-08-06',
        openPrice: 154.4248,
        highPrice: 154.4248,
        lowPrice: 151.8976,
        closePrice: 154.4248,
        adjustedClosePrice: 0.523,
        volume: 1632000,
      },

      averageTrueRange: 0,
    },
    // 48
    {
      datum: {
        securityId: 1,
        priceDate: '1980-08-07',
        openPrice: 160.3368,
        highPrice: 160.3368,
        lowPrice: 155.2776,
        closePrice: 160.3368,
        adjustedClosePrice: 0.543,
        volume: 2433600,
      },

      averageTrueRange: 0,
    },
    // 49
    {
      datum: {
        securityId: 1,
        priceDate: '1980-08-08',
        openPrice: 165.3952,
        highPrice: 167.0688,
        lowPrice: 162.0144,
        closePrice: 165.3952,
        adjustedClosePrice: 0.5602,
        volume: 3916800,
      },

      averageTrueRange: 0,
    },
    // 50 swingHigh
    {
      datum: {
        securityId: 1,
        priceDate: '1980-08-11',
        openPrice: 172.5688,
        highPrice: 173.3896,
        lowPrice: 167.0688,
        closePrice: 172.5688,
        adjustedClosePrice: 0.5845,
        volume: 1434012,
      },
      swingPoint: 'swingHigh',
      averageTrueRange: 0,
    },
    // 51
    {
      datum: {
        securityId: 1,
        priceDate: '1980-08-12',
        openPrice: 172.1256,
        highPrice: 175.0992,
        lowPrice: 172.1256,
        closePrice: 172.1256,
        adjustedClosePrice: 0.583,
        volume: 2142012,
      },

      averageTrueRange: 0,
    },
    // 52 swingLow
    {
      datum: {
        securityId: 1,
        priceDate: '1980-08-13',
        openPrice: 168.7776,
        highPrice: 171.3088,
        lowPrice: 168.3328,
        closePrice: 168.7776,
        adjustedClosePrice: 0.5716,
        volume: 2890812,
      },
      swingPoint: 'swingLow',
      averageTrueRange: 0,
    },
    // 53 swingHigh
    {
      datum: {
        securityId: 1,
        priceDate: '1980-08-14',
        openPrice: 174.2464,
        highPrice: 174.2464,
        lowPrice: 168.3328,
        closePrice: 174.2464,
        adjustedClosePrice: 0.5901,
        volume: 1992000,
      },
      swingPoint: 'swingHigh',
      averageTrueRange: 0,
    },
    // 54
    {
      datum: {
        securityId: 1,
        priceDate: '1980-08-15',
        openPrice: 169.596,
        highPrice: 175.5096,
        lowPrice: 169.596,
        closePrice: 169.596,
        adjustedClosePrice: 0.5744,
        volume: 1062012,
      },

      averageTrueRange: 0,
    },
    // 55
    {
      datum: {
        securityId: 1,
        priceDate: '1980-08-18',
        openPrice: 166.6584,
        highPrice: 170.4552,
        lowPrice: 165.3952,
        closePrice: 166.6584,
        adjustedClosePrice: 0.5645,
        volume: 475200,
      },

      averageTrueRange: 0,
    },
    // 56 swingLow
    {
      datum: {
        securityId: 1,
        priceDate: '1980-08-19',
        openPrice: 161.6008,
        highPrice: 166.6584,
        lowPrice: 161.1576,
        closePrice: 161.6008,
        adjustedClosePrice: 0.5473,
        volume: 998400,
      },
      swingPoint: 'swingLow',
      averageTrueRange: 0,
    },
    // 57
    {
      datum: {
        securityId: 1,
        priceDate: '1980-08-20',
        openPrice: 162.864,
        highPrice: 163.6848,
        lowPrice: 161.1576,
        closePrice: 162.864,
        adjustedClosePrice: 0.5516,
        volume: 1017600,
      },

      averageTrueRange: 0,
    },
    // 58
    {
      datum: {
        securityId: 1,
        priceDate: '1980-08-21',
        openPrice: 164.5416,
        highPrice: 164.9488,
        lowPrice: 162.864,
        closePrice: 164.5416,
        adjustedClosePrice: 0.5573,
        volume: 828012,
      },

      averageTrueRange: 0,
    },
    // 59 swingHigh
    {
      datum: {
        securityId: 1,
        priceDate: '1980-08-22',
        openPrice: 167.0688,
        highPrice: 167.9224,
        lowPrice: 165.8056,
        closePrice: 167.0688,
        adjustedClosePrice: 0.5658,
        volume: 1260012,
      },
      swingPoint: 'swingHigh',
      averageTrueRange: 0,
    },
    // 60
    {
      datum: {
        securityId: 1,
        priceDate: '1980-08-25',
        openPrice: 167.9224,
        highPrice: 167.9224,
        lowPrice: 165.3952,
        closePrice: 167.9224,
        adjustedClosePrice: 0.5687,
        volume: 537600,
      },

      averageTrueRange: 0,
    },
    // 61
    {
      datum: {
        securityId: 1,
        priceDate: '1980-08-26',
        openPrice: 166.6584,
        highPrice: 168.3328,
        lowPrice: 166.2448,
        closePrice: 166.6584,
        adjustedClosePrice: 0.5645,
        volume: 270012,
      },

      averageTrueRange: 0,
    },
    // 62
    {
      datum: {
        securityId: 1,
        priceDate: '1980-08-27',
        openPrice: 163.6848,
        highPrice: 166.2448,
        lowPrice: 162.864,
        closePrice: 163.6848,
        adjustedClosePrice: 0.5544,
        volume: 940800,
      },

      averageTrueRange: 0,
    },
    // 63 swingLow
    {
      datum: {
        securityId: 1,
        priceDate: '1980-08-28',
        openPrice: 161.6008,
        highPrice: 163.2736,
        lowPrice: 161.6008,
        closePrice: 161.6008,
        adjustedClosePrice: 0.5473,
        volume: 823212,
      },
      swingPoint: 'swingLow',
      averageTrueRange: 0,
    },
    // 64
    {
      datum: {
        securityId: 1,
        priceDate: '1980-08-29',
        openPrice: 161.6008,
        highPrice: 161.6008,
        lowPrice: 160.3368,
        closePrice: 161.6008,
        adjustedClosePrice: 0.5473,
        volume: 682812,
      },

      averageTrueRange: 0,
    },
    // 65
    {
      datum: {
        securityId: 1,
        priceDate: '1980-09-02',
        openPrice: 163.6848,
        highPrice: 163.6848,
        lowPrice: 158.6296,
        closePrice: 163.6848,
        adjustedClosePrice: 0.5544,
        volume: 525612,
      },

      averageTrueRange: 0,
    },
    // 66 swingHigh
    {
      datum: {
        securityId: 1,
        priceDate: '1980-09-03',
        openPrice: 166.6584,
        highPrice: 166.6584,
        lowPrice: 163.6848,
        closePrice: 166.6584,
        adjustedClosePrice: 0.5645,
        volume: 235200,
      },
      swingPoint: 'swingHigh',
      averageTrueRange: 0,
    },
    // 67
    {
      datum: {
        securityId: 1,
        priceDate: '1980-09-04',
        openPrice: 160.3368,
        highPrice: 167.4816,
        lowPrice: 158.6296,
        closePrice: 160.3368,
        adjustedClosePrice: 0.543,
        volume: 1056000,
      },

      averageTrueRange: 0,
    },
    // 68
    {
      datum: {
        securityId: 1,
        priceDate: '1980-09-05',
        openPrice: 159.8928,
        highPrice: 162.864,
        lowPrice: 158.6296,
        closePrice: 159.8928,
        adjustedClosePrice: 0.5415,
        volume: 1142400,
      },

      averageTrueRange: 0,
    },
    // 69 swingLow
    {
      datum: {
        securityId: 1,
        priceDate: '1980-09-08',
        openPrice: 158.2192,
        highPrice: 161.1576,
        lowPrice: 157.8048,
        closePrice: 158.2192,
        adjustedClosePrice: 0.5359,
        volume: 912000,
      },
      swingPoint: 'swingLow',
      averageTrueRange: 0,
    },
    // 70
    {
      datum: {
        securityId: 1,
        priceDate: '1980-09-09',
        openPrice: 157.3656,
        highPrice: 158.2192,
        lowPrice: 156.1024,
        closePrice: 157.3656,
        adjustedClosePrice: 0.533,
        volume: 559212,
      },

      averageTrueRange: 0,
    },
    // 71
    {
      datum: {
        securityId: 1,
        priceDate: '1980-09-10',
        openPrice: 158.2192,
        highPrice: 159.4824,
        lowPrice: 157.8048,
        closePrice: 158.2192,
        adjustedClosePrice: 0.5359,
        volume: 892800,
      },

      averageTrueRange: 0,
    },
    // 72
    {
      datum: {
        securityId: 1,
        priceDate: '1980-09-11',
        openPrice: 157.8048,
        highPrice: 159.0736,
        lowPrice: 157.3656,
        closePrice: 157.8048,
        adjustedClosePrice: 0.5345,
        volume: 946812,
      },

      averageTrueRange: 0,
    },
    // 73
    {
      datum: {
        securityId: 1,
        priceDate: '1980-09-12',
        openPrice: 158.2192,
        highPrice: 158.6296,
        lowPrice: 156.952,
        closePrice: 158.2192,
        adjustedClosePrice: 0.5359,
        volume: 578412,
      },

      averageTrueRange: 0,
    },
    // 74
    {
      datum: {
        securityId: 1,
        priceDate: '1980-09-15',
        openPrice: 161.1576,
        highPrice: 161.1576,
        lowPrice: 158.6296,
        closePrice: 161.1576,
        adjustedClosePrice: 0.5458,
        volume: 877212,
      },

      averageTrueRange: 0,
    },
    // 75
    {
      datum: {
        securityId: 1,
        priceDate: '1980-09-16',
        openPrice: 166.2448,
        highPrice: 168.3328,
        lowPrice: 161.6008,
        closePrice: 166.2448,
        adjustedClosePrice: 0.5631,
        volume: 1201212,
      },

      averageTrueRange: 0,
    },
    // 76 swingHigh
    {
      datum: {
        securityId: 1,
        priceDate: '1980-09-17',
        openPrice: 169.596,
        highPrice: 170.0416,
        lowPrice: 166.2448,
        closePrice: 169.596,
        adjustedClosePrice: 0.5744,
        volume: 718812,
      },
      swingPoint: 'swingHigh',
      averageTrueRange: 0,
    },
    // 77
    {
      datum: {
        securityId: 1,
        priceDate: '1980-09-18',
        openPrice: 167.0688,
        highPrice: 172.1256,
        lowPrice: 167.0688,
        closePrice: 167.0688,
        adjustedClosePrice: 0.5658,
        volume: 1012800,
      },

      averageTrueRange: 0,
    },
    // 78
    {
      datum: {
        securityId: 1,
        priceDate: '1980-09-19',
        openPrice: 168.3328,
        highPrice: 170.0416,
        lowPrice: 164.9488,
        closePrice: 168.3328,
        adjustedClosePrice: 0.5701,
        volume: 1021212,
      },

      averageTrueRange: 0,
    },
    // 79
    {
      datum: {
        securityId: 1,
        priceDate: '1980-09-22',
        openPrice: 169.596,
        highPrice: 169.596,
        lowPrice: 165.3952,
        closePrice: 169.596,
        adjustedClosePrice: 0.5744,
        volume: 1294812,
      },

      averageTrueRange: 0,
    },
    // 80
    {
      datum: {
        securityId: 1,
        priceDate: '1980-09-23',
        openPrice: 168.3328,
        highPrice: 172.5688,
        lowPrice: 168.3328,
        closePrice: 168.3328,
        adjustedClosePrice: 0.5701,
        volume: 1112412,
      },

      averageTrueRange: 0,
    },
    // 81
    {
      datum: {
        securityId: 1,
        priceDate: '1980-09-24',
        openPrice: 167.4816,
        highPrice: 168.7776,
        lowPrice: 166.2448,
        closePrice: 167.4816,
        adjustedClosePrice: 0.5672,
        volume: 784812,
      },

      averageTrueRange: 0,
    },
    // 82
    {
      datum: {
        securityId: 1,
        priceDate: '1980-09-25',
        openPrice: 164.5416,
        highPrice: 166.2448,
        lowPrice: 164.128,
        closePrice: 164.5416,
        adjustedClosePrice: 0.5573,
        volume: 525612,
      },

      averageTrueRange: 0,
    },
    // 83
    {
      datum: {
        securityId: 1,
        priceDate: '1980-09-26',
        openPrice: 161.1576,
        highPrice: 162.864,
        lowPrice: 160.7464,
        closePrice: 161.1576,
        adjustedClosePrice: 0.5458,
        volume: 739200,
      },

      averageTrueRange: 0,
    },
    // 84
    {
      datum: {
        securityId: 1,
        priceDate: '1980-09-29',
        openPrice: 161.1576,
        highPrice: 161.1576,
        lowPrice: 159.0736,
        closePrice: 161.1576,
        adjustedClosePrice: 0.5458,
        volume: 277212,
      },

      averageTrueRange: 0,
    },
    // 85
    {
      datum: {
        securityId: 1,
        priceDate: '1980-09-30',
        openPrice: 162.0144,
        highPrice: 162.864,
        lowPrice: 161.1576,
        closePrice: 162.0144,
        adjustedClosePrice: 0.5487,
        volume: 336000,
      },

      averageTrueRange: 0,
    },
    // 86
    {
      datum: {
        securityId: 1,
        priceDate: '1980-10-01',
        openPrice: 162.0144,
        highPrice: 162.864,
        lowPrice: 160.7464,
        closePrice: 162.0144,
        adjustedClosePrice: 0.5487,
        volume: 1008000,
      },

      averageTrueRange: 0,
    },
    // 87 swingLow
    {
      datum: {
        securityId: 1,
        priceDate: '1980-10-02',
        openPrice: 159.8928,
        highPrice: 162.864,
        lowPrice: 157.3656,
        closePrice: 159.8928,
        adjustedClosePrice: 0.5415,
        volume: 1684800,
      },
      swingPoint: 'swingLow',
      averageTrueRange: 0,
    },
    // 88 swingHigh
    {
      datum: {
        securityId: 1,
        priceDate: '1980-10-03',
        openPrice: 162.0144,
        highPrice: 162.42,
        lowPrice: 159.0736,
        closePrice: 162.0144,
        adjustedClosePrice: 0.5487,
        volume: 1243200,
      },
      swingPoint: 'swingHigh',
      averageTrueRange: 0,
    },
    // 89
    {
      datum: {
        securityId: 1,
        priceDate: '1980-10-06',
        openPrice: 161.6008,
        highPrice: 164.128,
        lowPrice: 160.7464,
        closePrice: 161.6008,
        adjustedClosePrice: 0.5473,
        volume: 488412,
      },

      averageTrueRange: 0,
    },
    // 90
    {
      datum: {
        securityId: 1,
        priceDate: '1980-10-07',
        openPrice: 159.4824,
        highPrice: 162.0144,
        lowPrice: 158.6296,
        closePrice: 159.4824,
        adjustedClosePrice: 0.5401,
        volume: 1707612,
      },

      averageTrueRange: 0,
    },
    // 91
    {
      datum: {
        securityId: 1,
        priceDate: '1980-10-08',
        openPrice: 160.3368,
        highPrice: 160.7464,
        lowPrice: 158.6296,
        closePrice: 160.3368,
        adjustedClosePrice: 0.543,
        volume: 784812,
      },

      averageTrueRange: 0,
    },
    // 92
    {
      datum: {
        securityId: 1,
        priceDate: '1980-10-09',
        openPrice: 158.6296,
        highPrice: 160.7464,
        lowPrice: 158.2192,
        closePrice: 158.6296,
        adjustedClosePrice: 0.5373,
        volume: 386412,
      },

      averageTrueRange: 0,
    },
    // 93 swingLow
    {
      datum: {
        securityId: 1,
        priceDate: '1980-10-10',
        openPrice: 155.692,
        highPrice: 159.0736,
        lowPrice: 155.692,
        closePrice: 155.692,
        adjustedClosePrice: 0.5273,
        volume: 811200,
      },
      swingPoint: 'swingLow',
      averageTrueRange: 0,
    },
    // 94 swingHigh
    {
      datum: {
        securityId: 1,
        priceDate: '1980-10-13',
        openPrice: 157.8048,
        highPrice: 158.6296,
        lowPrice: 155.2776,
        closePrice: 157.8048,
        adjustedClosePrice: 0.5345,
        volume: 702012,
      },
      swingPoint: 'swingHigh',
      averageTrueRange: 0,
    },
    // 95
    {
      datum: {
        securityId: 1,
        priceDate: '1980-10-14',
        openPrice: 157.8048,
        highPrice: 160.3368,
        lowPrice: 157.8048,
        closePrice: 157.8048,
        adjustedClosePrice: 0.5345,
        volume: 2466012,
      },

      averageTrueRange: 0,
    },
    // 96
    {
      datum: {
        securityId: 1,
        priceDate: '1980-10-15',
        openPrice: 158.6296,
        highPrice: 158.6296,
        lowPrice: 157.3656,
        closePrice: 158.6296,
        adjustedClosePrice: 0.5373,
        volume: 942012,
      },

      averageTrueRange: 0,
    },
    // 97
    {
      datum: {
        securityId: 1,
        priceDate: '1980-10-16',
        openPrice: 156.5464,
        highPrice: 159.4824,
        lowPrice: 156.1024,
        closePrice: 156.5464,
        adjustedClosePrice: 0.5302,
        volume: 1936812,
      },

      averageTrueRange: 0,
    },
    // 98
    {
      datum: {
        securityId: 1,
        priceDate: '1980-10-17',
        openPrice: 155.692,
        highPrice: 156.952,
        lowPrice: 155.2776,
        closePrice: 155.692,
        adjustedClosePrice: 0.5273,
        volume: 735612,
      },

      averageTrueRange: 0,
    },
    // 99
    {
      datum: {
        securityId: 1,
        priceDate: '1980-10-20',
        openPrice: 155.692,
        highPrice: 156.1024,
        lowPrice: 154.8328,
        closePrice: 155.692,
        adjustedClosePrice: 0.5273,
        volume: 771612,
      },

      averageTrueRange: 0,
    },
    // 100
    {
      datum: {
        securityId: 1,
        priceDate: '1980-10-21',
        openPrice: 154.4248,
        highPrice: 157.3656,
        lowPrice: 153.5688,
        closePrice: 154.4248,
        adjustedClosePrice: 0.523,
        volume: 1196412,
      },

      averageTrueRange: 0,
    },
    // 101
    {
      datum: {
        securityId: 1,
        priceDate: '1980-10-22',
        openPrice: 154.8328,
        highPrice: 154.8328,
        lowPrice: 153.5688,
        closePrice: 154.8328,
        adjustedClosePrice: 0.5244,
        volume: 423612,
      },

      averageTrueRange: 0,
    },
    // 102 swingLow
    {
      datum: {
        securityId: 1,
        priceDate: '1980-10-23',
        openPrice: 150.1888,
        highPrice: 154.8328,
        lowPrice: 150.1888,
        closePrice: 150.1888,
        adjustedClosePrice: 0.5087,
        volume: 1297212,
      },
      swingPoint: 'swingLow',
      averageTrueRange: 0,
    },
    // 103
    {
      datum: {
        securityId: 1,
        priceDate: '1980-10-24',
        openPrice: 149.364,
        highPrice: 149.364,
        lowPrice: 147.6568,
        closePrice: 149.364,
        adjustedClosePrice: 0.5059,
        volume: 1606812,
      },

      averageTrueRange: 0,
    },
    // 104
    {
      datum: {
        securityId: 1,
        priceDate: '1980-10-27',
        openPrice: 150.1888,
        highPrice: 151.0416,
        lowPrice: 149.364,
        closePrice: 150.1888,
        adjustedClosePrice: 0.5093,
        volume: 885612,
      },

      averageTrueRange: 0,
    },
    // 105
    {
      datum: {
        securityId: 1,
        priceDate: '1980-10-28',
        openPrice: 149.7784,
        highPrice: 149.7784,
        lowPrice: 147.6568,
        closePrice: 149.7784,
        adjustedClosePrice: 0.508,
        volume: 1322412,
      },

      averageTrueRange: 0,
    },
    // 106
    {
      datum: {
        securityId: 1,
        priceDate: '1980-10-29',
        openPrice: 148.9248,
        highPrice: 151.0416,
        lowPrice: 148.5112,
        closePrice: 148.9248,
        adjustedClosePrice: 0.5339,
        volume: 618012,
      },

      averageTrueRange: 0,
    },
    // 107
    {
      datum: {
        securityId: 1,
        priceDate: '1980-10-30',
        openPrice: 147.6568,
        highPrice: 149.364,
        lowPrice: 146.8368,
        closePrice: 147.6568,
        adjustedClosePrice: 0.5294,
        volume: 910812,
      },

      averageTrueRange: 0,
    },
    // 108
    {
      datum: {
        securityId: 1,
        priceDate: '1980-10-31',
        openPrice: 149.364,
        highPrice: 149.364,
        lowPrice: 147.2512,
        closePrice: 149.364,
        adjustedClosePrice: 0.5355,
        volume: 558012,
      },

      averageTrueRange: 0,
    },
    // 109
    {
      datum: {
        securityId: 1,
        priceDate: '1980-11-03',
        openPrice: 151.4848,
        highPrice: 152.7184,
        lowPrice: 149.7784,
        closePrice: 151.4848,
        adjustedClosePrice: 0.5431,
        volume: 802812,
      },

      averageTrueRange: 0,
    },
    // 110 swingHigh
    {
      datum: {
        securityId: 1,
        priceDate: '1980-11-05',
        openPrice: 154.0144,
        highPrice: 157.3656,
        lowPrice: 153.1608,
        closePrice: 154.0144,
        adjustedClosePrice: 0.5522,
        volume: 1592412,
      },
      swingPoint: 'swingHigh',
      averageTrueRange: 0,
    },
    // 111 swingLow
    {
      datum: {
        securityId: 1,
        priceDate: '1980-11-06',
        openPrice: 148.9248,
        highPrice: 153.1608,
        lowPrice: 148.5112,
        closePrice: 148.9248,
        adjustedClosePrice: 0.5339,
        volume: 990012,
      },
      swingPoint: 'swingLow',
      averageTrueRange: 0,
    },
    // 112
    {
      datum: {
        securityId: 1,
        priceDate: '1980-11-07',
        openPrice: 149.7784,
        highPrice: 150.6336,
        lowPrice: 148.9248,
        closePrice: 149.7784,
        adjustedClosePrice: 0.537,
        volume: 952812,
      },

      averageTrueRange: 0,
    },
    // 113
    {
      datum: {
        securityId: 1,
        priceDate: '1980-11-10',
        openPrice: 148.5112,
        highPrice: 151.0416,
        lowPrice: 148.5112,
        closePrice: 148.5112,
        adjustedClosePrice: 0.5325,
        volume: 1104000,
      },

      averageTrueRange: 0,
    },
    // 114
    {
      datum: {
        securityId: 1,
        priceDate: '1980-11-11',
        openPrice: 148.9248,
        highPrice: 149.364,
        lowPrice: 147.6568,
        closePrice: 148.9248,
        adjustedClosePrice: 0.5339,
        volume: 874812,
      },

      averageTrueRange: 0,
    },
    // 115
    {
      datum: {
        securityId: 1,
        priceDate: '1980-11-12',
        openPrice: 148.9248,
        highPrice: 148.9248,
        lowPrice: 146.3976,
        closePrice: 148.9248,
        adjustedClosePrice: 0.5339,
        volume: 2373612,
      },

      averageTrueRange: 0,
    },
    // 116
    {
      datum: {
        securityId: 1,
        priceDate: '1980-11-13',
        openPrice: 148.9248,
        highPrice: 150.1888,
        lowPrice: 148.1008,
        closePrice: 148.9248,
        adjustedClosePrice: 0.5339,
        volume: 2410812,
      },

      averageTrueRange: 0,
    },
    // 117
    {
      datum: {
        securityId: 1,
        priceDate: '1980-11-14',
        openPrice: 147.6568,
        highPrice: 148.5112,
        lowPrice: 146.8368,
        closePrice: 147.6568,
        adjustedClosePrice: 0.5294,
        volume: 3015612,
      },

      averageTrueRange: 0,
    },
    // 118
    {
      datum: {
        securityId: 1,
        priceDate: '1980-11-17',
        openPrice: 148.1008,
        highPrice: 148.1008,
        lowPrice: 147.6568,
        closePrice: 148.1008,
        adjustedClosePrice: 0.531,
        volume: 1162812,
      },

      averageTrueRange: 0,
    },
    // 119
    {
      datum: {
        securityId: 1,
        priceDate: '1980-11-18',
        openPrice: 149.7784,
        highPrice: 150.1888,
        lowPrice: 147.6568,
        closePrice: 149.7784,
        adjustedClosePrice: 0.537,
        volume: 2151612,
      },

      averageTrueRange: 0,
    },
    // 120
    {
      datum: {
        securityId: 1,
        priceDate: '1980-11-19',
        openPrice: 152.7184,
        highPrice: 154.4248,
        lowPrice: 150.1888,
        closePrice: 152.7184,
        adjustedClosePrice: 0.5475,
        volume: 3012012,
      },

      averageTrueRange: 0,
    },
    // 121 swingHigh
    {
      datum: {
        securityId: 1,
        priceDate: '1980-11-20',
        openPrice: 157.8048,
        highPrice: 161.1576,
        lowPrice: 151.4848,
        closePrice: 157.8048,
        adjustedClosePrice: 0.5658,
        volume: 4592412,
      },
      swingPoint: 'swingHigh',
      averageTrueRange: 0,
    },
    // 122
    {
      datum: {
        securityId: 1,
        priceDate: '1980-11-21',
        openPrice: 158.6296,
        highPrice: 159.4824,
        lowPrice: 157.3656,
        closePrice: 158.6296,
        adjustedClosePrice: 0.5687,
        volume: 2176812,
      },

      averageTrueRange: 0,
    },
    // 123
    {
      datum: {
        securityId: 1,
        priceDate: '1980-11-24',
        openPrice: 158.6296,
        highPrice: 158.6296,
        lowPrice: 155.2776,
        closePrice: 158.6296,
        adjustedClosePrice: 0.5687,
        volume: 1149612,
      },

      averageTrueRange: 0,
    },
    // 124
    {
      datum: {
        securityId: 1,
        priceDate: '1980-11-25',
        openPrice: 158.2192,
        highPrice: 159.4824,
        lowPrice: 157.8048,
        closePrice: 158.2192,
        adjustedClosePrice: 0.5673,
        volume: 1718400,
      },

      averageTrueRange: 0,
    },
    // 125
    {
      datum: {
        securityId: 1,
        priceDate: '1980-11-26',
        openPrice: 155.692,
        highPrice: 158.6296,
        lowPrice: 155.2776,
        closePrice: 155.692,
        adjustedClosePrice: 0.5582,
        volume: 1689600,
      },

      averageTrueRange: 0,
    },
    // 126
    {
      datum: {
        securityId: 1,
        priceDate: '1980-11-28',
        openPrice: 154.8328,
        highPrice: 156.1024,
        lowPrice: 153.5688,
        closePrice: 154.8328,
        adjustedClosePrice: 0.5551,
        volume: 920412,
      },

      averageTrueRange: 0,
    },
    // 127 swingLow
    {
      datum: {
        securityId: 1,
        priceDate: '1980-12-01',
        openPrice: 150.1888,
        highPrice: 155.692,
        lowPrice: 149.364,
        closePrice: 150.1888,
        adjustedClosePrice: 0.5385,
        volume: 1993212,
      },
      swingPoint: 'swingLow',
      averageTrueRange: 0,
    },
    // 128
    {
      datum: {
        securityId: 1,
        priceDate: '1980-12-02',
        openPrice: 151.4848,
        highPrice: 151.4848,
        lowPrice: 147.6568,
        closePrice: 151.4848,
        adjustedClosePrice: 0.5431,
        volume: 1618812,
      },

      averageTrueRange: 0,
    },
    // 129
    {
      datum: {
        securityId: 1,
        priceDate: '1980-12-03',
        openPrice: 152.3056,
        highPrice: 152.7184,
        lowPrice: 150.6336,
        closePrice: 152.3056,
        adjustedClosePrice: 0.5461,
        volume: 1394412,
      },

      averageTrueRange: 0,
    },
    // 130
    {
      datum: {
        securityId: 1,
        priceDate: '1980-12-04',
        openPrice: 154.4248,
        highPrice: 154.8328,
        lowPrice: 152.3056,
        closePrice: 154.4248,
        adjustedClosePrice: 0.5537,
        volume: 1269612,
      },

      averageTrueRange: 0,
    },
    // 131 swingHigh
    {
      datum: {
        securityId: 1,
        priceDate: '1980-12-05',
        openPrice: 156.5464,
        highPrice: 157.3656,
        lowPrice: 153.5688,
        closePrice: 156.5464,
        adjustedClosePrice: 0.5613,
        volume: 612012,
      },
      swingPoint: 'swingHigh',
      averageTrueRange: 0,
    },
    // 132
    {
      datum: {
        securityId: 1,
        priceDate: '1980-12-08',
        openPrice: 153.1608,
        highPrice: 156.1024,
        lowPrice: 153.1608,
        closePrice: 153.1608,
        adjustedClosePrice: 0.5491,
        volume: 963612,
      },

      averageTrueRange: 0,
    },
    // 133
    {
      datum: {
        securityId: 1,
        priceDate: '1980-12-09',
        openPrice: 153.1608,
        highPrice: 154.8328,
        lowPrice: 151.8976,
        closePrice: 153.1608,
        adjustedClosePrice: 0.5491,
        volume: 1836012,
      },

      averageTrueRange: 0,
    },
    // 134
    {
      datum: {
        securityId: 1,
        priceDate: '1980-12-10',
        openPrice: 152.3056,
        highPrice: 156.5464,
        lowPrice: 152.3056,
        closePrice: 152.3056,
        adjustedClosePrice: 0.5461,
        volume: 1100412,
      },

      averageTrueRange: 0,
    },
    // 135
    {
      datum: {
        securityId: 1,
        priceDate: '1980-12-11',
        openPrice: 153.5688,
        highPrice: 154.4248,
        lowPrice: 150.6336,
        closePrice: 153.5688,
        adjustedClosePrice: 0.5506,
        volume: 985212,
      },

      averageTrueRange: 0,
    },
    // 136
    {
      datum: {
        securityId: 1,
        priceDate: '1980-12-12',
        openPrice: 154.8328,
        highPrice: 155.692,
        lowPrice: 153.5688,
        closePrice: 154.8328,
        adjustedClosePrice: 0.5551,
        volume: 1044012,
      },

      averageTrueRange: 0,
    },
    // 137
    {
      datum: {
        securityId: 1,
        priceDate: '1980-12-15',
        openPrice: 154.4248,
        highPrice: 155.2776,
        lowPrice: 152.3056,
        closePrice: 154.4248,
        adjustedClosePrice: 0.5537,
        volume: 471612,
      },

      averageTrueRange: 0,
    },
    // 138
    {
      datum: {
        securityId: 1,
        priceDate: '1980-12-16',
        openPrice: 153.5688,
        highPrice: 154.4248,
        lowPrice: 151.8976,
        closePrice: 153.5688,
        adjustedClosePrice: 0.5506,
        volume: 2644800,
      },

      averageTrueRange: 0,
    },
    // 139 swingLow
    {
      datum: {
        securityId: 1,
        priceDate: '1980-12-17',
        openPrice: 151.8976,
        highPrice: 153.5688,
        lowPrice: 151.8976,
        closePrice: 151.8976,
        adjustedClosePrice: 0.5446,
        volume: 2780412,
      },
      swingPoint: 'swingLow',
      averageTrueRange: 0,
    },
    // 140
    {
      datum: {
        securityId: 1,
        priceDate: '1980-12-18',
        openPrice: 150.6336,
        highPrice: 151.8976,
        lowPrice: 149.7784,
        closePrice: 150.6336,
        adjustedClosePrice: 0.5401,
        volume: 1672812,
      },

      averageTrueRange: 0,
    },
    // 141
    {
      datum: {
        securityId: 1,
        priceDate: '1980-12-19',
        openPrice: 151.0416,
        highPrice: 151.4848,
        lowPrice: 149.7784,
        closePrice: 151.0416,
        adjustedClosePrice: 0.5415,
        volume: 403200,
      },

      averageTrueRange: 0,
    },
    // 142
    {
      datum: {
        securityId: 1,
        priceDate: '1980-12-22',
        openPrice: 156.1024,
        highPrice: 156.1024,
        lowPrice: 150.6336,
        closePrice: 156.1024,
        adjustedClosePrice: 0.5597,
        volume: 938412,
      },

      averageTrueRange: 0,
    },
    // 143
    {
      datum: {
        securityId: 1,
        priceDate: '1980-12-23',
        openPrice: 155.2776,
        highPrice: 156.5464,
        lowPrice: 154.8328,
        closePrice: 155.2776,
        adjustedClosePrice: 0.5567,
        volume: 696000,
      },

      averageTrueRange: 0,
    },
    // 144 swingHigh
    {
      datum: {
        securityId: 1,
        priceDate: '1980-12-24',
        openPrice: 157.3656,
        highPrice: 157.3656,
        lowPrice: 154.8328,
        closePrice: 157.3656,
        adjustedClosePrice: 0.5642,
        volume: 684012,
      },
      swingPoint: 'swingHigh',
      averageTrueRange: 0,
    },
    // 145
    {
      datum: {
        securityId: 1,
        priceDate: '1980-12-26',
        openPrice: 156.5464,
        highPrice: 157.3656,
        lowPrice: 156.1024,
        closePrice: 156.5464,
        adjustedClosePrice: 0.5613,
        volume: 378012,
      },

      averageTrueRange: 0,
    },
    // 146 swingLow
    {
      datum: {
        securityId: 1,
        priceDate: '1980-12-29',
        openPrice: 154.8328,
        highPrice: 156.5464,
        lowPrice: 154.0144,
        closePrice: 154.8328,
        adjustedClosePrice: 0.5551,
        volume: 1104000,
      },
      swingPoint: 'swingLow',
      averageTrueRange: 0,
    },
    // 147
    {
      datum: {
        securityId: 1,
        priceDate: '1980-12-30',
        openPrice: 159.0736,
        highPrice: 160.3368,
        lowPrice: 154.0144,
        closePrice: 159.0736,
        adjustedClosePrice: 0.5703,
        volume: 450012,
      },

      averageTrueRange: 0,
    },
    // 148
    {
      datum: {
        securityId: 1,
        priceDate: '1980-12-31',
        openPrice: 164.5416,
        highPrice: 164.5416,
        lowPrice: 158.6296,
        closePrice: 164.5416,
        adjustedClosePrice: 0.5899,
        volume: 498012,
      },

      averageTrueRange: 0,
    },
  ],
  trends: [],
};

const YValueSourceClose: TestDataSource = {
  points: [
    {
      datum: {
        securityId: 1,
        priceDate: '1980-01-02',
        openPrice: 0,
        highPrice: 0,
        lowPrice: 0,
        closePrice: 10,
        adjustedClosePrice: 0,
        volume: 0,
      },
      averageTrueRange: 0,
    },
    {
      datum: {
        securityId: 1,
        priceDate: '1980-01-03',
        openPrice: 0,
        highPrice: 0,
        lowPrice: 0,
        closePrice: 5,
        adjustedClosePrice: 0,
        volume: 0,
      },
      averageTrueRange: 0,
      swingPoint: 'swingLow',
    },
    {
      datum: {
        securityId: 1,
        priceDate: '1980-01-04',
        openPrice: 0,
        highPrice: 0,
        lowPrice: 0,
        closePrice: 10,
        adjustedClosePrice: 0,
        volume: 0,
      },
      averageTrueRange: 0,
      swingPoint: 'swingHigh',
    },
    {
      datum: {
        securityId: 1,
        priceDate: '1980-01-05',
        openPrice: 0,
        highPrice: 0,
        lowPrice: 0,
        closePrice: 7,
        adjustedClosePrice: 0,
        volume: 0,
      },
      averageTrueRange: 0,
      swingPoint: 'swingLow',
    },
    {
      datum: {
        securityId: 1,
        priceDate: '1980-01-06',
        openPrice: 0,
        highPrice: 0,
        lowPrice: 0,
        closePrice: 12,
        adjustedClosePrice: 0,
        volume: 0,
      },
      averageTrueRange: 0,
    },
  ],
  trends: [],
};

const YValueSourceOpen: TestDataSource = {
  points: [
    {
      datum: {
        securityId: 1,
        priceDate: '1980-01-02',
        openPrice: 10,
        highPrice: 0,
        lowPrice: 0,
        closePrice: 0,
        adjustedClosePrice: 0,
        volume: 0,
      },
      averageTrueRange: 0,
    },
    {
      datum: {
        securityId: 1,
        priceDate: '1980-01-03',
        openPrice: 5,
        highPrice: 0,
        lowPrice: 0,
        closePrice: 0,
        adjustedClosePrice: 0,
        volume: 0,
      },
      averageTrueRange: 0,
      swingPoint: 'swingLow',
    },
    {
      datum: {
        securityId: 1,
        priceDate: '1980-01-04',
        openPrice: 10,
        highPrice: 0,
        lowPrice: 0,
        closePrice: 0,
        adjustedClosePrice: 0,
        volume: 0,
      },
      averageTrueRange: 0,
      swingPoint: 'swingHigh',
    },
    {
      datum: {
        securityId: 1,
        priceDate: '1980-01-05',
        openPrice: 7,
        highPrice: 0,
        lowPrice: 0,
        closePrice: 0,
        adjustedClosePrice: 0,
        volume: 0,
      },
      averageTrueRange: 0,
      swingPoint: 'swingLow',
    },
    {
      datum: {
        securityId: 1,
        priceDate: '1980-01-06',
        openPrice: 12,
        highPrice: 0,
        lowPrice: 0,
        closePrice: 0,
        adjustedClosePrice: 0,
        volume: 0,
      },
      averageTrueRange: 0,
    },
  ],
  trends: [],
};

const YValueSourceHigh: TestDataSource = {
  points: [
    {
      datum: {
        securityId: 1,
        priceDate: '1980-01-02',
        openPrice: 0,
        highPrice: 10,
        lowPrice: 0,
        closePrice: 0,
        adjustedClosePrice: 0,
        volume: 0,
      },
      averageTrueRange: 0,
    },
    {
      datum: {
        securityId: 1,
        priceDate: '1980-01-03',
        openPrice: 0,
        highPrice: 5,
        lowPrice: 0,
        closePrice: 0,
        adjustedClosePrice: 0,
        volume: 0,
      },
      averageTrueRange: 0,
      swingPoint: 'swingLow',
    },
    {
      datum: {
        securityId: 1,
        priceDate: '1980-01-04',
        openPrice: 0,
        highPrice: 10,
        lowPrice: 0,
        closePrice: 0,
        adjustedClosePrice: 0,
        volume: 0,
      },
      averageTrueRange: 0,
      swingPoint: 'swingHigh',
    },
    {
      datum: {
        securityId: 1,
        priceDate: '1980-01-05',
        openPrice: 0,
        highPrice: 7,
        lowPrice: 0,
        closePrice: 0,
        adjustedClosePrice: 0,
        volume: 0,
      },
      averageTrueRange: 0,
      swingPoint: 'swingLow',
    },
    {
      datum: {
        securityId: 1,
        priceDate: '1980-01-06',
        openPrice: 0,
        highPrice: 12,
        lowPrice: 0,
        closePrice: 0,
        adjustedClosePrice: 0,
        volume: 0,
      },
      averageTrueRange: 0,
    },
  ],
  trends: [],
};

const YValueSourceLow: TestDataSource = {
  points: [
    {
      datum: {
        securityId: 1,
        priceDate: '1980-01-02',
        openPrice: 0,
        highPrice: 0,
        lowPrice: 10,
        closePrice: 0,
        adjustedClosePrice: 0,
        volume: 0,
      },
      averageTrueRange: 0,
    },
    {
      datum: {
        securityId: 1,
        priceDate: '1980-01-03',
        openPrice: 0,
        highPrice: 0,
        lowPrice: 5,
        closePrice: 0,
        adjustedClosePrice: 0,
        volume: 0,
      },
      averageTrueRange: 5,
      swingPoint: 'swingLow',
    },
    {
      datum: {
        securityId: 1,
        priceDate: '1980-01-04',
        openPrice: 0,
        highPrice: 0,
        lowPrice: 10,
        closePrice: 0,
        adjustedClosePrice: 0,
        volume: 0,
      },
      averageTrueRange: 7.5,
      swingPoint: 'swingHigh',
    },
    {
      datum: {
        securityId: 1,
        priceDate: '1980-01-05',
        openPrice: 0,
        highPrice: 0,
        lowPrice: 7,
        closePrice: 0,
        adjustedClosePrice: 0,
        volume: 0,
      },
      averageTrueRange: 7.25,
      swingPoint: 'swingLow',
    },
    {
      datum: {
        securityId: 1,
        priceDate: '1980-01-06',
        openPrice: 0,
        highPrice: 0,
        lowPrice: 12,
        closePrice: 0,
        adjustedClosePrice: 0,
        volume: 0,
      },
      averageTrueRange: 9.625,
    },
  ],
  trends: [],
};

const FullAnalysisWithATR: TestDataSource = {
  points: [
    {
      datum: {
        securityId: 1,
        priceDate: '2023-01-01',
        openPrice: 100,
        highPrice: 105,
        lowPrice: 98,
        closePrice: 102,
        adjustedClosePrice: 102,
        volume: 1000,
      },
      averageTrueRange: 0,
    },
    {
      datum: {
        securityId: 1,
        priceDate: '2023-01-02',
        openPrice: 102,
        highPrice: 110,
        lowPrice: 101,
        closePrice: 108,
        adjustedClosePrice: 108,
        volume: 1000,
      },
      swingPoint: 'swingHigh',
      averageTrueRange: 8,
    },
    {
      datum: {
        securityId: 1,
        priceDate: '2023-01-03',
        openPrice: 108,
        highPrice: 109,
        lowPrice: 103,
        closePrice: 105,
        adjustedClosePrice: 105,
        volume: 1000,
      },
      swingPoint: 'swingLow',
      averageTrueRange: 7.5,
    },
    {
      datum: {
        securityId: 1,
        priceDate: '2023-01-04',
        openPrice: 105,
        highPrice: 115,
        lowPrice: 104,
        closePrice: 112,
        adjustedClosePrice: 112,
        volume: 1000,
      },
      swingPoint: 'swingHigh',
      averageTrueRange: 8.25,
    },
    {
      datum: {
        securityId: 1,
        priceDate: '2023-01-05',
        openPrice: 112,
        highPrice: 114,
        lowPrice: 108,
        closePrice: 110,
        adjustedClosePrice: 110,
        volume: 1000,
      },
      swingPoint: 'swingLow',
      averageTrueRange: 7.875,
    },
  ],
  trends: [
    {
      type: 'upward',
      start: new EnrichedDataPoint(
        new OHLCV({
          securityId: 1,
          priceDate: '2023-01-02',
          openPrice: 102,
          highPrice: 110,
          lowPrice: 101,
          closePrice: 108,
          adjustedClosePrice: 108,
          volume: 1000,
        }),
      ),
      end: new EnrichedDataPoint(
        new OHLCV({
          securityId: 1,
          priceDate: '2023-01-04',
          openPrice: 105,
          highPrice: 115,
          lowPrice: 104,
          closePrice: 112,
          adjustedClosePrice: 112,
          volume: 1000,
        }),
      ),
    },
    {
      type: 'upward',
      start: new EnrichedDataPoint(
        new OHLCV({
          securityId: 1,
          priceDate: '2023-01-03',
          openPrice: 108,
          highPrice: 109,
          lowPrice: 103,
          closePrice: 105,
          adjustedClosePrice: 105,
          volume: 1000,
        }),
      ),
      end: new EnrichedDataPoint(
        new OHLCV({
          securityId: 1,
          priceDate: '2023-01-05',
          openPrice: 112,
          highPrice: 114,
          lowPrice: 108,
          closePrice: 110,
          adjustedClosePrice: 110,
          volume: 1000,
        }),
      ),
    },
  ],
  trades: [
    new Trade({
      entry: {
        date: '2023-01-04',
        price: 110,
      },
      exit: {
        date: '2023-01-05',
        price: 108,
      },
    }),
  ],
};
