import { DataPoint } from '../../digital-signal-processing/digital-signal-processing.interface';
import { SwingPointData } from '../../digital-signal-processing/swing-points/swing-points.interface';
import { MIN_SWING_POINTS } from './parameters';
import { TrendData } from './trend.interface';

export class Trend {
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
  }

  detectTrends(): TrendData[] {
    // Ein Trend wird durch Abfolge von drei SwingPoints gestartet
    // Es muss ein Fenster von drei SwingPunkten über die Liste von SwingPoints laufen

    // Der erste SwingPoint im Fenster bestimmt potenziellen Trend: Aufwärts oder Abwärts
    // Der zweite SwingPoint muss gegenteilig zum ersten SwingPoint sein
    // Der dritte SwingPoint muss wieder wie der erste SwingPojnt sein
    // Der dritte SwingPoint muss höher/niedriger wie erste SwingPoint sein

    // Wird diese Bedingung erfüllt, dann wird ein Trend begonnen
    // Wird diese Bedingung nicht erfüllt, dann gehe zum nächsten SwingPoint, richte das Fenster neu ein
    // und wiederhole das Vorgehen

    // Existiert ein laufender Trend, dann muss als nächstes das Ende eines Trend gefunden werden
    // Warnungen erkennen, wann ein Trend möglicherweise zu Ende geht
    // Bei Trendbruch Toleranzen einügen, ob Fehlausbrüche zu ignorieren
    // Toleranzen parameterisierbar machen, um Feintuning zu ermöglichen

    // Ist Trend beendet, dann die ganze Prüfung wieder von vorne beginnen

    // Bei einem begonnen Trend den Trendkanal bestimmen

    // Ggf. erkennen, ob es sich um langfristigen, mittelfristigen oder kurzfristigen Trend handelt

    // Randbedingung: ein begonnener Trend wird in jedem Fall bis zum Ende der Datenreihe fortgesetzt,
    // falls kein Trendbruch vorher erkannt wird

    // Annahme: wenn kein Aufwärts- oder Abwärtstrend erkannt wird,
    // dann handelt es sich um einen Seitwärtstrend
    // Wahrscheinlich muss hier auch eine Toleranz eingeführt werden, da die Hochs und Tiefs
    // nicht exakt gleich sind, aber trotzdem ähnlich genug sind, um als Seitwärtstrend zu gelten

    const trends: TrendData[] = [];
    let idxSwingPoint = 0;
    while (idxSwingPoint <= this.swingPoints.length - MIN_SWING_POINTS) {
      const swingPoint1 = this.swingPoints[idxSwingPoint];
      const swingPoint2 = this.swingPoints[idxSwingPoint + 1];
      const swingPoint3 = this.swingPoints[idxSwingPoint + 2];

      if (this.isUpwardTrend(swingPoint1, swingPoint2, swingPoint3)) {
        trends.push({
          startPoint: swingPoint1.point,
          endPoint: swingPoint3.point,
          trendType: 'upward',
        });
      } else if (this.isDownwardTrend(swingPoint1, swingPoint2, swingPoint3)) {
        trends.push({
          startPoint: swingPoint1.point,
          endPoint: swingPoint3.point,
          trendType: 'downward',
        });
      } else {
        // kein Trend erkannt, gehe zum nächsten SwingPoint
      }

      idxSwingPoint++;
    }
    return trends;
  }

  private isUpwardTrend(
    swingPoint1: SwingPointData,
    swingPoint2: SwingPointData,
    swingPoint3: SwingPointData,
  ): boolean {
    return (
      swingPoint1.swingPointType === 'swingLow' &&
      swingPoint2.swingPointType === 'swingHigh' &&
      swingPoint3.swingPointType === 'swingLow' &&
      swingPoint1.point.y < swingPoint3.point.y
    );
  }

  private isDownwardTrend(
    swingPoint1: SwingPointData,
    swingPoint2: SwingPointData,
    swingPoint3: SwingPointData,
  ): boolean {
    return (
      swingPoint1.swingPointType === 'swingHigh' &&
      swingPoint2.swingPointType === 'swingLow' &&
      swingPoint3.swingPointType === 'swingHigh' &&
      swingPoint1.point.y > swingPoint3.point.y
    );
  }
}
