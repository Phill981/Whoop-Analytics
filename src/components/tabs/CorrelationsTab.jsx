import { useState, useMemo } from 'react';
import { ResponsiveContainer, ScatterChart, CartesianGrid, XAxis, YAxis, Tooltip, Scatter } from 'recharts';
import { Section, Panel, PanelTitle } from '../ui/Panel';
import { CorrelationMatrix } from '../charts/CorrelationMatrix';
import { colors, chartGrid, axisTick } from '../../lib/constants';
import { formatDateFull } from '../../lib/utils';

export function CorrelationsTab({ analytics, physiological }) {
  const { corrMetrics, corrMatrix, corrLabels, topCorrelations } = analytics;
  const [scatterPair, setScatterPair] = useState(null);

  const scatterData = useMemo(() => {
    if (!scatterPair || !physiological.length) return [];
    return physiological
      .map(d => ({ x: d[scatterPair.key1], y: d[scatterPair.key2], date: d.date }))
      .filter(d => d.x != null && d.y != null);
  }, [scatterPair, physiological]);

  function handleCellClick(rowIdx, colIdx) {
    setScatterPair({
      key1: corrMetrics[rowIdx],
      key2: corrMetrics[colIdx],
      label1: corrLabels[rowIdx],
      label2: corrLabels[colIdx],
      r: corrMatrix[rowIdx][colIdx],
    });
  }

  return (
    <Section title="Correlations">
      <Panel className="mb-6">
        <PanelTitle>Correlation Matrix</PanelTitle>
        <CorrelationMatrix matrix={corrMatrix} labels={corrLabels} onCellClick={handleCellClick} />
      </Panel>

      {scatterPair && scatterData.length > 0 && (
        <Panel className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <PanelTitle>
              {scatterPair.label1} vs {scatterPair.label2}{' '}
              <span className="font-normal text-muted font-mono">r={scatterPair.r.toFixed(3)}</span>
            </PanelTitle>
            <button
              onClick={() => setScatterPair(null)}
              className="bg-elevated border border-focus rounded-full text-secondary px-3.5 py-1 text-[11px] cursor-pointer font-body"
            >
              Close
            </button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart>
              <CartesianGrid {...chartGrid} />
              <XAxis dataKey="x" tick={axisTick} tickLine={false} />
              <YAxis dataKey="y" tick={axisTick} tickLine={false} />
              <Tooltip content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0]?.payload;
                return (
                  <div className="bg-elevated border border-focus rounded-xl p-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
                    <div className="text-muted text-[10px] font-mono">{formatDateFull(d?.date)}</div>
                    <div className="text-primary text-xs font-mono">{scatterPair.label1}: {payload[0]?.value?.toFixed(1)}</div>
                    <div className="text-primary text-xs font-mono">{scatterPair.label2}: {payload[1]?.value?.toFixed(1)}</div>
                  </div>
                );
              }} />
              <Scatter data={scatterData} fill={colors.accent} fillOpacity={0.5} r={4} />
            </ScatterChart>
          </ResponsiveContainer>
        </Panel>
      )}

      <div className="grid grid-cols-2 gap-5">
        <Panel>
          <PanelTitle>Strongest Positive</PanelTitle>
          {topCorrelations.positive?.map((c, i) => (
            <div key={i} className="flex justify-between py-2 border-b border-subtle text-[13px]">
              <span className="text-secondary">{c.metric1} ↔ {c.metric2}</span>
              <span className="font-medium text-accent font-mono">r={c.r.toFixed(3)}</span>
            </div>
          ))}
        </Panel>
        <Panel>
          <PanelTitle>Strongest Negative</PanelTitle>
          {topCorrelations.negative?.map((c, i) => (
            <div key={i} className="flex justify-between py-2 border-b border-subtle text-[13px]">
              <span className="text-secondary">{c.metric1} ↔ {c.metric2}</span>
              <span className="font-medium text-danger font-mono">r={c.r.toFixed(3)}</span>
            </div>
          ))}
        </Panel>
      </div>
    </Section>
  );
}
