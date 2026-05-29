"use client";

import { AnimatedMascot } from "@/components/animated/animated-mascot";
import { MascotAnimatedText, MascotSpeechBubble } from "@/components/animated/mascot-animated-text";
import { cn } from "@/lib/utils";

type MascotMessageProps = {
  title: string;
  description?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  bubble?: string;
};

export function MascotMessage({
  title,
  description,
  size = "md",
  className,
  bubble,
}: MascotMessageProps) {
  return (
    <div className={cn("flex flex-col items-center text-center", className)}>
      <div className="relative">
        {bubble && (
          <div className="absolute -top-2 left-1/2 z-10 max-w-[14rem] -translate-x-1/2 -translate-y-full sm:max-w-xs">
            <MascotSpeechBubble>{bubble}</MascotSpeechBubble>
          </div>
        )}
        <AnimatedMascot size={size} />
      </div>
      {title ? (
        <MascotAnimatedText as="h2" delay={0.12} className="mt-4 text-lg font-semibold text-white sm:text-xl">
          {title}
        </MascotAnimatedText>
      ) : null}
      {description && (
        <MascotAnimatedText
          as="p"
          delay={0.22}
          className="mt-2 max-w-md text-sm leading-relaxed text-white/55"
        >
          {description}
        </MascotAnimatedText>
      )}
    </div>
  );
}
