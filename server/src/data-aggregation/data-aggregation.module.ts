import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataAggregationController } from './data-aggregation.controller';
import { DataAggregationService } from './data-aggregation.service';
import { OHLCV } from './ohlcv.entity';
import { Security } from './security.entity';

@Module({
  imports: [
    HttpModule,
    ConfigModule,
    TypeOrmModule.forFeature([Security, OHLCV]),
  ],
  controllers: [DataAggregationController],
  providers: [DataAggregationService],
  exports: [DataAggregationService],
})
export class DataAggregationModule {}
