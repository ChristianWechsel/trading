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

  getMCD_US_19800601_19801231(): Pick<TestData, 'data' | 'expected'> {
    return {
      data: MCD_US_19800601_19801231.map<EodPrice>((item) =>
        this.mapRawEodToEodPrice(item.dataPoint),
      ),
      expected: MCD_US_19800601_19801231.map<EnrichedDataPoint>((item) => {
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

const MCD_US_19800601_19801231: {
  dataPoint: RawEod;
  swingPoint: SwingPointType;
}[] = [
  // 0
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-06-02',
      openPrice: '157.8048',
      highPrice: '158.2192',
      lowPrice: '155.2776',
      closePrice: '157.8048',
      adjustedClosePrice: '0.4792',
      volume: '1486812',
    },
    swingPoint: null,
  },
  // 1
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-06-03',
      openPrice: '156.5464',
      highPrice: '156.5464',
      lowPrice: '155.6920',
      closePrice: '156.5464',
      adjustedClosePrice: '0.4753',
      volume: '800412',
    },
    swingPoint: null,
  },
  // 2
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-06-04',
      openPrice: '159.4824',
      highPrice: '159.4824',
      lowPrice: '156.1024',
      closePrice: '159.4824',
      adjustedClosePrice: '0.4842',
      volume: '871212',
    },
    swingPoint: null,
  },
  // 3
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-06-05',
      openPrice: '158.2192',
      highPrice: '161.1576',
      lowPrice: '158.2192',
      closePrice: '158.2192',
      adjustedClosePrice: '0.4810',
      volume: '1708800',
    },
    swingPoint: null,
  },
  // 4
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-06-06',
      openPrice: '159.0736',
      highPrice: '159.0736',
      lowPrice: '157.8048',
      closePrice: '159.0736',
      adjustedClosePrice: '0.4836',
      volume: '902400',
    },
    swingPoint: null,
  },
  // 5
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-06-09',
      openPrice: '161.6008',
      highPrice: '162.0144',
      lowPrice: '160.7464',
      closePrice: '161.6008',
      adjustedClosePrice: '0.5177',
      volume: '637212',
    },
    swingPoint: null,
  },
  // 6
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-06-10',
      openPrice: '162.4200',
      highPrice: '162.8640',
      lowPrice: '159.8928',
      closePrice: '162.4200',
      adjustedClosePrice: '0.5203',
      volume: '620412',
    },
    swingPoint: null,
  },
  // 7
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-06-11',
      openPrice: '165.8056',
      highPrice: '166.2448',
      lowPrice: '162.0144',
      closePrice: '165.8056',
      adjustedClosePrice: '0.5311',
      volume: '1572012',
    },
    swingPoint: null,
  },
  // 8
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-06-12',
      openPrice: '166.6584',
      highPrice: '168.7776',
      lowPrice: '164.9488',
      closePrice: '166.6584',
      adjustedClosePrice: '0.5339',
      volume: '661212',
    },
    swingPoint: null,
  },
  // 9
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-06-13',
      openPrice: '167.0688',
      highPrice: '168.7776',
      lowPrice: '167.0688',
      closePrice: '167.0688',
      adjustedClosePrice: '0.5352',
      volume: '954012',
    },
    swingPoint: null,
  },
  // 10 swingHigh
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-06-16',
      openPrice: '170.0416',
      highPrice: '170.4552',
      lowPrice: '167.4816',
      closePrice: '170.0416',
      adjustedClosePrice: '0.5447',
      volume: '1267200',
    },
    swingPoint: 'swingHigh',
  },
  // 11
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-06-17',
      openPrice: '171.3088',
      highPrice: '173.8360',
      lowPrice: '170.8624',
      closePrice: '171.3088',
      adjustedClosePrice: '0.5487',
      volume: '2350812',
    },
    swingPoint: null,
  },
  // 12
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-06-18',
      openPrice: '167.9224',
      highPrice: '170.8624',
      lowPrice: '167.0688',
      closePrice: '167.9224',
      adjustedClosePrice: '0.5379',
      volume: '3193212',
    },
    swingPoint: null,
  },
  // 13 swingLow
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-06-19',
      openPrice: '162.8640',
      highPrice: '168.3328',
      lowPrice: '162.8640',
      closePrice: '162.8640',
      adjustedClosePrice: '0.5217',
      volume: '420012',
    },
    swingPoint: 'swingLow',
  },
  // 14
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-06-20',
      openPrice: '164.9488',
      highPrice: '165.3952',
      lowPrice: '162.4200',
      closePrice: '164.9488',
      adjustedClosePrice: '0.5284',
      volume: '358812',
    },
    swingPoint: null,
  },
  // 15
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-06-23',
      openPrice: '167.0688',
      highPrice: '167.0688',
      lowPrice: '164.9488',
      closePrice: '167.0688',
      adjustedClosePrice: '0.5352',
      volume: '975612',
    },
    swingPoint: null,
  },
  // 16
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-06-24',
      openPrice: '167.0688',
      highPrice: '167.4816',
      lowPrice: '165.3952',
      closePrice: '167.0688',
      adjustedClosePrice: '0.5352',
      volume: '390012',
    },
    swingPoint: null,
  },
  // 17 swingHigh
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-06-25',
      openPrice: '169.1856',
      highPrice: '169.1856',
      lowPrice: '166.6584',
      closePrice: '169.1856',
      adjustedClosePrice: '0.5419',
      volume: '810012',
    },
    swingPoint: 'swingHigh',
  },
  // 18
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-06-26',
      openPrice: '165.8056',
      highPrice: '169.5960',
      lowPrice: '165.8056',
      closePrice: '165.8056',
      adjustedClosePrice: '0.5311',
      volume: '961212',
    },
    swingPoint: null,
  },
  // 19
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-06-27',
      openPrice: '165.8056',
      highPrice: '166.6584',
      lowPrice: '164.1280',
      closePrice: '165.8056',
      adjustedClosePrice: '0.5311',
      volume: '924012',
    },
    swingPoint: null,
  },
  // 20 swingLow
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-06-30',
      openPrice: '162.8640',
      highPrice: '164.9488',
      lowPrice: '162.8640',
      closePrice: '162.8640',
      adjustedClosePrice: '0.5217',
      volume: '421212',
    },
    swingPoint: 'swingLow',
  },
  // 21 swingHigh
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-07-01',
      openPrice: '164.5416',
      highPrice: '164.5416',
      lowPrice: '162.0144',
      closePrice: '164.5416',
      adjustedClosePrice: '0.5271',
      volume: '346812',
    },
    swingPoint: 'swingHigh',
  },
  // 22
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-07-02',
      openPrice: '162.0144',
      highPrice: '164.5416',
      lowPrice: '162.0144',
      closePrice: '162.0144',
      adjustedClosePrice: '0.5190',
      volume: '2052012',
    },
    swingPoint: null,
  },
  // 23
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-07-03',
      openPrice: '162.8640',
      highPrice: '162.8640',
      lowPrice: '161.1576',
      closePrice: '162.8640',
      adjustedClosePrice: '0.5217',
      volume: '194412',
    },
    swingPoint: null,
  },
  // 24
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-07-04',
      openPrice: '163.6848',
      highPrice: '164.1280',
      lowPrice: '162.0144',
      closePrice: '163.6848',
      adjustedClosePrice: '0.5243',
      volume: '1056120',
    },
    swingPoint: null,
  },
  // 25
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-07-07',
      openPrice: '163.6848',
      highPrice: '164.1280',
      lowPrice: '160.7464',
      closePrice: '163.6848',
      adjustedClosePrice: '0.5243',
      volume: '1611612',
    },
    swingPoint: null,
  },
  // 26
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-07-08',
      openPrice: '164.9488',
      highPrice: '165.8056',
      lowPrice: '163.2736',
      closePrice: '164.9488',
      adjustedClosePrice: '0.5284',
      volume: '1155612',
    },
    swingPoint: null,
  },
  // 27
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-07-09',
      openPrice: '164.5416',
      highPrice: '166.2448',
      lowPrice: '164.1280',
      closePrice: '164.5416',
      adjustedClosePrice: '0.5271',
      volume: '750012',
    },
    swingPoint: null,
  },
  // 28 swingLow
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-07-10',
      openPrice: '161.1576',
      highPrice: '163.2736',
      lowPrice: '161.1576',
      closePrice: '161.1576',
      adjustedClosePrice: '0.5162',
      volume: '580800',
    },
    swingPoint: 'swingLow',
  },
  // 29
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-07-11',
      openPrice: '162.0144',
      highPrice: '163.6848',
      lowPrice: '161.1576',
      closePrice: '162.0144',
      adjustedClosePrice: '0.5190',
      volume: '370812',
    },
    swingPoint: null,
  },
  // 30
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-07-14',
      openPrice: '165.8056',
      highPrice: '166.2448',
      lowPrice: '161.6008',
      closePrice: '165.8056',
      adjustedClosePrice: '0.5311',
      volume: '579612',
    },
    swingPoint: null,
  },
  // 31 swingHigh
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-07-15',
      openPrice: '167.4816',
      highPrice: '169.5960',
      lowPrice: '167.4816',
      closePrice: '167.4816',
      adjustedClosePrice: '0.5365',
      volume: '1521600',
    },
    swingPoint: 'swingHigh',
  },
  // 32
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-07-16',
      openPrice: '166.6584',
      highPrice: '168.7776',
      lowPrice: '165.3952',
      closePrice: '166.6584',
      adjustedClosePrice: '0.5339',
      volume: '1860012',
    },
    swingPoint: null,
  },
  // 33
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-07-17',
      openPrice: '165.3952',
      highPrice: '165.8056',
      lowPrice: '163.6848',
      closePrice: '165.3952',
      adjustedClosePrice: '0.5298',
      volume: '900012',
    },
    swingPoint: null,
  },
  // 34
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-07-18',
      openPrice: '163.2736',
      highPrice: '164.9488',
      lowPrice: '162.0144',
      closePrice: '163.2736',
      adjustedClosePrice: '0.5230',
      volume: '2251200',
    },
    swingPoint: null,
  },
  // 35 swingLow
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-07-21',
      openPrice: '159.4824',
      highPrice: '163.2736',
      lowPrice: '157.8048',
      closePrice: '159.4824',
      adjustedClosePrice: '0.5109',
      volume: '1123200',
    },
    swingPoint: 'swingLow',
  },
  // 36
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-07-22',
      openPrice: '160.3368',
      highPrice: '161.6008',
      lowPrice: '159.8928',
      closePrice: '160.3368',
      adjustedClosePrice: '0.5136',
      volume: '676800',
    },
    swingPoint: null,
  },
  // 37 swingHigh
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-07-23',
      openPrice: '162.0144',
      highPrice: '162.0144',
      lowPrice: '159.0736',
      closePrice: '162.0144',
      adjustedClosePrice: '0.5190',
      volume: '1017600',
    },
    swingPoint: 'swingHigh',
  },
  // 38
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-07-24',
      openPrice: '156.1024',
      highPrice: '160.3368',
      lowPrice: '154.0144',
      closePrice: '156.1024',
      adjustedClosePrice: '0.5007',
      volume: '1918812',
    },
    swingPoint: null,
  },
  // 39 swingLow
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-07-25',
      openPrice: '152.7184',
      highPrice: '156.5464',
      lowPrice: '150.1888',
      closePrice: '152.7184',
      adjustedClosePrice: '0.4898',
      volume: '1327212',
    },
    swingPoint: 'swingLow',
  },
  // 40
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-07-28',
      openPrice: '153.5688',
      highPrice: '153.5688',
      lowPrice: '152.3056',
      closePrice: '153.5688',
      adjustedClosePrice: '0.5201',
      volume: '1450812',
    },
    swingPoint: null,
  },
  // 41 swingHigh
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-07-29',
      openPrice: '161.6008',
      highPrice: '162.4200',
      lowPrice: '153.5688',
      closePrice: '161.6008',
      adjustedClosePrice: '0.5473',
      volume: '1045212',
    },
    swingPoint: 'swingHigh',
  },
  // 42
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-07-30',
      openPrice: '161.6008',
      highPrice: '162.0144',
      lowPrice: '157.8048',
      closePrice: '161.6008',
      adjustedClosePrice: '0.5473',
      volume: '1236012',
    },
    swingPoint: null,
  },
  // 43
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-07-31',
      openPrice: '157.8048',
      highPrice: '160.3368',
      lowPrice: '156.5464',
      closePrice: '157.8048',
      adjustedClosePrice: '0.5345',
      volume: '1462812',
    },
    swingPoint: null,
  },
  // 44 swingLow
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-08-01',
      openPrice: '154.4248',
      highPrice: '157.8048',
      lowPrice: '153.5688',
      closePrice: '154.4248',
      adjustedClosePrice: '0.5230',
      volume: '1170012',
    },
    swingPoint: 'swingLow',
  },
  // 45
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-08-04',
      openPrice: '154.4248',
      highPrice: '155.2776',
      lowPrice: '153.5688',
      closePrice: '154.4248',
      adjustedClosePrice: '0.5230',
      volume: '2540412',
    },
    swingPoint: null,
  },
  // 46
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-08-05',
      openPrice: '154.4248',
      highPrice: '156.9520',
      lowPrice: '153.1608',
      closePrice: '154.4248',
      adjustedClosePrice: '0.5230',
      volume: '1375212',
    },
    swingPoint: null,
  },
  // 47
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-08-06',
      openPrice: '154.4248',
      highPrice: '154.4248',
      lowPrice: '151.8976',
      closePrice: '154.4248',
      adjustedClosePrice: '0.5230',
      volume: '1632000',
    },
    swingPoint: null,
  },
  // 48
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-08-07',
      openPrice: '160.3368',
      highPrice: '160.3368',
      lowPrice: '155.2776',
      closePrice: '160.3368',
      adjustedClosePrice: '0.5430',
      volume: '2433600',
    },
    swingPoint: null,
  },
  // 49
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-08-08',
      openPrice: '165.3952',
      highPrice: '167.0688',
      lowPrice: '162.0144',
      closePrice: '165.3952',
      adjustedClosePrice: '0.5602',
      volume: '3916800',
    },
    swingPoint: null,
  },
  // 50 swingHigh
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-08-11',
      openPrice: '172.5688',
      highPrice: '173.3896',
      lowPrice: '167.0688',
      closePrice: '172.5688',
      adjustedClosePrice: '0.5845',
      volume: '1434012',
    },
    swingPoint: 'swingHigh',
  },
  // 51
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-08-12',
      openPrice: '172.1256',
      highPrice: '175.0992',
      lowPrice: '172.1256',
      closePrice: '172.1256',
      adjustedClosePrice: '0.5830',
      volume: '2142012',
    },
    swingPoint: null,
  },
  // 52 swingLow
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-08-13',
      openPrice: '168.7776',
      highPrice: '171.3088',
      lowPrice: '168.3328',
      closePrice: '168.7776',
      adjustedClosePrice: '0.5716',
      volume: '2890812',
    },
    swingPoint: 'swingLow',
  },
  // 53 swingHigh
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-08-14',
      openPrice: '174.2464',
      highPrice: '174.2464',
      lowPrice: '168.3328',
      closePrice: '174.2464',
      adjustedClosePrice: '0.5901',
      volume: '1992000',
    },
    swingPoint: 'swingHigh',
  },
  // 54
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-08-15',
      openPrice: '169.5960',
      highPrice: '175.5096',
      lowPrice: '169.5960',
      closePrice: '169.5960',
      adjustedClosePrice: '0.5744',
      volume: '1062012',
    },
    swingPoint: null,
  },
  // 55
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-08-18',
      openPrice: '166.6584',
      highPrice: '170.4552',
      lowPrice: '165.3952',
      closePrice: '166.6584',
      adjustedClosePrice: '0.5645',
      volume: '475200',
    },
    swingPoint: null,
  },
  // 56 swingLow
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-08-19',
      openPrice: '161.6008',
      highPrice: '166.6584',
      lowPrice: '161.1576',
      closePrice: '161.6008',
      adjustedClosePrice: '0.5473',
      volume: '998400',
    },
    swingPoint: 'swingLow',
  },
  // 57
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-08-20',
      openPrice: '162.8640',
      highPrice: '163.6848',
      lowPrice: '161.1576',
      closePrice: '162.8640',
      adjustedClosePrice: '0.5516',
      volume: '1017600',
    },
    swingPoint: null,
  },
  // 58
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-08-21',
      openPrice: '164.5416',
      highPrice: '164.9488',
      lowPrice: '162.8640',
      closePrice: '164.5416',
      adjustedClosePrice: '0.5573',
      volume: '828012',
    },
    swingPoint: null,
  },
  // 59 swingHigh
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-08-22',
      openPrice: '167.0688',
      highPrice: '167.9224',
      lowPrice: '165.8056',
      closePrice: '167.0688',
      adjustedClosePrice: '0.5658',
      volume: '1260012',
    },
    swingPoint: 'swingHigh',
  },
  // 60
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-08-25',
      openPrice: '167.9224',
      highPrice: '167.9224',
      lowPrice: '165.3952',
      closePrice: '167.9224',
      adjustedClosePrice: '0.5687',
      volume: '537600',
    },
    swingPoint: null,
  },
  // 61
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-08-26',
      openPrice: '166.6584',
      highPrice: '168.3328',
      lowPrice: '166.2448',
      closePrice: '166.6584',
      adjustedClosePrice: '0.5645',
      volume: '270012',
    },
    swingPoint: null,
  },
  // 62
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-08-27',
      openPrice: '163.6848',
      highPrice: '166.2448',
      lowPrice: '162.8640',
      closePrice: '163.6848',
      adjustedClosePrice: '0.5544',
      volume: '940800',
    },
    swingPoint: null,
  },
  // 63 swingLow
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-08-28',
      openPrice: '161.6008',
      highPrice: '163.2736',
      lowPrice: '161.6008',
      closePrice: '161.6008',
      adjustedClosePrice: '0.5473',
      volume: '823212',
    },
    swingPoint: 'swingLow',
  },
  // 64
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-08-29',
      openPrice: '161.6008',
      highPrice: '161.6008',
      lowPrice: '160.3368',
      closePrice: '161.6008',
      adjustedClosePrice: '0.5473',
      volume: '682812',
    },
    swingPoint: null,
  },
  // 65
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-09-02',
      openPrice: '163.6848',
      highPrice: '163.6848',
      lowPrice: '158.6296',
      closePrice: '163.6848',
      adjustedClosePrice: '0.5544',
      volume: '525612',
    },
    swingPoint: null,
  },
  // 66 swingHigh
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-09-03',
      openPrice: '166.6584',
      highPrice: '166.6584',
      lowPrice: '163.6848',
      closePrice: '166.6584',
      adjustedClosePrice: '0.5645',
      volume: '235200',
    },
    swingPoint: 'swingHigh',
  },
  // 67
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-09-04',
      openPrice: '160.3368',
      highPrice: '167.4816',
      lowPrice: '158.6296',
      closePrice: '160.3368',
      adjustedClosePrice: '0.5430',
      volume: '1056000',
    },
    swingPoint: null,
  },
  // 68
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-09-05',
      openPrice: '159.8928',
      highPrice: '162.8640',
      lowPrice: '158.6296',
      closePrice: '159.8928',
      adjustedClosePrice: '0.5415',
      volume: '1142400',
    },
    swingPoint: null,
  },
  // 69 swingLow
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-09-08',
      openPrice: '158.2192',
      highPrice: '161.1576',
      lowPrice: '157.8048',
      closePrice: '158.2192',
      adjustedClosePrice: '0.5359',
      volume: '912000',
    },
    swingPoint: 'swingLow',
  },
  // 70
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-09-09',
      openPrice: '157.3656',
      highPrice: '158.2192',
      lowPrice: '156.1024',
      closePrice: '157.3656',
      adjustedClosePrice: '0.5330',
      volume: '559212',
    },
    swingPoint: null,
  },
  // 71
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-09-10',
      openPrice: '158.2192',
      highPrice: '159.4824',
      lowPrice: '157.8048',
      closePrice: '158.2192',
      adjustedClosePrice: '0.5359',
      volume: '892800',
    },
    swingPoint: null,
  },
  // 72
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-09-11',
      openPrice: '157.8048',
      highPrice: '159.0736',
      lowPrice: '157.3656',
      closePrice: '157.8048',
      adjustedClosePrice: '0.5345',
      volume: '946812',
    },
    swingPoint: null,
  },
  // 73
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-09-12',
      openPrice: '158.2192',
      highPrice: '158.6296',
      lowPrice: '156.9520',
      closePrice: '158.2192',
      adjustedClosePrice: '0.5359',
      volume: '578412',
    },
    swingPoint: null,
  },
  // 74
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-09-15',
      openPrice: '161.1576',
      highPrice: '161.1576',
      lowPrice: '158.6296',
      closePrice: '161.1576',
      adjustedClosePrice: '0.5458',
      volume: '877212',
    },
    swingPoint: null,
  },
  // 75
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-09-16',
      openPrice: '166.2448',
      highPrice: '168.3328',
      lowPrice: '161.6008',
      closePrice: '166.2448',
      adjustedClosePrice: '0.5631',
      volume: '1201212',
    },
    swingPoint: null,
  },
  // 76 swingHigh
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-09-17',
      openPrice: '169.5960',
      highPrice: '170.0416',
      lowPrice: '166.2448',
      closePrice: '169.5960',
      adjustedClosePrice: '0.5744',
      volume: '718812',
    },
    swingPoint: 'swingHigh',
  },
  // 77
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-09-18',
      openPrice: '167.0688',
      highPrice: '172.1256',
      lowPrice: '167.0688',
      closePrice: '167.0688',
      adjustedClosePrice: '0.5658',
      volume: '1012800',
    },
    swingPoint: null,
  },
  // 78
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-09-19',
      openPrice: '168.3328',
      highPrice: '170.0416',
      lowPrice: '164.9488',
      closePrice: '168.3328',
      adjustedClosePrice: '0.5701',
      volume: '1021212',
    },
    swingPoint: null,
  },
  // 79
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-09-22',
      openPrice: '169.5960',
      highPrice: '169.5960',
      lowPrice: '165.3952',
      closePrice: '169.5960',
      adjustedClosePrice: '0.5744',
      volume: '1294812',
    },
    swingPoint: null,
  },
  // 80
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-09-23',
      openPrice: '168.3328',
      highPrice: '172.5688',
      lowPrice: '168.3328',
      closePrice: '168.3328',
      adjustedClosePrice: '0.5701',
      volume: '1112412',
    },
    swingPoint: null,
  },
  // 81
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-09-24',
      openPrice: '167.4816',
      highPrice: '168.7776',
      lowPrice: '166.2448',
      closePrice: '167.4816',
      adjustedClosePrice: '0.5672',
      volume: '784812',
    },
    swingPoint: null,
  },
  // 82
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-09-25',
      openPrice: '164.5416',
      highPrice: '166.2448',
      lowPrice: '164.1280',
      closePrice: '164.5416',
      adjustedClosePrice: '0.5573',
      volume: '525612',
    },
    swingPoint: null,
  },
  // 83
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-09-26',
      openPrice: '161.1576',
      highPrice: '162.8640',
      lowPrice: '160.7464',
      closePrice: '161.1576',
      adjustedClosePrice: '0.5458',
      volume: '739200',
    },
    swingPoint: null,
  },
  // 84
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-09-29',
      openPrice: '161.1576',
      highPrice: '161.1576',
      lowPrice: '159.0736',
      closePrice: '161.1576',
      adjustedClosePrice: '0.5458',
      volume: '277212',
    },
    swingPoint: null,
  },
  // 85
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-09-30',
      openPrice: '162.0144',
      highPrice: '162.8640',
      lowPrice: '161.1576',
      closePrice: '162.0144',
      adjustedClosePrice: '0.5487',
      volume: '336000',
    },
    swingPoint: null,
  },
  // 86
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-10-01',
      openPrice: '162.0144',
      highPrice: '162.8640',
      lowPrice: '160.7464',
      closePrice: '162.0144',
      adjustedClosePrice: '0.5487',
      volume: '1008000',
    },
    swingPoint: null,
  },
  // 87 swingLow
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-10-02',
      openPrice: '159.8928',
      highPrice: '162.8640',
      lowPrice: '157.3656',
      closePrice: '159.8928',
      adjustedClosePrice: '0.5415',
      volume: '1684800',
    },
    swingPoint: 'swingLow',
  },
  // 88 swingHigh
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-10-03',
      openPrice: '162.0144',
      highPrice: '162.4200',
      lowPrice: '159.0736',
      closePrice: '162.0144',
      adjustedClosePrice: '0.5487',
      volume: '1243200',
    },
    swingPoint: 'swingHigh',
  },
  // 89
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-10-06',
      openPrice: '161.6008',
      highPrice: '164.1280',
      lowPrice: '160.7464',
      closePrice: '161.6008',
      adjustedClosePrice: '0.5473',
      volume: '488412',
    },
    swingPoint: null,
  },
  // 90
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-10-07',
      openPrice: '159.4824',
      highPrice: '162.0144',
      lowPrice: '158.6296',
      closePrice: '159.4824',
      adjustedClosePrice: '0.5401',
      volume: '1707612',
    },
    swingPoint: null,
  },
  // 91
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-10-08',
      openPrice: '160.3368',
      highPrice: '160.7464',
      lowPrice: '158.6296',
      closePrice: '160.3368',
      adjustedClosePrice: '0.5430',
      volume: '784812',
    },
    swingPoint: null,
  },
  // 92
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-10-09',
      openPrice: '158.6296',
      highPrice: '160.7464',
      lowPrice: '158.2192',
      closePrice: '158.6296',
      adjustedClosePrice: '0.5373',
      volume: '386412',
    },
    swingPoint: null,
  },
  // 93 swingLow
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-10-10',
      openPrice: '155.6920',
      highPrice: '159.0736',
      lowPrice: '155.6920',
      closePrice: '155.6920',
      adjustedClosePrice: '0.5273',
      volume: '811200',
    },
    swingPoint: 'swingLow',
  },
  // 94 swingHigh
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-10-13',
      openPrice: '157.8048',
      highPrice: '158.6296',
      lowPrice: '155.2776',
      closePrice: '157.8048',
      adjustedClosePrice: '0.5345',
      volume: '702012',
    },
    swingPoint: 'swingHigh',
  },
  // 95
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-10-14',
      openPrice: '157.8048',
      highPrice: '160.3368',
      lowPrice: '157.8048',
      closePrice: '157.8048',
      adjustedClosePrice: '0.5345',
      volume: '2466012',
    },
    swingPoint: null,
  },
  // 96
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-10-15',
      openPrice: '158.6296',
      highPrice: '158.6296',
      lowPrice: '157.3656',
      closePrice: '158.6296',
      adjustedClosePrice: '0.5373',
      volume: '942012',
    },
    swingPoint: null,
  },
  // 97
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-10-16',
      openPrice: '156.5464',
      highPrice: '159.4824',
      lowPrice: '156.1024',
      closePrice: '156.5464',
      adjustedClosePrice: '0.5302',
      volume: '1936812',
    },
    swingPoint: null,
  },
  // 98
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-10-17',
      openPrice: '155.6920',
      highPrice: '156.9520',
      lowPrice: '155.2776',
      closePrice: '155.6920',
      adjustedClosePrice: '0.5273',
      volume: '735612',
    },
    swingPoint: null,
  },
  // 99
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-10-20',
      openPrice: '155.6920',
      highPrice: '156.1024',
      lowPrice: '154.8328',
      closePrice: '155.6920',
      adjustedClosePrice: '0.5273',
      volume: '771612',
    },
    swingPoint: null,
  },
  // 100
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-10-21',
      openPrice: '154.4248',
      highPrice: '157.3656',
      lowPrice: '153.5688',
      closePrice: '154.4248',
      adjustedClosePrice: '0.5230',
      volume: '1196412',
    },
    swingPoint: null,
  },
  // 101
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-10-22',
      openPrice: '154.8328',
      highPrice: '154.8328',
      lowPrice: '153.5688',
      closePrice: '154.8328',
      adjustedClosePrice: '0.5244',
      volume: '423612',
    },
    swingPoint: null,
  },
  // 102 swingLow
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-10-23',
      openPrice: '150.1888',
      highPrice: '154.8328',
      lowPrice: '150.1888',
      closePrice: '150.1888',
      adjustedClosePrice: '0.5087',
      volume: '1297212',
    },
    swingPoint: 'swingLow',
  },
  // 103
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-10-24',
      openPrice: '149.3640',
      highPrice: '149.3640',
      lowPrice: '147.6568',
      closePrice: '149.3640',
      adjustedClosePrice: '0.5059',
      volume: '1606812',
    },
    swingPoint: null,
  },
  // 104
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-10-27',
      openPrice: '150.1888',
      highPrice: '151.0416',
      lowPrice: '149.3640',
      closePrice: '150.1888',
      adjustedClosePrice: '0.5093',
      volume: '885612',
    },
    swingPoint: null,
  },
  // 105
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-10-28',
      openPrice: '149.7784',
      highPrice: '149.7784',
      lowPrice: '147.6568',
      closePrice: '149.7784',
      adjustedClosePrice: '0.5080',
      volume: '1322412',
    },
    swingPoint: null,
  },
  // 106
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-10-29',
      openPrice: '148.9248',
      highPrice: '151.0416',
      lowPrice: '148.5112',
      closePrice: '148.9248',
      adjustedClosePrice: '0.5339',
      volume: '618012',
    },
    swingPoint: null,
  },
  // 107
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-10-30',
      openPrice: '147.6568',
      highPrice: '149.3640',
      lowPrice: '146.8368',
      closePrice: '147.6568',
      adjustedClosePrice: '0.5294',
      volume: '910812',
    },
    swingPoint: null,
  },
  // 108
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-10-31',
      openPrice: '149.3640',
      highPrice: '149.3640',
      lowPrice: '147.2512',
      closePrice: '149.3640',
      adjustedClosePrice: '0.5355',
      volume: '558012',
    },
    swingPoint: null,
  },
  // 109
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-11-03',
      openPrice: '151.4848',
      highPrice: '152.7184',
      lowPrice: '149.7784',
      closePrice: '151.4848',
      adjustedClosePrice: '0.5431',
      volume: '802812',
    },
    swingPoint: null,
  },
  // 110 swingHigh
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-11-05',
      openPrice: '154.0144',
      highPrice: '157.3656',
      lowPrice: '153.1608',
      closePrice: '154.0144',
      adjustedClosePrice: '0.5522',
      volume: '1592412',
    },
    swingPoint: 'swingHigh',
  },
  // 111 swingLow
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-11-06',
      openPrice: '148.9248',
      highPrice: '153.1608',
      lowPrice: '148.5112',
      closePrice: '148.9248',
      adjustedClosePrice: '0.5339',
      volume: '990012',
    },
    swingPoint: 'swingLow',
  },
  // 112
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-11-07',
      openPrice: '149.7784',
      highPrice: '150.6336',
      lowPrice: '148.9248',
      closePrice: '149.7784',
      adjustedClosePrice: '0.5370',
      volume: '952812',
    },
    swingPoint: null,
  },
  // 113
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-11-10',
      openPrice: '148.5112',
      highPrice: '151.0416',
      lowPrice: '148.5112',
      closePrice: '148.5112',
      adjustedClosePrice: '0.5325',
      volume: '1104000',
    },
    swingPoint: null,
  },
  // 114
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-11-11',
      openPrice: '148.9248',
      highPrice: '149.3640',
      lowPrice: '147.6568',
      closePrice: '148.9248',
      adjustedClosePrice: '0.5339',
      volume: '874812',
    },
    swingPoint: null,
  },
  // 115
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-11-12',
      openPrice: '148.9248',
      highPrice: '148.9248',
      lowPrice: '146.3976',
      closePrice: '148.9248',
      adjustedClosePrice: '0.5339',
      volume: '2373612',
    },
    swingPoint: null,
  },
  // 116
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-11-13',
      openPrice: '148.9248',
      highPrice: '150.1888',
      lowPrice: '148.1008',
      closePrice: '148.9248',
      adjustedClosePrice: '0.5339',
      volume: '2410812',
    },
    swingPoint: null,
  },
  // 117
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-11-14',
      openPrice: '147.6568',
      highPrice: '148.5112',
      lowPrice: '146.8368',
      closePrice: '147.6568',
      adjustedClosePrice: '0.5294',
      volume: '3015612',
    },
    swingPoint: null,
  },
  // 118
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-11-17',
      openPrice: '148.1008',
      highPrice: '148.1008',
      lowPrice: '147.6568',
      closePrice: '148.1008',
      adjustedClosePrice: '0.5310',
      volume: '1162812',
    },
    swingPoint: null,
  },
  // 119
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-11-18',
      openPrice: '149.7784',
      highPrice: '150.1888',
      lowPrice: '147.6568',
      closePrice: '149.7784',
      adjustedClosePrice: '0.5370',
      volume: '2151612',
    },
    swingPoint: null,
  },
  // 120
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-11-19',
      openPrice: '152.7184',
      highPrice: '154.4248',
      lowPrice: '150.1888',
      closePrice: '152.7184',
      adjustedClosePrice: '0.5475',
      volume: '3012012',
    },
    swingPoint: null,
  },
  // 121 swingHigh
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-11-20',
      openPrice: '157.8048',
      highPrice: '161.1576',
      lowPrice: '151.4848',
      closePrice: '157.8048',
      adjustedClosePrice: '0.5658',
      volume: '4592412',
    },
    swingPoint: 'swingHigh',
  },
  // 122
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-11-21',
      openPrice: '158.6296',
      highPrice: '159.4824',
      lowPrice: '157.3656',
      closePrice: '158.6296',
      adjustedClosePrice: '0.5687',
      volume: '2176812',
    },
    swingPoint: null,
  },
  // 123
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-11-24',
      openPrice: '158.6296',
      highPrice: '158.6296',
      lowPrice: '155.2776',
      closePrice: '158.6296',
      adjustedClosePrice: '0.5687',
      volume: '1149612',
    },
    swingPoint: null,
  },
  // 124
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-11-25',
      openPrice: '158.2192',
      highPrice: '159.4824',
      lowPrice: '157.8048',
      closePrice: '158.2192',
      adjustedClosePrice: '0.5673',
      volume: '1718400',
    },
    swingPoint: null,
  },
  // 125
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-11-26',
      openPrice: '155.6920',
      highPrice: '158.6296',
      lowPrice: '155.2776',
      closePrice: '155.6920',
      adjustedClosePrice: '0.5582',
      volume: '1689600',
    },
    swingPoint: null,
  },
  // 126
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-11-28',
      openPrice: '154.8328',
      highPrice: '156.1024',
      lowPrice: '153.5688',
      closePrice: '154.8328',
      adjustedClosePrice: '0.5551',
      volume: '920412',
    },
    swingPoint: null,
  },
  // 127 swingLow
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-12-01',
      openPrice: '150.1888',
      highPrice: '155.6920',
      lowPrice: '149.3640',
      closePrice: '150.1888',
      adjustedClosePrice: '0.5385',
      volume: '1993212',
    },
    swingPoint: 'swingLow',
  },
  // 128
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-12-02',
      openPrice: '151.4848',
      highPrice: '151.4848',
      lowPrice: '147.6568',
      closePrice: '151.4848',
      adjustedClosePrice: '0.5431',
      volume: '1618812',
    },
    swingPoint: null,
  },
  // 129
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-12-03',
      openPrice: '152.3056',
      highPrice: '152.7184',
      lowPrice: '150.6336',
      closePrice: '152.3056',
      adjustedClosePrice: '0.5461',
      volume: '1394412',
    },
    swingPoint: null,
  },
  // 130
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-12-04',
      openPrice: '154.4248',
      highPrice: '154.8328',
      lowPrice: '152.3056',
      closePrice: '154.4248',
      adjustedClosePrice: '0.5537',
      volume: '1269612',
    },
    swingPoint: null,
  },
  // 131 swingHigh
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-12-05',
      openPrice: '156.5464',
      highPrice: '157.3656',
      lowPrice: '153.5688',
      closePrice: '156.5464',
      adjustedClosePrice: '0.5613',
      volume: '612012',
    },
    swingPoint: 'swingHigh',
  },
  // 132
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-12-08',
      openPrice: '153.1608',
      highPrice: '156.1024',
      lowPrice: '153.1608',
      closePrice: '153.1608',
      adjustedClosePrice: '0.5491',
      volume: '963612',
    },
    swingPoint: null,
  },
  // 133
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-12-09',
      openPrice: '153.1608',
      highPrice: '154.8328',
      lowPrice: '151.8976',
      closePrice: '153.1608',
      adjustedClosePrice: '0.5491',
      volume: '1836012',
    },
    swingPoint: null,
  },
  // 134
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-12-10',
      openPrice: '152.3056',
      highPrice: '156.5464',
      lowPrice: '152.3056',
      closePrice: '152.3056',
      adjustedClosePrice: '0.5461',
      volume: '1100412',
    },
    swingPoint: null,
  },
  // 135
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-12-11',
      openPrice: '153.5688',
      highPrice: '154.4248',
      lowPrice: '150.6336',
      closePrice: '153.5688',
      adjustedClosePrice: '0.5506',
      volume: '985212',
    },
    swingPoint: null,
  },
  // 136
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-12-12',
      openPrice: '154.8328',
      highPrice: '155.6920',
      lowPrice: '153.5688',
      closePrice: '154.8328',
      adjustedClosePrice: '0.5551',
      volume: '1044012',
    },
    swingPoint: null,
  },
  // 137
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-12-15',
      openPrice: '154.4248',
      highPrice: '155.2776',
      lowPrice: '152.3056',
      closePrice: '154.4248',
      adjustedClosePrice: '0.5537',
      volume: '471612',
    },
    swingPoint: null,
  },
  // 138
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-12-16',
      openPrice: '153.5688',
      highPrice: '154.4248',
      lowPrice: '151.8976',
      closePrice: '153.5688',
      adjustedClosePrice: '0.5506',
      volume: '2644800',
    },
    swingPoint: null,
  },
  // 139 swingLow
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-12-17',
      openPrice: '151.8976',
      highPrice: '153.5688',
      lowPrice: '151.8976',
      closePrice: '151.8976',
      adjustedClosePrice: '0.5446',
      volume: '2780412',
    },
    swingPoint: 'swingLow',
  },
  // 140
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-12-18',
      openPrice: '150.6336',
      highPrice: '151.8976',
      lowPrice: '149.7784',
      closePrice: '150.6336',
      adjustedClosePrice: '0.5401',
      volume: '1672812',
    },
    swingPoint: null,
  },
  // 141
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-12-19',
      openPrice: '151.0416',
      highPrice: '151.4848',
      lowPrice: '149.7784',
      closePrice: '151.0416',
      adjustedClosePrice: '0.5415',
      volume: '403200',
    },
    swingPoint: null,
  },
  // 142
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-12-22',
      openPrice: '156.1024',
      highPrice: '156.1024',
      lowPrice: '150.6336',
      closePrice: '156.1024',
      adjustedClosePrice: '0.5597',
      volume: '938412',
    },
    swingPoint: null,
  },
  // 143
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-12-23',
      openPrice: '155.2776',
      highPrice: '156.5464',
      lowPrice: '154.8328',
      closePrice: '155.2776',
      adjustedClosePrice: '0.5567',
      volume: '696000',
    },
    swingPoint: null,
  },
  // 144 swingHigh
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-12-24',
      openPrice: '157.3656',
      highPrice: '157.3656',
      lowPrice: '154.8328',
      closePrice: '157.3656',
      adjustedClosePrice: '0.5642',
      volume: '684012',
    },
    swingPoint: 'swingHigh',
  },
  // 145
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-12-26',
      openPrice: '156.5464',
      highPrice: '157.3656',
      lowPrice: '156.1024',
      closePrice: '156.5464',
      adjustedClosePrice: '0.5613',
      volume: '378012',
    },
    swingPoint: null,
  },
  // 146 swingLow
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-12-29',
      openPrice: '154.8328',
      highPrice: '156.5464',
      lowPrice: '154.0144',
      closePrice: '154.8328',
      adjustedClosePrice: '0.5551',
      volume: '1104000',
    },
    swingPoint: 'swingLow',
  },
  // 147
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-12-30',
      openPrice: '159.0736',
      highPrice: '160.3368',
      lowPrice: '154.0144',
      closePrice: '159.0736',
      adjustedClosePrice: '0.5703',
      volume: '450012',
    },
    swingPoint: null,
  },
  // 148
  {
    dataPoint: {
      securityId: 1,
      priceDate: '1980-12-31',
      openPrice: '164.5416',
      highPrice: '164.5416',
      lowPrice: '158.6296',
      closePrice: '164.5416',
      adjustedClosePrice: '0.5899',
      volume: '498012',
    },
    swingPoint: null,
  },
];
