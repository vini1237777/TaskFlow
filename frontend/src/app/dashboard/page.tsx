'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import AuthGuard from '@/components/AuthGuard';
import TaskCard from '@/components/TaskCard';
import TaskModal from '@/components/TaskModal';
import TaskFiltersBar from '@/components/TaskFiltersBar';
import TaskSkeleton from '@/components/TaskSkeleton';
import StatsBar from '@/components/StatsBar';
import Pagination from '@/components/Pagination';
import { useAuthStore } from '@/store/authStore';
import { authApi } from '@/lib/authApi';
import { useTasks } from '@/hooks/useTasks';
import type { Task } from '@/types';

export default function DashboardPage() {
  return <AuthGuard><Dashboard /></AuthGuard>;
}

function Dashboard() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [isLogoutPending, startLogout] = useTransition();

  const { tasks, pagination, filters, isLoading, isSubmitting, updateFilters, createTask, updateTask, deleteTask, toggleTask, refetch } = useTasks();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const openCreate = () => { setEditingTask(null); setModalOpen(true); };
  const openEdit = (task: Task) => { setEditingTask(task); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditingTask(null); };

  const handleSubmit = async (data: Parameters<typeof createTask>[0]) => {
    if (editingTask) return updateTask(editingTask.id, data);
    return createTask(data);
  };

  const handleLogout = () => {
    startLogout(async () => {
      try { await authApi.logout(); } catch { }
      logout();
      toast.success('Logged out');
      router.push('/login');
    });
  };

  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?';

  return (
    <div className="min-h-dvh bg-layer">
      <header className="sticky top-0 z-40 glass-nav">
        <div className="max-w-4xl mx-auto px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 bg-accent rounded-md flex-shrink-0" />
            <span className="font-display font-bold text-sm text-ink">TaskFlow</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => refetch()}
              className="text-xs text-ink-tertiary hover:text-ink-secondary px-2.5 py-1.5 rounded-lg hover:bg-layer-2 transition-all border border-transparent hover:border-edge"
            >
              {isLoading ? 'Loading...' : 'Refresh'}
            </button>

            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-layer-2 rounded-xl border border-edge">
              <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center text-white text-[10px] font-bold font-display">
                {initials}
              </div>
              <span className="text-xs text-ink-secondary max-w-[120px] truncate">{user?.name}</span>
            </div>

            <button onClick={handleLogout} disabled={isLogoutPending} className="btn-ghost py-1.5 px-3 text-xs">
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-5 py-10 space-y-7">
        <div className="flex items-end justify-between gap-4 animate-in stagger-1">
          <div>
            <p className="text-ink-tertiary text-sm mb-0.5">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
            <h1 className="font-display font-bold text-3xl text-ink">My tasks</h1>
          </div>
          <button onClick={openCreate} className="btn-primary flex-shrink-0">
            + New task
          </button>
        </div>

        {!isLoading && tasks.length > 0 && pagination && (
          <div className="animate-in stagger-2">
            <StatsBar tasks={tasks} total={pagination.total} />
          </div>
        )}

        <div className="animate-in stagger-3">
          <TaskFiltersBar filters={filters} onChange={updateFilters} total={pagination?.total} />
        </div>

        <div className="animate-in stagger-4">
          {isLoading ? (
            <TaskSkeleton />
          ) : tasks.length === 0 ? (
            <div className="card flex flex-col items-center justify-center py-20 text-center">
              <div className="w-12 h-12 bg-layer-2 rounded-2xl flex items-center justify-center mb-4 border border-edge text-2xl">
                ✓
              </div>
              <p className="font-display font-semibold text-ink mb-1.5">
                {filters.status || filters.priority || filters.search ? 'No tasks match your filters' : 'No tasks yet'}
              </p>
              <p className="text-ink-tertiary text-sm mb-6 max-w-xs">
                {filters.status || filters.priority || filters.search
                  ? 'Try adjusting your filters to see more tasks.'
                  : 'Create your first task and start getting things done.'}
              </p>
              {(filters.status || filters.priority || filters.search) ? (
                <button onClick={() => updateFilters({ status: '', priority: '', search: '' })} className="btn-ghost">Clear filters</button>
              ) : (
                <button onClick={openCreate} className="btn-primary">+ Create task</button>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {tasks.map((task, i) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggle={toggleTask}
                  onEdit={openEdit}
                  onDelete={deleteTask}
                  style={{ animationDelay: `${i * 0.04}s` }}
                />
              ))}
            </div>
          )}

          {pagination && pagination.totalPages > 1 && (
            <div className="mt-6">
              <Pagination pagination={pagination} onPageChange={page => updateFilters({ page })} />
            </div>
          )}
        </div>
      </main>

      <TaskModal open={modalOpen} onClose={closeModal} onSubmit={handleSubmit} task={editingTask} isSubmitting={isSubmitting} />
    </div>
  );
}
