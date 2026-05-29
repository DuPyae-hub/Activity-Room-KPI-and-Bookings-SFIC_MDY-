import { AdminNav } from "@/components/layout/admin-nav";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdmin();

  return (
    <div className="min-h-screen pb-16 pt-28">
      <AdminNav admin={admin} />
      <main className="mx-auto w-full max-w-6xl px-4">{children}</main>
    </div>
  );
}
