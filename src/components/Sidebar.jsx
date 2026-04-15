import { forwardRef } from 'react';
import clsx from 'clsx';
import { NAV_ITEMS } from '../lib/constants';

export const Sidebar = forwardRef(function Sidebar({
  activeTab, setActiveTab, expanded, setExpanded,
  dataSource, onUpload, onReset,
}, folderRef) {
  const width = expanded ? 220 : 64;

  return (
    <div
      className="fixed top-0 left-0 z-50 min-h-screen bg-surface border-r border-subtle flex flex-col overflow-hidden transition-[width] duration-200"
      style={{ width }}
    >
      <div
        className="px-4 py-5 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? (
          <span className="text-[15px] font-semibold text-primary font-heading whitespace-nowrap">
            WHOOP Analytics
          </span>
        ) : (
          <span className="text-[15px] font-semibold text-primary font-heading">
            W
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-0.5 px-2">
        {NAV_ITEMS.map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={clsx(
                'flex items-center gap-2.5 rounded-lg border-l-[3px] w-full text-left transition-all duration-150',
                expanded ? 'px-3 py-2.5' : 'px-3.5 py-2.5',
                isActive
                  ? 'bg-elevated border-l-accent text-primary font-medium'
                  : 'border-l-transparent text-muted hover:text-secondary',
              )}
            >
              <svg
                width="18" height="18" fill="none" stroke="currentColor"
                strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                viewBox="0 0 24 24" className="shrink-0"
              >
                <path d={item.icon} />
              </svg>
              {expanded && (
                <span className="whitespace-nowrap overflow-hidden text-ellipsis text-[13px]">
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-2 py-3 border-t border-subtle">
        <input
          ref={folderRef}
          type="file"
          accept=".csv"
          multiple
          webkitdirectory=""
          directory=""
          onChange={e => onUpload(e.target.files)}
          className="hidden"
        />

        <button
          onClick={() => folderRef.current?.click()}
          className="w-full py-2 px-3 rounded-lg border border-focus bg-transparent text-secondary text-xs cursor-pointer font-body mb-1.5 transition-colors hover:bg-elevated"
        >
          {expanded ? 'Upload Data' : '+'}
        </button>

        {dataSource === 'uploaded' && (
          <button
            onClick={onReset}
            className="w-full py-1.5 px-3 rounded-lg border-none bg-transparent text-muted text-[11px] cursor-pointer font-body"
          >
            Reset
          </button>
        )}

        <div className="text-[10px] text-muted text-center mt-2">
          {dataSource === 'demo' ? 'Demo data' : 'Uploaded'}
        </div>
      </div>
    </div>
  );
});
