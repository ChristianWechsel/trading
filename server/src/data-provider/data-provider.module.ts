import { Module } from '@nestjs/common';
import { DataProviderController } from './data-provider.controller';
import { DataProviderService } from './data-provider.service';

@Module({
  controllers: [DataProviderController],
  providers: [DataProviderService]
})
export class DataProviderModule {}
