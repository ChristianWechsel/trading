import { AnalysisContextClass } from '../../../analysis/core/analysis-context';
import { EnrichedDataPoint } from '../../../analysis/core/enriched-data-points/enriched-data-point';
import { analysisConfig } from '../../config/analysis.config';
import {
  AnalysisStep,
  Step,
  TrendDataMetadata,
} from '../../core/analysis.interface';
import { TrendDetectionStateMachine } from './trend-detection-state-machine';
import {
  DownwardTrendConfirmed,
  DownwardTrendWarning,
  State,
  TrendBroken,
  UpwardTrendConfirmed,
  UpwardTrendWarning,
} from './trend-detection-states';
import { SwingPointData } from './trend-detection.interface';

export class TrendDetection implements AnalysisStep {
  name: Step = 'TrendDetection';
  dependsOn: Step[] = ['SwingPointDetection'];

  execute(context: AnalysisContextClass): void {
    const rawData = context.getEnrichedDataPoints();
    const { swingPoints, data } = this.generateSwingPointsAndData(
      rawData,
      context,
    );
    const trendsMetadata = this.detectTrends(swingPoints, data);
    context.setTrends(
      trendsMetadata.map((trendMetadata) => trendMetadata.trendData),
    );
  }

  private generateSwingPointsAndData(
    rawData: EnrichedDataPoint[],
    context: AnalysisContextClass,
  ) {
    const swingPoints = rawData
      .filter(
        (datum) =>
          datum.getSwingPointType() !== undefined &&
          datum.getSwingPointType() !== null,
      )
      .map<SwingPointData>((enrichedDataPoint) => {
        return {
          swingPointType: enrichedDataPoint.getSwingPointType()!,
          point: {
            enrichedDataPoint,
            priceComparisonValue: context.buildComparableNumber({
              enrichedDataPoint,
              step: this.name,
            }),
          },
        };
      });
    if (swingPoints.length < analysisConfig.trendDetection.MIN_SWING_POINTS) {
      throw new Error(
        `data must be an array with at least ${analysisConfig.trendDetection.MIN_SWING_POINTS} swing points`,
      );
    }

    const data = rawData.map<SwingPointData['point']>((enrichedDataPoint) => ({
      enrichedDataPoint,
      priceComparisonValue: context.buildComparableNumber({
        enrichedDataPoint,
        step: this.name,
      }),
    }));
    return { swingPoints, data };
  }

  private detectTrends(
    swingPoints: SwingPointData[],
    data: SwingPointData['point'][],
  ) {
    const trends: TrendDataMetadata[] = [];

    const stateMachine = new TrendDetectionStateMachine(
      ({ newState, oldState, memory }) => {
        if (this.isTrendConfirmed(newState, oldState)) {
          const trendDefiningPoints = memory.getLatest(3);
          const start =
            trendDefiningPoints[0].swingPoint.point.enrichedDataPoint;
          const end = trendDefiningPoints[2].swingPoint.point.enrichedDataPoint;
          trends.push({
            trendData: {
              type:
                newState instanceof UpwardTrendConfirmed
                  ? 'upward'
                  : 'downward',
              start,
              end,
              confirmation: end,
            },
            metaddata: { statusTrend: 'ongoing' },
          });
        } else if (this.isTrendWarningTriggered(newState, oldState)) {
          const lastTrend = trends[trends.length - 1];
          const [pointBeforeWarning, warningPoint] = memory.getLatest(2);
          lastTrend.trendData.end =
            pointBeforeWarning.swingPoint.point.enrichedDataPoint; // Ende wird auf letzten Punkt vor Warnung gesetzt
          if (Array.isArray(lastTrend.trendData.warnings)) {
            lastTrend.trendData.warnings?.push(
              warningPoint.swingPoint.point.enrichedDataPoint,
            );
          } else {
            lastTrend.trendData.warnings = [
              warningPoint.swingPoint.point.enrichedDataPoint,
            ];
          }
        } else if (this.isTrendWarningCleared(newState, oldState)) {
          const lastTrend = trends[trends.length - 1];
          const currentPoint = memory.getLast();
          if (currentPoint) {
            lastTrend.trendData.end =
              currentPoint.swingPoint.point.enrichedDataPoint; // Ende wird auf aktuellen Punkt gesetzt
          }
        } else if (this.isTrendBroken(newState, oldState)) {
          const lastTrend = trends[trends.length - 1];
          lastTrend.metaddata.statusTrend = 'finished';
        }
      },
    );

    let idxSwingPoint = 0;
    while (idxSwingPoint < swingPoints.length) {
      stateMachine.process(swingPoints[idxSwingPoint]);
      idxSwingPoint++;
    }
    const lastTrend = trends[trends.length - 1];
    if (lastTrend && lastTrend.metaddata.statusTrend === 'ongoing') {
      lastTrend.trendData.end = data[data.length - 1].enrichedDataPoint; // Ende des Trends auf letzten Datenpunkt setzen
    }

    return trends;
  }

  private isTrendConfirmed(newState: State, oldState: State | undefined) {
    return (
      (newState instanceof UpwardTrendConfirmed &&
        !(
          oldState instanceof UpwardTrendWarning ||
          oldState instanceof UpwardTrendConfirmed
        )) ||
      (newState instanceof DownwardTrendConfirmed &&
        !(
          oldState instanceof DownwardTrendWarning ||
          oldState instanceof DownwardTrendConfirmed
        ))
    );
  }

  private isTrendWarningTriggered(
    newState: State,
    oldState: State | undefined,
  ) {
    return (
      (newState instanceof UpwardTrendWarning ||
        newState instanceof DownwardTrendWarning) &&
      (oldState instanceof UpwardTrendConfirmed ||
        oldState instanceof DownwardTrendConfirmed)
    );
  }

  private isTrendWarningCleared(newState: State, oldState: State | undefined) {
    return (
      (newState instanceof UpwardTrendConfirmed ||
        newState instanceof DownwardTrendConfirmed) &&
      (oldState instanceof UpwardTrendWarning ||
        oldState instanceof DownwardTrendWarning)
    );
  }

  private isTrendBroken(newState: State, oldState: State | undefined) {
    return (
      newState instanceof TrendBroken &&
      (oldState instanceof UpwardTrendWarning ||
        oldState instanceof DownwardTrendWarning)
    );
  }
}
