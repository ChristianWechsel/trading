import { DataPoint } from '../../../digital-signal-processing/digital-signal-processing.interface';
import { EnrichedDataPoint } from '../../../digital-signal-processing/dto/enriched-data-point/enriched-data-point';
import { SwingPointData } from '../../../digital-signal-processing/swing-points/swing-points.interface';
import { analysisConfig } from '../../config/analysis.config';
import {
  AnalysisContext,
  AnalysisStep,
  Step,
  TrendDataMetadata,
} from '../../core/analysis.interface';
import { ComparableNumber } from '../utils/comparable-number/comparable-number';
import { TrendDetectionStateMachine } from './trend-detection-state-machine';
import {
  DownwardTrendConfirmed,
  DownwardTrendWarning,
  TrendBroken,
  UpwardTrendConfirmed,
  UpwardTrendWarning,
} from './trend-detection-states';

export class TrendDetection implements AnalysisStep {
  name: Step = 'TrendDetection';
  dependsOn: Step[] = ['SwingPointDetection'];

  constructor(private options: { relativeThreshold: number }) {
    const { relativeThreshold } = options;
    if (
      relativeThreshold < analysisConfig.comparableNumber.MIN_THRESHOLD ||
      relativeThreshold > analysisConfig.comparableNumber.MAX_THRESHOLD
    ) {
      throw new Error(
        `relativeThreshold must be between ${analysisConfig.comparableNumber.MIN_THRESHOLD} and ${analysisConfig.comparableNumber.MAX_THRESHOLD}`,
      );
    }
  }

  execute(context: AnalysisContext): void {
    const rawData = context.enrichedDataPoints;
    const { swingPoints, data } = this.generateSwingPointsAndData(rawData);
    const trendsMetadata = this.detectTrends(swingPoints, data);
    context.trends = trendsMetadata.map(
      (trendMetadata) => trendMetadata.trendData,
    );
  }

  private generateSwingPointsAndData(rawData: EnrichedDataPoint[]) {
    const swingPoints = rawData
      .filter((datum) => datum.getSwingPointType() !== null)
      .map<SwingPointData<ComparableNumber>>((enrichedDataPoint) => {
        return {
          swingPointType: enrichedDataPoint.getSwingPointType()!,
          point: {
            x: new ComparableNumber(
              enrichedDataPoint.x,
              this.options.relativeThreshold,
            ),
            y: new ComparableNumber(
              enrichedDataPoint.y,
              this.options.relativeThreshold,
            ),
          },
        };
      });
    if (swingPoints.length < analysisConfig.trendDetection.MIN_SWING_POINTS) {
      throw new Error(
        `data must be an array with at least ${analysisConfig.trendDetection.MIN_SWING_POINTS} swing points`,
      );
    }

    const data = rawData.map<DataPoint<ComparableNumber>>((point) => ({
      x: new ComparableNumber(point.x, this.options.relativeThreshold),
      y: new ComparableNumber(point.y, this.options.relativeThreshold),
    }));
    return { swingPoints, data };
  }

  private detectTrends(
    swingPoints: SwingPointData<ComparableNumber>[],
    data: DataPoint<ComparableNumber>[],
  ) {
    const trends: TrendDataMetadata[] = [];

    const stateMachine = new TrendDetectionStateMachine(
      ({ newState, oldState, memory }) => {
        // Erste Trendbestätigung
        if (
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
        ) {
          const trendDefiningPoints = memory.getLatest(3);
          trends.push({
            trendData: {
              type:
                newState instanceof UpwardTrendConfirmed
                  ? 'upward'
                  : 'downward',
              startPoint: {
                x: trendDefiningPoints[0].swingPoint.point.x.getValue(),
              },
              endPoint: {
                x: trendDefiningPoints[2].swingPoint.point.x.getValue(),
              },
            },
            metaddata: { statusTrend: 'ongoing' },
          });
        } else if (
          // erste Warnung stellt potenzielles Ende des Trends dar
          (newState instanceof UpwardTrendWarning ||
            newState instanceof DownwardTrendWarning) &&
          (oldState instanceof UpwardTrendConfirmed ||
            oldState instanceof DownwardTrendConfirmed)
        ) {
          const lastTrend = trends[trends.length - 1];
          const [pointBeforeWarning] = memory.getLatest(2);
          lastTrend.trendData.endPoint = {
            x: pointBeforeWarning.swingPoint.point.x.getValue(),
          }; // Ende wird auf letzten Punkt vor Warnung gesetzt
        } else if (
          // Warnung hat sich nicht bestätigt, Trend geht weiter.
          (newState instanceof UpwardTrendConfirmed ||
            newState instanceof DownwardTrendConfirmed) &&
          (oldState instanceof UpwardTrendWarning ||
            oldState instanceof DownwardTrendWarning)
        ) {
          const lastTrend = trends[trends.length - 1];
          const currentPoint = memory.getLast();
          if (currentPoint) {
            lastTrend.trendData.endPoint = {
              x: currentPoint.swingPoint.point.x.getValue(),
            }; // Ende wird auf aktuellen Punkt gesetzt
          }
        } else if (
          // Trendbruch eingetreten
          newState instanceof TrendBroken &&
          (oldState instanceof UpwardTrendWarning ||
            oldState instanceof DownwardTrendWarning)
        ) {
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
      lastTrend.trendData.endPoint = {
        x: data[data.length - 1].x.getValue(),
      }; // Ende des Trends auf letzten Datenpunkt setzen
    }

    return trends;
  }
}
