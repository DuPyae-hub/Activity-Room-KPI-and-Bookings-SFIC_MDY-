import { BookingStatus, type RoomType } from "@prisma/client";
import { prisma } from "@/lib/db";
import {
  endOfDayInAppTz,
  hoursFromBookingInAppTz,
  startOfDayInAppTz,
} from "@/lib/timezone";
import { parseAmenities, type BookingWithRelations, type RoomWithAmenities } from "@/lib/types";

const bookingInclude = {
  room: true,
  club: true,
  user: { select: { id: true, name: true, email: true } },
} as const;

export async function getRooms(options?: {
  roomType?: RoomType;
  amenityFilters?: string[];
}): Promise<RoomWithAmenities[]> {
  const rooms = await prisma.room.findMany({
    where: options?.roomType ? { roomType: options.roomType } : undefined,
    orderBy: { name: "asc" },
  });

  return rooms
    .map((room) => ({
      ...room,
      amenities: parseAmenities(room.amenities),
    }))
    .filter((room) => {
      const amenityFilters = options?.amenityFilters;
      if (!amenityFilters?.length) return true;
      return amenityFilters.every((tag) =>
        room.amenities.some((a) => a.toLowerCase().includes(tag.toLowerCase())),
      );
    });
}

export async function getClubs() {
  return prisma.club.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, logo: true, description: true },
  });
}

export async function getTodayTimeline(date: Date, roomType?: RoomType) {
  return getApprovedBookingsBetween(
    startOfDayInAppTz(date),
    endOfDayInAppTz(date),
    roomType,
  );
}

export async function getApprovedBookingsBetween(
  start: Date,
  end: Date,
  roomType?: RoomType,
) {
  return prisma.booking.findMany({
    where: {
      status: BookingStatus.APPROVED,
      startTime: { lt: end },
      endTime: { gt: start },
      ...(roomType ? { room: { roomType } } : {}),
    },
    include: bookingInclude,
    orderBy: { startTime: "asc" },
  }) as Promise<BookingWithRelations[]>;
}

export async function getAllBookingsForAdmin() {
  return prisma.booking.findMany({
    include: bookingInclude,
    orderBy: { startTime: "desc" },
  }) as Promise<BookingWithRelations[]>;
}

export async function getBookingsByEmail(email: string) {
  return prisma.booking.findMany({
    where: { bookerEmail: email.trim().toLowerCase() },
    include: bookingInclude,
    orderBy: { createdAt: "desc" },
  }) as Promise<BookingWithRelations[]>;
}

export async function getBookingById(id: string) {
  return prisma.booking.findUnique({
    where: { id },
    include: { room: true, club: true },
  });
}

export async function getPendingBookings() {
  return prisma.booking.findMany({
    where: { status: BookingStatus.PENDING },
    include: bookingInclude,
    orderBy: { createdAt: "asc" },
  }) as Promise<BookingWithRelations[]>;
}

export async function getAdminKpis() {
  const [clubCountsRaw, hourRows, pendingCount] = await Promise.all([
    prisma.booking.groupBy({
      by: ["clubId"],
      where: { status: BookingStatus.APPROVED, clubId: { not: null } },
      _count: { _all: true },
    }),
    prisma.$queryRaw<{ hour: number; count: bigint }[]>`
      SELECT EXTRACT(HOUR FROM "startTime")::int AS hour, COUNT(*)::bigint AS count
      FROM "Booking"
      WHERE status = 'APPROVED'
      GROUP BY hour
      ORDER BY count DESC
      LIMIT 8
    `,
    prisma.booking.count({ where: { status: BookingStatus.PENDING } }),
  ]);

  const clubCounts = [...clubCountsRaw]
    .filter((row): row is typeof row & { clubId: string } => row.clubId != null)
    .sort((a, b) => b._count._all - a._count._all)
    .slice(0, 5);

  const clubs = await prisma.club.findMany({
    where: { id: { in: clubCounts.map((c) => c.clubId) } },
  });

  const clubMap = new Map(clubs.map((c) => [c.id, c.name]));

  return {
    topClubs: clubCounts.map((row) => ({
      clubId: row.clubId,
      name: clubMap.get(row.clubId) ?? "Unknown",
      count: row._count._all,
    })),
    peakHours: hourRows.map((row) => ({
      hour: row.hour,
      count: Number(row.count),
    })),
    pendingCount,
  };
}

/** One DB round-trip for all rooms on a date (avoids N+1 queries on /book). */
export async function getOccupiedHoursByDate(
  date: string,
  roomIds: string[],
): Promise<Record<string, number[]>> {
  const result = Object.fromEntries(roomIds.map((id) => [id, [] as number[]]));
  if (roomIds.length === 0) return result;

  const dayStart = startOfDayInAppTz(date);
  const dayEnd = endOfDayInAppTz(date);

  const bookings = await prisma.booking.findMany({
    where: {
      roomId: { in: roomIds },
      status: { in: [BookingStatus.PENDING, BookingStatus.APPROVED] },
      startTime: { lt: dayEnd },
      endTime: { gt: dayStart },
    },
    select: { roomId: true, startTime: true, endTime: true },
  });

  const byRoom = new Map<string, Set<number>>();
  for (const b of bookings) {
    let set = byRoom.get(b.roomId);
    if (!set) {
      set = new Set();
      byRoom.set(b.roomId, set);
    }
    for (const h of hoursFromBookingInAppTz(b.startTime, b.endTime)) set.add(h);
  }

  for (const [roomId, hours] of byRoom) {
    result[roomId] = Array.from(hours).sort((a, b) => a - b);
  }
  return result;
}

export async function getRoomOccupiedHours(roomId: string, date: string): Promise<number[]> {
  const map = await getOccupiedHoursByDate(date, [roomId]);
  return map[roomId] ?? [];
}
