import { BookingStatus, RoomStatus, RoomType } from "@prisma/client";
import { z } from "zod";
import { BOOKING_END_HOUR, BOOKING_START_HOUR } from "@/lib/booking-hours";
import { CLASSROOM_CUSTOM_MAX_HOURS } from "@/lib/booking-duration";

const durationHoursField = z
  .number()
  .int()
  .min(1)
  .max(CLASSROOM_CUSTOM_MAX_HOURS);

export const adminLoginSchema = z.object({
  password: z.string().min(1, "Password required"),
});

export const bookingCreateSchema = z
  .object({
    roomId: z.string().min(1),
    clubId: z.string().optional(),
    className: z.string().max(120).optional(),
    bookerName: z.string().min(2).max(120),
    bookerEmail: z.string().email(),
    startHour: z.number().int().min(BOOKING_START_HOUR).max(BOOKING_END_HOUR - 1),
    durationHours: durationHoursField,
    purpose: z.string().max(500).optional(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  })
  .refine((d) => d.startHour + d.durationHours <= BOOKING_END_HOUR, {
    message: "Booking must end by 10:00 PM",
    path: ["startHour"],
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
    clubId: z.string().optional().nullable(),
    className: z.string().max(120).optional().nullable(),
    bookerName: z.string().min(2).max(120),
    bookerEmail: z.string().email(),
    startHour: z.number().int().min(BOOKING_START_HOUR).max(BOOKING_END_HOUR - 1),
    durationHours: durationHoursField,
    purpose: z.string().max(500).optional(),
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
