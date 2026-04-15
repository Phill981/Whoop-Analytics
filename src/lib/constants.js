export const colors = {
  void: '#05060a',
  surface: '#0d0f14',
  elevated: '#14171e',
  subtle: '#1a1e28',
  focus: '#2a2f3a',
  primary: '#e8eaed',
  secondary: '#8b919e',
  muted: '#4a5060',
  accent: '#00f0a0',
  accentDim: 'rgba(0,240,160,0.12)',
  warm: '#f5a623',
  warmDim: 'rgba(245,166,35,0.12)',
  danger: '#ff4d6a',
  dangerDim: 'rgba(255,77,106,0.08)',
  blue: '#3b82f6',
  purple: '#a78bfa',
  cyan: '#22d3ee',
  pink: '#f472b6',
};

export const SERIES = [
  '#00f0a0', '#3b82f6', '#f5a623', '#ff4d6a',
  '#a78bfa', '#22d3ee', '#f472b6', '#818cf8',
  '#fb923c', '#34d399',
];

export const chartGrid = { strokeDasharray: '4 4', stroke: colors.subtle };

export const axisTick = {
  fill: colors.muted,
  fontSize: 11,
  fontFamily: "'JetBrains Mono', monospace",
};

export const COLUMN_MAP = {
  'Startzeit des Zyklus': 'cycleStart',
  'Endzeit des Zyklus': 'cycleEnd',
  'Zeitzone des Zyklus': 'timezone',
  'Erholungswert %': 'recovery',
  'Ruheherzfrequenz (Schläge pro Minute)': 'rhr',
  'Herzfrequenzvariabilität (ms)': 'hrv',
  'Hauttemperatur (Celsius)': 'skinTemp',
  'Blutsauerstoff %': 'spo2',
  'Tagesbelastung': 'strain',
  'Verbrannte Energie (cal)': 'calories',
  'Max HF (Schläge pro Minute)': 'maxHR',
  'Durchschnittliche HF (Schläge pro Minute)': 'avgHR',
  'Beginn des Schlafs': 'sleepStart',
  'Beginn des Aufwachens': 'wakeStart',
  'Schlafleistung %': 'sleepPerformance',
  'Atemfrequenz (Atemzüge/Min.)': 'respiratoryRate',
  'Schlafdauer (Min.)': 'sleepDuration',
  'Dauer im Bett (Min.)': 'timeInBed',
  'Dauer des Leichtschlafs (Min.)': 'lightSleep',
  'Dauer des Tiefschlafs (Min.)': 'deepSleep',
  'Dauer des REM-Schlafs (Min.)': 'remSleep',
  'Dauer des Aufwachens (Min.)': 'awakeDuration',
  'Schlafbedarf (Min.)': 'sleepNeed',
  'Schlafdefizit (Min.)': 'sleepDebt',
  'Schlafeffizienz %': 'sleepEfficiency',
  'Schlafbeständigkeit %': 'sleepConsistency',
  'Startzeit des Trainings': 'workoutStart',
  'Endzeit des Trainings': 'workoutEnd',
  'Dauer (Min.)': 'workoutDuration',
  'Name der Aktivität': 'activityType',
  'Aktivitätsbelastung': 'workoutStrain',
  'HF-Zone 1 %': 'hrZone1',
  'HF-Zone 2 %': 'hrZone2',
  'HF-Zone 3 %': 'hrZone3',
  'HF-Zone 4 %': 'hrZone4',
  'HF-Zone 5 %': 'hrZone5',
  'GPS aktiviert': 'gpsEnabled',
  'Fragetext': 'question',
  'Beantwortet mit Ja': 'answeredYes',
  'Anmerkungen': 'notes',
  'Nickerchen': 'nap',
};

export const JOURNAL_MAP = {
  'Alkohol konsumiert?': 'alcohol',
  'Koffein konsumiert?': 'caffeine',
  'Kurz vor dem Schlafengehen noch etwas gegessen?': 'lateEating',
  'im Bett gelesen (kein Gerät mit Bildschirm)?': 'readInBed',
  'Cardio in Zone 2 gemacht?': 'zone2Cardio',
};

export const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { id: 'scores', label: 'Wellbeing', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
  { id: 'recommendations', label: 'Insights', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
  { id: 'trends', label: 'Trends', icon: 'M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z' },
  { id: 'heart', label: 'Heart & Body', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
  { id: 'correlations', label: 'Correlations', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
  { id: 'outliers', label: 'Outliers', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z' },
  { id: 'sleep', label: 'Sleep', icon: 'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z' },
  { id: 'workouts', label: 'Workouts', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
];
