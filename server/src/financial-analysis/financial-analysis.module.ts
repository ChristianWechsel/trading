import { Module } from '@nestjs/common';
import { FinancialAnalysisService } from './financial-analysis.service';

@Module({
  providers: [FinancialAnalysisService],
})
export class FinancialAnalysisModule {}
