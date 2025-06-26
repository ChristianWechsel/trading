/**
 * Globale Konfigurationsparameter für die Analyse-Module.
 *
 * - comparableNumber: Schwellwerte für vergleichbare Zahlen.
 * - swingPointDetection: Parameter zur Erkennung von Swing-Points.
 * - trendAnalysis: Einstellungen für die Trendanalyse.
 */
export const analysisConfig = {
  comparableNumber: { MIN_THRESHOLD: 0, MAX_THRESHOLD: 1 },
  /**
   * Parameter für die Swing-Point-Erkennung.
   * Ursprünglich in: /home/christian/Programmierung/trading/server/src/digital-signal-processing/comparable-number/parameters.ts
   */
  swingPointDetection: {
    MIN_WINDOW_SIZE: 1,
  },

  /**
   * Parameter für die Trendanalyse.
   * Referenz: /home/christian/Programmierung/trading/Trendanalyse.txt
   */
  trendAnalysis: {
    pivotPointWindowSize: 1,
    minTrendLength: 3,
  },
};
