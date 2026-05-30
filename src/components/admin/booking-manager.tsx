"use client";

import { motion } from "framer-motion";
import { bookingLocalPartsInAppTz, formatInAppTz } from "@/lib/timezone";
import { Pencil, Trash2 } from "lucide-react";
import { useMemo, useState, useTransition } from "react";
import { BookingStatus } from "@prisma/client";
import {
  deleteBookingAction,
  updateBookingAction,
  updateBookingStatusAction,
} from "@/actions/bookings";
import { RoomTypeBadge } from "@/components/layout/space-switcher";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import {
  formatHourLabel,
  getValidStartHours,
  maxStartHourForDuration,
} from "@/lib/booking-hours";
import { RoomType } from "@prisma/client";
import {
  CLASSROOM_CUSTOM_MAX_HOURS,
  CLASSROOM_CUSTOM_MIN_HOURS,
  CLASSROOM_DURATION_PRESETS,
  ACTIVITY_DURATION_OPTIONS,
  getDefaultDurationHours,
  isPresetDuration,
  isValidDurationForRoom,
} from "@/lib/booking-duration";
import { getBookerDisplay, type BookingWithRelations } from "@/lib/types";

type RoomOption = { id: string; name: string; roomType: RoomType };
type ClubOption = { id: string; name: string; logo: string | null };

type FormState = {
  id: string;
  roomId: string;
  clubId: string;
  bookerName: string;
  bookerEmail: string;
  date: string;
  startHour: number;
  durationHours: number;
  purpose: string;
  status: BookingStatus;
};

function bookingToForm(booking: BookingWithRelations): FormState {
  const local = bookingLocalPartsInAppTz(
    new Date(booking.startTime),
    new Date(booking.endTime),
  );
  return {
    id: booking.id,
    roomId: booking.roomId,
    clubId: booking.clubId,
    bookerName: booking.bookerName,
    bookerEmail: booking.bookerEmail,
    date: local.date,
    startHour: local.startHour,
    durationHours: local.durationHours,
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

  const editingRoom = form ? rooms.find((r) => r.id === form.roomId) : undefined;

  const validStarts = form
    ? getValidStartHours(form.durationHours).filter(
        (h) => h <= maxStartHourForDuration(form.durationHours),
      )
    : [];

  const durationOptions =
    editingRoom?.roomType === RoomType.CLASSROOM
      ? [...CLASSROOM_DURATION_PRESETS]
      : [...ACTIVITY_DURATION_OPTIONS];

  const showCustomDuration =
    editingRoom?.roomType === RoomType.CLASSROOM &&
    !isPresetDuration(form?.durationHours ?? 0, RoomType.CLASSROOM);

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
                    : "border-border-strong text-foreground-muted hover:border-white/30"
                }`}
              >
                {key === "ALL" ? "All" : key}
              </button>
            ),
          )}
        </div>

        <div className="max-h-[70vh] space-y-3 overflow-y-auto pr-1">
          {filtered.length === 0 ? (
            <GlassCard className="p-6 text-center text-foreground-muted">No bookings in this filter.</GlassCard>
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
                          <RoomTypeBadge roomType={booking.room.roomType} />
                          <StatusBadge status={booking.status} />
                        </div>
                        <p className="text-sm text-brand-red">
                          {booking.club.logo} {booking.club.name}
                        </p>
                        <p className="text-xs text-foreground-muted">
                          {booker.name} · {booker.email}
                        </p>
                        <p className="mt-1 text-sm text-foreground-muted">
                          {formatInAppTz(new Date(booking.startTime), "MMM d, yyyy · h:mm a")} —{" "}
                          {formatInAppTz(new Date(booking.endTime), "h:mm a")}
                        </p>
                        <p className="mt-1 text-sm text-foreground-muted">{booking.purpose}</p>
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
          <p className="text-sm text-foreground-muted">
            Use Edit on any booking — including approved — or Delete to remove it permanently.
          </p>
        ) : (
          <div className="space-y-3">
            <label className="block">
              <span className="text-sm text-foreground-muted">Room</span>
              <select
                value={form.roomId}
                onChange={(e) => {
                  const roomId = e.target.value;
                  const room = rooms.find((r) => r.id === roomId);
                  setForm((f) => {
                    if (!f || !room) return f;
                    let durationHours = f.durationHours;
                    if (!isValidDurationForRoom(durationHours, room.roomType)) {
                      durationHours = getDefaultDurationHours(room.roomType);
                    }
                    return {
                      ...f,
                      roomId,
                      durationHours,
                      startHour: Math.min(
                        f.startHour,
                        maxStartHourForDuration(durationHours),
                      ),
                    };
                  });
                }}
                className="mt-2 w-full rounded-xl border border-border bg-stone-50 px-4 py-2.5 text-sm outline-none focus:border-brand-red/40"
              >
                {rooms.map((r) => (
                  <option key={r.id} value={r.id} className="bg-surface">
                    {r.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-sm text-foreground-muted">Club</span>
              <select
                value={form.clubId}
                onChange={(e) => setForm((f) => f && { ...f, clubId: e.target.value })}
                className="mt-2 w-full rounded-xl border border-border bg-stone-50 px-4 py-2.5 text-sm outline-none focus:border-brand-red/40"
              >
                {clubs.map((c) => (
                  <option key={c.id} value={c.id} className="bg-surface">
                    {c.logo} {c.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-sm text-foreground-muted">Booker name</span>
              <input
                value={form.bookerName}
                onChange={(e) => setForm((f) => f && { ...f, bookerName: e.target.value })}
                className="mt-2 w-full rounded-xl border border-border bg-stone-50 px-4 py-2.5 text-sm outline-none focus:border-brand-red/40"
              />
            </label>
            <label className="block">
              <span className="text-sm text-foreground-muted">Booker email</span>
              <input
                type="email"
                value={form.bookerEmail}
                onChange={(e) => setForm((f) => f && { ...f, bookerEmail: e.target.value })}
                className="mt-2 w-full rounded-xl border border-border bg-stone-50 px-4 py-2.5 text-sm outline-none focus:border-brand-red/40"
              />
            </label>
            <label className="block">
              <span className="text-sm text-foreground-muted">Date</span>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm((f) => f && { ...f, date: e.target.value })}
                className="mt-2 w-full rounded-xl border border-border bg-stone-50 px-4 py-2.5 text-sm outline-none focus:border-brand-red/40"
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block sm:col-span-2">
                <span className="text-sm text-foreground-muted">Duration (hours)</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {durationOptions.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() =>
                        setForm((f) =>
                          f
                            ? {
                                ...f,
                                durationHours: d,
                                startHour: Math.min(
                                  f.startHour,
                                  maxStartHourForDuration(d),
                                ),
                              }
                            : f,
                        )
                      }
                      className={`rounded-lg border px-3 py-1.5 text-sm font-medium ${
                        !showCustomDuration && form.durationHours === d
                          ? "border-brand-red bg-brand-red/15 text-brand-red"
                          : "border-border bg-stone-50"
                      }`}
                    >
                      {d}h
                    </button>
                  ))}
                  {editingRoom?.roomType === RoomType.CLASSROOM && (
                    <button
                      type="button"
                      onClick={() =>
                        setForm((f) =>
                          f
                            ? {
                                ...f,
                                durationHours: showCustomDuration
                                  ? f.durationHours
                                  : 4,
                              }
                            : f,
                        )
                      }
                      className={`rounded-lg border px-3 py-1.5 text-sm font-medium ${
                        showCustomDuration
                          ? "border-brand-orange bg-brand-orange/15 text-brand-orange"
                          : "border-border bg-stone-50"
                      }`}
                    >
                      Custom
                    </button>
                  )}
                </div>
                {showCustomDuration && (
                  <input
                    type="number"
                    min={CLASSROOM_CUSTOM_MIN_HOURS}
                    max={CLASSROOM_CUSTOM_MAX_HOURS}
                    value={form.durationHours}
                    onChange={(e) => {
                      const parsed = parseInt(e.target.value, 10);
                      if (Number.isNaN(parsed)) return;
                      const durationHours = Math.min(
                        CLASSROOM_CUSTOM_MAX_HOURS,
                        Math.max(CLASSROOM_CUSTOM_MIN_HOURS, parsed),
                      );
                      setForm((f) =>
                        f
                          ? {
                              ...f,
                              durationHours,
                              startHour: Math.min(
                                f.startHour,
                                maxStartHourForDuration(durationHours),
                              ),
                            }
                          : f,
                      );
                    }}
                    className="field-input mt-2 w-24"
                  />
                )}
              </label>
              <label className="block">
                <span className="text-sm text-foreground-muted">Start time</span>
                <select
                  value={form.startHour}
                  onChange={(e) =>
                    setForm((f) => f && { ...f, startHour: Number(e.target.value) })
                  }
                  className="mt-2 w-full rounded-xl border border-border bg-stone-50 px-4 py-2.5 text-sm outline-none focus:border-brand-red/40"
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
              <span className="text-sm text-foreground-muted">Status</span>
              <select
                value={form.status}
                onChange={(e) =>
                  setForm(
                    (f) => f && { ...f, status: e.target.value as BookingStatus },
                  )
                }
                className="mt-2 w-full rounded-xl border border-border bg-stone-50 px-4 py-2.5 text-sm outline-none focus:border-brand-red/40"
              >
                {Object.values(BookingStatus).map((s) => (
                  <option key={s} value={s} className="bg-surface">
                    {s}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-sm text-foreground-muted">Purpose</span>
              <textarea
                value={form.purpose}
                onChange={(e) => setForm((f) => f && { ...f, purpose: e.target.value })}
                rows={3}
                className="mt-2 w-full rounded-xl border border-border bg-stone-50 px-4 py-2.5 text-sm outline-none focus:border-brand-red/40"
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
