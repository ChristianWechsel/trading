import {
  AnalysisContextClass,
  YValueAccessor,
} from '../../../analysis/core/analysis-context';
import {
  EnrichedDataPoint,
  SwingPointType,
} from '../../../analysis/core/enriched-data-points/enriched-data-point';
import {
  AnalysisStep,
  Step,
  TrendChannel,
} from '../../core/analysis.interface';

export class TrendChannelCalculation implements AnalysisStep {
  name: Step = 'TrendChannelCalculation';
  dependsOn: Step[] = ['TrendDetection'];

  execute(context: AnalysisContextClass): void {
    const trends = context.getTrends();
    if (!trends || trends.length === 0) return;

    const yValueAccessor = context.buildYValueAccessor();
    for (const trend of trends) {
      // Determine the range of the trend
      const startX = trend.start;
      const endX = trend.end;
      const pointsInTrend = context
        .getEnrichedDataPoints()
        .filter(
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
          yValueAccessor,
        );
      } else if (trend.type === 'downward') {
        trend.channel = this.calculateChannelForSequence(
          pointsInTrend,
          'swingHigh',
          'swingLow',
          yValueAccessor,
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
    yValueAccessor: YValueAccessor,
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
      (yValueAccessor(trendPointB) - yValueAccessor(trendPointA)) /
      (trendPointB.getDataPoint().getPriceDateEpochTime() -
        trendPointA.getDataPoint().getPriceDateEpochTime());
    const trendLine = {
      slope,
      yIntercept:
        yValueAccessor(trendPointA) -
        slope * trendPointA.getDataPoint().getPriceDateEpochTime(),
    };
    const returnLine = {
      slope,
      yIntercept:
        yValueAccessor(returnPoint) -
        slope * returnPoint.getDataPoint().getPriceDateEpochTime(),
    };

    return { trendLine, returnLine };
  }
}
