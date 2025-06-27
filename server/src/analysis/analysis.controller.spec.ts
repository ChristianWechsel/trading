import { Test, TestingModule } from '@nestjs/testing';
import { AnalysisQueryDto } from './analysis-query.dto';
import { AnalysisController } from './analysis.controller';
import { AnalysisService } from './analysis.service';

describe('AnalysisController', () => {
  let controller: AnalysisController;
  let service: AnalysisService;

  beforeEach(async () => {
    const mockService = {
      performAnalysis: jest.fn().mockReturnValue({ foo: 'bar' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnalysisController],
      providers: [{ provide: AnalysisService, useValue: mockService }],
    }).compile();

    controller = module.get<AnalysisController>(AnalysisController);
    service = module.get<AnalysisService>(AnalysisService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should delegate performAnalysis to the service', () => {
    const dto: AnalysisQueryDto = {
      steps: ['MovingAverage'],
      ticker: { exchange: 'US', symbol: 'AAPL' },
    };
    const result = controller.performAnalysis(dto);

    expect(service.performAnalysis).toHaveBeenCalledWith(dto.steps, []);
    expect(result).toEqual({ foo: 'bar' });
  });
});
