import { BookingStatus, RoomStatus } from "@prisma/client";
import { z } from "zod";

export const adminLoginSchema = z.object({
  password: z.string().min(1, "Password required"),
});

export const bookingCreateSchema = z
  .object({
    roomId: z.string().min(1),
    clubId: z.string().min(1),
    bookerName: z.string().min(2).max(120),
    bookerEmail: z.string().email(),
    startHour: z.number().int().min(8).max(21),
    endHour: z.number().int().min(9).max(22),
    purpose: z.string().min(3).max(500),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  })
  .refine((d) => d.endHour > d.startHour, {
    message: "End time must be after start time",
    path: ["endHour"],
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

export const roomUpsertSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2).max(80),
  capacity: z.coerce.number().int().min(1).max(500),
  amenities: z.array(z.string().min(1)).default([]),
  status: z.nativeEnum(RoomStatus),
});

export const amenityFilterSchema = z.array(z.string()).optional();
