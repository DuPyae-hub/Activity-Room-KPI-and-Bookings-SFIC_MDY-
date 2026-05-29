import { PublicNav } from "@/components/layout/public-nav";

/** Live DB data — do not prerender at build (Vercel may not have DATABASE_URL during build). */
export const dynamic = "force-dynamic";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen pb-16 pt-28">
      <PublicNav />
      <main className="mx-auto w-full max-w-6xl px-4">{children}</main>
    </div>
  );
}
