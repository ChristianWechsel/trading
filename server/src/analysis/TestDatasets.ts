import { EodPrice } from '../data-aggregation/eod-price.entity';
import { TestData } from './analysis.int.testdata';
import { EnrichedDataPoint, SwingPointType } from './core/enriched-data-point';

type RawEod = {
  securityId: number;
  priceDate: string;
  openPrice: string;
  highPrice: string;
  lowPrice: string;
  closePrice: string;
  adjustedClosePrice: string;
  volume: string;
};

export class TestDatasets {
  getMCD_US_19800317_19800601(): Pick<TestData, 'data' | 'expected'> {
    return {
      data: MCD_US_19800317_19800601.map<EodPrice>((item) =>
        this.mapRawEodToEodPrice(item.dataPoint),
      ),
      expected: MCD_US_19800317_19800601.map<EnrichedDataPoint>((item) => {
        return this.mapToEnrichedDataPoint(item);
      }),
    };
  }

  private mapToEnrichedDataPoint(item: {
    dataPoint: RawEod;
    swingPoint: SwingPointType;
  }) {
    const enrichedDataPoint = new EnrichedDataPoint({
      x: new Date(item.dataPoint.priceDate).getTime(),
      y: parseFloat(item.dataPoint.closePrice),
    });
    if (item.swingPoint) {
      enrichedDataPoint.setSwingPointType(item.swingPoint);
    }
    return enrichedDataPoint;
  }

  private mapRawEodToEodPrice(raw: RawEod): EodPrice {
    const {
      adjustedClosePrice,
      closePrice,
      highPrice,
      lowPrice,
      openPrice,
      priceDate,
      securityId,
      volume,
    } = raw;

    return {
      adjustedClosePrice: parseFloat(adjustedClosePrice),
      closePrice: parseFloat(closePrice),
      highPrice: parseFloat(highPrice),
      lowPrice: parseFloat(lowPrice),
      openPrice: parseFloat(openPrice),
      priceDate: priceDate,
      securityId,
      volume: parseInt(volume, 10),
    };
  }
}

const MCD_US_19800317_19800601: {
  dataPoint: RawEod;
  swingPoint: SwingPointType;
}[] = [
  // 0
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-03-17',
      openPrice: '124.9008',
      highPrice: '126.9856',
      lowPrice: '124.0440',
      closePrice: '124.9008',
      adjustedClosePrice: '0.3792',
      volume: '1422012',
    },
    swingPoint: null,
  },
  // 1
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-03-18',
      openPrice: '126.5760',
      highPrice: '127.4280',
      lowPrice: '124.4544',
      closePrice: '126.5760',
      adjustedClosePrice: '0.3843',
      volume: '3517212',
    },
    swingPoint: null,
  },
  // 2 swingHigh
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-03-19',
      openPrice: '127.8400',
      highPrice: '128.6928',
      lowPrice: '126.1656',
      closePrice: '127.8400',
      adjustedClosePrice: '0.3882',
      volume: '1078812',
    },
    swingPoint: 'swingHigh',
  },
  // 3
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-03-20',
      openPrice: '126.5760',
      highPrice: '128.6928',
      lowPrice: '125.3080',
      closePrice: '126.5760',
      adjustedClosePrice: '0.3843',
      volume: '750012',
    },
    swingPoint: null,
  },
  // 4
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-03-21',
      openPrice: '125.3080',
      highPrice: '126.9856',
      lowPrice: '125.3080',
      closePrice: '125.3080',
      adjustedClosePrice: '0.3805',
      volume: '586812',
    },
    swingPoint: null,
  },
  // 5 swingLow
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-03-24',
      openPrice: '122.3736',
      highPrice: '126.1656',
      lowPrice: '122.3736',
      closePrice: '122.3736',
      adjustedClosePrice: '0.3716',
      volume: '613212',
    },
    swingPoint: 'swingLow',
  },
  // 6
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-03-25',
      openPrice: '124.4544',
      highPrice: '125.3080',
      lowPrice: '122.3736',
      closePrice: '124.4544',
      adjustedClosePrice: '0.3779',
      volume: '672000',
    },
    swingPoint: null,
  },
  // 7
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-03-26',
      openPrice: '125.7216',
      highPrice: '127.8400',
      lowPrice: '125.3080',
      closePrice: '125.7216',
      adjustedClosePrice: '0.3817',
      volume: '963612',
    },
    swingPoint: null,
  },
  // 8
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-03-27',
      openPrice: '126.5760',
      highPrice: '127.4280',
      lowPrice: '125.3080',
      closePrice: '126.5760',
      adjustedClosePrice: '0.3843',
      volume: '342012',
    },
    swingPoint: null,
  },
  // 9
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-03-28',
      openPrice: '134.6040',
      highPrice: '135.8704',
      lowPrice: '132.8944',
      closePrice: '134.6040',
      adjustedClosePrice: '0.4087',
      volume: '1294812',
    },
    swingPoint: null,
  },
  // 10 swingHigh
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-03-31',
      openPrice: '140.0712',
      highPrice: '140.0712',
      lowPrice: '133.3080',
      closePrice: '140.0712',
      adjustedClosePrice: '0.4253',
      volume: '615612',
    },
    swingPoint: 'swingHigh',
  },
  // 11 swingLow
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-04-01',
      openPrice: '139.2160',
      highPrice: '140.0712',
      lowPrice: '138.8080',
      closePrice: '139.2160',
      adjustedClosePrice: '0.4227',
      volume: '550812',
    },
    swingPoint: 'swingLow',
  },
  // 12
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-04-02',
      openPrice: '140.0712',
      highPrice: '140.9296',
      lowPrice: '136.6888',
      closePrice: '140.0712',
      adjustedClosePrice: '0.4253',
      volume: '668412',
    },
    swingPoint: null,
  },
  // 13 swingHigh
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-04-03',
      openPrice: '141.7824',
      highPrice: '141.7824',
      lowPrice: '139.2160',
      closePrice: '141.7824',
      adjustedClosePrice: '0.4305',
      volume: '474012',
    },
    swingPoint: 'swingHigh',
  },
  // 14 swingLow
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-04-07',
      openPrice: '138.8080',
      highPrice: '140.9296',
      lowPrice: '138.8080',
      closePrice: '138.8080',
      adjustedClosePrice: '0.4215',
      volume: '1135212',
    },
    swingPoint: 'swingLow',
  },
  // 15 swingHigh
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-04-08',
      openPrice: '139.6608',
      highPrice: '140.0712',
      lowPrice: '137.5440',
      closePrice: '139.6608',
      adjustedClosePrice: '0.4241',
      volume: '489600',
    },
    swingPoint: 'swingHigh',
  },
  // 16
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-04-09',
      openPrice: '140.0712',
      highPrice: '140.9296',
      lowPrice: '138.8080',
      closePrice: '140.0712',
      adjustedClosePrice: '0.4253',
      volume: '670812',
    },
    swingPoint: null,
  },
  // 17
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-04-10',
      openPrice: '139.6608',
      highPrice: '140.4856',
      lowPrice: '139.2160',
      closePrice: '139.6608',
      adjustedClosePrice: '0.4241',
      volume: '1220412',
    },
    swingPoint: null,
  },
  // 18
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-04-11',
      openPrice: '137.9584',
      highPrice: '140.0712',
      lowPrice: '137.9584',
      closePrice: '137.9584',
      adjustedClosePrice: '0.4189',
      volume: '818412',
    },
    swingPoint: null,
  },
  // 19 swingLow
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-04-14',
      openPrice: '136.6888',
      highPrice: '137.5440',
      lowPrice: '136.2808',
      closePrice: '136.6888',
      adjustedClosePrice: '0.4150',
      volume: '390012',
    },
    swingPoint: 'swingLow',
  },
  // 20
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-04-15',
      openPrice: '136.2808',
      highPrice: '137.1336',
      lowPrice: '135.4248',
      closePrice: '136.2808',
      adjustedClosePrice: '0.4138',
      volume: '682812',
    },
    swingPoint: null,
  },
  // 21
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-04-16',
      openPrice: '136.2808',
      highPrice: '137.5440',
      lowPrice: '136.2808',
      closePrice: '136.2808',
      adjustedClosePrice: '0.4138',
      volume: '933612',
    },
    swingPoint: null,
  },
  // 22
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-04-17',
      openPrice: '136.2808',
      highPrice: '136.2808',
      lowPrice: '135.0168',
      closePrice: '136.2808',
      adjustedClosePrice: '0.4138',
      volume: '378012',
    },
    swingPoint: null,
  },
  // 23
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-04-18',
      openPrice: '136.2808',
      highPrice: '137.9584',
      lowPrice: '135.8704',
      closePrice: '136.2808',
      adjustedClosePrice: '0.4138',
      volume: '429612',
    },
    swingPoint: null,
  },
  // 24
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-04-21',
      openPrice: '135.8704',
      highPrice: '136.6888',
      lowPrice: '135.0168',
      closePrice: '135.8704',
      adjustedClosePrice: '0.4126',
      volume: '706812',
    },
    swingPoint: null,
  },
  // 25
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-04-22',
      openPrice: '141.7824',
      highPrice: '142.1880',
      lowPrice: '137.5440',
      closePrice: '141.7824',
      adjustedClosePrice: '0.4305',
      volume: '1513212',
    },
    swingPoint: null,
  },
  // 26 swingHigh
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-04-23',
      openPrice: '144.7200',
      highPrice: '148.5112',
      lowPrice: '144.3096',
      closePrice: '144.7200',
      adjustedClosePrice: '0.4394',
      volume: '1548012',
    },
    swingPoint: 'swingHigh',
  },
  // 27
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-04-24',
      openPrice: '144.3096',
      highPrice: '146.3976',
      lowPrice: '144.3096',
      closePrice: '144.3096',
      adjustedClosePrice: '0.4382',
      volume: '1382400',
    },
    swingPoint: null,
  },
  // 28
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-04-25',
      openPrice: '142.6024',
      highPrice: '142.6024',
      lowPrice: '140.9296',
      closePrice: '142.6024',
      adjustedClosePrice: '0.4330',
      volume: '1390812',
    },
    swingPoint: null,
  },
  // 29 swingLow
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-04-28',
      openPrice: '139.6608',
      highPrice: '142.1880',
      lowPrice: '139.6608',
      closePrice: '139.6608',
      adjustedClosePrice: '0.4241',
      volume: '70812',
    },
    swingPoint: 'swingLow',
  },
  // 30
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-04-29',
      openPrice: '140.0712',
      highPrice: '140.9296',
      lowPrice: '138.8080',
      closePrice: '140.0712',
      adjustedClosePrice: '0.4253',
      volume: '508800',
    },
    swingPoint: null,
  },
  // 31
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-04-30',
      openPrice: '143.8656',
      highPrice: '144.3096',
      lowPrice: '140.0712',
      closePrice: '143.8656',
      adjustedClosePrice: '0.4368',
      volume: '2659200',
    },
    swingPoint: null,
  },
  // 32
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-05-01',
      openPrice: '145.1296',
      highPrice: '145.1296',
      lowPrice: '143.8656',
      closePrice: '145.1296',
      adjustedClosePrice: '0.4407',
      volume: '997212',
    },
    swingPoint: null,
  },
  // 33
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-05-02',
      openPrice: '148.1008',
      highPrice: '148.5112',
      lowPrice: '144.3096',
      closePrice: '148.1008',
      adjustedClosePrice: '0.4497',
      volume: '462012',
    },
    swingPoint: null,
  },
  // 34 swingHigh
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-05-05',
      openPrice: '151.4848',
      highPrice: '151.4848',
      lowPrice: '146.8368',
      closePrice: '151.4848',
      adjustedClosePrice: '0.4600',
      volume: '1033212',
    },
    swingPoint: 'swingHigh',
  },
  // 35 swingLow
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-05-06',
      openPrice: '149.7784',
      highPrice: '152.3056',
      lowPrice: '149.3640',
      closePrice: '149.7784',
      adjustedClosePrice: '0.4548',
      volume: '2758812',
    },
    swingPoint: 'swingLow',
  },
  // 36 swingHigh
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-05-07',
      openPrice: '151.0416',
      highPrice: '152.3056',
      lowPrice: '148.5112',
      closePrice: '151.0416',
      adjustedClosePrice: '0.4586',
      volume: '1207212',
    },
    swingPoint: 'swingHigh',
  },
  // 37 swingLow
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-05-08',
      openPrice: '148.5112',
      highPrice: '151.8976',
      lowPrice: '147.6568',
      closePrice: '148.5112',
      adjustedClosePrice: '0.4509',
      volume: '1141212',
    },
    swingPoint: 'swingLow', // kam von oben und macht Knick zur Seite
  },
  // 38
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-05-09',
      openPrice: '148.5112',
      highPrice: '148.5112',
      lowPrice: '147.2512',
      closePrice: '148.5112',
      adjustedClosePrice: '0.4509',
      volume: '217212',
    },
    swingPoint: null,
  },
  // 39
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-05-12',
      openPrice: '150.1888',
      highPrice: '150.1888',
      lowPrice: '146.8368',
      closePrice: '150.1888',
      adjustedClosePrice: '0.4560',
      volume: '559212',
    },
    swingPoint: null,
  },
  // 40
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-05-13',
      openPrice: '154.4248',
      highPrice: '155.6920',
      lowPrice: '150.1888',
      closePrice: '154.4248',
      adjustedClosePrice: '0.4689',
      volume: '2302812',
    },
    swingPoint: null,
  },
  // 41
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-05-14',
      openPrice: '157.3656',
      highPrice: '158.6296',
      lowPrice: '155.2776',
      closePrice: '157.3656',
      adjustedClosePrice: '0.4778',
      volume: '1814400',
    },
    swingPoint: null,
  },
  // 42
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-05-15',
      openPrice: '157.8048',
      highPrice: '158.6296',
      lowPrice: '156.5464',
      closePrice: '157.8048',
      adjustedClosePrice: '0.4792',
      volume: '1215612',
    },
    swingPoint: null,
  },
  // 43
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-05-16',
      openPrice: '157.8048',
      highPrice: '158.2192',
      lowPrice: '156.5464',
      closePrice: '157.8048',
      adjustedClosePrice: '0.4792',
      volume: '993600',
    },
    swingPoint: null,
  },
  // 44
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-05-19',
      openPrice: '158.2192',
      highPrice: '159.4824',
      lowPrice: '156.9520',
      closePrice: '158.2192',
      adjustedClosePrice: '0.4804',
      volume: '709212',
    },
    swingPoint: null,
  },
  // 45
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-05-20',
      openPrice: '159.8928',
      highPrice: '160.3368',
      lowPrice: '156.5464',
      closePrice: '159.8928',
      adjustedClosePrice: '0.4855',
      volume: '1104000',
    },
    swingPoint: null,
  },
  // 46
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-05-21',
      openPrice: '159.4824',
      highPrice: '160.3368',
      lowPrice: '158.2192',
      closePrice: '159.4824',
      adjustedClosePrice: '0.4842',
      volume: '1617600',
    },
    swingPoint: null,
  },
  // 47
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-05-22',
      openPrice: '159.0736',
      highPrice: '160.3368',
      lowPrice: '158.6296',
      closePrice: '159.0736',
      adjustedClosePrice: '0.4830',
      volume: '1095612',
    },
    swingPoint: null,
  },
  // 48 swingHigh
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-05-23',
      openPrice: '161.6008',
      highPrice: '161.6008',
      lowPrice: '159.8928',
      closePrice: '161.6008',
      adjustedClosePrice: '0.4907',
      volume: '1662012',
    },
    swingPoint: 'swingHigh',
  },
  // 49
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-05-27',
      openPrice: '159.0736',
      highPrice: '161.6008',
      lowPrice: '158.6296',
      closePrice: '159.0736',
      adjustedClosePrice: '0.4830',
      volume: '1569600',
    },
    swingPoint: null,
  },
  // 50
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-05-28',
      openPrice: '159.4824',
      highPrice: '160.3368',
      lowPrice: '159.0736',
      closePrice: '159.4824',
      adjustedClosePrice: '0.4842',
      volume: '598812',
    },
    swingPoint: null,
  },
  // 51
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-05-29',
      openPrice: '157.8048',
      highPrice: '160.3368',
      lowPrice: '157.3656',
      closePrice: '157.8048',
      adjustedClosePrice: '0.4792',
      volume: '2584812',
    },
    swingPoint: null,
  },
  // 52
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-05-30',
      openPrice: '158.2192',
      highPrice: '158.2192',
      lowPrice: '154.8328',
      closePrice: '158.2192',
      adjustedClosePrice: '0.4804',
      volume: '721212',
    },
    swingPoint: null,
  },
];
