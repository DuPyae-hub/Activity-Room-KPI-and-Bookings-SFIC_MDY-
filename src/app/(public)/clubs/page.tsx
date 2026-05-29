import Link from "next/link";
import { ClubsGrid } from "@/components/clubs/clubs-grid";
import { PageHeader } from "@/components/layout/page-header";
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
      <PageHeader
        eyebrow="Strategy First · Mandalay"
        title="Student clubs"
        description={
          <>
            Official SFIC MDY clubs. When you book a room, select your club from this list.
            Sessions are booked in <strong className="text-white">2-hour</strong> or{" "}
            <strong className="text-white">3-hour</strong> blocks.
          </>
        }
        actions={
          <Link href="/book">
            <Button variant="gold">Book an activity room</Button>
          </Link>
        }
      />

      <ClubsGrid clubs={clubs} />
    </div>
  );
}
