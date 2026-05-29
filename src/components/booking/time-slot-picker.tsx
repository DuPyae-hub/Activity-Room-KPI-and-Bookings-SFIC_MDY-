"use client";

import { motion } from "framer-motion";
import { HOUR_SLOTS, formatHourLabel } from "@/lib/booking-hours";
import { cn } from "@/lib/utils";

type TimeSlotPickerProps = {
  selectedStart: number | null;
  selectedEnd: number | null;
  occupiedHours: number[];
  onSelect: (start: number, end: number) => void;
};

export function TimeSlotPicker({
  selectedStart,
  selectedEnd,
  occupiedHours,
  onSelect,
}: TimeSlotPickerProps) {
  const handleClick = (hour: number) => {
    if (occupiedHours.includes(hour)) return;

    if (selectedStart === null || (selectedStart !== null && selectedEnd !== null)) {
      onSelect(hour, hour + 1);
      return;
    }

    if (hour <= selectedStart) {
      onSelect(hour, selectedStart + 1);
      return;
    }

    const rangeHasBlocked = HOUR_SLOTS.slice(
      selectedStart - HOUR_SLOTS[0],
      hour - HOUR_SLOTS[0] + 1,
    ).some((h) => occupiedHours.includes(h));

    if (rangeHasBlocked) {
      onSelect(hour, hour + 1);
      return;
    }

    onSelect(selectedStart, hour + 1);
  };

  const rangeStart = selectedStart;
  const rangeEnd = selectedEnd ? selectedEnd - 1 : null;

  return (
    <div className="relative">
      <p className="mb-3 text-sm text-foreground-muted">
        Tap start hour, then end hour — highlight flows across your range.
      </p>
      <div className="relative grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-7">
        {rangeStart !== null && rangeEnd !== null && rangeEnd >= rangeStart && (
          <motion.div
            layout
            layoutId="slot-range-highlight"
            className="pointer-events-none absolute z-0 rounded-xl bg-gradient-to-r from-brand-red/40 via-brand-red/60 to-brand-red/30 ring-1 ring-brand-red/50"
            style={{
              top: `${Math.floor((rangeStart - HOUR_SLOTS[0]) / 7) * (100 / Math.ceil(HOUR_SLOTS.length / 7))}%`,
            }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
          />
        )}

        {HOUR_SLOTS.map((hour) => {
          const occupied = occupiedHours.includes(hour);
          const inRange =
            rangeStart !== null &&
            rangeEnd !== null &&
            hour >= rangeStart &&
            hour <= rangeEnd;
          const isStart = hour === rangeStart;
          const isEnd = hour === rangeEnd;

          return (
            <motion.button
              key={hour}
              type="button"
              layout
              disabled={occupied}
              onClick={() => handleClick(hour)}
              whileHover={occupied ? undefined : { scale: 1.03 }}
              whileTap={occupied ? undefined : { scale: 0.97 }}
              className={cn(
                "relative z-10 rounded-xl border px-2 py-3 text-sm font-medium transition-colors",
                occupied && "cursor-not-allowed border-white/5 bg-stone-50 text-foreground-subtle line-through",
                !occupied && !inRange && "border-border bg-stone-50 hover:border-brand-red/50",
                inRange && "border-brand-red/60 bg-brand-red/35 text-foreground",
                (isStart || isEnd) && "ring-2 ring-brand-red",
              )}
            >
              {formatHourLabel(hour)}
            </motion.button>
          );
        })}
      </div>

      {selectedStart !== null && selectedEnd !== null && (
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 text-sm text-brand-red"
        >
          Selected: {formatHourLabel(selectedStart)} — {formatHourLabel(selectedEnd)}
        </motion.p>
      )}
    </div>
  );
}
