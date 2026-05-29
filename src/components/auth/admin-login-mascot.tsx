"use client";

import { AnimatedMascot } from "@/components/animated/animated-mascot";
import { MascotSpeechBubble } from "@/components/animated/mascot-animated-text";

export function AdminLoginMascot() {
  return (
    <div className="mb-8 flex justify-center">
      <div className="relative">
        <div className="absolute -top-2 left-1/2 z-10 max-w-[12rem] -translate-x-1/2 -translate-y-full text-center">
          <MascotSpeechBubble className="text-center">Staff only — welcome back!</MascotSpeechBubble>
        </div>
        <AnimatedMascot size="lg" />
      </div>
    </div>
  );
}
