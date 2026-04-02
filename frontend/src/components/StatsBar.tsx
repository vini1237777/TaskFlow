'use client';

import type { Task } from '@/types';

export default function StatsBar({ tasks, total }: { tasks: Task[]; total: number }) {
  const counts = tasks.reduce((acc, t) => {
    acc[t.status] = (acc[t.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const completedPct = total > 0 ? Math.round(((counts.COMPLETED || 0) / total) * 100) : 0;

  const stats = [
    { label: 'Total tasks',  value: total,               color: 'bg-accent',  light: 'bg-accent/10 text-accent' },
    { label: 'To do',        value: counts.PENDING || 0, color: 'bg-ink-tertiary', light: 'bg-layer-2 text-ink-secondary' },
    { label: 'In progress',  value: counts.IN_PROGRESS || 0, color: 'bg-gold',  light: 'bg-gold/10 text-gold' },
    { label: 'Completed',    value: counts.COMPLETED || 0,   color: 'bg-jade',  light: 'bg-jade/10 text-jade' },
  ];

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map(s => (
          <div key={s.label} className="card p-4">
            <p className="text-2xl font-display font-bold text-ink">{s.value}</p>
            <p className="text-ink-tertiary text-xs mt-0.5">{s.label}</p>
            <div className={`inline-flex mt-2 px-2 py-0.5 rounded-full text-[10px] font-medium ${s.light}`}>
              {total > 0 ? Math.round((s.value / total) * 100) : 0}%
            </div>
          </div>
        ))}
      </div>

      <div className="card px-4 py-3 flex items-center gap-3">
        <span className="text-xs text-ink-secondary font-medium flex-shrink-0">Progress</span>
        <div className="flex-1 h-1.5 bg-layer-3 rounded-full overflow-hidden">
          <div
            className="h-full bg-jade rounded-full transition-all duration-500"
            style={{ width: `${completedPct}%` }}
          />
        </div>
        <span className="text-xs font-mono text-ink-secondary flex-shrink-0">{completedPct}%</span>
      </div>
    </div>
  );
}
