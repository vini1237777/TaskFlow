'use client';

import type { Task } from '@/types';

export default function StatsBar({ tasks, total }: { tasks: Task[]; total: number }) {
  const counts = tasks.reduce((acc, t) => {
    acc[t.status] = (acc[t.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const stats = [
    { label: 'Total', value: total, color: 'bg-ink-tertiary' },
    { label: 'Pending', value: counts.PENDING || 0, color: 'bg-ink-secondary' },
    { label: 'In Progress', value: counts.IN_PROGRESS || 0, color: 'bg-accent' },
    { label: 'Completed', value: counts.COMPLETED || 0, color: 'bg-jade' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map(s => (
        <div key={s.label} className="card p-4 flex items-center gap-3">
          <div className={`w-1.5 h-8 rounded-full ${s.color} opacity-60 flex-shrink-0`} />
          <div>
            <p className="font-display font-bold text-xl text-ink">{s.value}</p>
            <p className="text-ink-tertiary text-xs">{s.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
