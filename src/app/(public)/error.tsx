"use client";

import { useEffect } from "react";
import { MascotMessage } from "@/components/animated/mascot-message";
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

  const isInvalidTime =
    error.message.includes("Invalid time value") ||
    error.message.includes("Invalid time");

  const isDb =
    error.message.includes("DATABASE_URL") ||
    error.message.includes("Can't reach database") ||
    error.message.includes("P1001");

  let message =
    "Something unexpected failed. Try again, or open Book from the menu.";

  if (isBuildCache) {
    message =
      "The dev build cache may be corrupted. Stop the server, run npm run dev:clean, then reload.";
  } else if (isInvalidTime) {
    message =
      "A date on this page was invalid. Use the date picker on Book or Room KPI, or tap Try again.";
  } else if (isDb) {
    message =
      "Database connection failed. In Vercel, check DATABASE_URL and DIRECT_URL, then redeploy.";
  }

  return (
    <div className="flex min-h-[50vh] items-center justify-center py-12">
      <GlassCard className="max-w-lg p-8 sm:p-10">
        <MascotMessage
          size="md"
          title="Something went wrong"
          bubble="Don't worry — let's try again."
          description={message}
        />
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button variant="gold" onClick={() => reset()}>
            Try again
          </Button>
          <Button variant="secondary" onClick={() => window.location.assign("/book")}>
            Book a room
          </Button>
          <Button variant="secondary" onClick={() => window.location.assign("/")}>
            Home
          </Button>
        </div>
      </GlassCard>
    </div>
  );
}
