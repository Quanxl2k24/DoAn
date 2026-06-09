const Skeleton = ({ variant = 'text', width, height, className = '' }) => {
  const base = 'animate-pulse bg-white/10 rounded';
  const styles = {
    text: 'h-4 w-full',
    circular: 'rounded-full',
    rectangular: '',
  };

  return (
    <div
      className={`${base} ${styles[variant]} ${className}`}
      style={{ width, height }}
    />
  );
};

export const SkeletonTable = ({ rows = 5, cols = 6 }) => (
  <div className="p-6 space-y-4">
    {/* header */}
    <div className="flex gap-4 mb-6">
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton key={i} className="flex-1 h-6" />
      ))}
    </div>
    {/* rows */}
    {Array.from({ length: rows }).map((_, r) => (
      <div key={r} className="flex gap-4">
        {Array.from({ length: cols }).map((_, c) => (
          <Skeleton key={c} className="flex-1 h-5" />
        ))}
      </div>
    ))}
  </div>
);

export const SkeletonList = ({ rows = 5 }) => (
  <div className="flex flex-col gap-4">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="bg-surface-container-low border border-white/5 rounded-2xl p-6 flex items-center gap-6">
        <Skeleton variant="rectangular" className="w-16 h-16 rounded-xl shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-1/4" />
        </div>
        <div className="text-right space-y-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    ))}
  </div>
);

export const SkeletonCard = ({ count = 4 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="bg-surface-container-low rounded-2xl border border-white/5 overflow-hidden">
        <Skeleton variant="rectangular" className="w-full aspect-[2/3]" />
        <div className="p-4 space-y-3">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      </div>
    ))}
  </div>
);

export default Skeleton;
