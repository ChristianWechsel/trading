import { Controller, Get, Query } from '@nestjs/common';
import { AnalysisQueryDto } from './analysis-query.dto';
import { AnalysisService } from './analysis.service';

@Controller('analysis')
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}

  @Get()
  performAnalysis(@Query() query: AnalysisQueryDto): any {
    return this.analysisService.performAnalysis(query);
  }
}
