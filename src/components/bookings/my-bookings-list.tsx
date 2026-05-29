"use client";

import { format } from "date-fns";
import { motion } from "framer-motion";
import { useOptimistic, useTransition } from "react";
import { BookingStatus } from "@prisma/client";
import { cancelBookingAction } from "@/actions/bookings";
import { AnimatedStatusCharacter } from "@/components/animated/animated-status-character";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import type { BookingWithRelations } from "@/lib/types";

type MyBookingRow = BookingWithRelations & { pendingCancel?: boolean };

export function MyBookingsList({
  bookings,
  bookerEmail,
}: {
  bookings: BookingWithRelations[];
  bookerEmail: string;
}) {
  const [optimisticBookings, setOptimistic] = useOptimistic(
    bookings as MyBookingRow[],
    (state: MyBookingRow[], bookingId: string) =>
      state.map((b) =>
        b.id === bookingId
          ? { ...b, status: BookingStatus.REJECTED, pendingCancel: true }
          : b,
      ),
  );
  const [isPending, startTransition] = useTransition();

  if (!bookerEmail) {
    return (
      <GlassCard className="flex flex-col items-center py-16">
        <AnimatedStatusCharacter
          status="EMPTY"
          title="Look up your bookings"
          description="Enter the email address you used when submitting a room request."
        />
      </GlassCard>
    );
  }

  if (bookings.length === 0) {
    return (
      <GlassCard className="flex flex-col items-center py-16">
        <AnimatedStatusCharacter
          status="EMPTY"
          title="No bookings found"
          description="No requests match this email. Double-check the address or book a new room."
        />
      </GlassCard>
    );
  }

  const handleCancel = (bookingId: string) => {
    startTransition(async () => {
      setOptimistic(bookingId);
      await cancelBookingAction({ bookingId, bookerEmail });
    });
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {optimisticBookings.map((booking, i) => (
        <motion.div
          key={booking.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06 }}
        >
          <GlassCard
            gradient
            className={`p-5 ${booking.pendingCancel ? "opacity-60" : ""}`}
          >
            <div className="mb-3 flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold">{booking.room.name}</h3>
                <p className="text-sm text-white/50">
                  {booking.club.logo} {booking.club.name} ·{" "}
                  {format(booking.startTime, "MMM d, yyyy")} ·{" "}
                  {format(booking.startTime, "h:mm a")} —{" "}
                  {format(booking.endTime, "h:mm a")}
                </p>
              </div>
              <StatusBadge status={booking.status} />
            </div>
            <p className="text-sm text-white/60">{booking.purpose}</p>
            {(booking.status === "PENDING" || booking.status === "APPROVED") &&
              !booking.pendingCancel && (
                <Button
                  variant="danger"
                  size="sm"
                  className="mt-4"
                  disabled={isPending}
                  onClick={() => handleCancel(booking.id)}
                >
                  Cancel request
                </Button>
              )}
          </GlassCard>
        </motion.div>
      ))}
    </div>
  );
}
