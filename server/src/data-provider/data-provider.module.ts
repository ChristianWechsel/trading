import { Module } from '@nestjs/common';
import { DataAggregationModule } from '../data-aggregation/data-aggregation.module';
import { DataProviderController } from './data-provider.controller';
import { DataProviderService } from './data-provider.service';

@Module({
  imports: [DataAggregationModule],
  controllers: [DataProviderController],
  providers: [DataProviderService],
})
export class DataProviderModule {}
