import { Type } from 'class-transformer';
import { IsDateString, IsOptional, ValidateNested } from 'class-validator';
import { TickerDto } from 'src/data-aggregation/data-aggregation.dto';

export class DateRangeDto {
  @IsDateString()
  from: string;

  @IsDateString()
  to: string;
}

export class DataProviderDto {
  @ValidateNested()
  @Type(() => TickerDto)
  ticker: TickerDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => DateRangeDto)
  range?: DateRangeDto;
}
