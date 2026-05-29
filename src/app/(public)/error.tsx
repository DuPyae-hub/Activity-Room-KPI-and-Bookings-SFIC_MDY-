"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";

export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const isBuildCache =
    error.message.includes("ENOENT") ||
    error.message.includes("_buildManifest");

  return (
    <div className="flex min-h-[50vh] items-center justify-center py-12">
      <GlassCard className="max-w-lg p-8 text-center">
        <h2 className="text-xl font-semibold text-brand-red">Something went wrong</h2>
        <p className="mt-3 text-sm text-white/55">
          {isBuildCache
            ? "The dev build cache may be corrupted. Stop the server, run npm run dev:clean, then reload."
            : "We could not load this page. Check your database connection with npm run db:check."}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button variant="gold" onClick={() => reset()}>
            Try again
          </Button>
          <Button variant="secondary" onClick={() => window.location.assign("/dashboard")}>
            Dashboard
          </Button>
        </div>
      </GlassCard>
    </div>
  );
}
