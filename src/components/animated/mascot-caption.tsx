"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type MascotCaptionProps = {
  children: React.ReactNode;
  label?: string;
  className?: string;
  delay?: number;
  align?: "left" | "center";
};

/** Minimal caption card — matches warm mascot theme */
export function MascotCaption({
  children,
  label = "Note",
  className,
  delay = 0,
  align = "left",
}: MascotCaptionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "max-w-[16rem] rounded-xl border border-border bg-surface-elevated px-3.5 py-2.5 shadow-sm sm:max-w-xs sm:px-4 sm:py-3",
        align === "center" && "text-center",
        className,
      )}
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-red">
        {label}
      </p>
      <p className="mt-1 text-sm leading-snug text-foreground">{children}</p>
    </motion.div>
  );
}

type MascotCopyProps = {
  title: string;
  description?: string;
  className?: string;
  delay?: number;
};

export function MascotCopy({ title, description, className, delay = 0.1 }: MascotCopyProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={cn("space-y-1.5", className)}
    >
      <h2 className="text-base font-semibold tracking-tight text-foreground sm:text-lg">{title}</h2>
      {description ? (
        <p className="text-sm leading-relaxed text-foreground-muted">{description}</p>
      ) : null}
    </motion.div>
  );
}

/** @deprecated Use MascotCaption */
export function MascotSpeechBubble({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <MascotCaption label="Tip" delay={delay} className={className}>
      {children}
    </MascotCaption>
  );
}

/** @deprecated Use MascotCopy */
export function MascotAnimatedText({
  children,
  className,
  delay = 0,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "p" | "h2" | "div" | "span";
}) {
  const MotionTag = motion[Tag];
  return (
    <MotionTag
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </MotionTag>
  );
}
