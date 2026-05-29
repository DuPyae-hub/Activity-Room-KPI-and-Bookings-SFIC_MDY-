import { Clock } from "lucide-react";
import { APP_TIMEZONE_LABEL } from "@/lib/timezone";
import { cn } from "@/lib/utils";

export function TimezoneNotice({ className }: { className?: string }) {
  return (
    <p
      className={cn(
        "inline-flex items-center gap-1.5 text-xs text-foreground-subtle",
        className,
      )}
    >
      <Clock className="h-3.5 w-3.5 text-brand-red/80" aria-hidden />
      All times are {APP_TIMEZONE_LABEL} (UTC+6:30)
    </p>
  );
}
