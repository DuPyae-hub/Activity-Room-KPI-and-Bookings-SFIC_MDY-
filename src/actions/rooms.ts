"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { serializeAmenities } from "@/lib/types";
import { roomUpsertSchema } from "@/lib/validations";
import type { ActionResult } from "@/actions/bookings";

export async function upsertRoomAction(input: unknown): Promise<ActionResult<{ id: string }>> {
  await requireRole(["ADMIN"]);
  const parsed = roomUpsertSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, error: "Invalid room data" };
  }

  const { id, name, capacity, amenities, status, roomType } = parsed.data;
  const payload = {
    name,
    capacity,
    amenities: serializeAmenities(amenities),
    status,
    roomType,
  };

  if (id) {
    await prisma.room.update({ where: { id }, data: payload });
    revalidatePath("/admin/rooms");
    revalidatePath("/book");
    revalidatePath("/dashboard");
    revalidatePath("/admin/bookings");
    return { success: true, data: { id } };
  }

  const room = await prisma.room.create({ data: payload });
  revalidatePath("/admin/rooms");
  revalidatePath("/book");
  revalidatePath("/dashboard");
  return { success: true, data: { id: room.id } };
}

export async function deleteRoomAction(roomId: string): Promise<ActionResult> {
  await requireRole(["ADMIN"]);

  const activeBookings = await prisma.booking.count({
    where: {
      roomId,
      status: { in: ["PENDING", "APPROVED"] },
      endTime: { gt: new Date() },
    },
  });

  if (activeBookings > 0) {
    return { success: false, error: "Cannot delete room with active bookings" };
  }

  await prisma.room.delete({ where: { id: roomId } });
  revalidatePath("/admin/rooms");
  revalidatePath("/book");
  revalidatePath("/dashboard");

  return { success: true };
}
