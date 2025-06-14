import { ComparableNumber } from '../../digital-signal-processing/comparable-number/comparable-number';
import {
  MAX_THRESHOLD,
  MIN_THRESHOLD,
} from '../../digital-signal-processing/comparable-number/parameters';
import { DataPoint } from '../../digital-signal-processing/digital-signal-processing.interface';
import { SwingPointData } from '../../digital-signal-processing/swing-points/swing-points.interface';
import { MIN_SWING_POINTS } from './parameters';
import {
  DownwardTrendConfirmed,
  DownwardTrendWarning,
  TrendBroken,
  UpwardTrendConfirmed,
  UpwardTrendWarning,
} from './states';
import { TrendStateMachine } from './trend-state-machine';
import { TrendData, TrendDataMetadata } from './trend.interface';

export class Trend {
  private trends: TrendDataMetadata[];
  private swingPoints: SwingPointData<ComparableNumber>[];
  private data: DataPoint<ComparableNumber>[];

  constructor(
    swingPoints: SwingPointData<number>[],
    data: DataPoint<number>[],
    private options: { relativeThreshold: number },
  ) {
    const { relativeThreshold } = options;
    if (swingPoints.length < MIN_SWING_POINTS) {
      throw new Error(
        `swingPoints must be an array with at least ${MIN_SWING_POINTS} elements`,
      );
    }
    if (data.length < MIN_SWING_POINTS) {
      throw new Error(
        `data must be an array with at least ${MIN_SWING_POINTS} elements`,
      );
    }
    if (
      relativeThreshold < MIN_THRESHOLD ||
      relativeThreshold > MAX_THRESHOLD
    ) {
      throw new Error(
        `relativeThreshold must be between ${MIN_THRESHOLD} and ${MAX_THRESHOLD}`,
      );
    }

    this.trends = [];
    this.swingPoints = swingPoints.map<SwingPointData<ComparableNumber>>(
      (swingPoint) => {
        const { point, swingPointType } = swingPoint;
        return {
          swingPointType,
          point: {
            x: new ComparableNumber(point.x, this.options.relativeThreshold),
            y: new ComparableNumber(point.y, this.options.relativeThreshold),
          },
        };
      },
    );
    this.data = data.map<DataPoint<ComparableNumber>>((point) => ({
      x: new ComparableNumber(point.x, this.options.relativeThreshold),
      y: new ComparableNumber(point.y, this.options.relativeThreshold),
    }));
  }

  detectTrends(): TrendData[] {
    // Bei Trendbruch Toleranzen einügen, ob Fehlausbrüche zu ignorieren
    // Toleranzen parameterisierbar machen, um Feintuning zu ermöglichen

    // Bei einem begonnen Trend den Trendkanal bestimmen

    // Ggf. erkennen, ob es sich um langfristigen, mittelfristigen oder kurzfristigen Trend handelt

    const stateMachine = new TrendStateMachine(
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
          this.trends.push({
            trendData: {
              trendType:
                newState instanceof UpwardTrendConfirmed
                  ? 'upward'
                  : 'downward',
              startPoint: {
                x: trendDefiningPoints[0].swingPoint.point.x.getValue(),
                y: trendDefiningPoints[0].swingPoint.point.y.getValue(),
              },
              endPoint: {
                x: trendDefiningPoints[2].swingPoint.point.x.getValue(),
                y: trendDefiningPoints[2].swingPoint.point.y.getValue(),
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
          const lastTrend = this.trends[this.trends.length - 1];
          const [pointBeforeWarning] = memory.getLatest(2);
          lastTrend.trendData.endPoint = {
            x: pointBeforeWarning.swingPoint.point.x.getValue(),
            y: pointBeforeWarning.swingPoint.point.y.getValue(),
          }; // Ende wird auf letzten Punkt vor Warnung gesetzt
        } else if (
          // Warnung hat sich nicht bestätigt, Trend geht weiter.
          (newState instanceof UpwardTrendConfirmed ||
            newState instanceof DownwardTrendConfirmed) &&
          (oldState instanceof UpwardTrendWarning ||
            oldState instanceof DownwardTrendWarning)
        ) {
          const lastTrend = this.trends[this.trends.length - 1];
          const currentPoint = memory.getLast();
          if (currentPoint) {
            lastTrend.trendData.endPoint = {
              x: currentPoint.swingPoint.point.x.getValue(),
              y: currentPoint.swingPoint.point.y.getValue(),
            }; // Ende wird auf aktuellen Punkt gesetzt
          }
        } else if (
          // Trendbruch eingetreten
          newState instanceof TrendBroken &&
          (oldState instanceof UpwardTrendWarning ||
            oldState instanceof DownwardTrendWarning)
        ) {
          const lastTrend = this.trends[this.trends.length - 1];
          lastTrend.metaddata.statusTrend = 'finished';
        }
      },
    );

    let idxSwingPoint = 0;
    while (idxSwingPoint < this.swingPoints.length) {
      stateMachine.process(this.swingPoints[idxSwingPoint]);
      idxSwingPoint++;
    }
    const lastTrend = this.trends[this.trends.length - 1];
    if (lastTrend && lastTrend.metaddata.statusTrend === 'ongoing') {
      lastTrend.trendData.endPoint = {
        x: this.data[this.data.length - 1].x.getValue(),
        y: this.data[this.data.length - 1].y.getValue(),
      }; // Ende des Trends auf letzten Datenpunkt setzen
    }

    return this.trends.map((trend) => trend.trendData);
  }
}
