import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataAggregationController } from './data-aggregation.controller';
import { DataAggregationService } from './data-aggregation.service';
import { EodPrice } from './eod-price.entity';
import { Security } from './security.entity';

@Module({
  imports: [
    HttpModule,
    ConfigModule,
    TypeOrmModule.forFeature([Security, EodPrice]),
  ],
  controllers: [DataAggregationController],
  providers: [DataAggregationService],
})
export class DataAggregationModule {}
