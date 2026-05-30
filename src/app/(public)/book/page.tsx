import Link from "next/link";
import { Suspense } from "react";
import { BookingMascotHint } from "@/components/booking/booking-mascot-hint";
import { BookRoomClient } from "@/components/booking/book-room-client";
import { HowItWorks } from "@/components/layout/how-it-works";
import { DbErrorBanner } from "@/components/layout/db-error-banner";
import { PageHeader } from "@/components/layout/page-header";
import { SpaceSwitcher } from "@/components/layout/space-switcher";
import { TimezoneNotice } from "@/components/layout/timezone-notice";
import { Button } from "@/components/ui/button";
import { getClubs, getOccupiedHoursByDate, getRooms } from "@/data/queries";
import { ensureDynamicPage } from "@/lib/ensure-dynamic";
import { isDbConnectionError } from "@/lib/safe-query";
import {
  getRoomSpaceOption,
  parseRoomSpaceParam,
  roomTypeToSpaceParam,
} from "@/lib/room-types";
import { BOOKING_HOURS_LABEL } from "@/lib/booking-hours";
import { parseBookingDateParam } from "@/lib/timezone";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string; space?: string }>;
}) {
  await ensureDynamicPage();

  const params = await searchParams;
  const date = parseBookingDateParam(params.date);
  const roomType = parseRoomSpaceParam(params.space);
  const space = roomTypeToSpaceParam(roomType);
  const spaceMeta = getRoomSpaceOption(roomType);

  let rooms: Awaited<ReturnType<typeof getRooms>> = [];
  let clubs: Awaited<ReturnType<typeof getClubs>> = [];
  let occupiedByRoom: Record<string, number[]> = {};
  let dbError = false;

  try {
    rooms = await getRooms({ roomType });
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
        title={spaceMeta.param === "classroom" ? "Book a classroom" : "Book an activity room"}
        description={
          <>
            Choose a {spaceMeta.label.toLowerCase()} and time for your club.{" "}
            {spaceMeta.param === "classroom" ? (
              <>
                Classrooms: <strong className="text-foreground">2, 3, or 5 hours</strong>, or a{" "}
                <strong className="text-foreground">custom</strong> length ({BOOKING_HOURS_LABEL}).
              </>
            ) : (
              <>
                Sessions are <strong className="text-foreground">2 or 3 hours</strong> (
                {BOOKING_HOURS_LABEL}).
              </>
            )}{" "}
            {spaceMeta.param === "classroom" ? (
              <>
                Enter your <strong className="text-foreground">name</strong>,{" "}
                <strong className="text-foreground">email</strong>, and{" "}
                <strong className="text-foreground">class name</strong> — no club required.
              </>
            ) : (
              <>Select your club and describe the purpose of the session.</>
            )}{" "}
            No account needed — admin approval is required.{" "}
            <TimezoneNotice className="mt-2 block" />
          </>
        }
        actions={
          <Link href="/my-bookings">
            <Button variant="secondary">Track my bookings</Button>
          </Link>
        }
      />

      <Suspense fallback={null}>
        <SpaceSwitcher basePath="/book" activeSpace={space} className="mb-6" />
      </Suspense>

      {dbError && <DbErrorBanner />}

      {!dbError && <BookingMascotHint space={space} />}

      {!dbError && (
        <BookRoomClient
          rooms={rooms}
          clubs={clubs}
          allAmenities={allAmenities}
          date={date}
          space={space}
          occupiedByRoom={occupiedByRoom}
        />
      )}

      <HowItWorks className="mt-16" />
    </div>
  );
}
