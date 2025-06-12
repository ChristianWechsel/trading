import { DataPoint } from '../../digital-signal-processing/digital-signal-processing.interface';
import { SwingPointData } from '../../digital-signal-processing/swing-points/swing-points.interface';
import { MIN_SWING_POINTS } from './parameters';
import {
  DownwardTrendConfirmed,
  getStartState,
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

    // Überlegungen zum Algorithmus
    // Der erste SwingPoint (idx) bestimmt durch seine Ausprägung den potenziell nächsten Trend
    //      SwingHigh => Abwärtstrend
    //      SwingLow => Aufwärtstrend
    //      state wird auf not confirmed gesetzt
    //      startPoint wird auf Wert des SwingPoints gesetzt
    // Überprüfung der nächten SwingPoints:
    // Fall Trend wird bestätigt
    //      iteration zum nächsten SwingPoint idx + 1
    //      SwingPoint muss gegenteilig zum ersten SwingPoint sein
    //      iteration zum nächsten SwingPoint idx + 2
    //      SwingPoint muss wie der erste SwingPoint sein
    //      SwingPoint muss höher/niedriger wie der erste SwingPoint sein
    // => state wird auf confirmed gesetzt
    // Fall Trend wird nicht bestätigt
    //      sobald ein SwingPoint nicht den Bedingungen entspricht wird Prozess
    //      abgebrochen und zum nächsten SwingPoint iteriert idx++
    //      und der Prozess beginnt von vorne

    // Bei einem bestätigem Trend wird jetzt immer weiter zum nächsten
    // Swingpoint iteriert und dieser mit dem vorheirgen SwingPoint vom gleichen
    // Typ verglichen, ob der Wert steigend/fallend ist. Dies wird bis zum
    // Ende der Datenreihe durchgeführt.
    // Falls der erste SwingPoint diesen Bedingungen nicht entspricht,
    // dann wird warningAt mit dem DataPoint der "Verletzung" gefüllt und state auf warning gesetzt.

    // Fallunterscheidung nächster SwingPoint
    // Falls der nächste SwingPoint ebenfalls den Bedingungen verletzt, wird state auf broken gesetzt
    // und der endpoint auf das DatPoint des letzten SwingPoints gesetzt
    // Falls der SwingPoint den Bedingungen entspricht, wird state auf confirmed gesetzt und warningAt geleert.
    const stateMachine = new TrendStateMachine(
      getStartState((state) => {
        console.log(`Transitioned to state: ${state.constructor.name}`);
        if (state instanceof UpwardTrendConfirmed) {
          this.trends.push({
            trendType: 'upward',
            startPoint: this.swingPoints[0].point,
            endPoint: this.swingPoints[this.swingPoints.length - 1].point,
          });
        } else if (state instanceof DownwardTrendConfirmed) {
          this.trends.push({
            trendType: 'downward',
            startPoint: this.swingPoints[0].point,
            endPoint: this.swingPoints[this.swingPoints.length - 1].point,
          });
        }
      }),
    );

    let idxSwingPoint = 0;
    while (idxSwingPoint < this.swingPoints.length) {
      stateMachine.process(this.swingPoints[idxSwingPoint]);
      idxSwingPoint++;
    }
    return this.trends;
  }
}
