"use client";

import { AnimatedMascot } from "@/components/animated/animated-mascot";
import { MascotSpeechBubble } from "@/components/animated/mascot-animated-text";
import { GlassCard } from "@/components/ui/glass-card";

export function BookingMascotHint() {
  return (
    <GlassCard className="mb-8 p-4 sm:p-6">
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
        <div className="relative shrink-0">
          <div className="absolute -top-1 left-1/2 z-10 max-w-[11rem] -translate-x-1/2 -translate-y-full text-center">
            <MascotSpeechBubble className="text-center">
              Tap a room to start your booking!
            </MascotSpeechBubble>
          </div>
          <AnimatedMascot size="md" />
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
