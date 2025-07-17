import { Test } from '@nestjs/testing';
import { DataAggregationService } from '../data-aggregation/data-aggregation.service';
import { AnalysisController } from './analysis.controller';
import { AnalysisIntTestData } from './analysis.int.testdata';
import { IDataAggregationService } from './analysis.interface';
import { AnalysisService } from './analysis.service';

describe('Analysis (Integration)', () => {
  const analysisIntTestData = new AnalysisIntTestData();
  let controller: AnalysisController;

  beforeEach(async () => {
    const mockDataAggregationService: IDataAggregationService = {
      loadAndUpdateIfNeeded: () =>
        Promise.resolve(analysisIntTestData.getMCDUSHistoricalData1980().data),
      importAndSaveData: jest.fn(),
      loadData: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      controllers: [AnalysisController],
      providers: [
        AnalysisService,
        {
          provide: DataAggregationService,
          useValue: mockDataAggregationService,
        },
      ],
    }).compile();

    controller = moduleRef.get<AnalysisController>(AnalysisController);
  });

  it('MCD.US 1980-03-17 - 1980-06-01', async () => {
    const testData = analysisIntTestData.getMCDUSHistoricalData1980();
    const result = await controller.performAnalysis(testData.dto);
    expect(result.enrichedDataPoints).toEqual(
      expect.arrayContaining(testData.expected),
    );
  });
});
