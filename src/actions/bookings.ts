"use server";

import { BookingStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { buildSlotDateTime } from "@/lib/booking-hours";
import {
  bookingCancelSchema,
  bookingCreateSchema,
  bookingStatusSchema,
} from "@/lib/validations";

export type ActionResult<T = void> =
  | { success: true; data?: T }
  | { success: false; error: string };

export async function createBookingAction(
  input: unknown,
): Promise<ActionResult<{ id: string }>> {
  const parsed = bookingCreateSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, error: parsed.error.flatten().formErrors[0] ?? "Invalid booking" };
  }

  const {
    roomId,
    clubId,
    bookerName,
    bookerEmail,
    startHour,
    endHour,
    purpose,
    date,
  } = parsed.data;
  const startTime = buildSlotDateTime(date, startHour);
  const endTime = buildSlotDateTime(date, endHour);

  const [room, club] = await Promise.all([
    prisma.room.findUnique({ where: { id: roomId } }),
    prisma.club.findUnique({ where: { id: clubId } }),
  ]);

  if (!room || room.status !== "AVAILABLE") {
    return { success: false, error: "Room is not available for booking" };
  }

  if (!club) {
    return { success: false, error: "Please select a valid club" };
  }

  const conflict = await prisma.booking.findFirst({
    where: {
      roomId,
      status: { in: [BookingStatus.PENDING, BookingStatus.APPROVED] },
      startTime: { lt: endTime },
      endTime: { gt: startTime },
    },
  });

  if (conflict) {
    return { success: false, error: "This time slot overlaps an existing booking" };
  }

  const booking = await prisma.booking.create({
    data: {
      roomId,
      clubId,
      bookerName: bookerName.trim(),
      bookerEmail: bookerEmail.trim().toLowerCase(),
      startTime,
      endTime,
      purpose,
      status: BookingStatus.PENDING,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/book");
  revalidatePath("/my-bookings");
  revalidatePath("/admin");

  return { success: true, data: { id: booking.id } };
}

export async function updateBookingStatusAction(
  input: unknown,
): Promise<ActionResult> {
  await requireRole(["ADMIN"]);
  const parsed = bookingStatusSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, error: "Invalid status update" };
  }

  const { bookingId, status } = parsed.data;

  await prisma.booking.update({
    where: { id: bookingId },
    data: { status },
  });

  revalidatePath("/admin");
  revalidatePath("/dashboard");
  revalidatePath("/my-bookings");

  return { success: true };
}

export async function cancelBookingAction(
  input: unknown,
): Promise<ActionResult> {
  const parsed = bookingCancelSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, error: "Invalid cancellation request" };
  }

  const { bookingId, bookerEmail } = parsed.data;

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
  });

  if (!booking) {
    return { success: false, error: "Booking not found" };
  }

  if (booking.bookerEmail.toLowerCase() !== bookerEmail.trim().toLowerCase()) {
    return { success: false, error: "Email does not match this booking" };
  }

  if (booking.status === BookingStatus.REJECTED) {
    return { success: false, error: "Booking already cancelled" };
  }

  await prisma.booking.update({
    where: { id: bookingId },
    data: { status: BookingStatus.REJECTED },
  });

  revalidatePath("/my-bookings");
  revalidatePath("/dashboard");
  revalidatePath("/admin");

  return { success: true };
}
