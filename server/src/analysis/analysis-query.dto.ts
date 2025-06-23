import { Transform } from 'class-transformer';
import { IsArray, IsEnum, IsNotEmpty } from 'class-validator';
import { Step } from './core/analysis.interface';

const allSteps: Step[] = [
  'MovingAverage',
  'SwingPointDetection',
  'TrendDetection',
  'TrendChannelCalculation',
];

export class AnalysisQueryDto {
  /**
   * Eine kommagetrennte Liste der auszuführenden Analyse-Schritte.
   * Beispiel: "TrendDetection,MovingAverage"
   */
  @Transform(({ value }: { value: string }) => value.split(',')) // Transformiert den String in ein Array
  @IsArray()
  @IsEnum(allSteps, { each: true }) // Validiert jeden Wert im Array gegen den Step-Typ
  @IsNotEmpty()
  steps: Step[];
}
