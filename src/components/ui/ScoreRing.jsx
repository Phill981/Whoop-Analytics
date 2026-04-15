import { colors } from '../../lib/constants';

export function ScoreRing({ score, label, size = 120 }) {
  const color = score >= 75 ? colors.accent : score >= 50 ? colors.warm : colors.danger;
  const circumference = 2 * Math.PI * 42;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="text-center flex-1 basis-[100px]">
      <svg width={size} height={size} viewBox="0 0 100 100">
        <circle
          cx="50" cy="50" r="42" fill="none"
          stroke={colors.subtle} strokeWidth="5"
        />
        <circle
          cx="50" cy="50" r="42" fill="none"
          stroke={color} strokeWidth="5" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          transform="rotate(-90 50 50)"
          className="transition-[stroke-dashoffset] duration-1000 ease-out"
        />
        <text
          x="50" y="46" textAnchor="middle"
          fill={color} fontSize="20" fontWeight="500"
          fontFamily="'JetBrains Mono', monospace"
        >
          {Math.round(score)}
        </text>
        <text
          x="50" y="60" textAnchor="middle"
          fill={colors.muted} fontSize="9"
          fontFamily="'Outfit', sans-serif"
        >
          /100
        </text>
      </svg>
      <div className="text-xs text-secondary font-normal mt-0.5 font-body">{label}</div>
    </div>
  );
}
