import { Body, Controller, Post } from '@nestjs/common';
import { DataAggregationService } from '../data-aggregation/data-aggregation.service';
import { AnalysisQueryDto } from './analysis-query.dto';
import { AnalysisService } from './analysis.service';
import { DataPoint } from './core/analysis.interface';

@Controller('analysis')
export class AnalysisController {
  constructor(
    private readonly analysisService: AnalysisService,
    private readonly dataAggregationService: DataAggregationService,
  ) {}

  @Post()
  async performAnalysis(@Body() body: AnalysisQueryDto) {
    const dataPoints = await this.dataAggregationService.loadData(body.ticker);
    return this.analysisService.performAnalysis(
      body,
      dataPoints.map<DataPoint<number>>((dp) => ({
        x: new Date(dp.priceDate).getTime(),
        y: dp.closePrice,
      })),
    );
  }
}
