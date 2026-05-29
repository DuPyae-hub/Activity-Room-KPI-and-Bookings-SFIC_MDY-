import { createHash, timingSafeEqual } from "crypto";

const ADMIN_LOGIN_PATH = "/sfic/manage";

export function getAdminLoginPath(): string {
  return ADMIN_LOGIN_PATH;
}

export function isAdminPasswordConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD?.trim());
}

export function verifyAdminPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD?.trim();
  const value = input.trim();
  if (!expected || !value) return false;

  const a = createHash("sha256").update(value).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

export async function getAdminUserForLogin() {
  const email = process.env.ADMIN_EMAIL ?? "admin@sfic.edu";
  const { prisma } = await import("@/lib/db");
  return prisma.user.findFirst({
    where: { email, role: "ADMIN" },
  });
}
