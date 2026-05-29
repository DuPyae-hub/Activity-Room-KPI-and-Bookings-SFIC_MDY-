"use client";

import { motion } from "framer-motion";
import { AnimatedMascot, type MascotPose } from "@/components/animated/animated-mascot";
import { cn } from "@/lib/utils";

type MascotMessageProps = {
  pose?: MascotPose;
  title: string;
  description?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  bubble?: string;
};

export function MascotMessage({
  pose = "float",
  title,
  description,
  size = "md",
  className,
  bubble,
}: MascotMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      className={cn("flex flex-col items-center text-center", className)}
    >
      <div className="relative">
        {bubble && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.15, type: "spring", stiffness: 320, damping: 22 }}
            className="absolute -top-2 left-1/2 z-10 max-w-[14rem] -translate-x-1/2 -translate-y-full rounded-2xl border border-brand-red/30 bg-surface-elevated px-3 py-2 text-xs font-medium text-white shadow-lg sm:max-w-xs sm:text-sm"
          >
            {bubble}
            <span
              className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-b border-r border-brand-red/30 bg-surface-elevated"
              aria-hidden
            />
          </motion.div>
        )}
        <AnimatedMascot pose={pose} size={size} />
      </div>
      {title ? (
        <h2 className="mt-4 text-lg font-semibold text-white sm:text-xl">{title}</h2>
      ) : null}
      {description && (
        <p className="mt-2 max-w-md text-sm leading-relaxed text-white/55">{description}</p>
      )}
    </motion.div>
  );
}
