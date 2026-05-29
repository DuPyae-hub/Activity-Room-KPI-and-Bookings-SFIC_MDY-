"use client";

import { format, isSameDay, parseISO } from "date-fns";
import { GlassCard } from "@/components/ui/glass-card";
import { BOOKING_END_HOUR, BOOKING_START_HOUR, formatHourLabel } from "@/lib/booking-hours";
import { cn } from "@/lib/utils";
import type { BookingWithRelations } from "@/lib/types";

type RoomRow = { id: string; name: string };

const HOURS = Array.from(
  { length: BOOKING_END_HOUR - BOOKING_START_HOUR },
  (_, i) => BOOKING_START_HOUR + i,
);

function bookingCoversHour(booking: BookingWithRelations, hour: number, day: Date): boolean {
  const start = new Date(booking.startTime);
  const end = new Date(booking.endTime);
  if (!isSameDay(start, day)) return false;
  return hour >= start.getHours() && hour < end.getHours();
}

export function RoomScheduleGrid({
  day,
  rooms,
  bookings,
}: {
  day: string;
  rooms: RoomRow[];
  bookings: BookingWithRelations[];
}) {
  const dayDate = parseISO(day);
  const dayBookings = bookings.filter((b) => isSameDay(new Date(b.startTime), dayDate));

  if (rooms.length === 0) {
    return (
      <GlassCard className="p-8 text-center text-white/50">No rooms configured yet.</GlassCard>
    );
  }

  return (
    <GlassCard className="overflow-x-auto p-4">
      <h3 className="mb-4 text-lg font-semibold">
        {format(dayDate, "EEEE, MMMM d")} — room schedule
      </h3>
      <div className="min-w-[640px]">
        <div
          className="grid gap-px rounded-xl bg-white/10"
          style={{
            gridTemplateColumns: `8rem repeat(${HOURS.length}, minmax(3.5rem, 1fr))`,
          }}
        >
          <div className="bg-surface/90 p-2 text-xs font-medium text-white/40">Room</div>
          {HOURS.map((h) => (
            <div
              key={h}
              className="bg-surface/90 p-2 text-center text-[10px] font-medium text-white/40"
            >
              {formatHourLabel(h).replace(":00", "")}
            </div>
          ))}

          {rooms.map((room) => {
            const roomBookings = dayBookings.filter((b) => b.roomId === room.id);
            return (
              <div key={room.id} className="contents">
                <div className="flex items-center bg-surface/80 px-2 py-2 text-sm font-medium text-white/80">
                  {room.name}
                </div>
                {HOURS.map((hour) => {
                  const booking = roomBookings.find((b) =>
                    bookingCoversHour(b, hour, dayDate),
                  );
                  const isStart =
                    booking &&
                    new Date(booking.startTime).getHours() === hour;

                  return (
                    <div
                      key={`${room.id}-${hour}`}
                      className={cn(
                        "relative min-h-[2.75rem] bg-surface/60 p-0.5",
                        booking && "bg-brand-red/10",
                      )}
                      title={
                        booking
                          ? `${booking.club.name}: ${booking.purpose}`
                          : undefined
                      }
                    >
                      {isStart && booking && (
                        <div className="absolute inset-0.5 z-10 overflow-hidden rounded-lg border border-brand-red/40 bg-brand-red/20 px-1 py-0.5">
                          <p className="truncate text-[10px] font-semibold text-white">
                            {booking.club.logo} {booking.club.name}
                          </p>
                          <p className="truncate text-[9px] text-white/55">
                            {format(new Date(booking.startTime), "h:mm")}–
                            {format(new Date(booking.endTime), "h:mm a")}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
      {dayBookings.length === 0 && (
        <p className="mt-4 text-center text-sm text-white/45">
          No approved sessions on this day.
        </p>
      )}
    </GlassCard>
  );
}
