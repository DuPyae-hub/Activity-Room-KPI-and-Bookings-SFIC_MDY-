import Link from "next/link";
import { ClubsGrid } from "@/components/clubs/clubs-grid";
import { Button } from "@/components/ui/button";
import { getClubs } from "@/data/queries";
import { ensureDynamicPage } from "@/lib/ensure-dynamic";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ClubsPage() {
  await ensureDynamicPage();

  const clubs = await getClubs();

  return (
    <div>
      <header className="mb-8">
        <p className="brand-subheading">Strategy First · Mandalay</p>
        <h1 className="text-3xl font-bold tracking-tight">Student clubs</h1>
        <p className="mt-2 max-w-2xl text-white/50">
          Official SFIC MDY clubs. Select your club when booking an activity room —
          sessions are available in <strong className="text-white">2-hour</strong> or{" "}
          <strong className="text-white">3-hour</strong> blocks.
        </p>
        <Link href="/book" className="mt-4 inline-block">
          <Button variant="gold">Book an activity room</Button>
        </Link>
      </header>

      <ClubsGrid clubs={clubs} />
    </div>
  );
}
