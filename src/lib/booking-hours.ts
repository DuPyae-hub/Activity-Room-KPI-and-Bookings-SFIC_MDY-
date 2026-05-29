import type { BookingDurationHours } from "@/lib/sfic-clubs";

export const BOOKING_START_HOUR = 8;
export const BOOKING_END_HOUR = 22;

export const HOUR_SLOTS = Array.from(
  { length: BOOKING_END_HOUR - BOOKING_START_HOUR },
  (_, i) => BOOKING_START_HOUR + i,
);

export function formatHourLabel(hour: number): string {
  const period = hour >= 12 ? "PM" : "AM";
  const h = hour % 12 === 0 ? 12 : hour % 12;
  return `${h}:00 ${period}`;
}

export function buildSlotDateTime(date: string, hour: number): Date {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(y, m - 1, d, hour, 0, 0, 0);
}

export function maxStartHourForDuration(durationHours: BookingDurationHours): number {
  return BOOKING_END_HOUR - durationHours;
}

export function getValidStartHours(durationHours: BookingDurationHours): number[] {
  const maxStart = maxStartHourForDuration(durationHours);
  return HOUR_SLOTS.filter((h) => h <= maxStart);
}

export function isSlotRangeAvailable(
  startHour: number,
  durationHours: BookingDurationHours,
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
