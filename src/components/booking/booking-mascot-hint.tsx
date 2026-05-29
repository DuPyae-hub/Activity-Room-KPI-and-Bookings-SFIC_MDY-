"use client";

import { MascotSpot } from "@/components/animated/mascot-spot";
import { GlassCard } from "@/components/ui/glass-card";

export function BookingMascotHint() {
  return (
    <GlassCard className="mb-6 border-white/[0.06] bg-white/[0.02] p-5 sm:p-6">
      <MascotSpot
        layout="inline"
        size="md"
        captionLabel="Booking"
        caption="Select a room card below to choose your time slot."
        title="How it works"
        description="Pick a 2 or 3 hour slot between 8 AM and 10 PM (Myanmar Time). After you submit, admin approves your request before it appears on Room KPI."
      />
    </GlassCard>
  );
}
