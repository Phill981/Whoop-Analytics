import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Section, Panel, PanelTitle } from '../ui/Panel';
import { StatCard } from '../ui/StatCard';
import { ScoreRing } from '../ui/ScoreRing';
import { WeeklyHeatmap } from '../charts/WeeklyHeatmap';
import { colors } from '../../lib/constants';

export function OverviewTab({ analytics, physiological }) {
  const { overview, trendData, recoveryZones, scores } = analytics;

  return (
    <Section title="Overview">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-5 mb-8">
        <StatCard title="Avg Recovery" value={overview.avgRecovery} unit="%" delta={overview.deltaRecovery} sparkData={trendData.slice(-30)} sparkKey="recovery" delay={0} />
        <StatCard title="Avg HRV" value={overview.avgHRV} unit="ms" delta={overview.deltaHRV} sparkData={trendData.slice(-30)} sparkKey="hrv" color={colors.blue} delay={50} />
        <StatCard title="Avg RHR" value={overview.avgRHR} unit="bpm" delta={overview.deltaRHR} sparkData={trendData.slice(-30)} sparkKey="rhr" color={colors.cyan} delay={100} />
        <StatCard title="Avg Strain" value={overview.avgStrain} decimals={1} delta={overview.deltaStrain} sparkData={trendData.slice(-30)} sparkKey="strain" color={colors.warm} delay={150} />
        <StatCard title="Avg Sleep" value={overview.avgSleep} decimals={1} unit="hrs" delta={overview.deltaSleep} sparkData={trendData.slice(-30)} sparkKey="sleepHours" color={colors.blue} delay={200} />
        <StatCard
          title="Workouts" value={overview.totalWorkouts} color={colors.accent}
          subtitle={`${(overview.totalWorkouts / physiological.length * 7).toFixed(1)} per week`} delay={250}
        />
      </div>

      <Panel className="mb-6">
        <PanelTitle>Recovery Heatmap</PanelTitle>
        <WeeklyHeatmap data={physiological} />
      </Panel>

      <Panel>
        <PanelTitle>Recovery Zones</PanelTitle>
        <div className="flex gap-6 items-center flex-wrap">
          <div className="w-40 h-40">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={recoveryZones} cx="50%" cy="50%" innerRadius={42} outerRadius={68} paddingAngle={3} dataKey="value">
                  {recoveryZones.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex-1">
            {recoveryZones.map((zone, i) => (
              <div key={i} className="flex items-center gap-3.5 mb-3">
                <div className="w-2.5 h-2.5 rounded-[3px] shrink-0" style={{ background: zone.color }} />
                <div className="flex-1">
                  <div className="text-[13px] text-primary font-normal">{zone.name}</div>
                  <div className="h-1 bg-elevated rounded-sm mt-1">
                    <div
                      className="h-1 rounded-sm transition-[width] duration-500"
                      style={{ background: zone.color, width: `${(zone.value / physiological.length) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="text-xl font-medium font-mono min-w-[50px] text-right" style={{ color: zone.color }}>
                  {zone.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Panel>
    </Section>
  );
}
