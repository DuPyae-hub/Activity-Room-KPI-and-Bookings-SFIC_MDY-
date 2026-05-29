import { Prisma } from "@prisma/client";

export function isDbConnectionError(error: unknown): boolean {
  if (error instanceof Prisma.PrismaClientInitializationError) return true;
  if (error instanceof Error) {
    return (
      error.message.includes("Can't reach database server") ||
      error.message.includes("P1001") ||
      error.message.includes("ECONNREFUSED")
    );
  }
  return false;
}
