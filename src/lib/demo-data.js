const ACTIVITIES = [
  'Running', 'Cycling', 'Strength Training', 'HIIT', 'Yoga',
  'Swimming', 'Walking', 'CrossFit', 'Rowing', 'Pilates',
];

const DAY_STRAIN_FACTOR = [0.7, 1, 1.1, 1, 0.9, 1.2, 0.8];

export function generateDemoData() {
  const days = 180;
  const now = new Date();
  const physiological = [];
  const sleep = [];
  const workouts = [];
  const journal = [];

  let prevRecovery = 55;
  let prevHRV = 45;
  let prevRHR = 58;
  let sleepDebt = 0;

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const dow = date.getDay();
    const weekNum = Math.floor((days - i) / 7);
    const fitnessGain = Math.min(weekNum * 0.4, 10);

    const recovery = Math.max(10, Math.min(99,
      prevRecovery + (Math.random() - 0.47) * 14 + (dow === 0 ? 3 : -0.5)));
    const hrv = Math.max(15, Math.min(130,
      prevHRV + (Math.random() - 0.47) * 10 + fitnessGain * 0.05));
    const rhr = Math.max(40, Math.min(78,
      prevRHR + (Math.random() - 0.5) * 4 - fitnessGain * 0.02));
    const strain = Math.max(1, Math.min(21,
      (7 + Math.random() * 8) * DAY_STRAIN_FACTOR[dow]));
    const skinTemp = 33 + Math.random() * 2.5 + Math.sin(i / 30) * 0.3;
    const spo2 = 94 + Math.random() * 4;
    const calories = 1500 + Math.random() * 1500 + strain * 50;
    const maxHR = 140 + Math.random() * 50;
    const avgHR = 60 + Math.random() * 30 + strain;
    const respRate = 14 + Math.random() * 5;

    const sleepNeed = 420 + Math.random() * 60;
    const sleepDuration = Math.max(240, Math.min(560,
      300 + Math.random() * 180 + (recovery > 60 ? 20 : -20)));
    const timeInBed = sleepDuration + 10 + Math.random() * 30;
    const deepSleep = sleepDuration * (0.15 + Math.random() * 0.15);
    const remSleep = sleepDuration * (0.15 + Math.random() * 0.15);
    const lightSleep = Math.max(0, sleepDuration - deepSleep - remSleep - Math.random() * 15);
    const awakeDuration = timeInBed - sleepDuration;
    const sleepPerf = Math.max(30, Math.min(100,
      (sleepDuration / sleepNeed) * 100 + (Math.random() - 0.5) * 10));
    const sleepEff = Math.max(70, Math.min(99, 85 + (Math.random() - 0.5) * 15));
    const sleepCon = Math.max(40, Math.min(99, 70 + (Math.random() - 0.5) * 30));

    sleepDebt = Math.max(0, sleepDebt + (sleepNeed - sleepDuration) * 0.3);
    if (sleepDuration > sleepNeed) sleepDebt *= 0.7;

    prevRecovery = recovery;
    prevHRV = hrv;
    prevRHR = rhr;

    const bedHour = dow >= 5 ? 23 + Math.random() * 2 : 22 + Math.random() * 2;
    const sleepStart = new Date(date);
    sleepStart.setHours(Math.floor(bedHour), Math.floor((bedHour % 1) * 60));
    const wakeEnd = new Date(sleepStart.getTime() + timeInBed * 60000);

    physiological.push({
      date: dateStr, cycleStart: sleepStart.toISOString(),
      recovery: Math.round(recovery), rhr: Math.round(rhr), hrv: Math.round(hrv),
      skinTemp: +skinTemp.toFixed(2), spo2: +spo2.toFixed(2), strain: +strain.toFixed(1),
      calories: Math.round(calories), maxHR: Math.round(maxHR), avgHR: Math.round(avgHR),
      respiratoryRate: +respRate.toFixed(1),
      sleepDuration: Math.round(sleepDuration), timeInBed: Math.round(timeInBed),
      lightSleep: Math.round(lightSleep), deepSleep: Math.round(deepSleep),
      remSleep: Math.round(remSleep), awakeDuration: Math.round(awakeDuration),
      sleepPerformance: Math.round(sleepPerf), sleepEfficiency: Math.round(sleepEff),
      sleepConsistency: Math.round(sleepCon), sleepStart: sleepStart.toISOString(),
      wakeStart: wakeEnd.toISOString(), sleepNeed: Math.round(sleepNeed),
      sleepDebt: Math.round(sleepDebt),
    });

    sleep.push({
      date: dateStr, sleepStart: sleepStart.toISOString(), wakeStart: wakeEnd.toISOString(),
      sleepPerformance: Math.round(sleepPerf), respiratoryRate: +respRate.toFixed(1),
      sleepDuration: Math.round(sleepDuration), timeInBed: Math.round(timeInBed),
      lightSleep: Math.round(lightSleep), deepSleep: Math.round(deepSleep),
      remSleep: Math.round(remSleep), awakeDuration: Math.round(awakeDuration),
      sleepEfficiency: Math.round(sleepEff), sleepConsistency: Math.round(sleepCon),
      sleepNeed: Math.round(sleepNeed), sleepDebt: Math.round(sleepDebt),
    });

    journal.push({
      date: dateStr,
      alcohol: Math.random() > 0.75,
      caffeine: true,
      lateEating: Math.random() > 0.7,
      readInBed: Math.random() > 0.8,
      zone2Cardio: Math.random() > 0.6,
    });

    const numWorkouts = dow === 0 || dow === 6
      ? (Math.random() > 0.5 ? 1 : 0)
      : (Math.random() > 0.3 ? 1 : 0) + (Math.random() > 0.85 ? 1 : 0);

    for (let w = 0; w < numWorkouts; w++) {
      const wStrain = 3 + Math.random() * 15;
      const wDuration = 15 + Math.random() * 75;
      workouts.push({
        date: dateStr,
        activityType: ACTIVITIES[Math.floor(Math.random() * ACTIVITIES.length)],
        workoutStrain: +wStrain.toFixed(1),
        workoutDuration: Math.round(wDuration),
        calories: Math.round(wDuration * 8 + Math.random() * 200),
        maxHR: Math.round(140 + Math.random() * 55),
        avgHR: Math.round(110 + Math.random() * 40),
        hrZone1: Math.round(20 + Math.random() * 50),
        hrZone2: Math.round(10 + Math.random() * 30),
        hrZone3: Math.round(5 + Math.random() * 20),
        hrZone4: Math.round(Math.random() * 15),
        hrZone5: Math.round(Math.random() * 10),
      });
    }
  }

  return { physiological, sleep, workouts, journal };
}
