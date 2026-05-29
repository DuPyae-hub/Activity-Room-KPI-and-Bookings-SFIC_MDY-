"use client";

import { AnimatedMascot } from "@/components/animated/animated-mascot";

export function AdminLoginMascot() {
  return (
    <div className="mb-8 flex justify-center">
      <div className="relative">
        <p className="absolute -top-2 left-1/2 z-10 max-w-[12rem] -translate-x-1/2 -translate-y-full rounded-2xl border border-brand-red/30 bg-surface-elevated px-3 py-2 text-center text-xs font-medium text-white shadow-md sm:text-sm">
          Staff only — welcome back!
        </p>
        <AnimatedMascot pose="wave" size="lg" />
      </div>
    </div>
  );
}
