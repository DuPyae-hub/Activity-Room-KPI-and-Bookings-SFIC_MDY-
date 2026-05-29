"use client";

import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { createBookingAction } from "@/actions/bookings";
import { ClubSelect } from "@/components/booking/club-select";
import { DurationTimePicker } from "@/components/booking/duration-time-picker";
import type { BookingDurationHours } from "@/lib/sfic-clubs";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { StatusBadge } from "@/components/ui/badge";
import type { RoomWithAmenities } from "@/lib/types";

type BookingDetailModalProps = {
  room: RoomWithAmenities | null;
  clubs: { id: string; name: string; logo: string | null; description?: string | null }[];
  layoutId: string;
  date: string;
  occupiedHours: number[];
  onClose: () => void;
};

export function BookingDetailModal({
  room,
  clubs,
  layoutId,
  date,
  occupiedHours,
  onClose,
}: BookingDetailModalProps) {
  const router = useRouter();
  const [startHour, setStartHour] = useState<number | null>(null);
  const [durationHours, setDurationHours] = useState<BookingDurationHours>(2);
  const [bookerName, setBookerName] = useState("");
  const [bookerEmail, setBookerEmail] = useState("");
  const [clubId, setClubId] = useState("");
  const [purpose, setPurpose] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (clubs.length === 0) {
      setClubId("");
      return;
    }
    if (!clubId || !clubs.some((c) => c.id === clubId)) {
      setClubId(clubs[0].id);
    }
  }, [clubs, clubId]);

  const canSubmit =
    bookerName.trim() &&
    bookerEmail.trim() &&
    clubId &&
    purpose.trim() &&
    startHour !== null;

  const handleSubmit = () => {
    if (!room || !canSubmit || startHour === null) return;
    setError(null);
    startTransition(async () => {
      const result = await createBookingAction({
        roomId: room.id,
        clubId,
        bookerName: bookerName.trim(),
        bookerEmail: bookerEmail.trim(),
        startHour,
        durationHours,
        purpose,
        date,
      });
      if (!result.success) {
        setError(result.error);
        return;
      }
      onClose();
      router.push(
        `/booking/success?id=${result.data?.id}&email=${encodeURIComponent(bookerEmail.trim())}`,
      );
    });
  };

  return (
    <AnimatePresence>
      {room && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              layoutId={layoutId}
              className="pointer-events-auto w-full max-w-2xl"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <GlassCard gradient className="max-h-[90vh] overflow-y-auto p-6">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-brand-red">
                      Booking request
                    </p>
                    <h2 className="mt-1 text-2xl font-bold">{room.name}</h2>
                    <StatusBadge status={room.status} type="room" className="mt-2" />
                    <p className="mt-2 text-sm text-foreground-muted">
                      Date: {date} (Myanmar Time) · Admin approval required
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-lg p-2 text-foreground-muted hover:bg-stone-100 hover:text-foreground"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="mb-6 grid gap-3 sm:grid-cols-2">
                  <label className="block sm:col-span-2">
                    <span className="field-label">Your name</span>
                    <input
                      value={bookerName}
                      onChange={(e) => setBookerName(e.target.value)}
                      className="field-input mt-2"
                      placeholder="Club leader name"
                    />
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="field-label">Email (to track your booking)</span>
                    <input
                      type="email"
                      value={bookerEmail}
                      onChange={(e) => setBookerEmail(e.target.value)}
                      className="field-input mt-2"
                      placeholder="you@club.edu"
                    />
                  </label>
                  <div className="sm:col-span-2">
                    <span className="text-sm font-medium text-foreground/80">Club</span>
                    <p className="mt-0.5 text-xs text-foreground-muted">
                      Strategy First MDY — select your registered club
                    </p>
                    <ClubSelect clubs={clubs} value={clubId} onChange={setClubId} />
                  </div>
                </div>

                <DurationTimePicker
                  selectedStart={startHour}
                  durationHours={durationHours}
                  occupiedHours={occupiedHours}
                  onDurationChange={(d) => {
                    setDurationHours(d);
                    setStartHour(null);
                  }}
                  onSelectStart={setStartHour}
                />

                <label className="mt-6 block">
                  <span className="field-label">Purpose of booking</span>
                  <textarea
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    rows={3}
                    className="field-input mt-2 min-h-[5rem] resize-y"
                    placeholder="e.g. Weekly band rehearsal"
                  />
                </label>

                {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

                <div className="mt-6 flex gap-3">
                  <Button variant="secondary" className="flex-1" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button
                    variant="gold"
                    className="flex-1"
                    disabled={isPending || !canSubmit}
                    onClick={handleSubmit}
                  >
                    {isPending ? "Submitting…" : "Request Booking"}
                  </Button>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
