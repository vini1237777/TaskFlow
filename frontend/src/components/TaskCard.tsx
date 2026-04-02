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

const statusConfig: Record<string, { label: string; className: string }> = {
  PENDING:     { label: 'To do',       className: 'bg-layer-2 text-ink-secondary border border-edge' },
  IN_PROGRESS: { label: 'In progress', className: 'bg-accent/10 text-accent border border-accent/20' },
  COMPLETED:   { label: 'Done',        className: 'bg-jade/10 text-jade border border-jade/20' },
};

const priorityConfig: Record<string, { dot: string; label: string }> = {
  LOW:    { dot: 'bg-jade',   label: 'Low' },
  MEDIUM: { dot: 'bg-gold',   label: 'Medium' },
  HIGH:   { dot: 'bg-danger', label: 'High' },
};

export default function TaskCard({ task, onToggle, onEdit, onDelete, style }: Props) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const done = task.status === 'COMPLETED';
  const overdue = task.dueDate && !done && isPast(parseISO(task.dueDate));
  const status = statusConfig[task.status];
  const priority = priorityConfig[task.priority];

  const handleDelete = () => {
    if (confirmDelete) { onDelete(task.id); }
    else { setConfirmDelete(true); setTimeout(() => setConfirmDelete(false), 3000); }
  };

  return (
    <div
      style={style}
      className={`group card-hover p-4 animate-in cursor-default ${done ? 'opacity-55' : ''}`}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={() => onToggle(task.id)}
          className={`mt-0.5 flex-shrink-0 w-[18px] h-[18px] rounded-[5px] border-2 flex items-center justify-center transition-all duration-150 ${
            done ? 'bg-jade border-jade' : 'border-edge-strong hover:border-accent'
          }`}
        >
          {done && <span className="text-white text-[10px] font-bold leading-none">✓</span>}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <p className={`text-sm font-medium leading-snug ${done ? 'line-through text-ink-tertiary' : 'text-ink'}`}>
              {task.title}
            </p>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-150 flex-shrink-0">
              <button
                onClick={() => onEdit(task)}
                className="text-xs px-2.5 py-1 rounded-lg border border-edge hover:border-edge-strong hover:bg-layer-2 text-ink-secondary hover:text-ink transition-all"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                  confirmDelete ? 'bg-danger/10 text-danger border-danger/30' : 'border-edge hover:border-danger/30 hover:bg-danger/5 text-ink-secondary hover:text-danger'
                }`}
              >
                {confirmDelete ? 'Sure?' : 'Delete'}
              </button>
            </div>
          </div>

          {task.description && (
            <p className="text-ink-tertiary text-xs mt-1 leading-relaxed line-clamp-1">{task.description}</p>
          )}

          <div className="flex items-center flex-wrap gap-2 mt-2.5">
            <span className={`badge text-[11px] ${status.className}`}>{status.label}</span>

            <span className="flex items-center gap-1.5 text-[11px] text-ink-tertiary">
              <span className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} />
              {priority.label}
            </span>

            {task.dueDate && (
              <span className={`text-[11px] ${overdue ? 'text-danger font-medium' : 'text-ink-tertiary'}`}>
                {overdue ? 'Overdue · ' : 'Due '}{format(parseISO(task.dueDate), 'MMM d')}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
