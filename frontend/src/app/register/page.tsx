'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { authApi } from '@/lib/authApi';
import { useAuthStore } from '@/store/authStore';

const pwRules = [
  { label: '8+ characters', test: (p: string) => p.length >= 8 },
  { label: 'Uppercase', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'Lowercase', test: (p: string) => /[a-z]/.test(p) },
  { label: 'Number', test: (p: string) => /\d/.test(p) },
];

export default function RegisterPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [isPending, startTransition] = useTransition();
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name || form.name.trim().length < 2) e.name = 'Name must be at least 2 characters';
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!pwRules.every(r => r.test(form.password))) e.password = 'Password does not meet all requirements';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    startTransition(async () => {
      try {
        const res = await authApi.register(form);
        setUser(res.data.user);
        toast.success('Account created!');
        router.replace('/dashboard');
      } catch (err: unknown) {
        const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Registration failed';
        toast.error(msg);
      }
    });
  };

  const pwStrength = pwRules.filter(r => r.test(form.password)).length;

  return (
    <div className="min-h-dvh flex">
      <div className="hidden lg:flex flex-1 bg-accent flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-accent rounded-sm" />
          </div>
          <span className="font-display font-bold text-white text-lg">TaskFlow</span>
        </div>
        <div>
          <p className="text-white/60 text-sm mb-3 font-mono uppercase tracking-widest">Get started today</p>
          <p className="text-white font-display font-bold text-4xl leading-tight">
            Your work,<br />organized.
          </p>
          <p className="text-white/70 text-base mt-4 leading-relaxed max-w-xs">
            Create tasks, track progress, and stay in flow — all in one place.
          </p>
        </div>
        <p className="text-white/40 text-xs">Free to use. No credit card required.</p>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-10">
            <div className="w-7 h-7 bg-accent rounded-lg" />
            <span className="font-display font-bold text-ink">TaskFlow</span>
          </div>

          <h1 className="font-display font-bold text-2xl text-ink mb-1">Create your account</h1>
          <p className="text-ink-secondary text-sm mb-8">Free forever. No credit card required.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">Full name</label>
              <input
                type="text"
                className={`input-base ${errors.name ? 'border-danger ring-2 ring-danger/20' : ''}`}
                placeholder="Jane Smith"
                value={form.name}
                onChange={e => { setForm(p => ({ ...p, name: e.target.value })); setErrors(p => ({ ...p, name: '' })); }}
                autoFocus
              />
              {errors.name && <p className="text-danger text-xs mt-1.5">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">Work email</label>
              <input
                type="email"
                className={`input-base ${errors.email ? 'border-danger ring-2 ring-danger/20' : ''}`}
                placeholder="you@company.com"
                value={form.email}
                onChange={e => { setForm(p => ({ ...p, email: e.target.value })); setErrors(p => ({ ...p, email: '' })); }}
              />
              {errors.email && <p className="text-danger text-xs mt-1.5">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  className={`input-base pr-14 ${errors.password ? 'border-danger ring-2 ring-danger/20' : ''}`}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => { setForm(p => ({ ...p, password: e.target.value })); setErrors(p => ({ ...p, password: '' })); }}
                />
                <button type="button" onClick={() => setShowPw(s => !s)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-ink-tertiary hover:text-ink-secondary font-medium transition-colors">
                  {showPw ? 'Hide' : 'Show'}
                </button>
              </div>

              {form.password.length > 0 && (
                <div className="mt-2.5 space-y-1.5">
                  <div className="flex gap-1">
                    {[1,2,3,4].map(i => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= pwStrength ? pwStrength <= 1 ? 'bg-danger' : pwStrength <= 2 ? 'bg-gold' : pwStrength <= 3 ? 'bg-gold' : 'bg-jade' : 'bg-layer-3'}`} />
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-x-3 gap-y-1">
                    {pwRules.map(r => (
                      <span key={r.label} className={`text-xs transition-colors ${r.test(form.password) ? 'text-jade' : 'text-ink-tertiary'}`}>
                        {r.test(form.password) ? '✓' : '·'} {r.label}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {errors.password && <p className="text-danger text-xs mt-1.5">{errors.password}</p>}
            </div>

            <button type="submit" disabled={isPending} className="btn-primary w-full py-3 mt-2">
              {isPending ? 'Creating account...' : 'Create free account'}
            </button>

            <p className="text-center text-xs text-ink-tertiary">
              By signing up you agree to our Terms of Service.
            </p>
          </form>

          <div className="mt-6 pt-6 border-t border-edge text-center">
            <p className="text-ink-secondary text-sm">
              Already have an account?{' '}
              <Link href="/login" className="text-accent font-medium hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
