import { Test, TestingModule } from '@nestjs/testing';
import { DataProviderController } from './data-provider.controller';

describe('DataProviderController', () => {
  let controller: DataProviderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DataProviderController],
    }).compile();

    controller = module.get<DataProviderController>(DataProviderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
