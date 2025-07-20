import {
  EnrichedDataPoint,
  SwingPointType,
} from 'src/analysis/core/enriched-data-point';
import {
  AnalysisContext,
  AnalysisStep,
  Step,
  TrendChannel,
} from '../../core/analysis.interface';

export class TrendChannelCalculation implements AnalysisStep {
  name: Step = 'TrendChannelCalculation';
  dependsOn: Step[] = ['TrendDetection'];

  execute(context: AnalysisContext): void {
    if (!context.trends || context.trends.length === 0) return;

    for (const trend of context.trends) {
      // Determine the range of the trend
      const startX = trend.startPoint;
      const endX = trend.endPoint;
      const pointsInTrend = context.enrichedDataPoints.filter(
        (p) =>
          p.getDataPoint().getPriceDateEpochTime() >=
            startX.getDataPoint().getPriceDateEpochTime() &&
          (endX === undefined ||
            p.getDataPoint().getPriceDateEpochTime() <=
              endX.getDataPoint().getPriceDateEpochTime()),
      );

      if (trend.type === 'upward') {
        trend.channel = this.calculateChannelForSequence(
          pointsInTrend,
          'swingLow',
          'swingHigh',
        );
      } else if (trend.type === 'downward') {
        trend.channel = this.calculateChannelForSequence(
          pointsInTrend,
          'swingHigh',
          'swingLow',
        );
      } else {
        trend.channel = undefined;
      }
    }
  }

  private calculateChannelForSequence(
    pointsInTrend: EnrichedDataPoint[],
    primaryType: SwingPointType,
    secondaryType: SwingPointType,
  ): TrendChannel | undefined {
    const primarySwings = pointsInTrend.filter(
      (p) => p.getSwingPointType() === primaryType,
    );
    const secondarySwings = pointsInTrend.filter(
      (p) => p.getSwingPointType() === secondaryType,
    );

    // We need at least two primary swings to define the trend line.
    if (primarySwings.length < 2) {
      return undefined;
    }

    const trendPointA = primarySwings[0];
    const trendPointB = primarySwings[1];

    // Find the first secondary swing that lies *between* the two primary swings.
    const returnPoint = secondarySwings.find(
      (p) =>
        p.getDataPoint().getPriceDateEpochTime() >
          trendPointA.getDataPoint().getPriceDateEpochTime() &&
        p.getDataPoint().getPriceDateEpochTime() <
          trendPointB.getDataPoint().getPriceDateEpochTime(),
    );

    // If no such point exists, we can't form a valid channel.
    if (!returnPoint) {
      return undefined;
    }

    // Calculate slope and intercepts
    const slope =
      (trendPointB.getDataPoint().getClosePrice() -
        trendPointA.getDataPoint().getClosePrice()) /
      (trendPointB.getDataPoint().getPriceDateEpochTime() -
        trendPointA.getDataPoint().getPriceDateEpochTime());
    const trendLine = {
      slope,
      yIntercept:
        trendPointA.getDataPoint().getClosePrice() -
        slope * trendPointA.getDataPoint().getPriceDateEpochTime(),
    };
    const returnLine = {
      slope,
      yIntercept:
        returnPoint.getDataPoint().getClosePrice() -
        slope * returnPoint.getDataPoint().getPriceDateEpochTime(),
    };

    return { trendLine, returnLine };
  }
}
