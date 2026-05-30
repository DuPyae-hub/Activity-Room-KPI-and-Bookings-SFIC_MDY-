"use client";

import { RoomType } from "@prisma/client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  formatHourLabel,
  getValidStartHours,
  isSlotRangeAvailable,
} from "@/lib/booking-hours";
import {
  CLASSROOM_CUSTOM_MAX_HOURS,
  CLASSROOM_CUSTOM_MIN_HOURS,
  CLASSROOM_DURATION_PRESETS,
  getDurationPresets,
  isPresetDuration,
} from "@/lib/booking-duration";
import { cn } from "@/lib/utils";

type DurationTimePickerProps = {
  roomType: RoomType;
  selectedStart: number | null;
  durationHours: number;
  occupiedHours: number[];
  onDurationChange: (duration: number) => void;
  onSelectStart: (start: number) => void;
};

export function DurationTimePicker({
  roomType,
  selectedStart,
  durationHours,
  occupiedHours,
  onDurationChange,
  onSelectStart,
}: DurationTimePickerProps) {
  const presets = getDurationPresets(roomType);
  const isClassroom = roomType === RoomType.CLASSROOM;
  const [customMode, setCustomMode] = useState(
    () => isClassroom && !isPresetDuration(durationHours, roomType),
  );

  useEffect(() => {
    setCustomMode(isClassroom && !isPresetDuration(durationHours, roomType));
  }, [roomType, durationHours, isClassroom]);

  const startHours = getValidStartHours(durationHours);

  const selectPreset = (hours: number) => {
    setCustomMode(false);
    onDurationChange(hours);
  };

  const selectCustomMode = () => {
    setCustomMode(true);
    const next =
      isPresetDuration(durationHours, roomType) || durationHours < CLASSROOM_CUSTOM_MIN_HOURS
        ? 4
        : durationHours;
    onDurationChange(Math.min(next, CLASSROOM_CUSTOM_MAX_HOURS));
  };

  const applyCustomHours = (raw: string) => {
    const parsed = parseInt(raw, 10);
    if (Number.isNaN(parsed)) return;
    const clamped = Math.min(
      CLASSROOM_CUSTOM_MAX_HOURS,
      Math.max(CLASSROOM_CUSTOM_MIN_HOURS, parsed),
    );
    onDurationChange(clamped);
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2 text-sm font-medium text-foreground/80">Session length</p>
        <div className="flex flex-wrap gap-2">
          {presets.map((hours) => (
            <button
              key={hours}
              type="button"
              onClick={() => selectPreset(hours)}
              className={cn(
                "min-w-[4.5rem] flex-1 rounded-xl border px-4 py-3 text-sm font-semibold transition sm:flex-none",
                !customMode && durationHours === hours
                  ? "border-brand-red bg-brand-red text-white shadow-lg shadow-brand-red/25"
                  : "border-border-strong bg-stone-50 text-stone-700 hover:border-brand-red/40",
              )}
            >
              {hours} hours
            </button>
          ))}
          {isClassroom && (
            <button
              type="button"
              onClick={selectCustomMode}
              className={cn(
                "min-w-[4.5rem] flex-1 rounded-xl border px-4 py-3 text-sm font-semibold transition sm:flex-none",
                customMode
                  ? "border-brand-orange bg-brand-orange text-white shadow-lg shadow-brand-orange/25"
                  : "border-border-strong bg-stone-50 text-stone-700 hover:border-brand-orange/40",
              )}
            >
              Custom
            </button>
          )}
        </div>
        {isClassroom && customMode && (
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-foreground-muted">
              <span>Hours</span>
              <input
                type="number"
                min={CLASSROOM_CUSTOM_MIN_HOURS}
                max={CLASSROOM_CUSTOM_MAX_HOURS}
                value={durationHours}
                onChange={(e) => applyCustomHours(e.target.value)}
                className="field-input w-20 py-2 text-center"
              />
            </label>
            <p className="text-xs text-foreground-subtle">
              {CLASSROOM_CUSTOM_MIN_HOURS}–{CLASSROOM_CUSTOM_MAX_HOURS} hours · must finish by
              10:00 PM
            </p>
          </div>
        )}
        {isClassroom && !customMode && (
          <p className="mt-2 text-xs text-foreground-subtle">
            Presets: {CLASSROOM_DURATION_PRESETS.join(", ")} hours — or choose Custom for another
            length.
          </p>
        )}
      </div>

      <div>
        <p className="mb-2 text-sm text-foreground-muted">
          Choose a start time — reserved for {durationHours} consecutive hour
          {durationHours === 1 ? "" : "s"}.
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
                    "cursor-not-allowed border-border bg-stone-50 text-foreground-subtle line-through",
                  available &&
                    !selected &&
                    "border-border bg-stone-50 hover:border-brand-red/50",
                  available &&
                    selected &&
                    "border-brand-red bg-brand-red/15 text-foreground ring-2 ring-brand-red",
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
