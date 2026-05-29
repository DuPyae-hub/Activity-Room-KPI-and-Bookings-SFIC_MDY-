"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type MascotPose = "wave" | "float" | "celebrate" | "think" | "sad" | "peek";

const sizeMap = {
  sm: { box: "h-24 w-24", img: 96 },
  md: { box: "h-36 w-36", img: 144 },
  lg: { box: "h-48 w-48 sm:h-56 sm:w-56", img: 220 },
  xl: { box: "h-64 w-64 sm:h-72 sm:w-72", img: 288 },
};

/** Hand-wave keyframes — pivot near raised arm / shoulder */
const WAVE_ROTATE = [0, 6, -4, 10, -7, 12, -8, 6, 0];
const WAVE_TIMES = [0, 0.12, 0.24, 0.36, 0.48, 0.62, 0.76, 0.88, 1];

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
  const isWaving = pose === "wave" || pose === "peek";

  return (
    <div className={cn("relative inline-flex flex-col items-center", className)}>
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className={cn("relative", dims.box)}
      >
        {/* Soft glow — no solid circle behind character */}
        <motion.span
          className="pointer-events-none absolute bottom-0 left-1/2 h-[18%] w-[55%] -translate-x-1/2 rounded-[100%] bg-brand-red/25 blur-2xl"
          animate={{ opacity: [0.25, 0.45, 0.25], scaleX: [1, 1.08, 1] }}
          transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut" }}
          aria-hidden
        />

        {/* Body bob (feet stay grounded) */}
        <motion.div
          className="relative h-full w-full"
          style={{ transformOrigin: "50% 92%" }}
          animate={
            pose === "sad"
              ? { y: 0, rotate: -3 }
              : {
                  y: pose === "celebrate" ? [0, -14, -8, -12, 0] : [0, -5, 0],
                  rotate:
                    pose === "celebrate"
                      ? [0, -2, 2, -2, 0]
                      : pose === "think"
                        ? [0, 1.5, -1.5, 0]
                        : 0,
                }
          }
          transition={{
            repeat: pose === "sad" ? 0 : Infinity,
            duration: pose === "celebrate" ? 1.4 : 2.6,
            ease: "easeInOut",
          }}
        >
          {/* Upper-body / arm wave */}
          <motion.div
            className="relative h-full w-full"
            style={{
              transformOrigin: isWaving ? "38% 72%" : "50% 88%",
            }}
            animate={
              isWaving
                ? pose === "peek"
                  ? { x: [0, 4, 0], rotate: WAVE_ROTATE }
                  : { rotate: WAVE_ROTATE }
                : pose === "celebrate"
                  ? { rotate: [0, -5, 5, -4, 0] }
                  : {}
            }
            transition={
              isWaving
                ? {
                    rotate: {
                      repeat: Infinity,
                      duration: 1.35,
                      ease: "easeInOut",
                      times: WAVE_TIMES,
                    },
                    x:
                      pose === "peek"
                        ? { repeat: Infinity, duration: 3, ease: "easeInOut" }
                        : undefined,
                  }
                : pose === "celebrate"
                  ? {
                      repeat: Infinity,
                      duration: 1.4,
                      ease: "easeInOut",
                    }
                  : undefined
            }
          >
            <Image
              src="/brand/sfic-mascot.png"
              alt={label}
              width={dims.img}
              height={dims.img}
              priority={priority}
              className="h-full w-full object-contain object-bottom drop-shadow-[0_8px_24px_rgba(0,0,0,0.45)]"
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
