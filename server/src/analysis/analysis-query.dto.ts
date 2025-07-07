import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { TickerDto } from '../data-aggregation/data-aggregation.dto';
import { analysisConfig } from './config/analysis.config';
import { Step } from './core/analysis.interface';

const allSteps: Step[] = [
  'MovingAverage',
  'SwingPointDetection',
  'TrendDetection',
  'TrendChannelCalculation',
];

class SwingPointDetectionOptionsDto {
  @IsOptional()
  @IsNumber()
  @Min(analysisConfig.comparableNumber.MIN_THRESHOLD)
  @Max(analysisConfig.comparableNumber.MAX_THRESHOLD)
  relativeThreshold?: number;

  @IsOptional()
  @IsNumber()
  @Min(analysisConfig.swingPointDetection.MIN_WINDOW_SIZE)
  windowSize?: number;
}

class TrendDetectionOptionsDto {
  @IsOptional()
  @IsNumber()
  @Min(analysisConfig.comparableNumber.MIN_THRESHOLD)
  @Max(analysisConfig.comparableNumber.MAX_THRESHOLD)
  relativeThreshold?: number;
}

class StepOptionsDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => SwingPointDetectionOptionsDto)
  swingPointDetection?: SwingPointDetectionOptionsDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => TrendDetectionOptionsDto)
  trendDetection?: TrendDetectionOptionsDto;
}

export class AnalysisQueryDto {
  @ValidateNested()
  @Type(() => TickerDto)
  @IsNotEmpty()
  ticker: TickerDto;

  @IsArray()
  @IsEnum(allSteps, { each: true }) // Validiert jeden Wert im Array gegen den Step-Typ
  @IsNotEmpty()
  steps: Step[];

  @IsOptional()
  @ValidateNested()
  @Type(() => StepOptionsDto)
  stepOptions?: StepOptionsDto;
}
