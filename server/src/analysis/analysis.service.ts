import { Injectable } from '@nestjs/common';
import { AnalysisQueryDto } from './analysis-query.dto';
import { AnalysisBuilder } from './core/analysis-builder';
import { AnalysisContext, DataPoint } from './core/analysis.interface';
import { EnrichedDataPoint } from './core/enriched-data-point';

@Injectable()
export class AnalysisService {
  performAnalysis(
    query: AnalysisQueryDto,
    dataPoints: DataPoint<number>[],
  ): AnalysisContext {
    const builder = new AnalysisBuilder(query.stepOptions);
    for (const step of query.steps) {
      builder.addStep(step);
    }

    const pipeline = builder.build();
    const analysisResult = pipeline.run(
      dataPoints.map((dp) => new EnrichedDataPoint(dp)),
    );

    return analysisResult;
  }
}
