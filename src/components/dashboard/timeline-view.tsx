"use client";

import { motion } from "framer-motion";
import { MascotMessage } from "@/components/animated/mascot-message";
import { formatInAppTz } from "@/lib/timezone";
import { GlassCard } from "@/components/ui/glass-card";
import type { BookingWithRelations } from "@/lib/types";

export function TimelineView({ bookings }: { bookings: BookingWithRelations[] }) {
  if (bookings.length === 0) {
    return (
      <GlassCard className="py-8">
        <MascotMessage
          size="sm"
          title="No sessions this day"
          description="Approved club bookings will show on the timeline and calendar."
        />
      </GlassCard>
    );
  }

  return (
    <div className="relative space-y-0">
      <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-brand-red via-brand-red to-transparent" />
      {bookings.map((booking, i) => (
        <motion.div
          key={booking.id}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.08 }}
          className="relative pl-10 pb-6"
        >
          <span className="absolute left-2.5 top-2 h-3 w-3 rounded-full bg-brand-red ring-4 ring-brand-red/30" />
          <GlassCard className="p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-semibold">{booking.room.name}</p>
                <p className="text-sm text-brand-red">
                  {booking.club.logo} {booking.club.name}
                </p>
              </div>
              <p className="text-sm text-white/55">
                {formatInAppTz(booking.startTime, "h:mm a")} —{" "}
                {formatInAppTz(booking.endTime, "h:mm a")}
              </p>
            </div>
            <p className="mt-2 text-sm text-white/50">{booking.purpose}</p>
          </GlassCard>
        </motion.div>
      ))}
    </div>
  );
}
