import {
  ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis,
  Tooltip, PieChart, Pie, Cell, LineChart, Line,
} from 'recharts';
import { Section, Panel, PanelTitle } from '../ui/Panel';
import { ChartTooltip } from '../ui/ChartTooltip';
import { colors, chartGrid, axisTick } from '../../lib/constants';

export function SleepTab({ analytics }) {
  const { sleepTrend, sleepComposition, sleepDebtTrend, sleepEfficiencyTrend } = analytics;
  const dotProps = color => ({ r: 5, fill: color, stroke: colors.surface, strokeWidth: 2 });

  return (
    <Section title="Sleep Analysis">
      <Panel className="mb-6">
        <PanelTitle>Sleep Stages</PanelTitle>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={sleepTrend}>
            <CartesianGrid {...chartGrid} />
            <XAxis dataKey="date" tick={axisTick} tickLine={false} interval={Math.floor(sleepTrend.length / 12)} />
            <YAxis tick={axisTick} tickLine={false} axisLine={false} />
            <Tooltip content={<ChartTooltip />} />
            <defs>
              <linearGradient id="gDeep" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={colors.blue} stopOpacity={0.3} />
                <stop offset="100%" stopColor={colors.blue} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gRem" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={colors.purple} stopOpacity={0.3} />
                <stop offset="100%" stopColor={colors.purple} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gLight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={colors.cyan} stopOpacity={0.3} />
                <stop offset="100%" stopColor={colors.cyan} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area type="monotoneX" dataKey="deep" stackId="1" stroke={colors.blue} fill="url(#gDeep)" name="Deep" />
            <Area type="monotoneX" dataKey="rem" stackId="1" stroke={colors.purple} fill="url(#gRem)" name="REM" />
            <Area type="monotoneX" dataKey="light" stackId="1" stroke={colors.cyan} fill="url(#gLight)" name="Light" />
            <Area type="monotoneX" dataKey="awake" stackId="1" stroke={colors.danger} fill={colors.danger} fillOpacity={0.15} name="Awake" />
          </AreaChart>
        </ResponsiveContainer>
      </Panel>

      <div className="grid grid-cols-2 gap-5 mb-6">
        <Panel>
          <PanelTitle>Avg Composition</PanelTitle>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={sleepComposition} cx="50%" cy="50%"
                innerRadius={50} outerRadius={85} paddingAngle={3} dataKey="value"
                label={({ name, value }) => `${name} ${(value / 60).toFixed(1)}h`}
              >
                {sleepComposition.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </Panel>

        <Panel>
          <PanelTitle>Sleep Debt</PanelTitle>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={sleepDebtTrend}>
              <CartesianGrid {...chartGrid} />
              <XAxis dataKey="date" tick={axisTick} tickLine={false} interval={Math.floor(sleepDebtTrend.length / 10)} />
              <YAxis tick={axisTick} tickLine={false} axisLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <defs>
                <linearGradient id="gDebt" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={colors.danger} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={colors.danger} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="debt" name="Debt (min)" stroke={colors.danger} fill="url(#gDebt)" />
            </AreaChart>
          </ResponsiveContainer>
        </Panel>
      </div>

      <Panel>
        <PanelTitle>Efficiency & Performance</PanelTitle>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={sleepEfficiencyTrend}>
            <CartesianGrid {...chartGrid} />
            <XAxis dataKey="date" tick={axisTick} tickLine={false} interval={Math.floor(sleepEfficiencyTrend.length / 10)} />
            <YAxis domain={[50, 100]} tick={axisTick} tickLine={false} axisLine={false} />
            <Tooltip content={<ChartTooltip />} />
            <Line type="monotone" dataKey="efficiency" stroke={colors.accent} strokeWidth={2} dot={false} name="Efficiency" activeDot={dotProps(colors.accent)} />
            <Line type="monotone" dataKey="performance" stroke={colors.blue} strokeWidth={2} dot={false} name="Performance" activeDot={dotProps(colors.blue)} />
          </LineChart>
        </ResponsiveContainer>
      </Panel>
    </Section>
  );
}
