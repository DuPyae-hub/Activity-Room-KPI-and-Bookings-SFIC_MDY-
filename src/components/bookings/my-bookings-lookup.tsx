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
      <GlassCard className="mb-8 p-5">
        <form onSubmit={handleLookup} className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <label className="flex-1">
            <span className="field-label">Your booking email</span>
            <p className="field-hint">Use the same address you entered when submitting a request.</p>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@club.edu"
              className="field-input mt-2"
            />
          </label>
          <Button type="submit" variant="gold" className="sm:mb-0 sm:self-end">
            Find bookings
          </Button>
        </form>
      </GlassCard>

      {lookupEmail && (
        <p className="mb-4 text-sm text-foreground-muted">
          Showing results for <span className="text-brand-red">{lookupEmail}</span>
        </p>
      )}

      <MyBookingsList bookings={bookings} bookerEmail={lookupEmail} />
    </>
  );
}
