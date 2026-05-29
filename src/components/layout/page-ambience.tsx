"use client";

import { AnimatedStickers } from "@/components/animated/animated-stickers";

/** Subtle floating stickers on public pages — fixed behind content */
export function PageAmbience() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <AnimatedStickers density="light" className="opacity-60" />
    </div>
  );
}
