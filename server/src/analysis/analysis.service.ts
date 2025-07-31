import { Injectable } from '@nestjs/common';
import { OHLCV } from 'src/data-aggregation/ohlcv.entity';
import { AnalysisQueryDto } from './analysis-query.dto';
import { AnalysisBuilder } from './core/analysis-builder';
import { AnalysisContextClass } from './core/analysis-context';

@Injectable()
export class AnalysisService {
  performAnalysis(
    query: AnalysisQueryDto,
    ohlcvs: OHLCV[],
  ): AnalysisContextClass {
    const builder = new AnalysisBuilder();
    for (const step of query.steps) {
      builder.addStep(step);
    }

    const context = new AnalysisContextClass(query, ohlcvs);
    const pipeline = builder.build();
    const analysisResult = pipeline.run(context);

    return analysisResult;
  }
}
