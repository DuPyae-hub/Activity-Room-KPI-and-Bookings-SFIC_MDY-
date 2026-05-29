import { BookingStatus, RoomStatus } from "@prisma/client";
import { cn } from "@/lib/utils";

const bookingStyles: Record<BookingStatus, string> = {
  PENDING: "bg-brand-red/15 text-brand-red-light border-brand-red/30",
  APPROVED: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  REJECTED: "bg-red-500/15 text-red-300 border-red-500/30",
};

const roomStyles: Record<RoomStatus, string> = {
  AVAILABLE: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  MAINTENANCE: "bg-orange-500/15 text-orange-300 border-orange-500/30",
};

export function StatusBadge({
  status,
  type = "booking",
  className,
}: {
  status: BookingStatus | RoomStatus;
  type?: "booking" | "room";
  className?: string;
}) {
  const styles =
    type === "room"
      ? roomStyles[status as RoomStatus]
      : bookingStyles[status as BookingStatus];

  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium tracking-wide uppercase",
        styles,
        className,
      )}
    >
      {status.replace("_", " ")}
    </span>
  );
}
