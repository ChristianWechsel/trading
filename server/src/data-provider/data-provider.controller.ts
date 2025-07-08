import { Body, Controller, Post } from '@nestjs/common';
import { DataProviderDto } from './data-provider.dto';
import { DataProviderService } from './data-provider.service';

@Controller('data-provider')
export class DataProviderController {
  constructor(private readonly dataProviderService: DataProviderService) {}

  @Post('eod')
  eodData(@Body() dto: DataProviderDto) {
    return this.dataProviderService.getEod(dto.ticker);
  }
}
