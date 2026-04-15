import {
  ResponsiveContainer, ComposedChart, CartesianGrid, XAxis, YAxis,
  Tooltip, ReferenceArea, ReferenceLine, Line,
} from 'recharts';
import { Section, Panel, PanelTitle } from '../ui/Panel';
import { ChartTooltip } from '../ui/ChartTooltip';
import { colors, chartGrid, axisTick } from '../../lib/constants';

export function HeartTab({ analytics }) {
  const { overview, heartTrend, hrvRange, rhrRange } = analytics;
  const interval = Math.floor(heartTrend.length / 12);
  const dotProps = color => ({ r: 5, fill: color, stroke: colors.surface, strokeWidth: 2 });

  const summaryCards = [
    { label: 'Avg RHR', value: `${overview.avgRHR.toFixed(0)} bpm`, color: colors.danger },
    { label: 'Avg HRV', value: `${overview.avgHRV.toFixed(0)} ms`, color: colors.accent },
    { label: 'Avg SpO2', value: `${overview.avgSpo2.toFixed(1)}%`, color: colors.blue },
    { label: 'Skin Temp', value: `${overview.avgSkinTemp.toFixed(1)}\u00B0C`, color: colors.warm },
    { label: 'Resp Rate', value: `${overview.avgRespRate.toFixed(1)}`, color: colors.purple },
  ];

  return (
    <Section title="Heart & Body">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-4 mb-6">
        {summaryCards.map((card, i) => (
          <Panel key={i} className="!py-3.5 !px-4">
            <div className="text-[10px] text-muted uppercase tracking-wider mb-1">{card.label}</div>
            <div className="text-xl font-medium font-mono" style={{ color: card.color }}>{card.value}</div>
          </Panel>
        ))}
      </div>

      <Panel className="mb-6">
        <PanelTitle>Heart Rate Variability</PanelTitle>
        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart data={heartTrend}>
            <CartesianGrid {...chartGrid} />
            <XAxis dataKey="date" tick={axisTick} tickLine={false} interval={interval} />
            <YAxis tick={axisTick} tickLine={false} axisLine={false} />
            <Tooltip content={<ChartTooltip />} />
            <ReferenceArea y1={hrvRange.p25} y2={hrvRange.p75} fill={colors.accent} fillOpacity={0.04} />
            <Line type="monotone" dataKey="hrv" stroke={colors.accent} strokeWidth={2} dot={false} name="HRV" activeDot={dotProps(colors.accent)} />
            <Line type="monotone" dataKey="hrv_ma" stroke={colors.accent} strokeWidth={1.5} strokeDasharray="4 4" dot={false} name="14d Avg" />
          </ComposedChart>
        </ResponsiveContainer>
      </Panel>

      <Panel className="mb-6">
        <PanelTitle>Resting Heart Rate</PanelTitle>
        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart data={heartTrend}>
            <CartesianGrid {...chartGrid} />
            <XAxis dataKey="date" tick={axisTick} tickLine={false} interval={interval} />
            <YAxis tick={axisTick} tickLine={false} axisLine={false} />
            <Tooltip content={<ChartTooltip />} />
            <ReferenceArea y1={rhrRange.p25} y2={rhrRange.p75} fill={colors.danger} fillOpacity={0.04} />
            <Line type="monotone" dataKey="rhr" stroke={colors.danger} strokeWidth={2} dot={false} name="RHR" activeDot={dotProps(colors.danger)} />
            <Line type="monotone" dataKey="rhr_ma" stroke={colors.danger} strokeWidth={1.5} strokeDasharray="4 4" dot={false} name="14d Avg" />
          </ComposedChart>
        </ResponsiveContainer>
      </Panel>

      <div className="grid grid-cols-2 gap-5">
        <Panel>
          <PanelTitle>Blood Oxygen</PanelTitle>
          <ResponsiveContainer width="100%" height={240}>
            <ComposedChart data={heartTrend}>
              <CartesianGrid {...chartGrid} />
              <XAxis dataKey="date" tick={axisTick} tickLine={false} interval={interval} />
              <YAxis domain={[92, 100]} tick={axisTick} tickLine={false} axisLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <ReferenceLine y={95} stroke={colors.blue} strokeDasharray="4 4" />
              <Line type="monotone" dataKey="spo2" stroke={colors.blue} strokeWidth={2} dot={false} name="SpO2" />
            </ComposedChart>
          </ResponsiveContainer>
        </Panel>

        <Panel>
          <PanelTitle>Skin Temperature & Respiratory Rate</PanelTitle>
          <ResponsiveContainer width="100%" height={240}>
            <ComposedChart data={heartTrend}>
              <CartesianGrid {...chartGrid} />
              <XAxis dataKey="date" tick={axisTick} tickLine={false} interval={interval} />
              <YAxis tick={axisTick} tickLine={false} axisLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Line type="monotone" dataKey="skinTemp" stroke={colors.warm} strokeWidth={2} dot={false} name="Skin Temp" />
              <Line type="monotone" dataKey="respRate" stroke={colors.purple} strokeWidth={2} dot={false} name="Resp Rate" />
            </ComposedChart>
          </ResponsiveContainer>
        </Panel>
      </div>
    </Section>
  );
}
