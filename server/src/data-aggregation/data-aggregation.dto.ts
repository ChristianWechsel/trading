import { Type } from 'class-transformer';
import {
  IsDateString,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

export class TickerDto {
  @IsString()
  @MaxLength(10)
  symbol: string;

  @IsString()
  @MaxLength(10)
  exchange: string;
}

export class DateRangeDto {
  @IsDateString()
  from: string;

  @IsDateString()
  to: string;
}

export class DataAggregationDto {
  @ValidateNested()
  @Type(() => TickerDto)
  ticker: TickerDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => DateRangeDto)
  range?: DateRangeDto;
}
