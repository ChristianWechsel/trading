/**
 * Globale Rahmenparameter für die Analyse-Module.
 *
 * - comparableNumber: Grenzwerte für vergleichbare Zahlen.
 * - swingPointDetection: Mindestanforderungen zur Erkennung von Swing-Points.
 * - trendDetection: Mindestanzahl für die Trendbestimmung.
 * - averageTrueRange: Minimale Periodenlänge für die ATR-Berechnung.
 */
export const analysisConfig = {
  comparableNumber: { MIN_THRESHOLD: 0, MAX_THRESHOLD: 1 },

  swingPointDetection: {
    MIN_WINDOW_SIZE: 1,
  },

  trendDetection: {
    MIN_SWING_POINTS: 3,
  },

  averageTrueRange: {
    MIN_PERIOD: 2,
  },
};
