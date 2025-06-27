import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsNotEmpty, ValidateNested } from 'class-validator';
import { TickerDto } from 'src/data-aggregation/data-aggregation.dto';
import { Step } from './core/analysis.interface';

const allSteps: Step[] = [
  'MovingAverage',
  'SwingPointDetection',
  'TrendDetection',
  'TrendChannelCalculation',
];

export class AnalysisQueryDto {
  @ValidateNested()
  @Type(() => TickerDto)
  @IsNotEmpty()
  ticker: TickerDto;

  @IsArray()
  @IsEnum(allSteps, { each: true }) // Validiert jeden Wert im Array gegen den Step-Typ
  @IsNotEmpty()
  steps: Step[];
}
