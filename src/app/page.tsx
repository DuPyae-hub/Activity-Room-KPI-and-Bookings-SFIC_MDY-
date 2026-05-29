import { redirect } from "next/navigation";
import { LandingHero } from "@/components/home/landing-hero";
import { PublicFooter } from "@/components/layout/public-footer";
import { PublicNav } from "@/components/layout/public-nav";
import { getSessionAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const admin = await getSessionAdmin();
  if (admin) redirect("/admin");

  return (
    <div className="min-h-screen pb-16 pt-28">
      <PublicNav />
      <main className="mx-auto w-full max-w-6xl px-4">
        <LandingHero />
        <PublicFooter />
      </main>
    </div>
  );
}
