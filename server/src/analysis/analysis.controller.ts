import { Body, Controller, Post } from '@nestjs/common';
import { AnalysisQueryDto } from './analysis-query.dto';
import { AnalysisService } from './analysis.service';

@Controller('analysis')
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}

  // Umbau zu Post.Dort die Analsyseschritte angeben, die durchgeführt werden sollen.
  // TickerSymbol übergeben, für welche die Analyse durchgeführt werden soll.
  // Die Datenpunkte für die Analyse werden aus der Datenbank geladen.
  // Beim Laden aus der Datenbank wird geprüft, ob der letzte Datenpunkt aktuell ist.
  // Wenn nicht, dann werden die Datenpunkte aktualisiert => data-aggregation verwenden.
  @Post()
  performAnalysis(@Body() body: AnalysisQueryDto) {
    return this.analysisService.performAnalysis(body.steps, []);
  }
}
