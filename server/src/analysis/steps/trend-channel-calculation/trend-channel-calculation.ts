import {
  AnalysisContext,
  AnalysisStep,
  Step,
} from '../../core/analysis.interface';

export class TrendChannelCalculation implements AnalysisStep {
  name: Step = 'TrendChannelCalculation';
  dependsOn: Step[] = ['TrendDetection'];

  execute(context: AnalysisContext): void {
    if (!context.trends || context.trends.length === 0) return;
    for (const trend of context.trends) {
      // Trendbereich bestimmen
      const startX = trend.startPoint.x;
      const endX = trend.endPoint?.x;
      const pointsInTrend = context.enrichedDataPoints.filter(
        (p) => p.x >= startX && (endX === undefined || p.x <= endX),
      );
      if (trend.type === 'upward') {
        // Finde die ersten beiden swingLows und das erste swingHigh dazwischen
        const swingLows = pointsInTrend.filter(
          (p) => p.getSwingPointType() === 'swingLow',
        );
        const swingHighs = pointsInTrend.filter(
          (p) => p.getSwingPointType() === 'swingHigh',
        );
        if (swingLows.length >= 2 && swingHighs.length >= 1) {
          const pointA = swingLows[0];
          const pointB = swingHighs[0];
          const pointC = swingLows[1];
          const slope = (pointC.y - pointA.y) / (pointC.x - pointA.x);
          const trendLine = { slope, yIntercept: pointA.y - slope * pointA.x };
          const returnLine = { slope, yIntercept: pointB.y - slope * pointB.x };
          trend.channel = { trendLine, returnLine };
        } else {
          trend.channel = undefined;
        }
      } else if (trend.type === 'downward') {
        // Finde die ersten beiden swingHighs und das erste swingLow dazwischen
        const swingHighs = pointsInTrend.filter(
          (p) => p.getSwingPointType() === 'swingHigh',
        );
        const swingLows = pointsInTrend.filter(
          (p) => p.getSwingPointType() === 'swingLow',
        );
        if (swingHighs.length >= 2 && swingLows.length >= 1) {
          const pointA = swingHighs[0];
          const pointB = swingLows[0];
          const pointC = swingHighs[1];
          const slope = (pointC.y - pointA.y) / (pointC.x - pointA.x);
          const trendLine = { slope, yIntercept: pointA.y - slope * pointA.x };
          const returnLine = { slope, yIntercept: pointB.y - slope * pointB.x };
          trend.channel = { trendLine, returnLine };
        } else {
          trend.channel = undefined;
        }
      } else {
        trend.channel = undefined;
      }
    }
  }
}
