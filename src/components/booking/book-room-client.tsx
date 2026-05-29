"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Filter, Search } from "lucide-react";
import { BookingDetailModal } from "@/components/booking/booking-detail-modal";
import { RoomCard } from "@/components/rooms/room-card";
import { GlassCard } from "@/components/ui/glass-card";
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
  occupiedByRoom: Record<string, number[]>;
};

export function BookRoomClient({
  rooms,
  clubs,
  allAmenities,
  date,
  occupiedByRoom,
}: BookRoomClientProps) {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<string[]>([]);
  const [selected, setSelected] = useState<RoomWithAmenities | null>(null);

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

  const toggleFilter = (tag: string) => {
    setFilters((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  return (
    <>
      <GlassCard className="mb-8 p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search rooms or amenities (Sound System, LAN…)"
              className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-brand-red/40"
            />
          </div>
          <p className="text-sm text-white/50">Booking date: {date}</p>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Filter className="h-4 w-4 text-brand-red" />
          {allAmenities.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleFilter(tag)}
              className={`rounded-full border px-3 py-1 text-xs transition ${
                filters.includes(tag)
                  ? "border-brand-red bg-brand-red/20 text-brand-red"
                  : "border-white/15 text-white/60 hover:border-brand-red/40"
              }`}
            >
              {tag}
            </button>
          ))}
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
        <p className="text-center text-white/50">No rooms match your filters.</p>
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
