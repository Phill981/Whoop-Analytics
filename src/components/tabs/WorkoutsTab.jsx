import {
  ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis,
  Tooltip, Cell, ScatterChart, Scatter, ComposedChart, Line,
} from 'recharts';
import { Section, Panel, PanelTitle } from '../ui/Panel';
import { ChartTooltip } from '../ui/ChartTooltip';
import { colors, SERIES, chartGrid, axisTick } from '../../lib/constants';

export function WorkoutsTab({ analytics }) {
  const { strainByType, recoveryAfterWorkout, weeklyWorkoutCounts } = analytics;

  return (
    <Section title="Workout Analysis">
      <Panel className="mb-6">
        <PanelTitle>Strain by Activity</PanelTitle>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={strainByType}>
            <CartesianGrid {...chartGrid} />
            <XAxis dataKey="type" tick={axisTick} tickLine={false} />
            <YAxis tick={axisTick} tickLine={false} axisLine={false} />
            <Tooltip content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const d = payload[0].payload;
              return (
                <div className="bg-elevated border border-focus rounded-xl p-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
                  <div className="text-primary font-medium text-[13px]">{d.type}</div>
                  <div className="text-secondary text-xs font-mono">
                    Strain: {d.avgStrain?.toFixed(1)} | {d.avgDuration?.toFixed(0)}m | {d.count}x
                  </div>
                </div>
              );
            }} />
            <Bar dataKey="avgStrain" radius={[4, 4, 0, 0]}>
              {strainByType.map((_, i) => <Cell key={i} fill={SERIES[i % SERIES.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Panel>

      <div className="grid grid-cols-2 gap-5 mb-6">
        <Panel>
          <PanelTitle>Strain vs Next-Day Recovery</PanelTitle>
          <ResponsiveContainer width="100%" height={260}>
            <ScatterChart>
              <CartesianGrid {...chartGrid} />
              <XAxis dataKey="strain" tick={axisTick} tickLine={false} />
              <YAxis dataKey="nextRecovery" tick={axisTick} tickLine={false} />
              <Tooltip content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0]?.payload;
                return (
                  <div className="bg-elevated border border-focus rounded-xl p-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
                    <div className="text-primary text-xs">{d?.type}</div>
                    <div className="text-secondary text-[11px] font-mono">
                      Strain: {d?.strain?.toFixed(1)} → Recovery: {d?.nextRecovery}%
                    </div>
                  </div>
                );
              }} />
              <Scatter data={recoveryAfterWorkout} fill={colors.accent} fillOpacity={0.5} r={4} />
            </ScatterChart>
          </ResponsiveContainer>
        </Panel>

        <Panel>
          <PanelTitle>Weekly Volume</PanelTitle>
          <ResponsiveContainer width="100%" height={260}>
            <ComposedChart data={weeklyWorkoutCounts}>
              <CartesianGrid {...chartGrid} />
              <XAxis dataKey="week" tick={axisTick} tickLine={false} />
              <YAxis yAxisId="left" tick={axisTick} tickLine={false} axisLine={false} allowDecimals={false} />
              <YAxis yAxisId="right" orientation="right" tick={axisTick} tickLine={false} axisLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Bar yAxisId="left" dataKey="count" name="Workouts" fill={colors.accent} radius={[4, 4, 0, 0]} opacity={0.8} />
              <Line yAxisId="right" type="monotone" dataKey="totalStrain" name="Total Strain" stroke={colors.warm} strokeWidth={2} dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </Panel>
      </div>
    </Section>
  );
}
