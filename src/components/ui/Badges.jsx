import clsx from 'clsx';

const BADGE_CONFIG = {
  positive: { bg: 'bg-accent-dim', color: 'text-accent', label: 'Strength' },
  warning: { bg: 'bg-warm-dim', color: 'text-warm', label: 'Attention' },
  critical: { bg: 'bg-danger-dim', color: 'text-danger', label: 'Action Needed' },
  info: { bg: 'bg-info/10', color: 'text-info', label: 'Insight' },
};

export function BadgeType({ type }) {
  const config = BADGE_CONFIG[type] || BADGE_CONFIG.info;
  return (
    <span className={clsx(
      'px-2.5 py-0.5 rounded-full text-[11px] font-medium font-body',
      config.bg, config.color,
    )}>
      {config.label}
    </span>
  );
}

export function SeverityBadge({ severity }) {
  const isExtreme = severity === 'extreme';
  return (
    <span className={clsx(
      'px-2.5 py-0.5 rounded-full text-[11px] font-medium font-body',
      isExtreme ? 'bg-danger-dim text-danger' : 'bg-warm-dim text-warm',
    )}>
      {severity}
    </span>
  );
}
