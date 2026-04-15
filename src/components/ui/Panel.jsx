import clsx from 'clsx';

export function Panel({ children, className = '' }) {
  return (
    <div className={clsx(
      'bg-surface/70 backdrop-blur-[12px] border border-white/[0.04] rounded-[14px] p-5',
      className,
    )}>
      {children}
    </div>
  );
}

export function PanelTitle({ children }) {
  return (
    <h3 className="text-sm font-medium text-primary mb-4 font-heading">
      {children}
    </h3>
  );
}

export function Section({ title, children, id }) {
  return (
    <div id={id} className="mb-10 animate-[fade-slide-in_0.3s_ease_forwards]">
      {title && (
        <h2 className="text-xl font-semibold text-primary mb-6 font-heading tracking-tight">
          {title}
        </h2>
      )}
      {children}
    </div>
  );
}
