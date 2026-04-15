import { Section, Panel, PanelTitle } from '../ui/Panel';
import { BadgeType } from '../ui/Badges';
import { colors } from '../../lib/constants';
import { average } from '../../lib/utils';

export function InsightsTab({ analytics }) {
  const { behaviorImpact, recommendations } = analytics;

  return (
    <Section title="Insights & Recommendations">
      {behaviorImpact.length > 0 && (
        <Panel className="mb-6">
          <PanelTitle>Behavior Impact</PanelTitle>
          <p className="text-xs text-muted mb-4">
            How daily habits affect your metrics, based on your data.
          </p>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4">
            {behaviorImpact.map((item, i) => {
              const recoveryDiff = item.yesRecovery - item.noRecovery;
              const isNegative = recoveryDiff < -2;
              const isPositive = recoveryDiff > 2;

              return (
                <div
                  key={i}
                  className="p-4 bg-elevated rounded-[10px] border"
                  style={{
                    borderColor: isNegative
                      ? 'rgba(255,77,106,0.15)'
                      : isPositive
                        ? 'rgba(0,240,160,0.15)'
                        : colors.subtle,
                  }}
                >
                  <div className="flex justify-between mb-3">
                    <span className="text-sm font-medium text-primary">{item.behavior}</span>
                    <span className="text-[11px] text-muted font-mono">{item.yesCount}/{item.noCount} days</span>
                  </div>

                  {[
                    { label: 'Recovery', yes: item.yesRecovery, no: item.noRecovery, unit: '%' },
                    { label: 'HRV', yes: item.yesHRV, no: item.noHRV, unit: ' ms' },
                    { label: 'Sleep', yes: item.yesSleep, no: item.noSleep, unit: 'h' },
                  ].map((metric, j) => {
                    const diff = metric.yes - metric.no;
                    const isDown = (metric.label === 'Recovery' || metric.label === 'HRV' || metric.label === 'Sleep') && diff < -1;

                    return (
                      <div key={j} className="flex justify-between py-1.5 text-xs" style={{ borderBottom: j < 2 ? `1px solid ${colors.subtle}` : 'none' }}>
                        <span className="text-muted">{metric.label}</span>
                        <div className="flex gap-2 items-center">
                          <span className="text-secondary font-mono">
                            {metric.yes.toFixed(1)}{metric.unit} / {metric.no.toFixed(1)}{metric.unit}
                          </span>
                          <span className={`font-medium font-mono ${isDown ? 'text-danger' : diff > 1 ? 'text-accent' : 'text-muted'}`}>
                            {diff >= 0 ? '+' : ''}{diff.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </Panel>
      )}

      <Panel>
        <PanelTitle>Personalized Recommendations</PanelTitle>
        <div className="flex flex-col gap-3">
          {recommendations.map((rec, i) => (
            <div
              key={i}
              className="p-4 bg-elevated rounded-[10px] border border-subtle transition-colors hover:border-focus"
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2.5">
                  <BadgeType type={rec.type} />
                  <span className="text-sm font-medium text-primary">{rec.title}</span>
                </div>
                <span className="text-[10px] text-muted bg-surface px-2 py-0.5 rounded-md">
                  {rec.category}
                </span>
              </div>
              <p className="text-[13px] text-secondary leading-relaxed">{rec.text}</p>
            </div>
          ))}
        </div>
      </Panel>
    </Section>
  );
}
