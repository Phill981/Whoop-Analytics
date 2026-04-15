export function DemoBanner({ onUpload }) {
  return (
    <div className="flex items-center gap-3 px-4 py-2.5 mb-6 bg-warm-dim border border-warm/20 rounded-[10px]">
      <svg
        width="16" height="16" fill="none" stroke="currentColor"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        viewBox="0 0 24 24" className="text-warm shrink-0"
      >
        <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>

      <span className="text-xs text-warm font-medium font-body">
        Viewing demo data
      </span>
      <span className="text-xs text-muted font-body">
        Upload your WHOOP export folder or drag & drop CSV files to see your own data.
      </span>

      <button
        onClick={onUpload}
        className="ml-auto py-1 px-3.5 rounded-lg border border-warm/25 bg-transparent text-warm text-[11px] font-medium cursor-pointer font-body whitespace-nowrap transition-colors hover:bg-warm/10"
      >
        Upload Data
      </button>
    </div>
  );
}
