import { Module } from '@nestjs/common';
import { DigitalSignalProcessingService } from './digital-signal-processing.service';

@Module({
  providers: [DigitalSignalProcessingService]
})
export class DigitalSignalProcessingModule {}
