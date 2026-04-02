'use client';

import { useState } from 'react';
import { format, isPast, parseISO } from 'date-fns';
import type { Task } from '@/types';

interface Props {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  style?: React.CSSProperties;
}

const statusLabels: Record<string, { label: string; className: string }> = {
  PENDING: { label: 'Pending', className: 'bg-layer-3 text-ink-secondary' },
  IN_PROGRESS: { label: 'In Progress', className: 'bg-accent/10 text-accent' },
  COMPLETED: { label: 'Done', className: 'bg-jade/10 text-jade' },
};

const priorityLabels: Record<string, { label: string; className: string }> = {
  LOW: { label: 'Low', className: 'text-jade' },
  MEDIUM: { label: 'Medium', className: 'text-gold' },
  HIGH: { label: 'High', className: 'text-danger' },
};

export default function TaskCard({ task, onToggle, onEdit, onDelete, style }: Props) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const done = task.status === 'COMPLETED';
  const overdue = task.dueDate && !done && isPast(parseISO(task.dueDate));

  const handleDelete = () => {
    if (confirmDelete) {
      onDelete(task.id);
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
    }
  };

  const status = statusLabels[task.status];
  const priority = priorityLabels[task.priority];

  return (
    <div
      style={style}
      className={`group card p-4 transition-all duration-150 hover:shadow-md animate-in ${done ? 'opacity-60' : ''}`}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={() => onToggle(task.id)}
          className={`mt-0.5 flex-shrink-0 w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
            done ? 'bg-jade border-jade' : 'border-edge-strong hover:border-accent'
          }`}
        >
          {done && <span className="text-white text-[9px] font-bold leading-none">✓</span>}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className={`font-medium text-sm leading-snug ${done ? 'line-through text-ink-tertiary' : 'text-ink'}`}>
              {task.title}
            </p>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
              <button
                onClick={() => onEdit(task)}
                className="px-2 py-0.5 text-xs text-ink-secondary hover:text-ink border border-edge hover:border-edge-strong rounded-lg transition-colors"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className={`px-2 py-0.5 text-xs rounded-lg border transition-colors ${
                  confirmDelete
                    ? 'text-danger border-danger/40 bg-danger/10'
                    : 'text-ink-secondary hover:text-danger border-edge hover:border-danger/30'
                }`}
              >
                {confirmDelete ? 'Sure?' : 'Delete'}
              </button>
            </div>
          </div>

          {task.description && (
            <p className="text-ink-tertiary text-xs mt-1 line-clamp-2">{task.description}</p>
          )}

          <div className="flex items-center flex-wrap gap-2 mt-2.5">
            <span className={`text-xs px-2 py-0.5 rounded-full ${status.className}`}>{status.label}</span>
            <span className={`text-xs ${priority.className}`}>{priority.label} priority</span>
            {task.dueDate && (
              <span className={`text-xs ${overdue ? 'text-danger' : 'text-ink-tertiary'}`}>
                {overdue ? 'Overdue · ' : 'Due '}{format(parseISO(task.dueDate), 'MMM d')}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
