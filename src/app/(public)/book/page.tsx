import Link from "next/link";
import { BookRoomClient } from "@/components/booking/book-room-client";
import { HowItWorks } from "@/components/layout/how-it-works";
import { DbErrorBanner } from "@/components/layout/db-error-banner";
import { PageHeader } from "@/components/layout/page-header";
import { TimezoneNotice } from "@/components/layout/timezone-notice";
import { Button } from "@/components/ui/button";
import { getClubs, getOccupiedHoursByDate, getRooms } from "@/data/queries";
import { ensureDynamicPage } from "@/lib/ensure-dynamic";
import { isDbConnectionError } from "@/lib/safe-query";
import { parseBookingDateParam } from "@/lib/timezone";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  await ensureDynamicPage();

  const params = await searchParams;
  const date = parseBookingDateParam(params.date);

  let rooms: Awaited<ReturnType<typeof getRooms>> = [];
  let clubs: Awaited<ReturnType<typeof getClubs>> = [];
  let occupiedByRoom: Record<string, number[]> = {};
  let dbError = false;

  try {
    rooms = await getRooms();
    clubs = await getClubs();
    occupiedByRoom = await getOccupiedHoursByDate(
      date,
      rooms.map((r) => r.id),
    );
  } catch (error) {
    if (isDbConnectionError(error)) dbError = true;
    else throw error;
  }

  const allAmenities = Array.from(new Set(rooms.flatMap((r) => r.amenities))).sort();

  return (
    <div>
      <PageHeader
        eyebrow="Reserve a space"
        title="Book an activity room"
        description={
          <>
            Choose a room and time for your club. Sessions are{" "}
            <strong className="text-white">2 or 3 hours</strong> (8 AM – 10 PM). No account
            needed — admin approval is required before your booking is confirmed.{" "}
            <TimezoneNotice className="mt-2 block" />
          </>
        }
        actions={
          <Link href="/my-bookings">
            <Button variant="secondary">Track my bookings</Button>
          </Link>
        }
      />

      {dbError && <DbErrorBanner />}

      {!dbError && (
        <BookRoomClient
          rooms={rooms}
          clubs={clubs}
          allAmenities={allAmenities}
          date={date}
          occupiedByRoom={occupiedByRoom}
        />
      )}

      <HowItWorks className="mt-16" />
    </div>
  );
}
