import { DataPoint } from '../../digital-signal-processing/digital-signal-processing.interface';
import { SwingPointData } from '../../digital-signal-processing/swing-points/swing-points.interface';
import { MIN_SWING_POINTS } from './parameters';
import {
  DownwardTrendConfirmed,
  TrendBroken,
  UpwardTrendConfirmed,
} from './states';
import { TrendStateMachine } from './trend-state-machine';
import { TrendData } from './trend.interface';

export class Trend {
  private trends: TrendData[];

  constructor(
    private swingPoints: SwingPointData[],
    private data: DataPoint[],
  ) {
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

    let currentUnbrokenTrend: TrendData | undefined;

    const stateMachine = new TrendStateMachine(({ state, memory }) => {
      if (state instanceof UpwardTrendConfirmed) {
        const trendDefiningPoints = memory.getLatest(3);

        if (!currentUnbrokenTrend) {
          currentUnbrokenTrend = {
            trendType: 'upward',
            startPoint: trendDefiningPoints[0].swingPoint.point,
          };
        }
      } else if (state instanceof DownwardTrendConfirmed) {
        const trendDefiningPoints = memory.getLatest(3);

        if (!currentUnbrokenTrend) {
          currentUnbrokenTrend = {
            trendType: 'downward',
            startPoint: trendDefiningPoints[0].swingPoint.point,
          };
        }
      } else if (state instanceof TrendBroken) {
        const lastPoint = memory.getLast();
        if (currentUnbrokenTrend && lastPoint) {
          currentUnbrokenTrend.endPoint = lastPoint.swingPoint.point;
          this.trends.push(currentUnbrokenTrend);
          currentUnbrokenTrend = undefined;
        }
      }
    });

    let idxSwingPoint = 0;
    while (idxSwingPoint < this.swingPoints.length) {
      stateMachine.process(this.swingPoints[idxSwingPoint]);
      idxSwingPoint++;
    }
    if (currentUnbrokenTrend) {
      currentUnbrokenTrend.endPoint = this.data[this.data.length - 1];
      this.trends.push(currentUnbrokenTrend);
    }

    return this.trends;
  }
}
