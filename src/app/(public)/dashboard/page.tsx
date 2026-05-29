import Link from "next/link";
import { endOfMonth, format, isValid, parseISO } from "date-fns";
import { CalendarPlus } from "lucide-react";
import { RoomKpiCalendar } from "@/components/dashboard/room-kpi-calendar";
import { RoomScheduleGrid } from "@/components/dashboard/room-schedule-grid";
import { TimelineView } from "@/components/dashboard/timeline-view";
import { DbErrorBanner } from "@/components/layout/db-error-banner";
import { PageHeader } from "@/components/layout/page-header";
import { TimezoneNotice } from "@/components/layout/timezone-notice";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import {
  getApprovedBookingsBetween,
  getRooms,
  getTodayTimeline,
} from "@/data/queries";
import { ensureDynamicPage } from "@/lib/ensure-dynamic";
import { isDbConnectionError } from "@/lib/safe-query";
import {
  currentMonthInAppTz,
  endOfDayInAppTz,
  formatDateOnlyInAppTz,
  startOfDayInAppTz,
  todayInAppTz,
} from "@/lib/timezone";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function parseMonthParam(value: string | undefined): string {
  if (value && /^\d{4}-\d{2}$/.test(value)) return value;
  return currentMonthInAppTz();
}

function parseDayParam(value: string | undefined, month: string): string {
  if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const d = parseISO(value);
    if (isValid(d)) return value;
  }
  const today = todayInAppTz();
  if (today.startsWith(month)) return today;
  return `${month}-01`;
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; day?: string }>;
}) {
  await ensureDynamicPage();

  const params = await searchParams;
  const month = parseMonthParam(params.month);
  const selectedDay = parseDayParam(params.day, month);
  const monthStart = startOfDayInAppTz(`${month}-01`);
  const monthEnd = endOfDayInAppTz(
    format(endOfMonth(parseISO(`${month}-01`)), "yyyy-MM-dd"),
  );
  const selectedDate = parseISO(selectedDay);

  let monthBookings: Awaited<ReturnType<typeof getApprovedBookingsBetween>> = [];
  let dayTimeline: Awaited<ReturnType<typeof getTodayTimeline>> = [];
  let rooms: Awaited<ReturnType<typeof getRooms>> = [];
  let dbError = false;

  try {
    [monthBookings, dayTimeline, rooms] = await Promise.all([
      getApprovedBookingsBetween(monthStart, monthEnd),
      getTodayTimeline(selectedDate),
      getRooms(),
    ]);
  } catch (error) {
    if (isDbConnectionError(error)) dbError = true;
    else throw error;
  }

  const sessionsOnSelectedDay = dayTimeline.length;

  return (
    <div>
      <PageHeader
        eyebrow="Live schedule"
        title="Room KPI"
        description={
          <>
            See approved club sessions across all activity rooms. Pick a day on the calendar for
            the room-by-room schedule. <TimezoneNotice className="mt-2" />
          </>
        }
        actions={
          <Link href="/book">
            <Button variant="gold">
              <CalendarPlus className="h-4 w-4" />
              Book a room
            </Button>
          </Link>
        }
      />

      {dbError && <DbErrorBanner />}

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <GlassCard className="p-5">
          <p className="text-sm text-foreground-muted">This month (approved)</p>
          <p className="mt-1 text-3xl font-bold text-brand-red">{monthBookings.length}</p>
        </GlassCard>
        <GlassCard className="p-5">
          <p className="text-sm text-foreground-muted">Selected day</p>
          <p className="mt-1 text-3xl font-bold text-brand-red">{sessionsOnSelectedDay}</p>
          <p className="mt-1 text-xs text-foreground-subtle">
            {formatDateOnlyInAppTz(selectedDay, "MMM d, yyyy")}
          </p>
        </GlassCard>
        <GlassCard className="flex items-center justify-between p-5">
          <div>
            <p className="text-sm text-foreground-muted">No login required</p>
            <p className="font-medium">Reserve a room</p>
          </div>
          <Link href="/book">
            <Button variant="gold" size="sm">
              <CalendarPlus className="h-4 w-4" />
              Book
            </Button>
          </Link>
        </GlassCard>
      </div>

      {!dbError && (
      <>
      <div className="mb-8">
        <RoomKpiCalendar
          month={month}
          selectedDay={selectedDay}
          bookings={monthBookings}
        />
      </div>

      <div className="mb-8">
        <RoomScheduleGrid
          day={selectedDay}
          rooms={rooms.map((r) => ({ id: r.id, name: r.name }))}
          bookings={monthBookings}
        />
      </div>

      <h2 className="mb-4 text-lg font-semibold">Day timeline</h2>
      <TimelineView bookings={dayTimeline} />
      </>
      )}
    </div>
  );
}
