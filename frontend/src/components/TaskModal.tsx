'use client';

import { useEffect, useState } from 'react';
import type { Task, TaskFormData, TaskPriority, TaskStatus } from '@/types';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: TaskFormData) => Promise<boolean>;
  task?: Task | null;
  isSubmitting?: boolean;
}

const defaultForm: TaskFormData = { title: '', description: '', status: 'PENDING', priority: 'MEDIUM', dueDate: '' };

export default function TaskModal({ open, onClose, onSubmit, task, isSubmitting }: Props) {
  const [form, setForm] = useState<TaskFormData>(defaultForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (task) {
      setForm({ title: task.title, description: task.description || '', status: task.status, priority: task.priority, dueDate: task.dueDate ? task.dueDate.split('T')[0] : '' });
    } else {
      setForm(defaultForm);
    }
    setErrors({});
  }, [task, open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = 'Title is required';
    else if (form.title.length > 200) e.title = 'Max 200 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const ok = await onSubmit({ ...form, dueDate: form.dueDate || undefined, description: form.description || undefined });
    if (ok) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="absolute inset-0 bg-ink/20 backdrop-blur-[2px]" />

      <div className="relative w-full max-w-md bg-white rounded-2xl p-6 animate-[scaleIn_0.2s_cubic-bezier(0.16,1,0.3,1)_forwards]" style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06)' }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display font-bold text-ink">{task ? 'Edit task' : 'New task'}</h2>
            <p className="text-ink-tertiary text-xs mt-0.5">{task ? 'Update the details below' : 'Add a new task to your board'}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-layer-2 text-ink-tertiary hover:text-ink transition-colors text-lg leading-none">×</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">Task title</label>
            <input
              className={`input-base ${errors.title ? 'border-danger ring-2 ring-danger/20' : ''}`}
              placeholder="What needs to be done?"
              value={form.title}
              onChange={e => { setForm(p => ({ ...p, title: e.target.value })); setErrors(p => ({ ...p, title: '' })); }}
              autoFocus
            />
            {errors.title && <p className="text-danger text-xs mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">Description <span className="text-ink-tertiary font-normal">(optional)</span></label>
            <textarea
              className="input-base resize-none h-20"
              placeholder="Add details, links, or notes..."
              value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">Status</label>
              <select className="input-base" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value as TaskStatus }))}>
                <option value="PENDING">To do</option>
                <option value="IN_PROGRESS">In progress</option>
                <option value="COMPLETED">Done</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">Priority</label>
              <select className="input-base" value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value as TaskPriority }))}>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">Due date <span className="text-ink-tertiary font-normal">(optional)</span></label>
            <input type="date" className="input-base" value={form.dueDate} min={new Date().toISOString().split('T')[0]} onChange={e => setForm(p => ({ ...p, dueDate: e.target.value }))} />
          </div>

          <div className="flex gap-2.5 pt-2">
            <button type="button" onClick={onClose} className="btn-ghost flex-1">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="btn-primary flex-1">
              {isSubmitting ? 'Saving...' : task ? 'Save changes' : 'Create task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
