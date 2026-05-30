"use server";

import { BookingStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { validateBookingParty } from "@/lib/booking-party";
import {
  durationValidationMessage,
  isValidDurationForRoom,
} from "@/lib/booking-duration";
import { buildSlotDateTime } from "@/lib/timezone";
import {
  bookingAdminUpdateSchema,
  bookingCancelSchema,
  bookingCreateSchema,
  bookingDeleteSchema,
  bookingStatusSchema,
} from "@/lib/validations";

function revalidateBookingPaths() {
  revalidatePath("/dashboard");
  revalidatePath("/book");
  revalidatePath("/my-bookings");
  revalidatePath("/admin");
  revalidatePath("/admin/bookings");
}

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
    className,
    bookerName,
    bookerEmail,
    startHour,
    durationHours,
    purpose,
    date,
  } = parsed.data;
  const endHour = startHour + durationHours;
  const startTime = buildSlotDateTime(date, startHour);
  const endTime = buildSlotDateTime(date, endHour);

  const room = await prisma.room.findUnique({ where: { id: roomId } });

  if (!room || room.status !== "AVAILABLE") {
    return { success: false, error: "Room is not available for booking" };
  }

  if (!isValidDurationForRoom(durationHours, room.roomType)) {
    return { success: false, error: durationValidationMessage(room.roomType) };
  }

  const party = validateBookingParty(room.roomType, { clubId, className, purpose });
  if (!party.ok) {
    return { success: false, error: party.error };
  }

  if (party.clubId) {
    const club = await prisma.club.findUnique({ where: { id: party.clubId } });
    if (!club) {
      return { success: false, error: "Please select a valid club" };
    }
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
      clubId: party.clubId,
      className: party.className,
      bookerName: bookerName.trim(),
      bookerEmail: bookerEmail.trim().toLowerCase(),
      startTime,
      endTime,
      purpose: party.purpose,
      status: BookingStatus.PENDING,
    },
  });

  revalidateBookingPaths();

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

  revalidateBookingPaths();

  return { success: true };
}

export async function updateBookingAction(
  input: unknown,
): Promise<ActionResult> {
  await requireRole(["ADMIN"]);
  const parsed = bookingAdminUpdateSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.flatten().formErrors[0] ?? "Invalid booking update",
    };
  }

  const {
    id,
    roomId,
    clubId,
    className,
    bookerName,
    bookerEmail,
    startHour,
    durationHours,
    purpose,
    date,
    status,
  } = parsed.data;

  const endHour = startHour + durationHours;
  const startTime = buildSlotDateTime(date, startHour);
  const endTime = buildSlotDateTime(date, endHour);

  const existing = await prisma.booking.findUnique({ where: { id } });
  if (!existing) {
    return { success: false, error: "Booking not found" };
  }

  const room = await prisma.room.findUnique({ where: { id: roomId } });
  if (!room) return { success: false, error: "Room not found" };

  if (!isValidDurationForRoom(durationHours, room.roomType)) {
    return { success: false, error: durationValidationMessage(room.roomType) };
  }

  const party = validateBookingParty(room.roomType, {
    clubId: clubId ?? undefined,
    className: className ?? undefined,
    purpose,
  });
  if (!party.ok) {
    return { success: false, error: party.error };
  }

  if (party.clubId) {
    const club = await prisma.club.findUnique({ where: { id: party.clubId } });
    if (!club) return { success: false, error: "Club not found" };
  }

  if (
    status !== BookingStatus.REJECTED &&
    room.status !== "AVAILABLE"
  ) {
    return { success: false, error: "Room is not available for booking" };
  }

  if (status === BookingStatus.PENDING || status === BookingStatus.APPROVED) {
    const conflict = await prisma.booking.findFirst({
      where: {
        id: { not: id },
        roomId,
        status: { in: [BookingStatus.PENDING, BookingStatus.APPROVED] },
        startTime: { lt: endTime },
        endTime: { gt: startTime },
      },
    });
    if (conflict) {
      return { success: false, error: "This time slot overlaps an existing booking" };
    }
  }

  await prisma.booking.update({
    where: { id },
    data: {
      roomId,
      clubId: party.clubId,
      className: party.className,
      bookerName: bookerName.trim(),
      bookerEmail: bookerEmail.trim().toLowerCase(),
      startTime,
      endTime,
      purpose: party.purpose,
      status,
    },
  });

  revalidateBookingPaths();
  return { success: true };
}

export async function deleteBookingAction(
  input: unknown,
): Promise<ActionResult> {
  await requireRole(["ADMIN"]);
  const parsed = bookingDeleteSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, error: "Invalid delete request" };
  }

  const existing = await prisma.booking.findUnique({
    where: { id: parsed.data.bookingId },
  });
  if (!existing) {
    return { success: false, error: "Booking not found" };
  }

  await prisma.booking.delete({ where: { id: parsed.data.bookingId } });

  revalidateBookingPaths();
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

  revalidateBookingPaths();

  return { success: true };
}
