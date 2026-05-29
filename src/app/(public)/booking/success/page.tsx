import Link from "next/link";
import { notFound } from "next/navigation";
import { AnimatedStatusCharacter } from "@/components/animated/animated-status-character";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { getBookingById } from "@/data/queries";

export default async function BookingSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  if (!id) notFound();

  const booking = await getBookingById(id);
  if (!booking) notFound();

  const lookupHref = `/my-bookings?email=${encodeURIComponent(booking.bookerEmail)}`;

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center">
      <GlassCard gradient className="w-full max-w-lg p-10 text-center">
        <AnimatedStatusCharacter
          status="SUCCESS"
          title="Booking request sent"
          description={`${booking.room.name} is pending admin approval. Save your email (${booking.bookerEmail}) to check status later.`}
        />
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href={lookupHref}>
            <Button variant="gold">View My Bookings</Button>
          </Link>
          <Link href="/book">
            <Button variant="secondary">Book Another</Button>
          </Link>
        </div>
      </GlassCard>
    </div>
  );
}
