import { Test, TestingModule } from '@nestjs/testing';
import { DataAggregationController } from './data-aggregation.controller';

describe('DataAggregationController', () => {
  let controller: DataAggregationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DataAggregationController],
    }).compile();

    controller = module.get<DataAggregationController>(DataAggregationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
