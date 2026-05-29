import { redirect } from "next/navigation";
import { LandingHero } from "@/components/home/landing-hero";
import { PageAmbience } from "@/components/layout/page-ambience";
import { PublicFooter } from "@/components/layout/public-footer";
import { PublicNav } from "@/components/layout/public-nav";
import { getSessionAdmin } from "@/lib/auth";
import { isDbConnectionError } from "@/lib/safe-query";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  try {
    const admin = await getSessionAdmin();
    if (admin) redirect("/admin");
  } catch (error) {
    if (!isDbConnectionError(error)) throw error;
  }

  return (
    <div className="relative min-h-screen pb-16 pt-28">
      <PageAmbience />
      <PublicNav />
      <main className="relative z-[1] mx-auto w-full max-w-6xl px-4">
        <LandingHero />
        <PublicFooter />
      </main>
    </div>
  );
}
