import Link from "next/link";
import { format } from "date-fns";
import { CalendarPlus } from "lucide-react";
import { TimelineView } from "@/components/dashboard/timeline-view";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { getTodayTimeline } from "@/data/queries";
import { ensureDynamicPage } from "@/lib/ensure-dynamic";
import { isDbConnectionError } from "@/lib/safe-query";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardPage() {
  await ensureDynamicPage();

  const today = new Date();
  let timeline: Awaited<ReturnType<typeof getTodayTimeline>> = [];
  let dbError = false;

  try {
    timeline = await getTodayTimeline(today);
  } catch (error) {
    if (isDbConnectionError(error)) dbError = true;
    else throw error;
  }

  return (
    <div>
      <header className="mb-8">
        <p className="text-sm text-brand-red">Club activity rooms</p>
        <h1 className="text-3xl font-bold tracking-tight">Today&apos;s schedule</h1>
        <p className="mt-1 text-white/50">
          {format(today, "EEEE, MMMM d, yyyy")} — approved room allocations across all clubs
        </p>
      </header>

      {dbError && (
        <GlassCard className="mb-6 border-brand-red/30 bg-brand-red/10 p-4 text-sm text-brand-red-light">
          Database unreachable. In terminal run:{" "}
          <code className="text-white">npm run db:check</code> then{" "}
          <code className="text-white">npm run fresh</code> (uses Session pooler in .env).
        </GlassCard>
      )}

      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <GlassCard className="p-5">
          <p className="text-sm text-white/50">Today&apos;s sessions</p>
          <p className="mt-1 text-3xl font-bold text-brand-red">{timeline.length}</p>
        </GlassCard>
        <GlassCard className="flex items-center justify-between p-5">
          <div>
            <p className="text-sm text-white/50">No login required</p>
            <p className="font-medium">Reserve a room for your club</p>
          </div>
          <Link href="/book">
            <Button variant="gold" size="sm">
              <CalendarPlus className="h-4 w-4" />
              Book
            </Button>
          </Link>
        </GlassCard>
      </div>

      <h2 className="mb-4 text-lg font-semibold">Timeline</h2>
      <TimelineView bookings={timeline} />
    </div>
  );
}
