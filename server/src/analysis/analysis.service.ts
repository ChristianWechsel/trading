import { Injectable } from '@nestjs/common';
import { OHLCV } from 'src/data-aggregation/ohlcv.entity';
import { AnalysisQueryDto } from './analysis-query.dto';
import { AnalysisBuilder } from './core/analysis-builder';
import { AnalysisContext } from './core/analysis.interface';

@Injectable()
export class AnalysisService {
  performAnalysis(query: AnalysisQueryDto, ohlcvs: OHLCV[]): AnalysisContext {
    const builder = new AnalysisBuilder(query.stepOptions);
    for (const step of query.steps) {
      builder.addStep(step);
    }

    const pipeline = builder.build();
    const analysisResult = pipeline.run(ohlcvs);

    return analysisResult;
  }
}
