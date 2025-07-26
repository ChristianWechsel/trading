import { Body, Controller, Post } from '@nestjs/common';
import { DataAggregationService } from '../data-aggregation/data-aggregation.service';
import { AnalysisQueryDto } from './analysis-query.dto';
import { AnalysisService } from './analysis.service';

@Controller('analysis')
export class AnalysisController {
  constructor(
    private readonly analysisService: AnalysisService,
    private readonly dataAggregationService: DataAggregationService,
  ) {}

  @Post()
  async performAnalysis(@Body() query: AnalysisQueryDto) {
    const ohlcvs = await this.dataAggregationService.loadAndUpdateIfNeeded(
      query.dataAggregation,
    );
    return this.analysisService.performAnalysis(query, ohlcvs);
  }
}
