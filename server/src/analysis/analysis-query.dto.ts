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
import { SelectorMoneyManagement } from './core/money-management/money-management.interface';
import { SelectorRiskManagement } from './core/risk-management/risk-management.interface';

const allSteps: Step[] = [
  'MovingAverage',
  'SwingPointDetection',
  'TrendDetection',
  'TrendChannelCalculation',
];

export type YValueSource = 'open' | 'high' | 'low' | 'close';
const yValueSourceValues: YValueSource[] = ['open', 'high', 'low', 'close'];

export const selectorMoneyManagementValues: SelectorMoneyManagement[] = [
  'all-in',
  'fixed-fractional',
];

export const selectorRiskManagementValues: SelectorRiskManagement[] = [
  'atr-based',
  'fixed-percentage',
];

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

export class AccountDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  initialCapital?: number;
}

export class MoneyManagementDto {
  @IsOptional()
  @IsEnum(selectorMoneyManagementValues)
  moneyManagement?: SelectorMoneyManagement;

  @IsOptional()
  @IsPositive()
  fixedFractional?: number;
}

export class RiskManagementDto {
  @IsOptional()
  @IsEnum(selectorRiskManagementValues)
  riskManagement?: SelectorRiskManagement;

  @IsOptional()
  @IsPositive()
  atrFactor?: number;

  @IsOptional()
  @IsPositive()
  fixedFractional?: number;
}

export class TradingDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => AccountDto)
  account?: AccountDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => MoneyManagementDto)
  moneyManagement?: MoneyManagementDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => RiskManagementDto)
  riskManagement?: RiskManagementDto;
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

  @IsOptional()
  @ValidateNested()
  @Type(() => TradingDto)
  trading?: TradingDto;
}
