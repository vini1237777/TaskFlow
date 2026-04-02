"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authApi } from "@/lib/authApi";
import { useAuthStore } from "@/store/authStore";

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [isPending, startTransition] = useTransition();
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password) e.password = "Password is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    startTransition(async () => {
      try {
        const res = await authApi.login(form);
        setUser(res.data.user);
        toast.success(`Welcome back, ${res.data.user.name.split(" ")[0]}!`);
        router.replace("/dashboard");
      } catch (err: unknown) {
        const msg =
          (err as { response?: { data?: { message?: string } } })?.response
            ?.data?.message || "Login failed";
        toast.error(msg);
      }
    });
  };

  return (
    <div className="min-h-dvh flex">
      <div className="hidden lg:flex flex-1 bg-accent flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-accent rounded-sm" />
          </div>
          <span className="font-display font-bold text-white text-lg">
            TaskFlow
          </span>
        </div>
        <div>
          <p className="text-white font-display font-bold text-4xl leading-tight">
            Stay on top of
            <br />
            everything that
            <br />
            matters.
          </p>
          <p className="text-white/60 text-base mt-4 leading-relaxed max-w-xs">
            Plan your work, track progress, and get things done, all in one
            place.
          </p>
        </div>
        <div className="flex gap-4">
          {["Plan", "Track", "Ship"].map((w) => (
            <div
              key={w}
              className="px-4 py-2 bg-white/10 rounded-xl text-white text-sm font-medium border border-white/20"
            >
              {w}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-10">
            <div className="w-7 h-7 bg-accent rounded-lg" />
            <span className="font-display font-bold text-ink">TaskFlow</span>
          </div>

          <h1 className="font-display font-bold text-2xl text-ink mb-1">
            Sign in
          </h1>
          <p className="text-ink-secondary text-sm mb-8">
            Welcome back — let&apos;s pick up where you left off.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">
                Email address
              </label>
              <input
                type="email"
                className={`input-base ${errors.email ? "border-danger ring-2 ring-danger/20" : ""}`}
                placeholder="you@company.com"
                value={form.email}
                onChange={(e) => {
                  setForm((p) => ({ ...p, email: e.target.value }));
                  setErrors((p) => ({ ...p, email: "" }));
                }}
                autoComplete="email"
                autoFocus
              />
              {errors.email && (
                <p className="text-danger text-xs mt-1.5">{errors.email}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-ink">Password</label>
              </div>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  className={`input-base pr-14 ${errors.password ? "border-danger ring-2 ring-danger/20" : ""}`}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => {
                    setForm((p) => ({ ...p, password: e.target.value }));
                    setErrors((p) => ({ ...p, password: "" }));
                  }}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-ink-tertiary hover:text-ink-secondary font-medium transition-colors"
                >
                  {showPw ? "Hide" : "Show"}
                </button>
              </div>
              {errors.password && (
                <p className="text-danger text-xs mt-1.5">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="btn-primary w-full py-3 mt-2"
            >
              {isPending ? "Signing in..." : "Continue"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-edge text-center">
            <p className="text-ink-secondary text-sm">
              No account?{" "}
              <Link
                href="/register"
                className="text-accent font-medium hover:underline"
              >
                Sign up free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
