const ToolResultSkeleton = ({ cards = 2 }: { cards?: number }) => (
  <div className="mt-6 space-y-4" aria-live="polite" aria-busy="true">
    {Array.from({ length: cards }).map((_, index) => (
      <div key={index} className="glass-card rounded-2xl p-5 space-y-3 animate-pulse">
        <div className="h-4 w-24 rounded-full bg-muted" />
        <div className="h-6 w-2/3 rounded-xl bg-muted" />
        <div className="h-16 rounded-2xl bg-muted/80" />
        <div className="grid grid-cols-2 gap-3">
          <div className="h-12 rounded-xl bg-muted/70" />
          <div className="h-12 rounded-xl bg-muted/70" />
        </div>
      </div>
    ))}
  </div>
);

export default ToolResultSkeleton;