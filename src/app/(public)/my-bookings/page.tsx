import { MyBookingsLookup } from "@/components/bookings/my-bookings-lookup";
import { getBookingsByEmail } from "@/data/queries";
import { bookingLookupSchema } from "@/lib/validations";

export default async function MyBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
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
      <header className="mb-8">
        <p className="text-sm text-brand-red">Track your requests</p>
        <h1 className="text-3xl font-bold">My Bookings</h1>
        <p className="mt-1 text-white/50">
          Enter the email you used when booking — no login required.
        </p>
      </header>
      <MyBookingsLookup initialEmail={emailParam} bookings={bookings} lookupEmail={lookupEmail} />
    </div>
  );
}
