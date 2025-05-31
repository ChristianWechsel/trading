import { IsOptional, IsString, IsUrl } from 'class-validator';

export class PayloadDto {
  @IsString()
  title: string;

  @IsString()
  body: string;

  @IsOptional()
  @IsUrl()
  url?: string;
}
