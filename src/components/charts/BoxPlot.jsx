import { colors } from '../../lib/constants';
import { formatDateFull } from '../../lib/utils';

export function BoxPlot({ stats, outliers, label, color = colors.accent }) {
  const { q1, q3, lower, upper, median } = stats;
  const min = Math.min(lower, ...outliers.map(o => o.value));
  const max = Math.max(upper, ...outliers.map(o => o.value));
  const range = max - min || 1;
  const padding = range * 0.1;
  const scaleMin = min - padding;
  const scaleMax = max + padding;
  const toX = v => ((v - scaleMin) / (scaleMax - scaleMin)) * 100;

  return (
    <div className="mb-4">
      <div className="text-xs text-secondary mb-1.5 font-normal font-body">{label}</div>

      <div className="relative h-[38px] bg-elevated rounded-lg overflow-hidden">
        {/* Whiskers */}
        <div
          className="absolute top-4"
          style={{
            left: `${toX(lower)}%`,
            width: `${toX(upper) - toX(lower)}%`,
            height: 1,
            borderTop: `1px dashed ${colors.muted}`,
          }}
        />

        {/* IQR Box */}
        <div
          className="absolute top-[7px] h-5 rounded"
          style={{
            left: `${toX(q1)}%`,
            width: `${toX(q3) - toX(q1)}%`,
            background: `${color}33`,
            border: `1px solid ${color}99`,
          }}
        />

        {/* Median */}
        <div
          className="absolute top-[5px] w-0.5 h-6 bg-primary rounded-sm"
          style={{ left: `${toX(median)}%` }}
        />

        {/* Outlier dots */}
        {outliers.map((o, i) => (
          <div
            key={i}
            title={`${formatDateFull(o.date)}: ${o.value.toFixed(1)}`}
            className="absolute top-3 w-2 h-2 rounded-full bg-danger -translate-x-1 cursor-pointer animate-[pulse-dot_2s_infinite]"
            style={{ left: `${toX(o.value)}%` }}
          />
        ))}
      </div>

      <div className="flex justify-between text-[10px] text-muted mt-1 font-mono">
        <span>{scaleMin.toFixed(1)}</span>
        <span>Q1:{q1.toFixed(1)} | Med:{median.toFixed(1)} | Q3:{q3.toFixed(1)}</span>
        <span>{scaleMax.toFixed(1)}</span>
      </div>
    </div>
  );
}
