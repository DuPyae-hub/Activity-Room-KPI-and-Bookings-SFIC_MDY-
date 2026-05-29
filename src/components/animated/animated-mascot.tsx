"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

export type MascotPose = "wave" | "float" | "celebrate" | "think" | "sad" | "peek";

const sizeMap = {
  sm: { box: "h-24 w-24", img: 96 },
  md: { box: "h-36 w-36", img: 144 },
  lg: { box: "h-48 w-48 sm:h-56 sm:w-56", img: 220 },
  xl: { box: "h-64 w-64 sm:h-72 sm:w-72", img: 288 },
};

const poseVariants: Record<MascotPose, Variants> = {
  wave: {
    initial: { opacity: 0, scale: 0.9, y: 16 },
    animate: {
      opacity: 1,
      scale: 1,
      y: [0, -10, 0],
      rotate: [0, -2, 2, 0],
      transition: {
        opacity: { duration: 0.4 },
        scale: { type: "spring", stiffness: 260, damping: 20 },
        y: { repeat: Infinity, duration: 3.2, ease: "easeInOut" },
        rotate: { repeat: Infinity, duration: 2.8, ease: "easeInOut" },
      },
    },
  },
  float: {
    initial: { opacity: 0, y: 12 },
    animate: {
      opacity: 1,
      y: [0, -8, 0],
      transition: {
        opacity: { duration: 0.35 },
        y: { repeat: Infinity, duration: 2.6, ease: "easeInOut" },
      },
    },
  },
  celebrate: {
    initial: { opacity: 0, scale: 0.85 },
    animate: {
      opacity: 1,
      scale: [1, 1.06, 1],
      rotate: [0, -4, 4, 0],
      y: [0, -12, 0],
      transition: {
        opacity: { duration: 0.35 },
        scale: { repeat: Infinity, duration: 1.8, ease: "easeInOut" },
        rotate: { repeat: Infinity, duration: 1.8, ease: "easeInOut" },
        y: { repeat: Infinity, duration: 1.8, ease: "easeInOut" },
      },
    },
  },
  think: {
    initial: { opacity: 0, x: 8 },
    animate: {
      opacity: 1,
      x: 0,
      rotate: [0, 2, -2, 0],
      transition: {
        opacity: { duration: 0.35 },
        rotate: { repeat: Infinity, duration: 4, ease: "easeInOut" },
      },
    },
  },
  sad: {
    initial: { opacity: 0, y: 8 },
    animate: {
      opacity: 1,
      y: 0,
      rotate: -4,
      transition: { type: "spring", stiffness: 200, damping: 22 },
    },
  },
  peek: {
    initial: { opacity: 0, x: 40, scale: 0.95 },
    animate: {
      opacity: 1,
      x: [0, 6, 0],
      scale: 1,
      transition: {
        opacity: { duration: 0.4 },
        x: { repeat: Infinity, duration: 3.5, ease: "easeInOut" },
        scale: { type: "spring", stiffness: 280, damping: 22 },
      },
    },
  },
};

type AnimatedMascotProps = {
  pose?: MascotPose;
  size?: keyof typeof sizeMap;
  className?: string;
  priority?: boolean;
  label?: string;
};

export function AnimatedMascot({
  pose = "wave",
  size = "md",
  className,
  priority = false,
  label = "Strategy First college mascot",
}: AnimatedMascotProps) {
  const dims = sizeMap[size];

  return (
    <div className={cn("relative inline-flex flex-col items-center", className)}>
      <motion.div
        variants={poseVariants[pose]}
        initial="initial"
        animate="animate"
        className={cn("relative", dims.box)}
      >
        <motion.span
          className="absolute -inset-3 rounded-full bg-brand-red/15 blur-xl"
          animate={{ opacity: [0.35, 0.55, 0.35], scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          aria-hidden
        />
        <div className="relative h-full w-full drop-shadow-[0_12px_32px_rgba(210,35,42,0.25)]">
          <Image
            src="/brand/sfic-mascot.png"
            alt={label}
            width={dims.img}
            height={dims.img}
            priority={priority}
            className="h-full w-full object-contain object-bottom"
          />
        </div>
      </motion.div>
    </div>
  );
}
