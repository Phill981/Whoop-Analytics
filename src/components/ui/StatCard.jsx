import { useState, useEffect, useRef } from 'react';
import { ResponsiveContainer, LineChart, Line } from 'recharts';
import clsx from 'clsx';
import { colors } from '../../lib/constants';

function AnimatedValue({ value, decimals = 0 }) {
  const [display, setDisplay] = useState(0);
  const frameRef = useRef(null);

  useEffect(() => {
    const start = display;
    const diff = value - start;
    const t0 = performance.now();

    function tick(now) {
      const progress = Math.min((now - t0) / 800, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(start + diff * eased);
      if (progress < 1) frameRef.current = requestAnimationFrame(tick);
    }

    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [value]);

  return <span>{display.toFixed(decimals)}</span>;
}

export function StatCard({
  title, value, decimals = 0, unit = '', delta,
  sparkData, sparkKey, color = colors.accent, subtitle, delay = 0,
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={clsx(
        'rounded-[14px] p-5 flex-1 basis-[220px] min-w-[220px]',
        'transition-all duration-200 border',
        hovered
          ? 'bg-elevated border-focus shadow-[0_0_20px_rgba(0,240,160,0.12)]'
          : 'bg-surface border-subtle',
      )}
      style={{
        opacity: 0,
        animation: `fade-slide-in 0.3s ease ${delay}ms forwards`,
      }}
    >
      <div className="text-secondary text-xs font-normal uppercase tracking-wider font-body mb-2.5">
        {title}
      </div>

      <div className="flex items-end justify-between">
        <div>
          <span className="text-4xl font-medium text-primary font-mono tracking-tighter">
            <AnimatedValue value={value} decimals={decimals} />
          </span>
          {unit && <span className="text-sm text-muted ml-1 font-body">{unit}</span>}

          {delta != null && (
            <div className={clsx(
              'text-xs font-medium mt-1 flex items-center gap-1 font-mono',
              delta >= 0 ? 'text-accent' : 'text-danger',
            )}>
              <span className="text-[10px]">{delta >= 0 ? '\u25B2' : '\u25BC'}</span>
              {Math.abs(delta).toFixed(1)}%
              <span className="text-muted font-normal font-body text-[11px]">vs 30d</span>
            </div>
          )}

          {subtitle && (
            <div className="text-[11px] text-muted mt-1 font-body">{subtitle}</div>
          )}
        </div>

        {sparkData && sparkKey && (
          <div className="w-[72px] h-8">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparkData}>
                <Line type="monotone" dataKey={sparkKey} stroke={color} strokeWidth={1.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
