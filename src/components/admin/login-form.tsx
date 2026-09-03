"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogIn, Lock } from "lucide-react";
import { adminLogin, type ActionResult } from "@/app/actions";
import { Button, Field, Input } from "@/components/ui";

const initialState: ActionResult = { ok: false, error: "" };

export function AdminLoginForm() {
  const [state, formAction] = useActionState(adminLogin, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state.ok) router.push("/admin/dashboard");
  }, [state.ok, router]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <form
          action={formAction}
          className="rounded-3xl border border-ink-900/5 bg-white p-8 shadow-2xl"
        >
          <span className="flex size-12 items-center justify-center rounded-2xl bg-navy-900 text-gold-400">
            <Lock size={22} />
          </span>
          <h1 className="mt-4 font-display text-2xl font-semibold text-navy-900">
            Command Center
          </h1>
          <p className="mt-1 text-sm text-ink-500">
            Private access for the property agent only.
          </p>
          <div className="mt-6 space-y-4">
            <Field label="Username" htmlFor="username">
              <Input
                id="username"
                name="username"
                autoCapitalize="none"
                autoComplete="username"
                placeholder="owner"
              />
            </Field>
            <Field label="Password" htmlFor="password">
              <Input
                id="password"
                name="password"
                type="password"
                required
                autoFocus
                autoComplete="current-password"
                placeholder="Enter dashboard password"
              />
            </Field>
          </div>
          {state.ok === false && state.error ? (
            <p className="mt-3 text-sm text-danger">{state.error}</p>
          ) : null}
          <Button type="submit" variant="navy" size="lg" className="mt-5 w-full">
            <LogIn size={18} /> Sign In
          </Button>
          <p className="mt-4 text-center text-xs text-ink-400">
            Default password: <code className="rounded bg-cream-100 px-1.5 py-0.5">monrovia2026</code>
          </p>
        </form>
        <p className="mt-4 text-center text-xs text-ink-400">
          Configure via <code className="rounded bg-cream-100 px-1.5 py-0.5">ADMIN_PASSWORD</code> in production.
        </p>
      </div>
    </div>
  );
}