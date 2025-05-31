import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DataAggregationController } from './data-aggregation.controller';
import { DataAggregationService } from './data-aggregation.service';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [DataAggregationController],
  providers: [DataAggregationService],
})
export class DataAggregationModule {}
