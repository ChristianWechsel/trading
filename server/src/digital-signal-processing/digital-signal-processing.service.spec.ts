import { Test, TestingModule } from '@nestjs/testing';
import { DigitalSignalProcessingService } from './digital-signal-processing.service';

describe('DigitalSignalProcessingService', () => {
  let service: DigitalSignalProcessingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DigitalSignalProcessingService],
    }).compile();

    service = module.get<DigitalSignalProcessingService>(DigitalSignalProcessingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
