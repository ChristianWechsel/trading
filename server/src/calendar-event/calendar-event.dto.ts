import {
  IsBoolean,
  IsDateString,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateCalendarEventDto {
  @IsString()
  @MaxLength(128)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(1024)
  description?: string;

  @IsDateString()
  eventDate: string;

  @IsBoolean()
  @IsOptional()
  recurring?: boolean = false;

  @IsOptional()
  @IsString()
  recurrenceRule?: string;
}
