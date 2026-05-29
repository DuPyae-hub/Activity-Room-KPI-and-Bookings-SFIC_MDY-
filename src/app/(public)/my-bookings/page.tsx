import Link from "next/link";
import { MyBookingsLookup } from "@/components/bookings/my-bookings-lookup";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { getBookingsByEmail } from "@/data/queries";
import { ensureDynamicPage } from "@/lib/ensure-dynamic";
import { bookingLookupSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function MyBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  await ensureDynamicPage();

  const params = await searchParams;
  const emailParam = params.email?.trim() ?? "";

  let bookings: Awaited<ReturnType<typeof getBookingsByEmail>> = [];
  let lookupEmail = "";

  if (emailParam) {
    const parsed = bookingLookupSchema.safeParse({ email: emailParam });
    if (parsed.success) {
      lookupEmail = parsed.data.email;
      bookings = await getBookingsByEmail(lookupEmail);
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Your requests"
        title="My bookings"
        description="Enter the email you used when booking. No password required — you can cancel pending or approved requests here."
        actions={
          <Link href="/book">
            <Button variant="gold">New booking</Button>
          </Link>
        }
      />
      <MyBookingsLookup initialEmail={emailParam} bookings={bookings} lookupEmail={lookupEmail} />
    </div>
  );
}
