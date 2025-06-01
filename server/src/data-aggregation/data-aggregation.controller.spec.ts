import { Test, TestingModule } from '@nestjs/testing';
import { DataAggregationController } from './data-aggregation.controller';
import { TickerDto } from './data-aggregation.dto';
import { DataAggregationService } from './data-aggregation.service';

describe('DataAggregationController', () => {
  let controller: DataAggregationController;
  let service: { importAndSaveData: jest.Mock };

  beforeEach(async () => {
    service = { importAndSaveData: jest.fn() };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DataAggregationController],
      providers: [{ provide: DataAggregationService, useValue: service }],
    }).compile();
    controller = module.get(DataAggregationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call importAndSaveData and return result', async () => {
    const dto: TickerDto = { symbol: 'AAPL', exchange: 'US' };
    service.importAndSaveData.mockResolvedValue({ message: 'ok' });
    const result = await controller.importData(dto);
    expect(service.importAndSaveData).toHaveBeenCalledWith(dto);
    expect(result).toEqual({ message: 'ok' });
  });
});
