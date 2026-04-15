import _ from 'lodash';
import { colors } from './constants';
import {
  formatDateShort, pearsonCorrelation, computeIQR,
  rollingAverage, percentile, clamp, average, daysBetween,
} from './utils';

export function computeScores(data, workoutData) {
  const n = data.length;
  if (!n) return null;

  const recent = data.slice(-14);
  const vals = key => data.map(d => d[key]).filter(v => v != null);

  const recoveryScore = clamp(average(recent, 'recovery'));

  const sleepPerfAvg = average(recent, 'sleepPerformance');
  const sleepHrsAvg = average(recent, 'sleepHours');
  const sleepMeetingNeed = data.filter(d =>
    d.sleepDuration && d.sleepNeed && d.sleepDuration >= d.sleepNeed * 0.9
  ).length / n * 100;
  const sleepScore = clamp(sleepPerfAvg * 0.4 + Math.min(sleepHrsAvg / 8 * 100, 100) * 0.3 + sleepMeetingNeed * 0.3);

  const hrvVals = vals('hrv');
  const hrvPct = percentile(hrvVals, average(recent, 'hrv'));
  const rhrVals = vals('rhr');
  const rhrPct = 100 - percentile(rhrVals, average(recent, 'rhr'));
  const cardioScore = clamp(hrvPct * 0.6 + rhrPct * 0.4);

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 14);
  const recentWorkouts = workoutData.filter(w => new Date(w.date) >= cutoff);
  const freqScore = clamp(Math.min(recentWorkouts.length / 2 / 4, 1) * 100);
  const strainAvg = average(recent, 'strain');
  const activityScore = clamp(freqScore * 0.5 + clamp(100 - Math.abs(strainAvg - 10) * 8) * 0.5);

  const spo2Score = clamp((average(recent, 'spo2') - 90) * 10);
  const consistencyAvg = average(recent, 'sleepConsistency');

  const overall = clamp(
    recoveryScore * 0.3 + sleepScore * 0.25 + cardioScore * 0.2 +
    activityScore * 0.15 + spo2Score * 0.05 + consistencyAvg * 0.05
  );

  const trend = data.length >= 28
    ? clamp(average(data.slice(-14), 'recovery')) - clamp(average(data.slice(-28, -14), 'recovery'))
    : 0;

  return { overall, recovery: recoveryScore, sleep: sleepScore, cardio: cardioScore, activity: activityScore, spo2: spo2Score, consistency: consistencyAvg, trend };
}

export function generateRecommendations(data, workoutData, journalData, scores, correlations) {
  const recs = [];
  const n = data.length;
  if (!n || !scores) return recs;

  const recent = data.slice(-14);

  if (scores.recovery < 50) {
    recs.push({ type: 'critical', category: 'Recovery', title: 'Recovery is critically low', text: `Your 14-day average recovery is ${scores.recovery.toFixed(0)}%. Consider reducing training intensity, prioritizing sleep, and managing stress.` });
  } else if (scores.recovery < 67) {
    recs.push({ type: 'warning', category: 'Recovery', title: 'Recovery needs attention', text: `Your recovery averages ${scores.recovery.toFixed(0)}%. Focus on rest days and sleep quality to return to the green zone.` });
  } else {
    recs.push({ type: 'positive', category: 'Recovery', title: 'Recovery is strong', text: `Your recovery is averaging ${scores.recovery.toFixed(0)}%. Current habits are working well.` });
  }

  const sleepHrs = average(recent, 'sleepHours');
  if (sleepHrs < 6.5) {
    recs.push({ type: 'critical', category: 'Sleep', title: 'Sleep duration is too low', text: `Averaging ${sleepHrs.toFixed(1)} hours. Adults need 7\u20139 hours. Set a consistent bedtime and reduce screen time before bed.` });
  } else if (sleepHrs < 7) {
    recs.push({ type: 'warning', category: 'Sleep', title: 'Sleep is slightly below target', text: `At ${sleepHrs.toFixed(1)} hours, even 30 extra minutes can meaningfully improve recovery and HRV.` });
  } else {
    recs.push({ type: 'positive', category: 'Sleep', title: 'Sleep duration is on target', text: `${sleepHrs.toFixed(1)} hours is within the recommended 7\u20139 hour range.` });
  }

  const rhrAvg = average(recent, 'rhr');
  if (rhrAvg > 65) {
    recs.push({ type: 'warning', category: 'Heart', title: 'Resting heart rate is elevated', text: `RHR is ${rhrAvg.toFixed(0)} bpm. This could indicate stress, dehydration, or overtraining. Zone 2 cardio can lower RHR over time.` });
  } else {
    recs.push({ type: 'positive', category: 'Heart', title: 'Resting heart rate is healthy', text: `At ${rhrAvg.toFixed(0)} bpm, your RHR indicates good cardiovascular fitness.` });
  }

  const hrvAvg = average(recent, 'hrv');
  if (hrvAvg < 40) {
    recs.push({ type: 'critical', category: 'Heart', title: 'HRV is very low', text: `HRV of ${hrvAvg.toFixed(0)} ms suggests high physiological stress. Prioritize breathing exercises, sleep, and reduce alcohol.` });
  } else if (hrvAvg < 60) {
    recs.push({ type: 'warning', category: 'Heart', title: 'HRV has room for improvement', text: `At ${hrvAvg.toFixed(0)} ms, consistent sleep schedules, hydration, and stress management can boost HRV.` });
  }

  const wksPerWeek = workoutData.length / (n / 7);
  if (wksPerWeek < 2) {
    recs.push({ type: 'warning', category: 'Activity', title: 'Training frequency is low', text: `Averaging ${wksPerWeek.toFixed(1)} workouts/week. Aim for 3\u20135 sessions for optimal benefits.` });
  }

  if (journalData.length) {
    const merged = data.map(d => {
      const j = journalData.find(jj => jj.date === d.date);
      return { ...d, ...(j || {}) };
    }).filter(d => d.alcohol != null);

    if (merged.length >= 10) {
      const alcYes = merged.filter(d => d.alcohol === true || d.alcohol === 'true');
      const alcNo = merged.filter(d => d.alcohol === false || d.alcohol === 'false');
      if (alcYes.length >= 3 && alcNo.length >= 3) {
        const diff = average(alcNo, 'recovery') - average(alcYes, 'recovery');
        if (diff > 3) recs.push({ type: 'warning', category: 'Behavior', title: 'Alcohol is reducing your recovery', text: `Recovery drops ${diff.toFixed(1)}% on alcohol days. HRV also decreases. Reducing intake would have a measurable impact.` });
      }

      const leYes = merged.filter(d => d.lateEating === true || d.lateEating === 'true');
      const leNo = merged.filter(d => d.lateEating === false || d.lateEating === 'false');
      if (leYes.length >= 3 && leNo.length >= 3) {
        const diff = average(leNo, 'sleepPerformance') - average(leYes, 'sleepPerformance');
        if (diff > 2) recs.push({ type: 'warning', category: 'Behavior', title: 'Late eating impacts sleep quality', text: `Sleep performance drops ${diff.toFixed(1)}% when eating late. Finish meals 2\u20133 hours before bed.` });
      }

      const z2Yes = merged.filter(d => d.zone2Cardio === true || d.zone2Cardio === 'true');
      const z2No = merged.filter(d => d.zone2Cardio === false || d.zone2Cardio === 'false');
      if (z2Yes.length >= 3 && z2No.length >= 3) {
        const diff = average(z2Yes, 'recovery') - average(z2No, 'recovery');
        if (diff > 2) recs.push({ type: 'positive', category: 'Behavior', title: 'Zone 2 cardio is boosting recovery', text: `Recovery is ${diff.toFixed(1)}% higher on Zone 2 days. Keep incorporating low-intensity aerobic work.` });
      }
    }
  }

  if (correlations?.length) {
    correlations.filter(c => Math.abs(c.r) > 0.4).slice(0, 3).forEach(c => {
      if (c.r > 0.4) recs.push({ type: 'info', category: 'Pattern', title: `${c.metric1} and ${c.metric2} move together`, text: `Strong positive correlation (r=${c.r.toFixed(2)}). Improving one may positively influence the other.` });
      else if (c.r < -0.4) recs.push({ type: 'info', category: 'Pattern', title: `${c.metric1} and ${c.metric2} are inversely related`, text: `Strong negative correlation (r=${c.r.toFixed(2)}). Higher ${c.metric1.toLowerCase()} is associated with lower ${c.metric2.toLowerCase()}.` });
    });
  }

  recs.push({ type: 'info', category: 'Enhancements', title: 'Additional tracking suggestions', text: 'Consider tracking: meditation, hydration, caffeine cutoff time, cold/heat exposure, supplements, mood (1\u201310 scale), and morning sunlight exposure. These are known to meaningfully affect HRV, recovery, and sleep.' });

  return recs;
}

export function buildAnalytics(physiological, workoutData, journalData) {
  if (!physiological.length) return null;

  const data = physiological;
  const n = data.length;
  const recent = data.slice(-30);
  const prior = data.slice(-60, -30);
  const vals = key => data.map(d => d[key]).filter(v => v != null);

  const delta = key => {
    const r = average(recent, key);
    const p = average(prior, key);
    return p ? ((r - p) / p) * 100 : 0;
  };

  const overview = {
    avgRecovery: average(data, 'recovery'),
    avgHRV: average(data, 'hrv'),
    avgRHR: average(data, 'rhr'),
    avgStrain: average(data, 'strain'),
    avgSleep: average(data, 'sleepHours'),
    totalWorkouts: workoutData.length,
    avgCalories: average(data, 'calories'),
    avgSpo2: average(data, 'spo2'),
    avgSkinTemp: average(data, 'skinTemp'),
    avgRespRate: average(data, 'respiratoryRate'),
    deltaRecovery: delta('recovery'),
    deltaHRV: delta('hrv'),
    deltaRHR: delta('rhr'),
    deltaStrain: delta('strain'),
    deltaSleep: delta('sleepHours'),
  };

  let trendData = data.map(d => ({
    date: formatDateShort(d.date),
    fullDate: d.date,
    recovery: d.recovery,
    hrv: d.hrv,
    rhr: d.rhr,
    strain: d.strain,
    sleepHours: d.sleepHours,
  }));
  ['recovery', 'hrv', 'rhr', 'strain', 'sleepHours'].forEach(key => {
    trendData = rollingAverage(trendData, key, 7);
  });

  const greenDays = data.filter(d => d.recovery >= 67).length;
  const yellowDays = data.filter(d => d.recovery != null && d.recovery >= 34 && d.recovery < 67).length;
  const redDays = data.filter(d => d.recovery != null && d.recovery < 34).length;
  const recoveryZones = [
    { name: 'Green', value: greenDays, color: colors.accent },
    { name: 'Yellow', value: yellowDays, color: colors.warm },
    { name: 'Red', value: redDays, color: colors.danger },
  ];

  const months = _.groupBy(data, d => d.date.substring(0, 7));
  const monthlyData = Object.entries(months).map(([m, days]) => ({
    month: new Date(m + '-01').toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
    recovery: average(days, 'recovery'),
    hrv: average(days, 'hrv'),
    strain: average(days, 'strain'),
  }));

  const metricKeys = ['recovery', 'hrv', 'rhr', 'strain', 'sleepHours', 'sleepPerformance', 'skinTemp', 'spo2', 'calories', 'respiratoryRate', 'deepSleep', 'remSleep'];
  const metricLabels = ['Recovery', 'HRV', 'RHR', 'Strain', 'Sleep Hrs', 'Sleep Perf', 'Skin Temp', 'SpO2', 'Calories', 'Resp Rate', 'Deep Sleep', 'REM Sleep'];

  const corrMatrix = metricKeys.map((k1, i) =>
    metricKeys.map((k2, j) =>
      i === j ? 1 : pearsonCorrelation(data.map(d => d[k1]), data.map(d => d[k2]))
    )
  );

  const allCorrelations = [];
  for (let i = 0; i < metricKeys.length; i++) {
    for (let j = i + 1; j < metricKeys.length; j++) {
      if (corrMatrix[i][j] != null) {
        allCorrelations.push({
          metric1: metricLabels[i], metric2: metricLabels[j],
          key1: metricKeys[i], key2: metricKeys[j],
          r: corrMatrix[i][j], i, j,
        });
      }
    }
  }
  allCorrelations.sort((a, b) => Math.abs(b.r) - Math.abs(a.r));

  const outlierMetrics = ['recovery', 'hrv', 'rhr', 'strain', 'sleepHours', 'spo2', 'skinTemp', 'respiratoryRate'];
  const outlierLabels = { recovery: 'Recovery', hrv: 'HRV', rhr: 'RHR', strain: 'Strain', sleepHours: 'Sleep', spo2: 'SpO2', skinTemp: 'Skin Temp', respiratoryRate: 'Resp Rate' };
  const outliers = [];
  const boxPlots = {};

  outlierMetrics.forEach(key => {
    const v = data.map(d => d[key]).filter(x => x != null);
    const stats = computeIQR(v);
    boxPlots[key] = { stats, outliers: [] };
    data.forEach(d => {
      const val = d[key];
      if (val == null) return;
      if (val < stats.lower || val > stats.upper) {
        const dist = val < stats.lower ? stats.lower - val : val - stats.upper;
        const severity = dist > stats.iqr * 1.5 ? 'extreme' : 'mild';
        const entry = { date: d.date, metric: outlierLabels[key], metricKey: key, value: val, distance: +dist.toFixed(2), severity, dayData: d };
        outliers.push(entry);
        boxPlots[key].outliers.push(entry);
      }
    });
  });
  outliers.sort((a, b) => b.distance - a.distance);

  const sleepTrend = data.map(d => ({
    date: formatDateShort(d.date),
    deep: d.deepSleep ? d.deepSleep / 60 : 0,
    rem: d.remSleep ? d.remSleep / 60 : 0,
    light: d.lightSleep ? d.lightSleep / 60 : 0,
    awake: d.awakeDuration ? d.awakeDuration / 60 : 0,
  }));

  const sleepComposition = [
    { name: 'Deep', value: average(data, 'deepSleep'), color: colors.blue },
    { name: 'REM', value: average(data, 'remSleep'), color: colors.purple },
    { name: 'Light', value: average(data, 'lightSleep'), color: colors.cyan },
    { name: 'Awake', value: average(data, 'awakeDuration'), color: colors.danger },
  ];

  const sleepDebtTrend = data.map(d => ({ date: formatDateShort(d.date), debt: d.sleepDebt || 0 }));
  const sleepEfficiencyTrend = data.map(d => ({ date: formatDateShort(d.date), efficiency: d.sleepEfficiency, performance: d.sleepPerformance }));

  let heartTrend = data.map(d => ({
    date: formatDateShort(d.date), rhr: d.rhr, hrv: d.hrv,
    spo2: d.spo2, skinTemp: d.skinTemp, respRate: d.respiratoryRate,
  }));
  ['rhr', 'hrv', 'spo2', 'skinTemp', 'respRate'].forEach(key => {
    heartTrend = rollingAverage(heartTrend, key, 14);
  });

  const hrvRange = { p25: computeIQR(vals('hrv')).q1, p75: computeIQR(vals('hrv')).q3 };
  const rhrRange = { p25: computeIQR(vals('rhr')).q1, p75: computeIQR(vals('rhr')).q3 };

  const byType = _.groupBy(workoutData, 'activityType');
  const strainByType = Object.entries(byType)
    .map(([type, ws]) => ({
      type,
      avgStrain: _.mean(ws.map(w => w.workoutStrain).filter(Boolean)),
      avgDuration: _.mean(ws.map(w => w.workoutDuration).filter(Boolean)),
      count: ws.length,
    }))
    .sort((a, b) => b.avgStrain - a.avgStrain);

  const recoveryAfterWorkout = workoutData.map(w => {
    const nextDay = data.find(d => daysBetween(w.date, d.date) === 1);
    return nextDay ? { strain: w.workoutStrain, nextRecovery: nextDay.recovery, type: w.activityType } : null;
  }).filter(Boolean);

  const weeklyWorkoutCounts = [];
  if (data.length) {
    let cursor = new Date(data[0].date);
    const end = new Date(data[n - 1].date);
    while (cursor <= end) {
      const weekEnd = new Date(cursor);
      weekEnd.setDate(weekEnd.getDate() + 6);
      const weekWorkouts = workoutData.filter(w => {
        const d = new Date(w.date);
        return d >= cursor && d <= weekEnd;
      });
      weeklyWorkoutCounts.push({
        week: formatDateShort(cursor),
        count: weekWorkouts.length,
        totalStrain: +_.sum(weekWorkouts.map(w => w.workoutStrain || 0)).toFixed(1),
      });
      cursor.setDate(cursor.getDate() + 7);
    }
  }

  const scores = computeScores(data, workoutData);

  const scoreTrend = [];
  for (let i = 13; i < n; i++) {
    const chunk = data.slice(Math.max(0, i - 13), i + 1);
    const chunkWorkouts = workoutData.filter(w => chunk.some(c => c.date === w.date));
    const s = computeScores(chunk, chunkWorkouts);
    if (s) scoreTrend.push({ date: formatDateShort(data[i].date), overall: s.overall, recovery: s.recovery, sleep: s.sleep, cardio: s.cardio });
  }

  const behaviorImpact = [];
  if (journalData.length) {
    const merged = data.map(d => {
      const j = journalData.find(jj => jj.date === d.date);
      return { ...d, ...(j || {}) };
    }).filter(d => d.alcohol != null);

    [
      { key: 'alcohol', label: 'Alcohol', yesLabel: 'With', noLabel: 'Without' },
      { key: 'lateEating', label: 'Late Eating', yesLabel: 'Yes', noLabel: 'No' },
      { key: 'zone2Cardio', label: 'Zone 2 Cardio', yesLabel: 'Yes', noLabel: 'No' },
      { key: 'caffeine', label: 'Caffeine', yesLabel: 'With', noLabel: 'Without' },
    ].forEach(behavior => {
      const yes = merged.filter(d => d[behavior.key] === true);
      const no = merged.filter(d => d[behavior.key] === false);
      if (yes.length >= 3 && no.length >= 3) {
        behaviorImpact.push({
          behavior: behavior.label,
          yesLabel: behavior.yesLabel,
          noLabel: behavior.noLabel,
          yesRecovery: average(yes, 'recovery'),
          noRecovery: average(no, 'recovery'),
          yesSleep: average(yes, 'sleepHours'),
          noSleep: average(no, 'sleepHours'),
          yesHRV: average(yes, 'hrv'),
          noHRV: average(no, 'hrv'),
          yesCount: yes.length,
          noCount: no.length,
        });
      }
    });
  }

  const recommendations = generateRecommendations(data, workoutData, journalData, scores, allCorrelations);

  return {
    overview, trendData, recoveryZones, monthlyData,
    corrMetrics: metricKeys, corrMatrix, corrLabels: metricLabels,
    topCorrelations: {
      positive: allCorrelations.filter(c => c.r > 0).slice(0, 5),
      negative: allCorrelations.filter(c => c.r < 0).slice(0, 5),
    },
    allCorrelations, outlierData: { outliers, boxPlots },
    sleepTrend, sleepComposition, sleepDebtTrend, sleepEfficiencyTrend,
    heartTrend, hrvRange, rhrRange,
    strainByType, recoveryAfterWorkout, weeklyWorkoutCounts,
    scores, scoreTrend, behaviorImpact, recommendations,
  };
}
