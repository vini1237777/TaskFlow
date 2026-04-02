export default function TaskSkeleton() {
  return (
    <div className="space-y-2.5">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="card p-4 animate-pulse">
          <div className="flex items-start gap-3">
            <div className="w-4 h-4 rounded bg-layer-3 mt-0.5 flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-layer-3 rounded w-2/3" />
              <div className="h-3 bg-layer-3 rounded w-1/2" />
              <div className="flex gap-2 mt-1">
                <div className="h-4 w-14 bg-layer-3 rounded-full" />
                <div className="h-4 w-10 bg-layer-3 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
