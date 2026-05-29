"use client";

import { motion } from "framer-motion";
import {
  formatHourLabel,
  getValidStartHours,
  isSlotRangeAvailable,
} from "@/lib/booking-hours";
import {
  BOOKING_DURATION_OPTIONS,
  type BookingDurationHours,
} from "@/lib/sfic-clubs";
import { cn } from "@/lib/utils";

type DurationTimePickerProps = {
  selectedStart: number | null;
  durationHours: BookingDurationHours;
  occupiedHours: number[];
  onDurationChange: (duration: BookingDurationHours) => void;
  onSelectStart: (start: number) => void;
};

export function DurationTimePicker({
  selectedStart,
  durationHours,
  occupiedHours,
  onDurationChange,
  onSelectStart,
}: DurationTimePickerProps) {
  const startHours = getValidStartHours(durationHours);

  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2 text-sm font-medium text-foreground/80">Session length</p>
        <div className="flex gap-2">
          {BOOKING_DURATION_OPTIONS.map((hours) => (
            <button
              key={hours}
              type="button"
              onClick={() => onDurationChange(hours)}
              className={cn(
                "flex-1 rounded-xl border px-4 py-3 text-sm font-semibold transition",
                durationHours === hours
                  ? "border-brand-red bg-brand-red text-foreground shadow-lg shadow-brand-red/25"
                  : "border-border-strong bg-stone-50 text-stone-700 hover:border-brand-red/40",
              )}
            >
              {hours} hours
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm text-foreground-muted">
          Choose a start time — your room is reserved for {durationHours} consecutive hours.
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-5">
          {startHours.map((hour) => {
            const available = isSlotRangeAvailable(hour, durationHours, occupiedHours);
            const selected = selectedStart === hour;

            return (
              <motion.button
                key={hour}
                type="button"
                disabled={!available}
                onClick={() => available && onSelectStart(hour)}
                whileHover={available ? { scale: 1.03 } : undefined}
                whileTap={available ? { scale: 0.97 } : undefined}
                className={cn(
                  "rounded-xl border px-2 py-3 text-sm font-medium transition-colors",
                  !available &&
                    "cursor-not-allowed border-white/5 bg-stone-50 text-foreground-subtle line-through",
                  available &&
                    !selected &&
                    "border-border bg-stone-50 hover:border-brand-red/50",
                  available &&
                    selected &&
                    "border-brand-red bg-brand-red/35 text-foreground ring-2 ring-brand-red",
                )}
              >
                {formatHourLabel(hour)}
              </motion.button>
            );
          })}
        </div>
      </div>

      {selectedStart !== null &&
        isSlotRangeAvailable(selectedStart, durationHours, occupiedHours) && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-brand-red"
          >
            {formatHourLabel(selectedStart)} —{" "}
            {formatHourLabel(selectedStart + durationHours)} ({durationHours} hr)
          </motion.p>
        )}
    </div>
  );
}
