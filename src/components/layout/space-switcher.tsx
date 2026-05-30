"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ROOM_SPACE_OPTIONS, type RoomSpaceParam } from "@/lib/room-types";
import type { RoomType } from "@prisma/client";

type SpaceSwitcherProps = {
  /** Base path without query, e.g. `/book` or `/dashboard` */
  basePath: string;
  /** Current space from server */
  activeSpace: RoomSpaceParam;
  className?: string;
};

function buildHref(basePath: string, space: RoomSpaceParam, searchParams: URLSearchParams) {
  const params = new URLSearchParams(searchParams.toString());
  if (space === "activity") {
    params.delete("space");
  } else {
    params.set("space", space);
  }
  const q = params.toString();
  return q ? `${basePath}?${q}` : basePath;
}

export function SpaceSwitcher({ basePath, activeSpace, className }: SpaceSwitcherProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (pathname !== basePath && !pathname.startsWith(`${basePath}/`)) {
    return null;
  }

  return (
    <div
      className={cn(
        "inline-flex rounded-xl border border-border bg-surface-elevated p-1 shadow-sm",
        className,
      )}
      role="tablist"
      aria-label="Space type"
    >
      {ROOM_SPACE_OPTIONS.map(({ param, shortLabel }) => {
        const active = activeSpace === param;
        return (
          <Link
            key={param}
            href={buildHref(basePath, param, searchParams)}
            role="tab"
            aria-selected={active}
            className={cn(
              "relative rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              active ? "text-brand-red" : "text-foreground-muted hover:text-foreground",
            )}
          >
            {active && (
              <motion.span
                layoutId={`space-switcher-${basePath}`}
                className="absolute inset-0 rounded-lg bg-brand-red/10 ring-1 ring-brand-red/25"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative">{shortLabel}</span>
          </Link>
        );
      })}
    </div>
  );
}

export function RoomTypeBadge({
  roomType,
  className,
}: {
  roomType: RoomType;
  className?: string;
}) {
  const isClassroom = roomType === "CLASSROOM";
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
        isClassroom
          ? "border-brand-orange/30 bg-brand-orange/10 text-brand-orange"
          : "border-brand-red/25 bg-brand-red/10 text-brand-red",
        className,
      )}
    >
      {isClassroom ? "Classroom" : "Activity"}
    </span>
  );
}
