import { formatInTimeZone, fromZonedTime, toZonedTime } from "date-fns-tz";

/** Myanmar Standard Time — UTC+6:30 (no daylight saving). */
export const APP_TIMEZONE = "Asia/Yangon";

export const APP_TIMEZONE_LABEL = "Myanmar Time (MMT)";

const DATE_ONLY_RE = /^\d{4}-\d{2}-\d{2}$/;

export function isDateOnlyString(value: string): boolean {
  if (!DATE_ONLY_RE.test(value)) return false;
  const d = fromZonedTime(`${value}T12:00:00`, APP_TIMEZONE);
  return !Number.isNaN(d.getTime());
}

/** Safe yyyy-MM-dd for booking URLs — falls back to today in Myanmar. */
export function parseBookingDateParam(value: string | undefined): string {
  if (value && isDateOnlyString(value)) return value;
  return todayInAppTz();
}

export function nowUtc(): Date {
  return new Date();
}

/** Today's calendar date in Myanmar, e.g. 2026-05-29 */
export function todayInAppTz(): string {
  return formatInTimeZone(nowUtc(), APP_TIMEZONE, "yyyy-MM-dd");
}

/** Current month in Myanmar, e.g. 2026-05 */
export function currentMonthInAppTz(): string {
  return formatInTimeZone(nowUtc(), APP_TIMEZONE, "yyyy-MM");
}

/** Build a UTC instant for a local date + hour in Myanmar. */
export function buildSlotDateTime(date: string, hour: number): Date {
  const hh = String(hour).padStart(2, "0");
  return fromZonedTime(`${date}T${hh}:00:00`, APP_TIMEZONE);
}

export function startOfDayInAppTz(date: Date | string): Date {
  const day =
    typeof date === "string"
      ? parseBookingDateParam(date)
      : safeFormatInAppTz(date, "yyyy-MM-dd");
  return fromZonedTime(`${day}T00:00:00`, APP_TIMEZONE);
}

export function endOfDayInAppTz(date: Date | string): Date {
  const day =
    typeof date === "string"
      ? parseBookingDateParam(date)
      : safeFormatInAppTz(date, "yyyy-MM-dd");
  return fromZonedTime(`${day}T23:59:59.999`, APP_TIMEZONE);
}

function safeFormatInAppTz(date: Date, pattern: string): string {
  if (Number.isNaN(date.getTime())) return todayInAppTz();
  try {
    return formatInTimeZone(date, APP_TIMEZONE, pattern);
  } catch {
    return todayInAppTz();
  }
}

export function formatInAppTz(date: Date, pattern: string): string {
  return safeFormatInAppTz(date, pattern);
}

/** Format a yyyy-MM-dd string in Myanmar (avoids UTC midnight shifting the calendar day). */
export function formatDateOnlyInAppTz(dateStr: string, pattern: string): string {
  const day = parseBookingDateParam(dateStr);
  try {
    return formatInTimeZone(
      fromZonedTime(`${day}T12:00:00`, APP_TIMEZONE),
      APP_TIMEZONE,
      pattern,
    );
  } catch {
    return day;
  }
}

export function getHourInAppTz(date: Date): number {
  if (Number.isNaN(date.getTime())) return 8;
  try {
    return Number(formatInTimeZone(date, APP_TIMEZONE, "H"));
  } catch {
    return 8;
  }
}

export function getDateStringInAppTz(date: Date): string {
  return safeFormatInAppTz(date, "yyyy-MM-dd");
}

export function isSameCalendarDayInAppTz(a: Date, b: Date): boolean {
  return getDateStringInAppTz(a) === getDateStringInAppTz(b);
}

/** Hour slots occupied by a booking (8–22 window) in Myanmar local hours. */
export function hoursFromBookingInAppTz(startTime: Date, endTime: Date): number[] {
  const hours: number[] = [];
  const start = Math.max(getHourInAppTz(startTime), 8);
  const end = Math.min(getHourInAppTz(endTime), 22);
  for (let h = start; h < end; h++) hours.push(h);
  return hours;
}

/** For admin edit forms: local date + hour + duration from stored UTC. */
export function bookingLocalPartsInAppTz(startTime: Date, endTime: Date) {
  const zonedStart = toZonedTime(startTime, APP_TIMEZONE);
  return {
    date: formatInTimeZone(startTime, APP_TIMEZONE, "yyyy-MM-dd"),
    startHour: zonedStart.getHours(),
    durationHours: getHourInAppTz(endTime) - getHourInAppTz(startTime),
  };
}
