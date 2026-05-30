export {
  BOOKING_END_HOUR,
  BOOKING_END_TIME_LABEL,
  BOOKING_HOURS_LABEL,
  BOOKING_START_HOUR,
} from "@/lib/booking-window";

import {
  BOOKING_END_HOUR,
  BOOKING_START_HOUR,
} from "@/lib/booking-window";

export const HOUR_SLOTS = Array.from(
  { length: BOOKING_END_HOUR - BOOKING_START_HOUR },
  (_, i) => BOOKING_START_HOUR + i,
);

export function formatHourLabel(hour: number): string {
  const period = hour >= 12 ? "PM" : "AM";
  const h = hour % 12 === 0 ? 12 : hour % 12;
  return `${h}:00 ${period}`;
}

export { buildSlotDateTime } from "@/lib/timezone";

export function maxStartHourForDuration(durationHours: number): number {
  return BOOKING_END_HOUR - durationHours;
}

export function getValidStartHours(durationHours: number): number[] {
  const maxStart = maxStartHourForDuration(durationHours);
  return HOUR_SLOTS.filter((h) => h <= maxStart);
}

export function isSlotRangeAvailable(
  startHour: number,
  durationHours: number,
  occupiedHours: number[],
): boolean {
  if (startHour < BOOKING_START_HOUR) return false;
  if (startHour + durationHours > BOOKING_END_HOUR) return false;
  for (let h = startHour; h < startHour + durationHours; h++) {
    if (occupiedHours.includes(h)) return false;
  }
  return true;
}

export function getHoursInBooking(startHour: number, endHour: number): number[] {
  const hours: number[] = [];
  for (let h = startHour; h < endHour; h++) hours.push(h);
  return hours;
}
