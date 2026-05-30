import { RoomType } from "@prisma/client";
import type {
  Booking,
  BookingStatus,
  Club,
  Role,
  Room,
  RoomStatus,
  User,
} from "@prisma/client";

export type { BookingStatus, Role, RoomStatus };

export type UserWithClub = User & { club: Club };

export type BookingWithRelations = Booking & {
  room: Room;
  club: Club | null;
  user: Pick<User, "id" | "name" | "email"> | null;
};

export type RoomWithAmenities = Omit<Room, "amenities"> & {
  amenities: string[];
};

export function getBookerDisplay(booking: BookingWithRelations): {
  name: string;
  email: string;
} {
  return {
    name: booking.bookerName || booking.user?.name || "Guest",
    email: booking.bookerEmail || booking.user?.email || "",
  };
}

/** Club (activity) or class name (classroom) shown in lists and KPI */
export function getBookingGroupLabel(booking: BookingWithRelations): string {
  if (booking.className?.trim()) {
    return booking.className.trim();
  }
  if (booking.club) {
    return booking.club.logo
      ? `${booking.club.logo} ${booking.club.name}`
      : booking.club.name;
  }
  return "—";
}

export function isClassroomBooking(booking: {
  className?: string | null;
  room?: { roomType: RoomType };
}): boolean {
  return (
    booking.room?.roomType === RoomType.CLASSROOM ||
    Boolean(booking.className?.trim())
  );
}

export function parseAmenities(amenities: Room["amenities"]): string[] {
  if (Array.isArray(amenities)) {
    return amenities.filter((a): a is string => typeof a === "string");
  }
  return [];
}

export function serializeAmenities(amenities: string[]): string[] {
  return amenities.map((a) => a.trim()).filter(Boolean);
}
