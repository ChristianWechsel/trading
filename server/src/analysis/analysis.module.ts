import { Module } from '@nestjs/common';
import { DataAggregationService } from '../data-aggregation/data-aggregation.service';
import { AnalysisController } from './analysis.controller';
import { AnalysisService } from './analysis.service';

@Module({
  controllers: [AnalysisController],
  providers: [AnalysisService, DataAggregationService],
})
export class AnalysisModule {}
