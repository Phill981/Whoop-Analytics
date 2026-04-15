import _ from 'lodash';
import { COLUMN_MAP } from './constants';

export function mapColumns(row) {
  const mapped = {};
  for (const [key, value] of Object.entries(row)) {
    mapped[COLUMN_MAP[key] || key] = value;
  }
  return mapped;
}

export function parseNumber(value) {
  if (value === '' || value == null) return null;
  const n = parseFloat(String(value).replace(',', '.'));
  return isNaN(n) ? null : n;
}

export function formatDateShort(date) {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function formatDateFull(date) {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function daysBetween(a, b) {
  return Math.round((new Date(b) - new Date(a)) / 864e5);
}

export function pearsonCorrelation(x, y) {
  const pairs = x.map((v, i) => [v, y[i]]).filter(([a, b]) => a != null && b != null);
  if (pairs.length < 5) return null;
  const xs = pairs.map(v => v[0]);
  const ys = pairs.map(v => v[1]);
  const n = xs.length;
  const mx = _.mean(xs);
  const my = _.mean(ys);
  let num = 0, dx = 0, dy = 0;
  for (let i = 0; i < n; i++) {
    const a = xs[i] - mx;
    const b = ys[i] - my;
    num += a * b;
    dx += a * a;
    dy += b * b;
  }
  const den = Math.sqrt(dx * dy);
  return den === 0 ? 0 : num / den;
}

export function computeIQR(values) {
  const sorted = [...values].filter(v => v != null).sort((a, b) => a - b);
  if (sorted.length < 4) return { q1: 0, q3: 0, iqr: 0, lower: 0, upper: 0, median: 0 };
  const q1 = sorted[Math.floor(sorted.length * 0.25)];
  const q3 = sorted[Math.floor(sorted.length * 0.75)];
  const median = sorted[Math.floor(sorted.length * 0.5)];
  const iqr = q3 - q1;
  return { q1, q3, iqr, lower: q1 - 1.5 * iqr, upper: q3 + 1.5 * iqr, median };
}

export function rollingAverage(data, key, window = 7) {
  return data.map((d, i) => {
    const slice = data.slice(Math.max(0, i - window + 1), i + 1);
    const values = slice.map(r => r[key]).filter(v => v != null);
    return { ...d, [`${key}_ma`]: values.length ? _.mean(values) : null };
  });
}

export function percentile(arr, value) {
  const sorted = [...arr].sort((a, b) => a - b);
  const idx = sorted.findIndex(x => x >= value);
  return idx < 0 ? 100 : (idx / sorted.length) * 100;
}

export function clamp(v, lo = 0, hi = 100) {
  return Math.max(lo, Math.min(hi, v));
}

export function average(arr, key) {
  const values = arr.map(d => d[key]).filter(x => x != null);
  return values.length ? _.mean(values) : 0;
}
