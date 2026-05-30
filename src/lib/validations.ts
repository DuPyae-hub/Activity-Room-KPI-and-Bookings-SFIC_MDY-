import { BookingStatus, RoomStatus, RoomType } from "@prisma/client";
import { z } from "zod";
import { BOOKING_END_HOUR, BOOKING_START_HOUR } from "@/lib/booking-hours";
import { BOOKING_DURATION_OPTIONS } from "@/lib/sfic-clubs";

export const adminLoginSchema = z.object({
  password: z.string().min(1, "Password required"),
});

export const bookingCreateSchema = z
  .object({
    roomId: z.string().min(1),
    clubId: z.string().min(1),
    bookerName: z.string().min(2).max(120),
    bookerEmail: z.string().email(),
    startHour: z.number().int().min(BOOKING_START_HOUR).max(BOOKING_END_HOUR - 1),
    durationHours: z.union([
      z.literal(BOOKING_DURATION_OPTIONS[0]),
      z.literal(BOOKING_DURATION_OPTIONS[1]),
    ]),
    purpose: z.string().min(3).max(500),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  })
  .refine((d) => d.startHour + d.durationHours <= BOOKING_END_HOUR, {
    message: "Booking must end by 10:00 PM",
    path: ["startHour"],
  })
  .refine((d) => d.durationHours === 2 || d.durationHours === 3, {
    message: "Duration must be 2 or 3 hours",
    path: ["durationHours"],
  });

export const clubUpsertSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2).max(120),
  logo: z.string().max(8).optional().nullable(),
  description: z.string().max(300).optional().nullable(),
});

export const bookingLookupSchema = z.object({
  email: z.string().email(),
});

export const bookingCancelSchema = z.object({
  bookingId: z.string().min(1),
  bookerEmail: z.string().email(),
});

export const bookingStatusSchema = z.object({
  bookingId: z.string().min(1),
  status: z.nativeEnum(BookingStatus),
});

export const bookingDeleteSchema = z.object({
  bookingId: z.string().min(1),
});

export const bookingAdminUpdateSchema = z
  .object({
    id: z.string().min(1),
    roomId: z.string().min(1),
    clubId: z.string().min(1),
    bookerName: z.string().min(2).max(120),
    bookerEmail: z.string().email(),
    startHour: z.number().int().min(BOOKING_START_HOUR).max(BOOKING_END_HOUR - 1),
    durationHours: z.union([
      z.literal(BOOKING_DURATION_OPTIONS[0]),
      z.literal(BOOKING_DURATION_OPTIONS[1]),
    ]),
    purpose: z.string().min(3).max(500),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    status: z.nativeEnum(BookingStatus),
  })
  .refine((d) => d.startHour + d.durationHours <= BOOKING_END_HOUR, {
    message: "Booking must end by 10:00 PM",
    path: ["startHour"],
  });

export const roomUpsertSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2).max(80),
  capacity: z.coerce.number().int().min(1).max(500),
  amenities: z.array(z.string().min(1)).default([]),
  status: z.nativeEnum(RoomStatus),
  roomType: z.nativeEnum(RoomType).default(RoomType.ACTIVITY_ROOM),
});

export const amenityFilterSchema = z.array(z.string()).optional();
