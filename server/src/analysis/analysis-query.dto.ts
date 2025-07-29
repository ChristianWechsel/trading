import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { DataAggregationDto } from '../data-aggregation/data-aggregation.dto';
import { analysisConfig } from './config/analysis.config';
import { Step } from './core/analysis.interface';

const allSteps: Step[] = [
  'MovingAverage',
  'SwingPointDetection',
  'TrendDetection',
  'TrendChannelCalculation',
];

export type YValueSource = 'open' | 'high' | 'low' | 'close';
const yValueSourceValues: YValueSource[] = ['open', 'high', 'low', 'close'];

export class SwingPointDetectionOptionsDto {
  @IsOptional()
  @IsNumber()
  @Min(analysisConfig.comparableNumber.MIN_THRESHOLD)
  @Max(analysisConfig.comparableNumber.MAX_THRESHOLD)
  relativeThreshold?: number;

  @IsOptional()
  @IsNumber()
  @Min(analysisConfig.swingPointDetection.MIN_WINDOW_SIZE)
  windowSize?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  atrFactor?: number;
}

export class TrendDetectionOptionsDto {
  @IsOptional()
  @IsNumber()
  @Min(analysisConfig.comparableNumber.MIN_THRESHOLD)
  @Max(analysisConfig.comparableNumber.MAX_THRESHOLD)
  relativeThreshold?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  atrFactor?: number;
}

export class AverageTrueRangeOptionsDto {
  @IsOptional()
  @IsNumber()
  @Min(analysisConfig.averageTrueRange.MIN_PERIOD)
  period?: number;
}

export class StepOptionsDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => SwingPointDetectionOptionsDto)
  swingPointDetection?: SwingPointDetectionOptionsDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => TrendDetectionOptionsDto)
  trendDetection?: TrendDetectionOptionsDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => AverageTrueRangeOptionsDto)
  averageTrueRange?: AverageTrueRangeOptionsDto;

  @IsOptional()
  @IsEnum(yValueSourceValues)
  yValueSource?: YValueSource;
}

export class AnalysisQueryDto {
  @ValidateNested()
  @Type(() => DataAggregationDto)
  dataAggregation: DataAggregationDto;

  @IsArray()
  @IsEnum(allSteps, { each: true }) // Validiert jeden Wert im Array gegen den Step-Typ
  @IsNotEmpty()
  steps: Step[];

  @IsOptional()
  @ValidateNested()
  @Type(() => StepOptionsDto)
  stepOptions?: StepOptionsDto;
}
