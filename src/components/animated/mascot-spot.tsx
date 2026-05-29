"use client";

import { AnimatedMascot } from "@/components/animated/animated-mascot";
import { MascotCaption, MascotCopy } from "@/components/animated/mascot-caption";
import { cn } from "@/lib/utils";

type MascotSpotSize = "sm" | "md" | "lg" | "xl";

type MascotSpotProps = {
  size?: MascotSpotSize;
  caption?: string;
  captionLabel?: string;
  title?: string;
  description?: string;
  layout?: "card" | "inline" | "stacked";
  className?: string;
  priority?: boolean;
};

/**
 * Unified mascot + copy layout — clean, minimal, consistent across pages.
 */
export function MascotSpot({
  size = "md",
  caption,
  captionLabel = "Tip",
  title,
  description,
  layout = "card",
  className,
  priority = false,
}: MascotSpotProps) {
  const hasCopy = Boolean(title || description);

  if (layout === "stacked") {
    return (
      <div className={cn("flex flex-col items-center gap-5 text-center", className)}>
        <div className="flex flex-col items-center gap-4">
          {caption && (
            <MascotCaption label={captionLabel} align="center">
              {caption}
            </MascotCaption>
          )}
          <AnimatedMascot size={size} priority={priority} />
        </div>
        {hasCopy && (
          <MascotCopy
            title={title!}
            description={description}
            className="max-w-md"
            delay={0.08}
          />
        )}
      </div>
    );
  }

  if (layout === "inline") {
    return (
      <div
        className={cn(
          "flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-8",
          className,
        )}
      >
        <div className="flex shrink-0 flex-col items-center gap-3 sm:items-end">
          {caption && (
            <MascotCaption label={captionLabel} align="center" className="sm:text-right">
              {caption}
            </MascotCaption>
          )}
          <AnimatedMascot size={size} priority={priority} />
        </div>
        {hasCopy && (
          <MascotCopy
            title={title!}
            description={description}
            className="flex-1 text-center sm:text-left"
          />
        )}
      </div>
    );
  }

  /* card — caption beside mascot in a soft panel */
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-5 sm:flex-row sm:items-end sm:justify-center sm:gap-6",
        className,
      )}
    >
      <AnimatedMascot size={size} priority={priority} />
      {(caption || hasCopy) && (
        <div className="flex max-w-xs flex-col gap-3 sm:pb-2">
          {caption && <MascotCaption label={captionLabel}>{caption}</MascotCaption>}
          {hasCopy && <MascotCopy title={title!} description={description} delay={0.06} />}
        </div>
      )}
    </div>
  );
}
