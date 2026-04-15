import { colors } from '../../lib/constants';

const CELL_SIZE = 48;

export function CorrelationMatrix({ matrix, labels, onCellClick }) {
  function getCellBackground(value, isDiagonal) {
    if (isDiagonal) return colors.surface;
    if (value == null) return colors.elevated;
    if (value > 0) return `rgba(0,240,160,${Math.abs(value) * 0.6})`;
    return `rgba(255,77,106,${Math.abs(value) * 0.6})`;
  }

  return (
    <div className="overflow-x-auto">
      <div className="inline-block">
        <div className="flex" style={{ marginLeft: CELL_SIZE * 2.2, marginBottom: 4 }}>
          {labels.map((label, i) => (
            <div
              key={i}
              className="text-[9px] text-muted text-center font-body whitespace-nowrap -rotate-45"
              style={{
                width: CELL_SIZE,
                height: CELL_SIZE * 1.2,
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                transformOrigin: 'center',
              }}
            >
              {label}
            </div>
          ))}
        </div>

        {matrix.map((row, ri) => (
          <div key={ri} className="flex items-center">
            <div
              className="text-[10px] text-muted text-right pr-2 font-body whitespace-nowrap overflow-hidden text-ellipsis"
              style={{ width: CELL_SIZE * 2.2 }}
            >
              {labels[ri]}
            </div>

            {row.map((value, ci) => {
              const isDiagonal = ri === ci;
              const isClickable = !isDiagonal && value != null;

              return (
                <div
                  key={ci}
                  onClick={() => isClickable && onCellClick(ri, ci)}
                  title={value != null ? `${labels[ri]} vs ${labels[ci]}: r=${value.toFixed(3)}` : ''}
                  className="flex items-center justify-center text-[9px] font-medium font-mono rounded-[3px] m-px transition-transform duration-150"
                  style={{
                    width: CELL_SIZE,
                    height: CELL_SIZE,
                    background: getCellBackground(value, isDiagonal),
                    color: isDiagonal
                      ? colors.muted
                      : (value != null && Math.abs(value) > 0.3) ? colors.primary : colors.muted,
                    cursor: isClickable ? 'pointer' : 'default',
                  }}
                  onMouseEnter={e => { if (!isDiagonal) e.currentTarget.style.transform = 'scale(1.06)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                >
                  {value != null ? value.toFixed(2) : ''}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
