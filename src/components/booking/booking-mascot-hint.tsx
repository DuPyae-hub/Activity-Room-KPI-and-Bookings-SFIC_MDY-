"use client";

import { AnimatedMascot } from "@/components/animated/animated-mascot";
import { GlassCard } from "@/components/ui/glass-card";

export function BookingMascotHint() {
  return (
    <GlassCard className="mb-8 p-4 sm:p-6">
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
        <div className="relative shrink-0">
          <p className="absolute -top-1 left-1/2 z-10 max-w-[11rem] -translate-x-1/2 -translate-y-full rounded-2xl border border-brand-red/30 bg-surface-elevated px-3 py-2 text-center text-xs font-medium text-white shadow-md sm:text-sm">
            Tap a room to start your booking!
          </p>
          <AnimatedMascot pose="peek" size="md" />
        </div>
        <div className="text-center sm:text-left">
          <p className="text-sm font-medium text-brand-red">How it works</p>
          <p className="mt-2 text-sm leading-relaxed text-white/55">
            Choose a room, pick a <strong className="text-white">2 or 3 hour</strong> slot (8 AM –
            10 PM Myanmar Time), and submit. Admin will approve before it appears on Room KPI.
          </p>
        </div>
      </div>
    </GlassCard>
  );
}
