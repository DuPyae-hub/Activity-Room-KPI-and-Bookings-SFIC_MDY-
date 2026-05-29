"use client";

import { motion } from "framer-motion";
import { CalendarDays, CheckCircle2, DoorOpen, Sparkles, Star } from "lucide-react";
import { cn } from "@/lib/utils";

type StickerDef = {
  Icon: typeof Sparkles;
  className: string;
  delay: number;
  duration: number;
};

const defaultStickers: StickerDef[] = [
  {
    Icon: Sparkles,
    className: "left-[6%] top-[12%] text-amber-300/80",
    delay: 0,
    duration: 5.2,
  },
  {
    Icon: CalendarDays,
    className: "right-[8%] top-[18%] text-brand-red-light/70",
    delay: 0.4,
    duration: 6,
  },
  {
    Icon: CheckCircle2,
    className: "right-[12%] bottom-[22%] text-emerald-400/65",
    delay: 0.8,
    duration: 5.5,
  },
  {
    Icon: DoorOpen,
    className: "left-[10%] bottom-[28%] text-white/35",
    delay: 1.1,
    duration: 6.4,
  },
  {
    Icon: Star,
    className: "left-[42%] top-[6%] text-brand-red-light/50",
    delay: 0.6,
    duration: 4.8,
  },
];

function FloatingSticker({ Icon, className, delay, duration }: StickerDef) {
  return (
    <motion.div
      className={cn("absolute", className)}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{
        opacity: [0.35, 0.85, 0.35],
        y: [0, -10, 0],
        rotate: [0, 8, -6, 0],
        scale: [1, 1.08, 1],
      }}
      transition={{
        delay,
        duration,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04] shadow-sm backdrop-blur-sm sm:h-10 sm:w-10">
        <Icon className="h-4 w-4 sm:h-[18px] sm:w-[18px]" strokeWidth={1.75} />
      </span>
    </motion.div>
  );
}

type AnimatedStickersProps = {
  className?: string;
  density?: "light" | "normal";
};

/** Decorative floating icon stickers — pointer-events none */
export function AnimatedStickers({ className, density = "normal" }: AnimatedStickersProps) {
  const items = density === "light" ? defaultStickers.slice(0, 3) : defaultStickers;

  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden
    >
      {items.map((sticker) => (
        <FloatingSticker key={sticker.className} {...sticker} />
      ))}
    </div>
  );
}
