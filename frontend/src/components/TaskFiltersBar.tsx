'use client';

import { useState, useCallback } from 'react';
import type { TaskFilters, TaskStatus, TaskPriority } from '@/types';

interface Props {
  filters: TaskFilters;
  onChange: (f: Partial<TaskFilters>) => void;
  total?: number;
}

export default function TaskFiltersBar({ filters, onChange, total }: Props) {
  const [searchInput, setSearchInput] = useState(filters.search || '');
  const [timer, setTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = useCallback((value: string) => {
    setSearchInput(value);
    if (timer) clearTimeout(timer);
    const t = setTimeout(() => onChange({ search: value, page: 1 }), 350);
    setTimer(t);
  }, [timer, onChange]);

  const hasFilters = filters.status || filters.priority || filters.search;

  return (
    <div className="space-y-2">
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          className="input-base flex-1"
          placeholder="Search tasks..."
          value={searchInput}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <select
          className="input-base sm:w-36"
          value={filters.status || ''}
          onChange={(e) => onChange({ status: e.target.value as TaskStatus | '', page: 1 })}
        >
          <option value="">All status</option>
          <option value="PENDING">Pending</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
        </select>
        <select
          className="input-base sm:w-32"
          value={filters.priority || ''}
          onChange={(e) => onChange({ priority: e.target.value as TaskPriority | '', page: 1 })}
        >
          <option value="">All priority</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>
        <select
          className="input-base sm:w-40"
          value={filters.sortBy || 'createdAt'}
          onChange={(e) => onChange({ sortBy: e.target.value, page: 1 })}
        >
          <option value="createdAt">Newest first</option>
          <option value="dueDate">Due date</option>
          <option value="priority">Priority</option>
          <option value="title">Title A–Z</option>
        </select>
      </div>

      {(hasFilters || total !== undefined) && (
        <div className="flex items-center justify-between text-xs text-ink-tertiary">
          <span>
            {total !== undefined && <>{total} task{total !== 1 ? 's' : ''}</>}
            {hasFilters && ' · filtered'}
          </span>
          {hasFilters && (
            <button
              onClick={() => { setSearchInput(''); onChange({ status: '', priority: '', search: '', page: 1 }); }}
              className="text-accent hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
