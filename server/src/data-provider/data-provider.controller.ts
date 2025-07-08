import { Body, Controller, Post } from '@nestjs/common';
import { DataAggregationDto } from '../data-aggregation/data-aggregation.dto';
import { DataProviderService } from './data-provider.service';

@Controller('data-provider')
export class DataProviderController {
  constructor(private readonly dataProviderService: DataProviderService) {}

  @Post('eod')
  eodData(@Body() dto: DataAggregationDto) {
    return this.dataProviderService.getEod(dto);
  }
}
