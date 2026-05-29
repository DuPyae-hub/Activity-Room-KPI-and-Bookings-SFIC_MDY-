"use client";

import Link from "next/link";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  parseISO,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils";
import type { BookingWithRelations } from "@/lib/types";

type Props = {
  month: string;
  selectedDay: string;
  bookings: BookingWithRelations[];
};

export function RoomKpiCalendar({ month, selectedDay, bookings }: Props) {
  const monthDate = parseISO(`${month}-01`);
  const selected = parseISO(selectedDay);
  const gridStart = startOfWeek(startOfMonth(monthDate), { weekStartsOn: 0 });
  const gridEnd = endOfWeek(endOfMonth(monthDate), { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

  const bookingsByDay = new Map<string, BookingWithRelations[]>();
  for (const b of bookings) {
    const key = format(new Date(b.startTime), "yyyy-MM-dd");
    const list = bookingsByDay.get(key) ?? [];
    list.push(b);
    bookingsByDay.set(key, list);
  }

  const prevMonth = format(subMonths(monthDate, 1), "yyyy-MM");
  const nextMonth = format(addMonths(monthDate, 1), "yyyy-MM");
  const today = format(new Date(), "yyyy-MM-dd");

  const dayHref = (day: Date) => {
    const d = format(day, "yyyy-MM-dd");
    const m = format(day, "yyyy-MM");
    return `/dashboard?month=${m}&day=${d}`;
  };

  return (
    <GlassCard className="p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-brand-red">Room KPI</p>
          <h2 className="text-lg font-semibold">{format(monthDate, "MMMM yyyy")}</h2>
        </div>
        <div className="flex items-center gap-1">
          <Link
            href={`/dashboard?month=${prevMonth}&day=${selectedDay}`}
            className="rounded-lg p-2 text-white/50 transition hover:bg-white/5 hover:text-white"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <Link
            href={`/dashboard?month=${month}&day=${today}`}
            className="rounded-lg px-3 py-1.5 text-xs font-medium text-white/60 ring-1 ring-white/15 transition hover:text-brand-red"
          >
            Today
          </Link>
          <Link
            href={`/dashboard?month=${nextMonth}&day=${selectedDay}`}
            className="rounded-lg p-2 text-white/50 transition hover:bg-white/5 hover:text-white"
            aria-label="Next month"
          >
            <ChevronRight className="h-5 w-5" />
          </Link>
        </div>
      </div>

      <div className="mb-2 grid grid-cols-7 gap-1 text-center text-xs font-medium text-white/40">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const key = format(day, "yyyy-MM-dd");
          const count = bookingsByDay.get(key)?.length ?? 0;
          const inMonth = isSameMonth(day, monthDate);
          const isSelected = isSameDay(day, selected);
          const isToday = isSameDay(day, new Date());

          return (
            <Link
              key={key}
              href={dayHref(day)}
              className={cn(
                "flex min-h-[4.25rem] flex-col rounded-xl border p-1.5 text-left transition",
                inMonth ? "border-white/10 bg-white/[0.03]" : "border-transparent opacity-35",
                isSelected && "border-brand-red/50 bg-brand-red/10 ring-1 ring-brand-red/30",
                !isSelected && inMonth && "hover:border-brand-red/30 hover:bg-white/[0.06]",
              )}
            >
              <span
                className={cn(
                  "text-xs font-medium",
                  isToday ? "text-brand-red" : "text-white/70",
                )}
              >
                {format(day, "d")}
              </span>
              {count > 0 && inMonth && (
                <span className="mt-auto rounded-md bg-brand-red/20 px-1 py-0.5 text-[10px] font-medium text-brand-red-light">
                  {count} session{count === 1 ? "" : "s"}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </GlassCard>
  );
}
