"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { MyBookingsList } from "@/components/bookings/my-bookings-list";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import type { BookingWithRelations } from "@/lib/types";

type MyBookingsLookupProps = {
  initialEmail: string;
  lookupEmail: string;
  bookings: BookingWithRelations[];
};

export function MyBookingsLookup({
  initialEmail,
  lookupEmail,
  bookings,
}: MyBookingsLookupProps) {
  const router = useRouter();
  const [email, setEmail] = useState(initialEmail);

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;
    router.push(`/my-bookings?email=${encodeURIComponent(trimmed)}`);
  };

  return (
    <>
      <GlassCard className="mb-8 p-4">
        <form onSubmit={handleLookup} className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <label className="flex-1">
            <span className="text-sm text-white/60">Your booking email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@club.edu"
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-brand-red/40"
            />
          </label>
          <Button type="submit" variant="gold">
            Find bookings
          </Button>
        </form>
      </GlassCard>

      {lookupEmail && (
        <p className="mb-4 text-sm text-white/50">
          Showing results for <span className="text-brand-red">{lookupEmail}</span>
        </p>
      )}

      <MyBookingsList bookings={bookings} bookerEmail={lookupEmail} />
    </>
  );
}
