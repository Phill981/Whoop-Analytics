import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import Papa from 'papaparse';
import { mapColumns, parseNumber } from '../lib/utils';
import { JOURNAL_MAP } from '../lib/constants';
import { generateDemoData } from '../lib/demo-data';
import { saveToCache, loadFromCache, clearCache } from '../lib/cache';

export function useWhoopData() {
  const cached = useRef(loadFromCache());
  const [initialDemo] = useState(() => generateDemoData());

  const [rawPhysio, setRawPhysio] = useState(() => cached.current?.physio || initialDemo.physiological);
  const [rawSleep, setRawSleep] = useState(() => cached.current?.sleep || initialDemo.sleep);
  const [rawWorkouts, setRawWorkouts] = useState(() => cached.current?.workouts || initialDemo.workouts);
  const [rawJournal, setRawJournal] = useState(() => cached.current?.journal || initialDemo.journal);
  const [dataSource, setDataSource] = useState(() => cached.current ? 'uploaded' : 'demo');
  const [uploadedFileNames, setUploadedFileNames] = useState(() => cached.current?.fileNames || []);

  const classifyAndLoad = useCallback(file => {
    return new Promise(resolve => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: result => {
          const mapped = result.data.map(mapColumns);
          if (!mapped.length) { resolve(null); return; }

          const cols = new Set(Object.keys(mapped[0]));

          if (cols.has('recovery') || cols.has('strain') || cols.has('spo2')) {
            setRawPhysio(mapped);
            resolve('physio');
          } else if (cols.has('workoutStrain') || cols.has('activityType')) {
            setRawWorkouts(mapped);
            resolve('workouts');
          } else if (cols.has('sleepDuration') || (cols.has('nap') && cols.has('sleepPerformance'))) {
            setRawSleep(mapped);
            resolve('sleep');
          } else if (cols.has('question') || cols.has('answeredYes')) {
            const byDate = {};
            mapped.forEach(row => {
              const dateStr = row.cycleStart?.split(' ')[0]?.split('T')[0] || '';
              if (!dateStr) return;
              if (!byDate[dateStr]) byDate[dateStr] = { date: dateStr };
              const journalKey = JOURNAL_MAP[row.question || ''];
              if (journalKey) {
                byDate[dateStr][journalKey] = (row.answeredYes === 'true' || row.answeredYes === true);
              }
            });
            setRawJournal(Object.values(byDate));
            resolve('journal');
          } else {
            resolve(null);
          }
        },
        error: () => resolve(null),
      });
    });
  }, []);

  const handleFiles = useCallback(async fileList => {
    const csvFiles = Array.from(fileList).filter(f => f.name.toLowerCase().endsWith('.csv'));
    if (!csvFiles.length) return;

    const names = [];
    for (const file of csvFiles) {
      const type = await classifyAndLoad(file);
      if (type) names.push(file.name);
    }
    if (names.length) {
      setUploadedFileNames(names);
      setDataSource('uploaded');
    }
  }, [classifyAndLoad]);

  useEffect(() => {
    if (dataSource === 'uploaded') {
      saveToCache(rawPhysio, rawSleep, rawWorkouts, rawJournal, uploadedFileNames);
    }
  }, [rawPhysio, rawSleep, rawWorkouts, rawJournal, dataSource, uploadedFileNames]);

  const resetToDemo = useCallback(() => {
    const demo = generateDemoData();
    setRawPhysio(demo.physiological);
    setRawSleep(demo.sleep);
    setRawWorkouts(demo.workouts);
    setRawJournal(demo.journal);
    setDataSource('demo');
    setUploadedFileNames([]);
    clearCache();
  }, []);

  const physiological = useMemo(() => {
    if (!rawPhysio) return [];
    return rawPhysio.map(row => {
      const dateStr = row.cycleStart?.split(' ')[0]?.split('T')[0] || row.date;
      const duration = parseNumber(row.sleepDuration);
      return {
        date: dateStr,
        recovery: parseNumber(row.recovery),
        hrv: parseNumber(row.hrv),
        rhr: parseNumber(row.rhr),
        strain: parseNumber(row.strain),
        skinTemp: parseNumber(row.skinTemp),
        spo2: parseNumber(row.spo2),
        calories: parseNumber(row.calories),
        maxHR: parseNumber(row.maxHR),
        avgHR: parseNumber(row.avgHR),
        respiratoryRate: parseNumber(row.respiratoryRate),
        sleepDuration: duration,
        timeInBed: parseNumber(row.timeInBed),
        lightSleep: parseNumber(row.lightSleep),
        deepSleep: parseNumber(row.deepSleep),
        remSleep: parseNumber(row.remSleep),
        awakeDuration: parseNumber(row.awakeDuration),
        sleepPerformance: parseNumber(row.sleepPerformance),
        sleepEfficiency: parseNumber(row.sleepEfficiency),
        sleepConsistency: parseNumber(row.sleepConsistency),
        sleepStart: row.sleepStart,
        wakeStart: row.wakeStart,
        sleepHours: duration ? duration / 60 : null,
        sleepNeed: parseNumber(row.sleepNeed),
        sleepDebt: parseNumber(row.sleepDebt),
      };
    })
      .filter(r => r.date)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [rawPhysio]);

  const workoutData = useMemo(() => {
    if (!rawWorkouts) return [];
    return rawWorkouts.map(row => {
      const dateStr = row.workoutStart?.split(' ')[0]?.split('T')[0]
        || row.cycleStart?.split(' ')[0]?.split('T')[0]
        || row.date;
      return {
        date: dateStr,
        activityType: row.activityType || 'Unknown',
        workoutStrain: parseNumber(row.workoutStrain),
        workoutDuration: parseNumber(row.workoutDuration),
        calories: parseNumber(row.calories),
        maxHR: parseNumber(row.maxHR),
        avgHR: parseNumber(row.avgHR),
        hrZone1: parseNumber(row.hrZone1),
        hrZone2: parseNumber(row.hrZone2),
        hrZone3: parseNumber(row.hrZone3),
        hrZone4: parseNumber(row.hrZone4),
        hrZone5: parseNumber(row.hrZone5),
      };
    })
      .filter(r => r.date)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [rawWorkouts]);

  const journalData = useMemo(() => {
    if (!rawJournal) return [];
    return rawJournal.map(row => ({
      date: row.date,
      alcohol: row.alcohol === true || row.alcohol === 'true',
      caffeine: row.caffeine === true || row.caffeine === 'true',
      lateEating: row.lateEating === true || row.lateEating === 'true',
      readInBed: row.readInBed === true || row.readInBed === 'true',
      zone2Cardio: row.zone2Cardio === true || row.zone2Cardio === 'true',
    })).filter(r => r.date);
  }, [rawJournal]);

  return {
    physiological, workoutData, journalData,
    dataSource, handleFiles, resetToDemo,
  };
}
