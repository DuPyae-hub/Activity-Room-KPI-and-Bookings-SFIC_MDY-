"use client";

import { motion } from "framer-motion";
import { ArrowRight, Users, Wrench } from "lucide-react";
import { StatusBadge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import type { RoomWithAmenities } from "@/lib/types";

type RoomCardProps = {
  room: RoomWithAmenities;
  index: number;
  layoutId: string;
  onSelect: (room: RoomWithAmenities) => void;
};

export function RoomCard({ room, index, layoutId, onSelect }: RoomCardProps) {
  const disabled = room.status === "MAINTENANCE";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
    >
      <motion.button
        type="button"
        layoutId={layoutId}
        disabled={disabled}
        onClick={() => !disabled && onSelect(room)}
        className="group w-full text-left disabled:cursor-not-allowed disabled:opacity-60"
        whileHover={disabled ? undefined : { y: -4 }}
      >
        <GlassCard gradient className="h-full p-5 transition hover:bg-white/[0.07]">
          <div className="mb-3 flex items-start justify-between gap-2">
            <h3 className="text-lg font-semibold">{room.name}</h3>
            <StatusBadge status={room.status} type="room" />
          </div>
          <p className="mb-4 flex items-center gap-2 text-sm text-white/55">
            <Users className="h-4 w-4 text-brand-red" />
            Capacity {room.capacity}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {room.amenities.map((tag) => (
              <span
                key={tag}
                className="rounded-lg bg-brand-red/20 px-2 py-0.5 text-xs text-brand-red-light ring-1 ring-brand-red/30"
              >
                {tag}
              </span>
            ))}
          </div>
          {disabled ? (
            <p className="mt-4 flex items-center gap-1 text-xs text-orange-300/80">
              <Wrench className="h-3.5 w-3.5" />
              Under maintenance
            </p>
          ) : (
            <p className="mt-4 flex items-center gap-1 text-sm font-medium text-brand-red-light">
              Select room
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </p>
          )}
        </GlassCard>
      </motion.button>
    </motion.div>
  );
}
