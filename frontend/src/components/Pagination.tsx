'use client';

import type { PaginationMeta } from '@/types';

interface Props {
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
}

export default function Pagination({ pagination, onPageChange }: Props) {
  const { page, totalPages, hasNext, hasPrev, total, limit } = pagination;
  if (totalPages <= 1) return null;

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  const pages: (number | '...')[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push('...');
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
    if (page < totalPages - 2) pages.push('...');
    pages.push(totalPages);
  }

  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-xs text-ink-tertiary hidden sm:block">{from}–{to} of {total}</span>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPrev}
          className="px-3 py-1.5 text-xs border border-edge rounded-lg text-ink-secondary hover:bg-layer-3 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          Prev
        </button>

        {pages.map((p, i) =>
          p === '...' ? (
            <span key={`e${i}`} className="px-2 text-ink-tertiary text-xs">...</span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p as number)}
              className={`w-8 h-8 text-xs rounded-lg transition-colors ${
                p === page
                  ? 'bg-accent text-white font-medium'
                  : 'border border-edge text-ink-secondary hover:bg-layer-3'
              }`}
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNext}
          className="px-3 py-1.5 text-xs border border-edge rounded-lg text-ink-secondary hover:bg-layer-3 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}
