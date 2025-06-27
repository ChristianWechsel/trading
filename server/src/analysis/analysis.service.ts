import { Injectable } from '@nestjs/common';
import { AnalysisQueryDto } from './analysis-query.dto';
import { AnalysisBuilder } from './core/analysis-builder';
import { AnalysisContext } from './core/analysis.interface';
import { EnrichedDataPoint } from './core/enriched-data-point';

@Injectable()
export class AnalysisService {
  performAnalysis(requestedSteps: AnalysisQueryDto): AnalysisContext {
    const builder = new AnalysisBuilder();
    for (const step of requestedSteps.steps) {
      builder.addStep(step);
    }

    const pipeline = builder.build();
    const analysisResult = pipeline.run([
      new EnrichedDataPoint({ x: 1, y: 10 }),
      new EnrichedDataPoint({ x: 2, y: 5 }),
      new EnrichedDataPoint({ x: 3, y: 15 }),
      new EnrichedDataPoint({ x: 4, y: 12 }),
      new EnrichedDataPoint({ x: 5, y: 20 }),
      new EnrichedDataPoint({ x: 6, y: 18 }),
    ]);
    return analysisResult;
  }
}
