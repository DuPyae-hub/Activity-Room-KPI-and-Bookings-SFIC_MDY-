import { cn } from "@/lib/utils";

type GlassCardProps = React.HTMLAttributes<HTMLDivElement> & {
  gradient?: boolean;
};

export function GlassCard({
  className,
  gradient = false,
  children,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "glass-card",
        gradient && "gradient-border",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
