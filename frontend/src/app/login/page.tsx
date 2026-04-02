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
    <div className="min-h-dvh flex items-center justify-center p-4 bg-layer">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <h1 className="font-display font-bold text-2xl text-ink">TaskFlow</h1>
          <p className="text-ink-secondary text-sm mt-1">
            Sign in to your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">
              Email
            </label>
            <input
              type="email"
              className={`input-base ${errors.email ? "border-danger" : ""}`}
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => {
                setForm((p) => ({ ...p, email: e.target.value }));
                setErrors((p) => ({ ...p, email: "" }));
              }}
              autoComplete="email"
              autoFocus
            />
            {errors.email && (
              <p className="text-danger text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                className={`input-base pr-16 ${errors.password ? "border-danger" : ""}`}
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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ink-tertiary hover:text-ink-secondary"
              >
                {showPw ? "hide" : "show"}
              </button>
            </div>
            {errors.password && (
              <p className="text-danger text-xs mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="btn-primary w-full py-2.5 mt-2"
          >
            {isPending ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="text-center text-ink-secondary text-sm mt-6">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-accent hover:underline font-medium"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
