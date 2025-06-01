import { IsString, MaxLength } from 'class-validator';

export class TickerDto {
  @IsString()
  @MaxLength(10)
  symbol: string;

  @IsString()
  @MaxLength(10)
  exchange: string;
}
