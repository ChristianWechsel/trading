import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataAggregationService } from '../data-aggregation/data-aggregation.service';
import { OHLCVEntity } from '../data-aggregation/ohlcv.entity';
import { Security } from '../data-aggregation/security.entity';
import { AnalysisController } from './analysis.controller';
import { AnalysisService } from './analysis.service';

@Module({
  imports: [
    HttpModule,
    ConfigModule,
    TypeOrmModule.forFeature([Security, OHLCVEntity]),
  ],
  controllers: [AnalysisController],
  providers: [AnalysisService, DataAggregationService],
})
export class AnalysisModule {}
