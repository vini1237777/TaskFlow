'use client';

import { useState, useCallback, useEffect } from 'react';
import toast from 'react-hot-toast';
import { tasksApi } from '@/lib/tasksApi';
import type { Task, TaskFormData, TaskFilters, PaginationMeta } from '@/types';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [filters, setFilters] = useState<TaskFilters>({ page: 1, limit: 10 });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTasks = useCallback(async (f?: TaskFilters) => {
    setIsLoading(true);
    try {
      const activeFilters = f || filters;
      const res = await tasksApi.getAll(activeFilters);
      setTasks(res.data.tasks);
      setPagination(res.data.pagination);
    } catch {
      toast.error('Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filters)]);

  const updateFilters = useCallback((newFilters: Partial<TaskFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: newFilters.page ?? 1 }));
  }, []);

  const createTask = async (data: TaskFormData): Promise<boolean> => {
    setIsSubmitting(true);
    try {
      await tasksApi.create(data);
      await fetchTasks();
      toast.success('Task created!');
      return true;
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to create task';
      toast.error(msg);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateTask = async (id: string, data: Partial<TaskFormData>): Promise<boolean> => {
    setIsSubmitting(true);
    try {
      const updated = await tasksApi.update(id, data);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      toast.success('Task updated!');
      return true;
    } catch {
      toast.error('Failed to update task');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteTask = async (id: string): Promise<boolean> => {
    try {
      await tasksApi.delete(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      if (pagination) setPagination((p) => p ? { ...p, total: p.total - 1 } : p);
      toast.success('Task deleted');
      return true;
    } catch {
      toast.error('Failed to delete task');
      return false;
    }
  };

  const toggleTask = async (id: string): Promise<void> => {
    try {
      const updated = await tasksApi.toggle(id);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      toast.success(updated.status === 'COMPLETED' ? 'Marked complete ✓' : 'Marked pending');
    } catch {
      toast.error('Failed to update task');
    }
  };

  return {
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
    refetch: fetchTasks,
  };
}
