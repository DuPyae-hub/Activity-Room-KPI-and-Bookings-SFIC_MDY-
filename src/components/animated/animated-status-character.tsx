"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Clock, Sparkles, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export type CharacterStatus = "SUCCESS" | "PENDING" | "EMPTY" | "ERROR";

const config: Record<
  CharacterStatus,
  { icon: typeof CheckCircle2; label: string; ring: string; glow: string }
> = {
  SUCCESS: {
    icon: CheckCircle2,
    label: "Request confirmed",
    ring: "ring-emerald-400/40",
    glow: "shadow-emerald-500/20",
  },
  PENDING: {
    icon: Clock,
    label: "Awaiting approval",
    ring: "ring-brand-red/40",
    glow: "shadow-brand-red/20",
  },
  EMPTY: {
    icon: Sparkles,
    label: "No bookings yet",
    ring: "ring-white/20",
    glow: "shadow-white/10",
  },
  ERROR: {
    icon: XCircle,
    label: "Something went wrong",
    ring: "ring-red-400/40",
    glow: "shadow-red-500/20",
  },
};

/**
 * Placeholder shell for Lottie / Rive — drop animation inside `.character-slot`.
 */
export function AnimatedStatusCharacter({
  status,
  title,
  description,
  className,
}: {
  status: CharacterStatus;
  title?: string;
  description?: string;
  className?: string;
}) {
  const { icon: Icon, label, ring, glow } = config[status];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className={cn("flex flex-col items-center text-center", className)}
    >
      <div
        className={cn(
          "character-slot relative mb-4 flex h-36 w-36 items-center justify-center rounded-full",
          "bg-gradient-to-br from-brand-red/30 to-surface-elevated ring-2",
          ring,
          "shadow-2xl",
          glow,
        )}
        data-animation-slot="true"
      >
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        >
          <Icon className="h-16 w-16 text-brand-red" strokeWidth={1.25} />
        </motion.div>
        <motion.span
          className="absolute -inset-2 rounded-full border border-brand-red/20"
          animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.15, 0.4] }}
          transition={{ repeat: Infinity, duration: 2.5 }}
        />
      </div>
      <p className="text-lg font-semibold">{title ?? label}</p>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-foreground-muted">{description}</p>
      )}
    </motion.div>
  );
}
