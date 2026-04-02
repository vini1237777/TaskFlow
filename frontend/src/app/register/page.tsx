"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authApi } from "@/lib/authApi";
import { useAuthStore } from "@/store/authStore";

const pwRules = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "Uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "Lowercase letter", test: (p: string) => /[a-z]/.test(p) },
  { label: "Number", test: (p: string) => /\d/.test(p) },
];

export default function RegisterPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [isPending, startTransition] = useTransition();
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name || form.name.trim().length < 2)
      e.name = "Name must be at least 2 characters";
    if (!form.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!pwRules.every((r) => r.test(form.password)))
      e.password = "Password does not meet requirements";
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
        toast.success("Account created!");
        router.replace("/dashboard");
      } catch (err: unknown) {
        const msg =
          (err as { response?: { data?: { message?: string } } })?.response
            ?.data?.message || "Registration failed";
        toast.error(msg);
      }
    });
  };

  return (
    <div className="min-h-dvh flex items-center justify-center p-4 bg-layer">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <h1 className="font-display font-bold text-2xl text-ink">
            Create account
          </h1>
          <p className="text-ink-secondary text-sm mt-1">
            Start organizing your work today
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">
              Full name
            </label>
            <input
              type="text"
              className={`input-base ${errors.name ? "border-danger" : ""}`}
              placeholder="Jane Smith"
              value={form.name}
              onChange={(e) => {
                setForm((p) => ({ ...p, name: e.target.value }));
                setErrors((p) => ({ ...p, name: "" }));
              }}
              autoFocus
            />
            {errors.name && (
              <p className="text-danger text-xs mt-1">{errors.name}</p>
            )}
          </div>

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
              />
              <button
                type="button"
                onClick={() => setShowPw((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ink-tertiary hover:text-ink-secondary"
              >
                {showPw ? "hide" : "show"}
              </button>
            </div>

            {form.password.length > 0 && (
              <div className="mt-2 grid grid-cols-2 gap-1">
                {pwRules.map((rule) => (
                  <p
                    key={rule.label}
                    className={`text-xs ${rule.test(form.password) ? "text-jade" : "text-ink-tertiary"}`}
                  >
                    {rule.test(form.password) ? "✓" : "·"} {rule.label}
                  </p>
                ))}
              </div>
            )}
            {errors.password && (
              <p className="text-danger text-xs mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="btn-primary w-full py-2.5 mt-2"
          >
            {isPending ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="text-center text-ink-secondary text-sm mt-6">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-accent hover:underline font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
