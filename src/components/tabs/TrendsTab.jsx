import { useState } from 'react';
import {
  ResponsiveContainer, ComposedChart, CartesianGrid, XAxis, YAxis,
  Tooltip, Brush, Line, BarChart, Bar,
} from 'recharts';
import clsx from 'clsx';
import { Section, Panel, PanelTitle } from '../ui/Panel';
import { ChartTooltip } from '../ui/ChartTooltip';
import { colors, SERIES, chartGrid, axisTick } from '../../lib/constants';

const METRIC_TOGGLES = [
  { key: 'recovery', label: 'Recovery', color: SERIES[0] },
  { key: 'hrv', label: 'HRV', color: SERIES[1] },
  { key: 'rhr', label: 'RHR', color: SERIES[3] },
  { key: 'strain', label: 'Strain', color: SERIES[2] },
  { key: 'sleepHours', label: 'Sleep', color: SERIES[4] },
];

export function TrendsTab({ analytics }) {
  const { trendData, monthlyData } = analytics;
  const [enabled, setEnabled] = useState({ recovery: true, hrv: true, rhr: true, strain: true, sleepHours: true });

  const toggle = key => setEnabled(prev => ({ ...prev, [key]: !prev[key] }));
  const dotConfig = color => ({ r: 5, fill: color, stroke: colors.surface, strokeWidth: 2 });

  return (
    <Section title="Trends" id="trends-section">
      <div className="flex gap-1.5 mb-4">
        {METRIC_TOGGLES.map(m => (
          <button
            key={m.key}
            onClick={() => toggle(m.key)}
            className={clsx(
              'rounded-lg px-3.5 py-1.5 text-xs font-normal cursor-pointer font-body transition-all border',
              enabled[m.key]
                ? 'bg-elevated border-focus'
                : 'bg-transparent border-subtle text-muted',
            )}
            style={{
              color: enabled[m.key] ? m.color : undefined,
              borderBottom: enabled[m.key] ? `2px solid ${m.color}` : '2px solid transparent',
            }}
          >
            {m.label}
          </button>
        ))}
      </div>

      <Panel className="mb-6">
        <ResponsiveContainer width="100%" height={380}>
          <ComposedChart data={trendData}>
            <CartesianGrid {...chartGrid} />
            <XAxis dataKey="date" tick={axisTick} tickLine={false} interval={Math.floor(trendData.length / 12)} />
            <YAxis tick={axisTick} tickLine={false} axisLine={false} />
            <Tooltip content={<ChartTooltip />} />
            <Brush dataKey="date" height={24} stroke={colors.accent} fill={colors.void} travellerWidth={8} />

            {enabled.recovery && (
              <>
                <Line type="monotone" dataKey="recovery" stroke={SERIES[0]} strokeWidth={2} dot={false} name="Recovery" activeDot={dotConfig(SERIES[0])} />
                <Line type="monotone" dataKey="recovery_ma" stroke={SERIES[0]} strokeWidth={1.5} strokeDasharray="4 4" dot={false} name="Recovery 7d" />
              </>
            )}
            {enabled.hrv && (
              <>
                <Line type="monotone" dataKey="hrv" stroke={SERIES[1]} strokeWidth={2} dot={false} name="HRV" activeDot={dotConfig(SERIES[1])} />
                <Line type="monotone" dataKey="hrv_ma" stroke={SERIES[1]} strokeWidth={1.5} strokeDasharray="4 4" dot={false} name="HRV 7d" />
              </>
            )}
            {enabled.rhr && (
              <>
                <Line type="monotone" dataKey="rhr" stroke={SERIES[3]} strokeWidth={2} dot={false} name="RHR" activeDot={dotConfig(SERIES[3])} />
                <Line type="monotone" dataKey="rhr_ma" stroke={SERIES[3]} strokeWidth={1.5} strokeDasharray="4 4" dot={false} name="RHR 7d" />
              </>
            )}
            {enabled.strain && (
              <>
                <Line type="monotone" dataKey="strain" stroke={SERIES[2]} strokeWidth={2} dot={false} name="Strain" activeDot={dotConfig(SERIES[2])} />
                <Line type="monotone" dataKey="strain_ma" stroke={SERIES[2]} strokeWidth={1.5} strokeDasharray="4 4" dot={false} name="Strain 7d" />
              </>
            )}
            {enabled.sleepHours && (
              <>
                <Line type="monotone" dataKey="sleepHours" stroke={SERIES[4]} strokeWidth={2} dot={false} name="Sleep" activeDot={dotConfig(SERIES[4])} />
                <Line type="monotone" dataKey="sleepHours_ma" stroke={SERIES[4]} strokeWidth={1.5} strokeDasharray="4 4" dot={false} name="Sleep 7d" />
              </>
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </Panel>

      <Panel>
        <PanelTitle>Monthly Progression</PanelTitle>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={monthlyData}>
            <CartesianGrid {...chartGrid} />
            <XAxis dataKey="month" tick={axisTick} tickLine={false} />
            <YAxis tick={axisTick} tickLine={false} axisLine={false} />
            <Tooltip content={<ChartTooltip />} />
            <Bar dataKey="recovery" name="Recovery" fill={SERIES[0]} radius={[4, 4, 0, 0]} />
            <Bar dataKey="hrv" name="HRV" fill={SERIES[1]} radius={[4, 4, 0, 0]} />
            <Bar dataKey="strain" name="Strain" fill={SERIES[2]} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Panel>
    </Section>
  );
}
