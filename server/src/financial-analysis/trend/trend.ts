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

  constructor(
    private swingPoints: SwingPointData[],
    private data: DataPoint[],
    private options: { relativeThreshold: number },
  ) {
    const { relativeThreshold } = options;
    if (this.swingPoints.length < MIN_SWING_POINTS) {
      throw new Error(
        `swingPoints must be an array with at least ${MIN_SWING_POINTS} elements`,
      );
    }
    if (this.data.length < MIN_SWING_POINTS) {
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
  }

  detectTrends(): TrendData[] {
    // Existiert ein laufender Trend, dann muss als nächstes das Ende eines Trend gefunden werden
    // Warnungen erkennen, wann ein Trend möglicherweise zu Ende geht
    // Bei Trendbruch Toleranzen einügen, ob Fehlausbrüche zu ignorieren
    // Toleranzen parameterisierbar machen, um Feintuning zu ermöglichen

    // Bei einem begonnen Trend den Trendkanal bestimmen

    // Ggf. erkennen, ob es sich um langfristigen, mittelfristigen oder kurzfristigen Trend handelt

    // Annahme: wenn kein Aufwärts- oder Abwärtstrend erkannt wird,
    // dann handelt es sich um einen Seitwärtstrend
    // Wahrscheinlich muss hier auch eine Toleranz eingeführt werden, da die Hochs und Tiefs
    // nicht exakt gleich sind, aber trotzdem ähnlich genug sind, um als Seitwärtstrend zu gelten

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
              startPoint: trendDefiningPoints[0].swingPoint.point,
              endPoint: trendDefiningPoints[2].swingPoint.point, // Ende des Trends wird auf den letzten SwingPoint gesetzt
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
          lastTrend.trendData.endPoint = pointBeforeWarning.swingPoint.point; // Ende wird auf letzten Punkt vor Warnung gesetzt
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
            lastTrend.trendData.endPoint = currentPoint.swingPoint.point; // Ende wird auf aktuellen Punkt gesetzt
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
      lastTrend.trendData.endPoint = this.data[this.data.length - 1];
    }

    return this.trends.map((trend) => trend.trendData);
  }
}
