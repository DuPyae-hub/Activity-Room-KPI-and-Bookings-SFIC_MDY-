"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

const sizeMap = {
  sm: { box: "h-24 w-24", img: 96 },
  md: { box: "h-36 w-36", img: 144 },
  lg: { box: "h-48 w-48 sm:h-56 sm:w-56", img: 220 },
  xl: { box: "h-64 w-64 sm:h-72 sm:w-72", img: 288 },
};

type AnimatedMascotProps = {
  size?: keyof typeof sizeMap;
  className?: string;
  priority?: boolean;
  label?: string;
};

/** Static SFIC mascot image (no motion on the character). */
export function AnimatedMascot({
  size = "md",
  className,
  priority = false,
  label = "Strategy First college mascot",
}: AnimatedMascotProps) {
  const dims = sizeMap[size];

  return (
    <div className={cn("relative inline-flex flex-col items-center", className)}>
      <div className={cn("relative", dims.box)}>
        <span
          className="pointer-events-none absolute bottom-0 left-1/2 h-[18%] w-[55%] -translate-x-1/2 rounded-[100%] bg-brand-red/20 blur-2xl"
          aria-hidden
        />
        <Image
          src="/brand/sfic-mascot.png"
          alt={label}
          width={dims.img}
          height={dims.img}
          priority={priority}
          className="relative h-full w-full object-contain object-bottom drop-shadow-[0_8px_24px_rgba(0,0,0,0.4)]"
        />
      </div>
    </div>
  );
}
