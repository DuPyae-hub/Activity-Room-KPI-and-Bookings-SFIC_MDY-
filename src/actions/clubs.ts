"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { clubUpsertSchema } from "@/lib/validations";
import type { ActionResult } from "@/actions/bookings";

function revalidateClubPaths() {
  revalidatePath("/clubs");
  revalidatePath("/book");
  revalidatePath("/admin/clubs");
  revalidatePath("/admin");
  revalidatePath("/dashboard");
}

export async function upsertClubAction(
  input: unknown,
): Promise<ActionResult<{ id: string }>> {
  await requireRole(["ADMIN"]);
  const parsed = clubUpsertSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.flatten().formErrors[0] ?? "Invalid club data",
    };
  }

  const { id, name, logo, description } = parsed.data;
  const payload = {
    name: name.trim(),
    logo: logo?.trim() || null,
    description: description?.trim() || null,
  };

  if (id) {
    await prisma.club.update({ where: { id }, data: payload });
    revalidateClubPaths();
    return { success: true, data: { id } };
  }

  const club = await prisma.club.create({ data: payload });
  revalidateClubPaths();
  return { success: true, data: { id: club.id } };
}

export async function deleteClubAction(clubId: string): Promise<ActionResult> {
  await requireRole(["ADMIN"]);

  const [userCount, bookingCount] = await Promise.all([
    prisma.user.count({ where: { clubId } }),
    prisma.booking.count({ where: { clubId } }),
  ]);

  if (bookingCount > 0) {
    return {
      success: false,
      error: "Cannot delete a club that has bookings. Reassign or remove bookings first.",
    };
  }

  if (userCount > 0) {
    return {
      success: false,
      error: "Cannot delete a club linked to user accounts.",
    };
  }

  await prisma.club.delete({ where: { id: clubId } });
  revalidateClubPaths();
  return { success: true };
}
