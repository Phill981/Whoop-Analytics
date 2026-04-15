export function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-elevated border border-focus rounded-xl p-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)] max-w-[260px]">
      <div className="text-secondary text-xs font-body mb-1.5">{label}</div>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2 mb-0.5">
          <div
            className="w-1.5 h-1.5 rounded-full shrink-0"
            style={{ background: entry.color }}
          />
          <span className="text-secondary text-[13px] font-body">{entry.name}</span>
          <span className="text-primary text-[13px] font-mono font-medium ml-auto">
            {typeof entry.value === 'number' ? entry.value.toFixed(1) : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
}
