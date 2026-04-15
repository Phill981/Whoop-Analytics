const CACHE_KEY = 'whoop_data_cache';

export function saveToCache(physio, sleep, workouts, journal, fileNames) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      physio, sleep, workouts, journal, fileNames, ts: Date.now(),
    }));
  } catch {
    /* quota exceeded or private browsing */
  }
}

export function loadFromCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    return data?.physio?.length ? data : null;
  } catch {
    return null;
  }
}

export function clearCache() {
  try { localStorage.removeItem(CACHE_KEY); } catch {}
}
