"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type MascotAnimatedTextProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "p" | "h2" | "div" | "span";
};

/** Pop-in once, then a slow zoom in / out loop */
export function MascotAnimatedText({
  children,
  className,
  delay = 0,
  as: Tag = "div",
}: MascotAnimatedTextProps) {
  const MotionTag = motion[Tag];

  return (
    <MotionTag
      initial={{ opacity: 0, scale: 0.88, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay,
        type: "spring",
        stiffness: 380,
        damping: 24,
      }}
      className={cn("inline-block origin-center", className)}
    >
      <motion.span
        className="inline-block origin-center"
        animate={{ scale: [1, 1.045, 1] }}
        transition={{
          delay: delay + 0.35,
          repeat: Infinity,
          duration: 3.6,
          ease: "easeInOut",
        }}
      >
        {children}
      </motion.span>
    </MotionTag>
  );
}

type MascotSpeechBubbleProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

export function MascotSpeechBubble({ children, className, delay = 0 }: MascotSpeechBubbleProps) {
  return (
    <MascotAnimatedText
      as="div"
      delay={delay}
      className={cn(
        "relative rounded-2xl border border-brand-red/30 bg-surface-elevated px-3 py-2 text-xs font-medium text-white shadow-lg sm:text-sm",
        className,
      )}
    >
      {children}
      <span
        className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-b border-r border-brand-red/30 bg-surface-elevated"
        aria-hidden
      />
    </MascotAnimatedText>
  );
}
