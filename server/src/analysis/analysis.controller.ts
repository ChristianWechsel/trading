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

  // Umbau zu Post.Dort die Analsyseschritte angeben, die durchgeführt werden sollen.
  // TickerSymbol übergeben, für welche die Analyse durchgeführt werden soll.
  // Die Datenpunkte für die Analyse werden aus der Datenbank geladen.
  // Beim Laden aus der Datenbank wird geprüft, ob der letzte Datenpunkt aktuell ist.
  // Wenn nicht, dann werden die Datenpunkte aktualisiert => data-aggregation verwenden.
  @Post()
  async performAnalysis(@Body() body: AnalysisQueryDto) {
    const dataPoints = await this.dataAggregationService.loadData(body.ticker);
    return this.analysisService.performAnalysis(
      body.steps,
      dataPoints.map<DataPoint<number>>((dp) => ({
        x: new Date(dp.priceDate).getTime(),
        y: dp.closePrice,
      })),
    );
  }
}
