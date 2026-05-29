"use client";

import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useState, useTransition } from "react";
import { createBookingAction } from "@/actions/bookings";
import { TimeSlotPicker } from "@/components/booking/time-slot-picker";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { StatusBadge } from "@/components/ui/badge";
import type { RoomWithAmenities } from "@/lib/types";

type ClubOption = {
  id: string;
  name: string;
  logo: string | null;
};

type BookingDetailModalProps = {
  room: RoomWithAmenities | null;
  clubs: ClubOption[];
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
  const [endHour, setEndHour] = useState<number | null>(null);
  const [bookerName, setBookerName] = useState("");
  const [bookerEmail, setBookerEmail] = useState("");
  const [clubId, setClubId] = useState(clubs[0]?.id ?? "");
  const [purpose, setPurpose] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const canSubmit =
    bookerName.trim() &&
    bookerEmail.trim() &&
    clubId &&
    purpose.trim() &&
    startHour !== null &&
    endHour !== null;

  const handleSubmit = () => {
    if (!room || !canSubmit || startHour === null || endHour === null) return;
    setError(null);
    startTransition(async () => {
      const result = await createBookingAction({
        roomId: room.id,
        clubId,
        bookerName: bookerName.trim(),
        bookerEmail: bookerEmail.trim(),
        startHour,
        endHour,
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
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">{room.name}</h2>
                    <StatusBadge status={room.status} type="room" className="mt-2" />
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-lg p-2 text-white/50 hover:bg-white/10 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="mb-6 grid gap-3 sm:grid-cols-2">
                  <label className="block sm:col-span-2">
                    <span className="text-sm text-white/60">Your name</span>
                    <input
                      value={bookerName}
                      onChange={(e) => setBookerName(e.target.value)}
                      className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-brand-red/40"
                      placeholder="Club leader name"
                    />
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="text-sm text-white/60">Email (to track your booking)</span>
                    <input
                      type="email"
                      value={bookerEmail}
                      onChange={(e) => setBookerEmail(e.target.value)}
                      className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-brand-red/40"
                      placeholder="you@club.edu"
                    />
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="text-sm text-white/60">Club</span>
                    <select
                      value={clubId}
                      onChange={(e) => setClubId(e.target.value)}
                      className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-brand-red/40"
                    >
                      {clubs.map((club) => (
                        <option key={club.id} value={club.id}>
                          {club.logo ? `${club.logo} ` : ""}
                          {club.name}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <TimeSlotPicker
                  selectedStart={startHour}
                  selectedEnd={endHour}
                  occupiedHours={occupiedHours}
                  onSelect={(s, e) => {
                    setStartHour(s);
                    setEndHour(e);
                  }}
                />

                <label className="mt-6 block">
                  <span className="text-sm text-white/60">Purpose of booking</span>
                  <textarea
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    rows={3}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-brand-red/50 focus:ring-1 focus:ring-brand-red/30"
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
