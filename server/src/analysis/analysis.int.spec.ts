import { Test } from '@nestjs/testing';
import { DataAggregationService } from '../data-aggregation/data-aggregation.service';
import { AnalysisController } from './analysis.controller';
import { AnalysisIntTestData } from './analysis.int.testdata';
import { IDataAggregationService } from './analysis.interface';
import { AnalysisService } from './analysis.service';

describe('Analysis (Integration)', () => {
  const analysisIntTestData = new AnalysisIntTestData();
  let controller: AnalysisController;

  beforeEach(async () => {});

  it('MCD.US 1980-03-17 - 1980-06-01 - RelativeThreshold', async () => {
    const testData =
      analysisIntTestData.getMCDUSHistoricalData1980FirstHalfRelativeThreshold();
    const mockDataAggregationService: IDataAggregationService = {
      loadAndUpdateIfNeeded: () => Promise.resolve(testData.data),
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

    const result = await controller.performAnalysis(testData.dto);

    const resultObjects = result.getEnrichedDataPoints().map((r) => ({
      dataPoint: r.getDataPoint(),
      swingPointType: r.getSwingPointType(),
    }));

    const expectedObjects = testData.expected.map((e) => ({
      dataPoint: e.getDataPoint(),
      swingPointType: e.getSwingPointType(),
    }));

    expect(resultObjects).toEqual(expectedObjects);
  });

  it('MCD.US 1980-06-01 - 1980-12-31', async () => {
    const testData = analysisIntTestData.getMCDUSHistoricalData1980SecondHalf();
    const mockDataAggregationService: IDataAggregationService = {
      loadAndUpdateIfNeeded: () => Promise.resolve(testData.data),
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

    const result = await controller.performAnalysis(testData.dto);
    const resultObjects = result.getEnrichedDataPoints().map((r) => ({
      dataPoint: r.getDataPoint(),
      swingPointType: r.getSwingPointType(),
    }));

    const expectedObjects = testData.expected.map((e) => ({
      dataPoint: e.getDataPoint(),
      swingPointType: e.getSwingPointType(),
    }));

    expect(resultObjects).toEqual(expectedObjects);
  });

  it('select y value: close', async () => {
    const testData = analysisIntTestData.getDataYSelectClose();
    const mockDataAggregationService: IDataAggregationService = {
      loadAndUpdateIfNeeded: () => Promise.resolve(testData.data),
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

    const result = await controller.performAnalysis(testData.dto);

    const resultObjects = result.getEnrichedDataPoints().map((r) => ({
      dataPoint: r.getDataPoint(),
      swingPointType: r.getSwingPointType(),
    }));

    const expectedObjects = testData.expected.map((e) => ({
      dataPoint: e.getDataPoint(),
      swingPointType: e.getSwingPointType(),
    }));

    expect(resultObjects).toEqual(expectedObjects);
  });

  it('select y value: open', async () => {
    const testData = analysisIntTestData.getDataYSelectOpen();
    const mockDataAggregationService: IDataAggregationService = {
      loadAndUpdateIfNeeded: () => Promise.resolve(testData.data),
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

    const result = await controller.performAnalysis(testData.dto);

    const resultObjects = result.getEnrichedDataPoints().map((r) => ({
      dataPoint: r.getDataPoint(),
      swingPointType: r.getSwingPointType(),
    }));

    const expectedObjects = testData.expected.map((e) => ({
      dataPoint: e.getDataPoint(),
      swingPointType: e.getSwingPointType(),
    }));

    expect(resultObjects).toEqual(expectedObjects);
  });

  it('select y value: high', async () => {
    const testData = analysisIntTestData.getDataYSelectHigh();
    const mockDataAggregationService: IDataAggregationService = {
      loadAndUpdateIfNeeded: () => Promise.resolve(testData.data),
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

    const result = await controller.performAnalysis(testData.dto);

    const resultObjects = result.getEnrichedDataPoints().map((r) => ({
      dataPoint: r.getDataPoint(),
      swingPointType: r.getSwingPointType(),
    }));

    const expectedObjects = testData.expected.map((e) => ({
      dataPoint: e.getDataPoint(),
      swingPointType: e.getSwingPointType(),
    }));

    expect(resultObjects).toEqual(expectedObjects);
  });

  it('select y value: low', async () => {
    const testData = analysisIntTestData.getDataYSelectLow();
    const mockDataAggregationService: IDataAggregationService = {
      loadAndUpdateIfNeeded: () => Promise.resolve(testData.data),
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

    const result = await controller.performAnalysis(testData.dto);

    const resultDataPoints = result.getEnrichedDataPoints().map((r) => ({
      dataPoint: r.getDataPoint(),
      swingPointType: r.getSwingPointType(),
      averageTrueRange: r.getAverageTrueRange(),
    }));

    const expectedDataPoints = testData.expected.map((e) => ({
      dataPoint: e.getDataPoint(),
      swingPointType: e.getSwingPointType(),
      averageTrueRange: e.getAverageTrueRange(),
    }));

    expect(resultDataPoints).toEqual(expectedDataPoints);
  });

  it('should perform a full analysis with all steps using ATR', async () => {
    const testData = analysisIntTestData.getFullAnalysisWithATR();
    const mockDataAggregationService: IDataAggregationService = {
      loadAndUpdateIfNeeded: () => Promise.resolve(testData.data),
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

    const result = await controller.performAnalysis(testData.dto);

    const resultDataPoints = result.getEnrichedDataPoints().map((r) => ({
      dataPoint: r.getDataPoint(),
      swingPointType: r.getSwingPointType(),
      averageTrueRange: r.getAverageTrueRange(),
    }));
    const expectedDataPoints = testData.expected.map((e) => ({
      dataPoint: e.getDataPoint(),
      swingPointType: e.getSwingPointType(),
      averageTrueRange: e.getAverageTrueRange(),
    }));

    const actualTrends = result.getTrends();
    const expectedTrends = testData.expectedTrends || [];

    expect(resultDataPoints).toEqual(expectedDataPoints);
    expect(actualTrends).toEqual(expectedTrends);
  });
});
