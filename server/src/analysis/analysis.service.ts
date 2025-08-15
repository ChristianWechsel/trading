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
    const context = new AnalysisContextClass(query, ohlcvs);
    const steps = context.getOptions().getSteps().getSteps();
    const builder = new AnalysisBuilder();
    for (const step of steps) {
      builder.addStep(step);
    }

    const pipeline = builder.build();
    const analysisResult = pipeline.run(context);

    return analysisResult;
  }
}
