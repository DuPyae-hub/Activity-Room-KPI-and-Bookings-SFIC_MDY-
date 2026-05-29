"use client";

import { format } from "date-fns";
import { motion } from "framer-motion";
import { Pencil, Trash2 } from "lucide-react";
import { useMemo, useState, useTransition } from "react";
import { BookingStatus } from "@prisma/client";
import {
  deleteBookingAction,
  updateBookingAction,
  updateBookingStatusAction,
} from "@/actions/bookings";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import {
  formatHourLabel,
  getValidStartHours,
  maxStartHourForDuration,
} from "@/lib/booking-hours";
import { BOOKING_DURATION_OPTIONS } from "@/lib/sfic-clubs";
import { getBookerDisplay, type BookingWithRelations } from "@/lib/types";

type RoomOption = { id: string; name: string };
type ClubOption = { id: string; name: string; logo: string | null };

type FormState = {
  id: string;
  roomId: string;
  clubId: string;
  bookerName: string;
  bookerEmail: string;
  date: string;
  startHour: number;
  durationHours: (typeof BOOKING_DURATION_OPTIONS)[number];
  purpose: string;
  status: BookingStatus;
};

function bookingToForm(booking: BookingWithRelations): FormState {
  const start = new Date(booking.startTime);
  const end = new Date(booking.endTime);
  return {
    id: booking.id,
    roomId: booking.roomId,
    clubId: booking.clubId,
    bookerName: booking.bookerName,
    bookerEmail: booking.bookerEmail,
    date: format(start, "yyyy-MM-dd"),
    startHour: start.getHours(),
    durationHours: (end.getHours() - start.getHours()) as FormState["durationHours"],
    purpose: booking.purpose,
    status: booking.status,
  };
}

export function BookingManager({
  bookings,
  rooms,
  clubs,
}: {
  bookings: BookingWithRelations[];
  rooms: RoomOption[];
  clubs: ClubOption[];
}) {
  const [form, setForm] = useState<FormState | null>(null);
  const [filter, setFilter] = useState<BookingStatus | "ALL">("ALL");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const filtered = useMemo(
    () =>
      filter === "ALL" ? bookings : bookings.filter((b) => b.status === filter),
    [bookings, filter],
  );

  const validStarts = form
    ? getValidStartHours(form.durationHours).filter(
        (h) => h <= maxStartHourForDuration(form.durationHours),
      )
    : [];

  const save = () => {
    if (!form?.id) return;
    setError(null);
    startTransition(async () => {
      const result = await updateBookingAction(form);
      if (!result.success) {
        setError(result.error);
        return;
      }
      setForm(null);
    });
  };

  const remove = (bookingId: string) => {
    if (!confirm("Permanently delete this booking? This cannot be undone.")) return;
    setError(null);
    startTransition(async () => {
      const result = await deleteBookingAction({ bookingId });
      if (!result.success) {
        setError(result.error);
        return;
      }
      if (form?.id === bookingId) setForm(null);
    });
  };

  const setStatus = (bookingId: string, status: BookingStatus) => {
    startTransition(async () => {
      const result = await updateBookingStatusAction({ bookingId, status });
      if (!result.success) setError(result.error);
    });
  };

  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {(["ALL", BookingStatus.PENDING, BookingStatus.APPROVED, BookingStatus.REJECTED] as const).map(
            (key) => (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                  filter === key
                    ? "border-brand-red/50 bg-brand-red/15 text-brand-red-light"
                    : "border-white/15 text-white/50 hover:border-white/30"
                }`}
              >
                {key === "ALL" ? "All" : key}
              </button>
            ),
          )}
        </div>

        <div className="max-h-[70vh] space-y-3 overflow-y-auto pr-1">
          {filtered.length === 0 ? (
            <GlassCard className="p-6 text-center text-white/50">No bookings in this filter.</GlassCard>
          ) : (
            filtered.map((booking, i) => {
              const booker = getBookerDisplay(booking);
              const editing = form?.id === booking.id;
              return (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.02 }}
                >
                  <GlassCard
                    className={`p-4 ${editing ? "ring-1 ring-brand-red/50" : ""}`}
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold">{booking.room.name}</p>
                          <StatusBadge status={booking.status} />
                        </div>
                        <p className="text-sm text-brand-red">
                          {booking.club.logo} {booking.club.name}
                        </p>
                        <p className="text-xs text-white/45">
                          {booker.name} · {booker.email}
                        </p>
                        <p className="mt-1 text-sm text-white/55">
                          {format(booking.startTime, "MMM d, yyyy · h:mm a")} —{" "}
                          {format(booking.endTime, "h:mm a")}
                        </p>
                        <p className="mt-1 text-sm text-white/60">{booking.purpose}</p>
                      </div>
                      <div className="flex shrink-0 flex-wrap gap-2">
                        {booking.status === BookingStatus.PENDING && (
                          <>
                            <Button
                              variant="gold"
                              size="sm"
                              disabled={isPending}
                              onClick={() => setStatus(booking.id, BookingStatus.APPROVED)}
                            >
                              Approve
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              disabled={isPending}
                              onClick={() => setStatus(booking.id, BookingStatus.REJECTED)}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                        <Button
                          variant="secondary"
                          size="sm"
                          disabled={isPending}
                          onClick={() => setForm(bookingToForm(booking))}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          disabled={isPending}
                          onClick={() => remove(booking.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })
          )}
        </div>
      </div>

      <GlassCard className="h-fit p-5">
        <h3 className="mb-4 font-semibold">
          {form?.id ? "Edit booking" : "Select a booking to edit"}
        </h3>
        {!form?.id ? (
          <p className="text-sm text-white/45">
            Use Edit on any booking — including approved — or Delete to remove it permanently.
          </p>
        ) : (
          <div className="space-y-3">
            <label className="block">
              <span className="text-sm text-white/60">Room</span>
              <select
                value={form.roomId}
                onChange={(e) => setForm((f) => f && { ...f, roomId: e.target.value })}
                className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-brand-red/40"
              >
                {rooms.map((r) => (
                  <option key={r.id} value={r.id} className="bg-surface">
                    {r.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-sm text-white/60">Club</span>
              <select
                value={form.clubId}
                onChange={(e) => setForm((f) => f && { ...f, clubId: e.target.value })}
                className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-brand-red/40"
              >
                {clubs.map((c) => (
                  <option key={c.id} value={c.id} className="bg-surface">
                    {c.logo} {c.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-sm text-white/60">Booker name</span>
              <input
                value={form.bookerName}
                onChange={(e) => setForm((f) => f && { ...f, bookerName: e.target.value })}
                className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-brand-red/40"
              />
            </label>
            <label className="block">
              <span className="text-sm text-white/60">Booker email</span>
              <input
                type="email"
                value={form.bookerEmail}
                onChange={(e) => setForm((f) => f && { ...f, bookerEmail: e.target.value })}
                className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-brand-red/40"
              />
            </label>
            <label className="block">
              <span className="text-sm text-white/60">Date</span>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm((f) => f && { ...f, date: e.target.value })}
                className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-brand-red/40"
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="text-sm text-white/60">Duration</span>
                <select
                  value={form.durationHours}
                  onChange={(e) =>
                    setForm((f) =>
                      f
                        ? {
                            ...f,
                            durationHours: Number(e.target.value) as FormState["durationHours"],
                            startHour: Math.min(
                              f.startHour,
                              maxStartHourForDuration(
                                Number(e.target.value) as FormState["durationHours"],
                              ),
                            ),
                          }
                        : f,
                    )
                  }
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-brand-red/40"
                >
                  {BOOKING_DURATION_OPTIONS.map((d) => (
                    <option key={d} value={d} className="bg-surface">
                      {d} hours
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-sm text-white/60">Start time</span>
                <select
                  value={form.startHour}
                  onChange={(e) =>
                    setForm((f) => f && { ...f, startHour: Number(e.target.value) })
                  }
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-brand-red/40"
                >
                  {validStarts.map((h) => (
                    <option key={h} value={h} className="bg-surface">
                      {formatHourLabel(h)}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label className="block">
              <span className="text-sm text-white/60">Status</span>
              <select
                value={form.status}
                onChange={(e) =>
                  setForm(
                    (f) => f && { ...f, status: e.target.value as BookingStatus },
                  )
                }
                className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-brand-red/40"
              >
                {Object.values(BookingStatus).map((s) => (
                  <option key={s} value={s} className="bg-surface">
                    {s}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-sm text-white/60">Purpose</span>
              <textarea
                value={form.purpose}
                onChange={(e) => setForm((f) => f && { ...f, purpose: e.target.value })}
                rows={3}
                className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-brand-red/40"
              />
            </label>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <div className="flex flex-wrap gap-2 pt-2">
              <Button variant="gold" disabled={isPending} onClick={save}>
                Save changes
              </Button>
              <Button variant="secondary" disabled={isPending} onClick={() => setForm(null)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                disabled={isPending}
                onClick={() => remove(form.id)}
              >
                Delete permanently
              </Button>
            </div>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
