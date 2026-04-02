import { api } from './api';
import type { Task, TaskFormData, TaskFilters, TasksResponse } from '@/types';

export const tasksApi = {
  getAll: async (filters: TaskFilters = {}): Promise<TasksResponse> => {
    const params = new URLSearchParams();
    if (filters.page) params.set('page', String(filters.page));
    if (filters.limit) params.set('limit', String(filters.limit));
    if (filters.status) params.set('status', filters.status);
    if (filters.priority) params.set('priority', filters.priority);
    if (filters.search) params.set('search', filters.search);
    if (filters.sortBy) params.set('sortBy', filters.sortBy);
    if (filters.sortOrder) params.set('sortOrder', filters.sortOrder);

    const { data } = await api.get<TasksResponse>(`/tasks?${params.toString()}`);
    return data;
  },

  getOne: async (id: string): Promise<Task> => {
    const { data } = await api.get<{ data: { task: Task } }>(`/tasks/${id}`);
    return data.data.task;
  },

  create: async (payload: TaskFormData): Promise<Task> => {
    const { data } = await api.post<{ data: { task: Task } }>('/tasks', payload);
    return data.data.task;
  },

  update: async (id: string, payload: Partial<TaskFormData>): Promise<Task> => {
    const { data } = await api.patch<{ data: { task: Task } }>(`/tasks/${id}`, payload);
    return data.data.task;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },

  toggle: async (id: string): Promise<Task> => {
    const { data } = await api.post<{ data: { task: Task } }>(`/tasks/${id}/toggle`);
    return data.data.task;
  },
};
