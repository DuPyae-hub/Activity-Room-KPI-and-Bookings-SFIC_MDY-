"use client";

import { MascotSpot } from "@/components/animated/mascot-spot";
import { cn } from "@/lib/utils";

type MascotMessageProps = {
  title: string;
  description?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  bubble?: string;
  captionLabel?: string;
};

export function MascotMessage({
  title,
  description,
  size = "md",
  className,
  bubble,
  captionLabel = "Note",
}: MascotMessageProps) {
  return (
    <MascotSpot
      layout="stacked"
      size={size}
      caption={bubble}
      captionLabel={captionLabel}
      title={title}
      description={description}
      className={cn("py-2", className)}
    />
  );
}
