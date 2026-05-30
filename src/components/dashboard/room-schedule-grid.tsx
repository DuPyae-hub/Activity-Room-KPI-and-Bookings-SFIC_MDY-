"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { BOOKING_END_HOUR, BOOKING_START_HOUR, formatHourLabel } from "@/lib/booking-hours";
import {
  formatDateOnlyInAppTz,
  formatInAppTz,
  getDateStringInAppTz,
  getHourInAppTz,
} from "@/lib/timezone";
import { cn } from "@/lib/utils";
import { getBookingGroupLabel, type BookingWithRelations } from "@/lib/types";

type RoomRow = { id: string; name: string };

const HOURS = Array.from(
  { length: BOOKING_END_HOUR - BOOKING_START_HOUR },
  (_, i) => BOOKING_START_HOUR + i,
);

function bookingCoversHour(
  booking: BookingWithRelations,
  hour: number,
  dayKey: string,
): boolean {
  if (getDateStringInAppTz(new Date(booking.startTime)) !== dayKey) return false;
  const startH = getHourInAppTz(new Date(booking.startTime));
  const endH = getHourInAppTz(new Date(booking.endTime));
  return hour >= startH && hour < endH;
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
  const dayBookings = bookings.filter(
    (b) => getDateStringInAppTz(new Date(b.startTime)) === day,
  );

  if (rooms.length === 0) {
    return (
      <GlassCard className="p-8 text-center text-foreground-muted">No rooms configured yet.</GlassCard>
    );
  }

  return (
    <GlassCard className="overflow-x-auto p-4">
      <h3 className="mb-4 text-lg font-semibold">
        {formatDateOnlyInAppTz(day, "EEEE, MMMM d")} — room schedule
      </h3>
      <div className="min-w-[640px]">
        <div
          className="grid gap-px rounded-xl bg-stone-100"
          style={{
            gridTemplateColumns: `8rem repeat(${HOURS.length}, minmax(3.5rem, 1fr))`,
          }}
        >
          <div className="bg-surface/90 p-2 text-xs font-medium text-foreground-subtle">Room</div>
          {HOURS.map((h) => (
            <div
              key={h}
              className="bg-surface/90 p-2 text-center text-[10px] font-medium text-foreground-subtle"
            >
              {formatHourLabel(h).replace(":00", "")}
            </div>
          ))}

          {rooms.map((room) => {
            const roomBookings = dayBookings.filter((b) => b.roomId === room.id);
            return (
              <div key={room.id} className="contents">
                <div className="flex items-center bg-surface/80 px-2 py-2 text-sm font-medium text-foreground/80">
                  {room.name}
                </div>
                {HOURS.map((hour) => {
                  const booking = roomBookings.find((b) => bookingCoversHour(b, hour, day));
                  const isStart =
                    booking && getHourInAppTz(new Date(booking.startTime)) === hour;

                  return (
                    <div
                      key={`${room.id}-${hour}`}
                      className={cn(
                        "relative min-h-[2.75rem] bg-surface/60 p-0.5",
                        booking && "bg-brand-red/10",
                      )}
                      title={
                        booking
                          ? `${getBookingGroupLabel(booking)}: ${booking.purpose}`
                          : undefined
                      }
                    >
                      {isStart && booking && (
                        <div className="absolute inset-0.5 z-10 overflow-hidden rounded-lg border border-brand-red/40 bg-brand-red/20 px-1 py-0.5">
                          <p className="truncate text-[10px] font-semibold text-foreground">
                            {getBookingGroupLabel(booking)}
                          </p>
                          <p className="truncate text-[9px] text-foreground-muted">
                            {formatInAppTz(new Date(booking.startTime), "h:mm")}–
                            {formatInAppTz(new Date(booking.endTime), "h:mm a")}
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
        <p className="mt-4 text-center text-sm text-foreground-muted">
          No approved sessions on this day.
        </p>
      )}
    </GlassCard>
  );
}
