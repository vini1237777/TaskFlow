"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import AuthGuard from "@/components/AuthGuard";
import TaskCard from "@/components/TaskCard";
import TaskModal from "@/components/TaskModal";
import TaskFiltersBar from "@/components/TaskFiltersBar";
import TaskSkeleton from "@/components/TaskSkeleton";
import StatsBar from "@/components/StatsBar";
import Pagination from "@/components/Pagination";
import { useAuthStore } from "@/store/authStore";
import { authApi } from "@/lib/authApi";
import { useTasks } from "@/hooks/useTasks";
import type { Task } from "@/types";

export default function DashboardPage() {
  return (
    <AuthGuard>
      <Dashboard />
    </AuthGuard>
  );
}

function Dashboard() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [isLogoutPending, startLogout] = useTransition();

  const {
    tasks,
    pagination,
    filters,
    isLoading,
    isSubmitting,
    updateFilters,
    createTask,
    updateTask,
    deleteTask,
    toggleTask,
    refetch,
  } = useTasks();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const openCreate = () => {
    setEditingTask(null);
    setModalOpen(true);
  };
  const openEdit = (task: Task) => {
    setEditingTask(task);
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setEditingTask(null);
  };

  const handleSubmit = async (data: Parameters<typeof createTask>[0]) => {
    if (editingTask) return updateTask(editingTask.id, data);
    return createTask(data);
  };

  const handleLogout = () => {
    startLogout(async () => {
      try {
        await authApi.logout();
      } catch {}
      logout();
      toast.success("Logged out");
      router.push("/login");
    });
  };

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const firstName = user?.name?.split(" ")[0] || "";

  return (
    <div className="min-h-dvh bg-layer">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-edge">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-sm text-ink">
              TaskFlow
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => refetch()}
              className="text-xs text-ink-secondary hover:text-ink px-2 py-1 rounded hover:bg-layer-3 transition-colors"
            >
              {isLoading ? "Loading..." : "Refresh"}
            </button>
            <span className="text-ink-tertiary text-xs hidden sm:block">
              {user?.email}
            </span>
            <button
              onClick={handleLogout}
              disabled={isLogoutPending}
              className="btn-ghost py-1.5 px-3 text-xs"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-ink-tertiary text-sm">{greeting},</p>
            <h1 className="font-display font-bold text-2xl text-ink mt-0.5">
              {firstName}
            </h1>
            <p className="text-ink-secondary text-sm mt-1">
              {pagination?.total === 0
                ? "No tasks yet — create one to get started"
                : pagination
                  ? `${pagination.total} task${pagination.total !== 1 ? "s" : ""} total`
                  : ""}
            </p>
          </div>
          <button onClick={openCreate} className="btn-primary flex-shrink-0">
            + New task
          </button>
        </div>

        {!isLoading && tasks.length > 0 && pagination && (
          <StatsBar tasks={tasks} total={pagination.total} />
        )}

        <TaskFiltersBar
          filters={filters}
          onChange={updateFilters}
          total={pagination?.total}
        />

        {isLoading ? (
          <TaskSkeleton />
        ) : tasks.length === 0 ? (
          <div className="card flex flex-col items-center justify-center py-16 text-center">
            <p className="font-medium text-ink mb-1">
              {filters.status || filters.priority || filters.search
                ? "No tasks match your filters"
                : "No tasks yet"}
            </p>
            <p className="text-ink-tertiary text-sm mb-5">
              {filters.status || filters.priority || filters.search
                ? "Try clearing the filters"
                : "Create your first task to get started"}
            </p>
            {filters.status || filters.priority || filters.search ? (
              <button
                onClick={() =>
                  updateFilters({ status: "", priority: "", search: "" })
                }
                className="btn-ghost"
              >
                Clear filters
              </button>
            ) : (
              <button onClick={openCreate} className="btn-primary">
                + Create task
              </button>
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
          <Pagination
            pagination={pagination}
            onPageChange={(page) => updateFilters({ page })}
          />
        )}
      </main>

      <TaskModal
        open={modalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        task={editingTask}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
