"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { addDays, format, parseISO, subDays } from "date-fns";
import { motion } from "framer-motion";
import { Calendar, ChevronLeft, ChevronRight, Filter, Search } from "lucide-react";
import { BookingDetailModal } from "@/components/booking/booking-detail-modal";
import { RoomCard } from "@/components/rooms/room-card";
import { GlassCard } from "@/components/ui/glass-card";
import { formatDateOnlyInAppTz, todayInAppTz } from "@/lib/timezone";
import type { RoomSpaceParam } from "@/lib/room-types";
import type { RoomWithAmenities } from "@/lib/types";

type ClubOption = {
  id: string;
  name: string;
  logo: string | null;
};

type BookRoomClientProps = {
  rooms: RoomWithAmenities[];
  clubs: ClubOption[];
  allAmenities: string[];
  date: string;
  space: RoomSpaceParam;
  occupiedByRoom: Record<string, number[]>;
};

export function BookRoomClient({
  rooms,
  clubs,
  allAmenities,
  date,
  space,
  occupiedByRoom,
}: BookRoomClientProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<string[]>([]);
  const [selected, setSelected] = useState<RoomWithAmenities | null>(null);

  const dateLabel = formatDateOnlyInAppTz(date, "EEEE, MMMM d, yyyy");
  const today = todayInAppTz();

  const setBookingDate = (next: string) => {
    const q = new URLSearchParams({ date: next });
    if (space === "classroom") q.set("space", "classroom");
    router.push(`/book?${q.toString()}`);
  };

  const spaceLabel = space === "classroom" ? "classrooms" : "activity rooms";

  const filtered = useMemo(() => {
    return rooms.filter((room) => {
      const matchesQuery =
        !query ||
        room.name.toLowerCase().includes(query.toLowerCase()) ||
        room.amenities.some((a) => a.toLowerCase().includes(query.toLowerCase()));
      const matchesFilters =
        filters.length === 0 || filters.every((f) => room.amenities.includes(f));
      return matchesQuery && matchesFilters;
    });
  }, [rooms, query, filters]);

  const availableCount = filtered.filter((r) => r.status === "AVAILABLE").length;

  const toggleFilter = (tag: string) => {
    setFilters((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  return (
    <>
      <GlassCard className="mb-8 p-5">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="field-label flex items-center gap-2">
              <Calendar className="h-4 w-4 text-brand-red" />
              Booking date
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setBookingDate(format(subDays(parseISO(date), 1), "yyyy-MM-dd"))}
                className="rounded-lg border border-border p-2 text-foreground-muted transition hover:border-brand-red/40 hover:text-foreground"
                aria-label="Previous day"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <input
                type="date"
                value={date}
                min={today}
                onChange={(e) => e.target.value && setBookingDate(e.target.value)}
                className="field-input max-w-[11rem]"
              />
              <button
                type="button"
                onClick={() => setBookingDate(format(addDays(parseISO(date), 1), "yyyy-MM-dd"))}
                className="rounded-lg border border-border p-2 text-foreground-muted transition hover:border-brand-red/40 hover:text-foreground"
                aria-label="Next day"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              {date !== today && (
                <button
                  type="button"
                  onClick={() => setBookingDate(today)}
                  className="rounded-lg px-3 py-2 text-xs font-medium text-brand-red-light ring-1 ring-brand-red/30 transition hover:bg-brand-red/10"
                >
                  Today
                </button>
              )}
            </div>
            <p className="field-hint">{dateLabel}</p>
          </div>
          <div className="rounded-xl bg-brand-red/10 px-4 py-3 ring-1 ring-brand-red/25">
            <p className="text-2xl font-bold text-brand-red">{availableCount}</p>
            <p className="text-xs text-foreground-muted">{spaceLabel} available to book</p>
          </div>
        </div>

        <div className="mt-5 border-t border-border pt-5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-subtle" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by room name or amenity…"
              className="field-input pl-10"
            />
          </div>
          {allAmenities.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Filter className="h-4 w-4 shrink-0 text-brand-red" />
              <span className="text-xs text-foreground-subtle">Amenities:</span>
              {allAmenities.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleFilter(tag)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                    filters.includes(tag)
                      ? "border-brand-red bg-brand-red/20 text-brand-red-light"
                      : "border-border-strong text-foreground-muted hover:border-brand-red/35"
                  }`}
                >
                  {tag}
                </button>
              ))}
              {filters.length > 0 && (
                <button
                  type="button"
                  onClick={() => setFilters([])}
                  className="text-xs text-foreground-subtle underline hover:text-foreground"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>
      </GlassCard>

      <motion.div layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((room, i) => (
          <RoomCard
            key={room.id}
            room={room}
            index={i}
            layoutId={`room-card-${room.id}`}
            onSelect={setSelected}
          />
        ))}
      </motion.div>

      {filtered.length === 0 && (
        <GlassCard className="p-10 text-center">
          <p className="text-foreground-muted">No {spaceLabel} match your search.</p>
          <p className="mt-1 text-sm text-foreground-subtle">Try clearing filters or another date.</p>
        </GlassCard>
      )}

      <BookingDetailModal
        room={selected}
        clubs={clubs}
        layoutId={selected ? `room-card-${selected.id}` : "room-card-none"}
        date={date}
        occupiedHours={selected ? occupiedByRoom[selected.id] ?? [] : []}
        onClose={() => setSelected(null)}
      />
    </>
  );
}
