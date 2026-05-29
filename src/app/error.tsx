"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const isChunkLoad =
    error.name === "ChunkLoadError" ||
    error.message.includes("Loading chunk") ||
    error.message.includes("ChunkLoadError");

  const isBuildCache =
    error.message.includes("ENOENT") ||
    error.message.includes("_buildManifest");

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4 py-12">
      <GlassCard className="max-w-lg p-8 text-center">
        <h2 className="text-xl font-semibold text-brand-red">Something went wrong</h2>
        <p className="mt-3 text-sm text-foreground-muted">
          {isChunkLoad || isBuildCache
            ? "The app was updated while this tab was open. Hard-refresh the page (Cmd+Shift+R), or stop the server and run npm run dev:clean."
            : "We could not load this page. Try again or return to the dashboard."}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button
            variant="gold"
            onClick={() => {
              if (isChunkLoad || isBuildCache) {
                window.location.reload();
                return;
              }
              reset();
            }}
          >
            Reload page
          </Button>
          <Button variant="secondary" onClick={() => window.location.assign("/dashboard")}>
            Dashboard
          </Button>
        </div>
      </GlassCard>
    </div>
  );
}
