import { Section, Panel, PanelTitle } from '../ui/Panel';
import { SeverityBadge } from '../ui/Badges';
import { BoxPlot } from '../charts/BoxPlot';
import { SERIES } from '../../lib/constants';
import { formatDateFull } from '../../lib/utils';

export function OutliersTab({ analytics }) {
  const { outlierData } = analytics;
  const boxPlotKeys = Object.keys(outlierData.boxPlots || {});

  function formatMetricLabel(key) {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
  }

  return (
    <Section title="Outlier Detection">
      <Panel className="mb-6">
        <PanelTitle>Distributions</PanelTitle>
        {boxPlotKeys.map((key, i) => (
          <BoxPlot
            key={key}
            stats={outlierData.boxPlots[key].stats}
            outliers={outlierData.boxPlots[key].outliers}
            label={formatMetricLabel(key)}
            color={SERIES[i % SERIES.length]}
          />
        ))}
      </Panel>

      <Panel className="overflow-x-auto">
        <PanelTitle>Outlier Events ({outlierData.outliers.length})</PanelTitle>
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr>
              {['Date', 'Metric', 'Value', 'Distance', 'Severity', 'Context'].map(header => (
                <th key={header} className="text-left px-3 py-2.5 text-muted font-medium text-[11px] uppercase tracking-wider font-body border-b border-subtle">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {outlierData.outliers.slice(0, 30).map((outlier, i) => (
              <tr
                key={i}
                className={`transition-colors hover:bg-elevated ${i % 2 === 0 ? 'bg-void' : 'bg-surface'}`}
              >
                <td className="px-3 py-2.5 font-mono text-xs">{formatDateFull(outlier.date)}</td>
                <td className="px-3 py-2.5">{outlier.metric}</td>
                <td className="px-3 py-2.5 font-medium font-mono">{outlier.value.toFixed(1)}</td>
                <td className="px-3 py-2.5 text-muted font-mono">{outlier.distance.toFixed(2)}</td>
                <td className="px-3 py-2.5"><SeverityBadge severity={outlier.severity} /></td>
                <td className="px-3 py-2.5 text-muted text-[11px] font-mono">
                  {outlier.dayData && `Rec:${outlier.dayData.recovery ?? '\u2014'}% HRV:${outlier.dayData.hrv ?? '\u2014'} Strain:${outlier.dayData.strain ?? '\u2014'} Sleep:${outlier.dayData.sleepHours?.toFixed(1) ?? '\u2014'}h`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </Section>
  );
}
