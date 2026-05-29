import Link from "next/link";
import { format } from "date-fns";
import { BookRoomClient } from "@/components/booking/book-room-client";
import { HowItWorks } from "@/components/layout/how-it-works";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { getClubs, getOccupiedHoursByDate, getRooms } from "@/data/queries";
import { ensureDynamicPage } from "@/lib/ensure-dynamic";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  await ensureDynamicPage();

  const params = await searchParams;
  const date = params.date ?? format(new Date(), "yyyy-MM-dd");

  const [rooms, clubs] = await Promise.all([getRooms(), getClubs()]);
  const occupiedByRoom = await getOccupiedHoursByDate(
    date,
    rooms.map((r) => r.id),
  );
  const allAmenities = Array.from(
    new Set(rooms.flatMap((r) => r.amenities)),
  ).sort();

  return (
    <div>
      <PageHeader
        eyebrow="Reserve a space"
        title="Book an activity room"
        description={
          <>
            Choose a room and time for your club. Sessions are{" "}
            <strong className="text-white">2 or 3 hours</strong> (8 AM – 10 PM). No account
            needed — admin approval is required before your booking is confirmed.
          </>
        }
        actions={
          <Link href="/my-bookings">
            <Button variant="secondary">Track my bookings</Button>
          </Link>
        }
      />

      <BookRoomClient
        rooms={rooms}
        clubs={clubs}
        allAmenities={allAmenities}
        date={date}
        occupiedByRoom={occupiedByRoom}
      />

      <HowItWorks className="mt-16" />
    </div>
  );
}
