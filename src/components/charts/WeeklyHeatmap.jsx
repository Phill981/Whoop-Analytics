import { useMemo } from 'react';
import { formatDateFull } from '../../lib/utils';

export function WeeklyHeatmap({ data }) {
  const { weeks, monthLabels } = useMemo(() => {
    if (!data.length) return { weeks: [], monthLabels: [] };

    const sorted = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
    const columns = [];
    let column = [];

    const startPad = new Date(sorted[0].date).getDay();
    for (let i = 0; i < startPad; i++) column.push(null);

    for (const day of sorted) {
      column.push(day);
      if (column.length === 7) {
        columns.push(column);
        column = [];
      }
    }
    if (column.length) {
      while (column.length < 7) column.push(null);
      columns.push(column);
    }

    const labels = [];
    let lastMonth = '';
    columns.forEach((col, idx) => {
      const firstDay = col.find(d => d);
      if (firstDay) {
        const month = new Date(firstDay.date).toLocaleDateString('en-US', { month: 'short' });
        if (month !== lastMonth) {
          labels.push({ idx, label: month });
          lastMonth = month;
        }
      }
    });

    return { weeks: columns, monthLabels: labels };
  }, [data]);

  const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const cellSize = 14;
  const gap = 2;

  function getCellColor(recovery) {
    if (recovery == null) return undefined;
    if (recovery >= 67) return `rgba(0,240,160,${0.15 + ((recovery - 67) / 33) * 0.5})`;
    if (recovery >= 34) return `rgba(245,166,35,${0.15 + ((recovery - 34) / 33) * 0.35})`;
    return `rgba(255,77,106,${0.15 + (recovery / 34) * 0.35})`;
  }

  return (
    <div className="overflow-x-auto">
      <div className="inline-flex flex-col">
        <div className="relative ml-5 mb-1 h-3.5">
          {monthLabels.map((m, i) => (
            <div
              key={i}
              className="absolute text-[10px] text-muted font-body whitespace-nowrap"
              style={{ left: m.idx * (cellSize + gap) }}
            >
              {m.label}
            </div>
          ))}
        </div>

        <div className="flex mt-2">
          <div className="flex flex-col mr-1 justify-center" style={{ gap }}>
            {dayLabels.map((label, i) => (
              <div
                key={i}
                className="text-[9px] text-muted font-mono flex items-center justify-end"
                style={{ height: cellSize, width: 14 }}
              >
                {i % 2 === 1 ? label : ''}
              </div>
            ))}
          </div>

          <div className="flex" style={{ gap }}>
            {weeks.map((col, ci) => (
              <div key={ci} className="flex flex-col" style={{ gap }}>
                {col.map((day, di) => (
                  <div
                    key={di}
                    title={day ? `${formatDateFull(day.date)}: ${day.recovery}%` : ''}
                    className="rounded-[3px] bg-elevated transition-transform duration-150 hover:scale-[1.3]"
                    style={{
                      width: cellSize,
                      height: cellSize,
                      background: getCellColor(day?.recovery),
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
