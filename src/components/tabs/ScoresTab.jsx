import {
  ResponsiveContainer, ComposedChart, CartesianGrid, XAxis, YAxis,
  Tooltip, ReferenceArea, Line,
} from 'recharts';
import { Section, Panel, PanelTitle } from '../ui/Panel';
import { ScoreRing } from '../ui/ScoreRing';
import { ChartTooltip } from '../ui/ChartTooltip';
import { colors, SERIES, chartGrid, axisTick } from '../../lib/constants';
import { clamp } from '../../lib/utils';

export function ScoresTab({ analytics }) {
  const { scores, scoreTrend } = analytics;
  if (!scores) return null;

  const breakdowns = [
    { label: 'Recovery', weight: '30%', desc: '14-day average recovery.', score: scores.recovery },
    { label: 'Sleep Quality', weight: '25%', desc: 'Sleep performance, duration relative to need.', score: scores.sleep },
    { label: 'Cardiovascular', weight: '20%', desc: 'HRV percentile and resting heart rate.', score: scores.cardio },
    { label: 'Activity', weight: '15%', desc: 'Workout frequency and strain balance.', score: scores.activity },
    { label: 'SpO2 & Consistency', weight: '10%', desc: 'Blood oxygen and schedule regularity.', score: clamp(scores.spo2 * 0.5 + scores.consistency * 0.5) },
  ];

  function scoreColor(s) {
    return s >= 75 ? colors.accent : s >= 50 ? colors.warm : colors.danger;
  }

  return (
    <Section title="Wellbeing Score">
      <Panel className="mb-6">
        <div className="flex flex-wrap gap-5 justify-center py-6">
          <ScoreRing score={scores.overall} label="Overall" size={150} />
          <ScoreRing score={scores.recovery} label="Recovery" />
          <ScoreRing score={scores.sleep} label="Sleep" />
          <ScoreRing score={scores.cardio} label="Cardio" />
          <ScoreRing score={scores.activity} label="Activity" />
        </div>
        <div className="text-center mt-2 text-[13px] text-secondary font-body">
          Trend:{' '}
          <span className={`font-medium font-mono ${scores.trend >= 0 ? 'text-accent' : 'text-danger'}`}>
            {scores.trend >= 0 ? '+' : ''}{scores.trend.toFixed(1)}
          </span>{' '}
          vs prior 2 weeks
        </div>
      </Panel>

      <Panel className="mb-6">
        <PanelTitle>Score Over Time</PanelTitle>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={scoreTrend}>
            <CartesianGrid {...chartGrid} />
            <XAxis dataKey="date" tick={axisTick} tickLine={false} interval={Math.floor(scoreTrend.length / 10)} />
            <YAxis domain={[0, 100]} tick={axisTick} tickLine={false} axisLine={false} />
            <Tooltip content={<ChartTooltip />} />
            <ReferenceArea y1={75} y2={100} fill={colors.accent} fillOpacity={0.03} />
            <ReferenceArea y1={0} y2={50} fill={colors.danger} fillOpacity={0.02} />
            <Line type="monotone" dataKey="overall" stroke={colors.accent} strokeWidth={2} dot={false} name="Overall" activeDot={{ r: 5, fill: colors.accent, stroke: colors.surface, strokeWidth: 2 }} />
            <Line type="monotone" dataKey="recovery" stroke={SERIES[0]} strokeWidth={1.5} strokeDasharray="4 4" dot={false} name="Recovery" />
            <Line type="monotone" dataKey="sleep" stroke={SERIES[1]} strokeWidth={1.5} strokeDasharray="4 4" dot={false} name="Sleep" />
          </ComposedChart>
        </ResponsiveContainer>
      </Panel>

      <Panel>
        <PanelTitle>Score Breakdown</PanelTitle>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
          {breakdowns.map((item, i) => (
            <div key={i} className="p-4 bg-elevated rounded-[10px] border border-subtle">
              <div className="flex justify-between mb-2">
                <span className="text-[13px] font-medium text-primary">
                  {item.label}{' '}
                  <span className="text-muted font-normal">({item.weight})</span>
                </span>
                <span className="text-lg font-medium font-mono" style={{ color: scoreColor(item.score) }}>
                  {item.score.toFixed(0)}
                </span>
              </div>
              <div className="text-xs text-muted leading-relaxed mb-2.5">{item.desc}</div>
              <div className="h-[3px] bg-subtle rounded-sm">
                <div
                  className="h-[3px] rounded-sm transition-[width] duration-500"
                  style={{ background: scoreColor(item.score), width: `${item.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </Section>
  );
}
