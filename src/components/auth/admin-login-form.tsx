"use client";

import { useActionState } from "react";
import { motion } from "framer-motion";
import { adminLoginAction, type AuthActionState } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";

const initialState: AuthActionState = {};

type AdminLoginFormProps = {
  next?: string;
};

export function AdminLoginForm({ next }: AdminLoginFormProps) {
  const [state, formAction, pending] = useActionState(adminLoginAction, initialState);
  const safeNext =
    next && next.startsWith("/admin") ? next : undefined;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md"
    >
      <GlassCard gradient className="p-6">
        <form action={formAction} className="space-y-4">
          {safeNext && <input type="hidden" name="next" value={safeNext} />}
          <label className="block">
            <span className="text-sm font-medium text-white/80">Admin password</span>
            <input
              id="admin-password"
              type="password"
              name="password"
              required
              autoComplete="current-password"
              aria-describedby="admin-password-hint"
              className="mt-2 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/45 outline-none transition focus:border-brand-red/60 focus:ring-2 focus:ring-brand-red/25"
              placeholder="Enter ADMIN_PASSWORD from .env"
            />
            <p id="admin-password-hint" className="mt-2 text-xs leading-relaxed text-white/45">
              Use the same value as{" "}
              <code className="rounded bg-white/10 px-1 py-0.5 text-brand-red/90">
                ADMIN_PASSWORD
              </code>{" "}
              in your project{" "}
              <code className="rounded bg-white/10 px-1 py-0.5 text-white/70">.env</code> file.
              Restart the dev server after changing it.
            </p>
          </label>
          {state.error && <p className="text-sm text-red-400">{state.error}</p>}
          <Button type="submit" variant="gold" className="w-full" disabled={pending}>
            {pending ? "Signing in…" : "Enter console"}
          </Button>
        </form>
      </GlassCard>
    </motion.div>
  );
}
