"use client";

import { motion } from "framer-motion";
import { formatInAppTz } from "@/lib/timezone";
import { useOptimistic, useTransition } from "react";
import { BookingStatus } from "@prisma/client";
import { updateBookingStatusAction } from "@/actions/bookings";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import { getBookerDisplay, getBookingGroupLabel, type BookingWithRelations } from "@/lib/types";

type QueueBooking = BookingWithRelations & {
  optimisticStatus?: BookingStatus;
};

export function ApprovalsQueue({ bookings }: { bookings: BookingWithRelations[] }) {
  const [optimisticBookings, setOptimistic] = useOptimistic(
    bookings as QueueBooking[],
    (state: QueueBooking[], update: { id: string; status: BookingStatus }) =>
      state
        .map((b) =>
          b.id === update.id
            ? { ...b, status: update.status, optimisticStatus: update.status }
            : b,
        )
        .filter((b) => b.status === BookingStatus.PENDING),
  );
  const [isPending, startTransition] = useTransition();

  const act = (bookingId: string, status: BookingStatus) => {
    startTransition(async () => {
      setOptimistic({ id: bookingId, status });
      await updateBookingStatusAction({ bookingId, status });
    });
  };

  if (bookings.length === 0) {
    return (
      <GlassCard className="p-8 text-center text-foreground-muted">
        No pending requests — you&apos;re all caught up.
      </GlassCard>
    );
  }

  return (
    <div className="space-y-3">
      {optimisticBookings.map((booking, i) => (
        <motion.div
          key={booking.id}
          layout
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, x: 40 }}
          transition={{ delay: i * 0.04 }}
        >
          <GlassCard className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold">{booking.room.name}</p>
                <StatusBadge status={booking.optimisticStatus ?? booking.status} />
              </div>
              <p className="text-sm text-brand-red">
                {getBookingGroupLabel(booking)} · {getBookerDisplay(booking).name}
              </p>
              <p className="text-xs text-foreground-subtle">{getBookerDisplay(booking).email}</p>
              <p className="text-sm text-foreground-muted">
                {formatInAppTz(booking.startTime, "MMM d · h:mm a")} —{" "}
                {formatInAppTz(booking.endTime, "h:mm a")}
              </p>
              <p className="mt-1 text-sm text-foreground-muted">{booking.purpose}</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <Button
                variant="danger"
                size="sm"
                disabled={isPending}
                onClick={() => act(booking.id, BookingStatus.REJECTED)}
              >
                Reject
              </Button>
              <Button
                variant="gold"
                size="sm"
                disabled={isPending}
                onClick={() => act(booking.id, BookingStatus.APPROVED)}
              >
                Approve
              </Button>
            </div>
          </GlassCard>
        </motion.div>
      ))}
    </div>
  );
}
