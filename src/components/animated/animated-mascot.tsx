"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

const sizeMap = {
  sm: { box: "h-28 w-28", img: 112 },
  md: { box: "h-36 w-36 sm:h-40 sm:w-40", img: 160 },
  lg: { box: "h-44 w-44 sm:h-52 sm:w-52", img: 208 },
  xl: { box: "h-52 w-52 sm:h-60 sm:w-60", img: 240 },
};

type AnimatedMascotProps = {
  size?: keyof typeof sizeMap;
  className?: string;
  priority?: boolean;
  label?: string;
};

/** Static mascot in a minimal rounded frame */
export function AnimatedMascot({
  size = "md",
  className,
  priority = false,
  label = "Strategy First college mascot",
}: AnimatedMascotProps) {
  const dims = sizeMap[size];

  return (
    <div className={cn("relative inline-flex shrink-0", className)}>
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl bg-white/[0.03] ring-1 ring-white/[0.08]",
          dims.box,
        )}
      >
        <Image
          src="/brand/sfic-mascot.png"
          alt={label}
          width={dims.img}
          height={dims.img}
          priority={priority}
          className="h-full w-full object-cover object-top"
        />
      </div>
    </div>
  );
}
