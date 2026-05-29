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
