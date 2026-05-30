import Link from "next/link";
import { notFound } from "next/navigation";
import { MascotMessage } from "@/components/animated/mascot-message";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { getBookingById } from "@/data/queries";
import { ensureDynamicPage } from "@/lib/ensure-dynamic";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function BookingSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  await ensureDynamicPage();

  const { id } = await searchParams;
  if (!id) notFound();

  const booking = await getBookingById(id);
  if (!booking) notFound();

  const lookupHref = `/my-bookings?email=${encodeURIComponent(booking.bookerEmail)}`;

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center">
      <GlassCard gradient className="w-full max-w-lg p-8 sm:p-10">
        <MascotMessage
          size="lg"
          captionLabel="Submitted"
          title="Booking request sent"
          bubble="Admin will review your request shortly."
          description={`${booking.room.name}${booking.className ? ` · Class: ${booking.className}` : booking.club ? ` · ${booking.club.name}` : ""} is pending approval. Save your email (${booking.bookerEmail}) to check status in My Bookings.`}
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
