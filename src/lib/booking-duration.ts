import { RoomType } from "@prisma/client";
import { BOOKING_END_HOUR, BOOKING_START_HOUR } from "@/lib/booking-hours";

/** Activity rooms — fixed presets only */
export const ACTIVITY_DURATION_OPTIONS = [2, 3] as const;

/** Classrooms — presets plus optional custom length */
export const CLASSROOM_DURATION_PRESETS = [2, 3, 5] as const;

export const CLASSROOM_CUSTOM_MIN_HOURS = 1;
export const CLASSROOM_CUSTOM_MAX_HOURS =
  BOOKING_END_HOUR - BOOKING_START_HOUR;

export function getDurationPresets(roomType: RoomType): readonly number[] {
  return roomType === RoomType.CLASSROOM
    ? CLASSROOM_DURATION_PRESETS
    : ACTIVITY_DURATION_OPTIONS;
}

export function getDefaultDurationHours(roomType: RoomType): number {
  return getDurationPresets(roomType)[0] ?? 2;
}

export function isPresetDuration(durationHours: number, roomType: RoomType): boolean {
  return (getDurationPresets(roomType) as readonly number[]).includes(durationHours);
}

export function isValidDurationForRoom(
  durationHours: number,
  roomType: RoomType,
): boolean {
  if (!Number.isInteger(durationHours) || durationHours < 1) return false;
  if (durationHours > CLASSROOM_CUSTOM_MAX_HOURS) return false;

  if (roomType === RoomType.ACTIVITY_ROOM) {
    return durationHours === 2 || durationHours === 3;
  }

  if ((CLASSROOM_DURATION_PRESETS as readonly number[]).includes(durationHours)) {
    return true;
  }

  return (
    durationHours >= CLASSROOM_CUSTOM_MIN_HOURS &&
    durationHours <= CLASSROOM_CUSTOM_MAX_HOURS
  );
}

export function durationValidationMessage(roomType: RoomType): string {
  if (roomType === RoomType.ACTIVITY_ROOM) {
    return "Activity rooms can only be booked for 2 or 3 hours.";
  }
  return `Classrooms allow 2, 3, or 5 hours, or a custom length between ${CLASSROOM_CUSTOM_MIN_HOURS} and ${CLASSROOM_CUSTOM_MAX_HOURS} hours (must end by 10:00 PM).`;
}

export function formatDurationLabel(hours: number): string {
  return `${hours} hour${hours === 1 ? "" : "s"}`;
}
