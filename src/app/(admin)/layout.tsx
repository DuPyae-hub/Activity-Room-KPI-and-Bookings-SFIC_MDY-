import { redirect } from "next/navigation";
import { DbUnavailableBanner } from "@/components/admin/db-unavailable-banner";
import { AdminNav } from "@/components/layout/admin-nav";
import { getAdminLoginPath } from "@/lib/admin-auth";
import { getSessionAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { isDbConnectionError } from "@/lib/safe-query";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let dbError = false;

  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (error) {
    if (isDbConnectionError(error)) dbError = true;
    else throw error;
  }

  const admin = dbError ? null : await getSessionAdmin();
  if (!dbError && !admin) {
    redirect(getAdminLoginPath());
  }

  return (
    <div className="min-h-screen pb-16 pt-28">
      {admin && <AdminNav admin={admin} />}
      <main className="mx-auto w-full max-w-6xl px-4">
        {dbError ? <DbUnavailableBanner /> : children}
      </main>
    </div>
  );
}
