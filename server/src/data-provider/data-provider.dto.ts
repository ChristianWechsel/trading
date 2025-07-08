import { Type } from 'class-transformer';
import { IsDateString, ValidateNested } from 'class-validator';
import { TickerDto } from 'src/data-aggregation/data-aggregation.dto';

export class DataProviderDto {
  @ValidateNested()
  @Type(() => TickerDto)
  ticker: TickerDto;

  @IsDateString()
  from: string;

  @IsDateString()
  to: string;
}
