import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Role } from "@prisma/client";
import { getAdminLoginPath } from "@/lib/admin-auth";
import {
  createAdminSessionToken,
  verifyAdminSessionToken,
} from "@/lib/admin-session";
import { prisma } from "@/lib/db";
import type { UserWithClub } from "@/lib/types";

const SESSION_COOKIE = "sfic_admin_session";

export async function getSessionAdmin(): Promise<UserWithClub | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const session = await verifyAdminSessionToken(token);
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: { club: true },
  });

  if (!user || user.role !== "ADMIN") {
    return null;
  }

  return user;
}

export async function requireAdmin(): Promise<UserWithClub> {
  const admin = await getSessionAdmin();
  if (!admin) redirect(getAdminLoginPath());
  return admin;
}

/** @deprecated Use requireAdmin — kept for admin-only server actions */
export async function requireRole(roles: Role[]): Promise<UserWithClub> {
  const admin = await requireAdmin();
  if (!roles.includes(admin.role)) redirect(getAdminLoginPath());
  return admin;
}

export async function setSessionAdmin(userId: string): Promise<void> {
  const cookieStore = await cookies();
  const token = await createAdminSessionToken(userId);
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
