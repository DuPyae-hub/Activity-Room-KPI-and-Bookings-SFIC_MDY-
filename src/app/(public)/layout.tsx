import { PageAmbience } from "@/components/layout/page-ambience";
import { PublicFooter } from "@/components/layout/public-footer";
import { PublicNav } from "@/components/layout/public-nav";

/** Live DB data — do not prerender at build (Vercel may not have DATABASE_URL during build). */
export const dynamic = "force-dynamic";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col pb-8 pt-28">
      <PageAmbience />
      <PublicNav />
      <main className="relative z-[1] mx-auto w-full max-w-6xl flex-1 px-4 sm:px-6">
        {children}
      </main>
      <div className="relative z-[1] mx-auto w-full max-w-6xl px-4 sm:px-6">
        <PublicFooter />
      </div>
    </div>
  );
}
