import { PublicNav } from "@/components/layout/public-nav";
import { getSessionAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getSessionAdmin();

  return (
    <div className="min-h-screen pb-16 pt-28">
      <PublicNav admin={admin} />
      <main className="mx-auto w-full max-w-6xl px-4">{children}</main>
    </div>
  );
}
