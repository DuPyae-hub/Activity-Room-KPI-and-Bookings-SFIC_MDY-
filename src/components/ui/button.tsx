"use client";

import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "gold";
  size?: "sm" | "md" | "lg";
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/50",
        "disabled:pointer-events-none disabled:opacity-50",
        size === "sm" && "px-3 py-1.5 text-sm",
        size === "md" && "px-4 py-2.5 text-sm",
        size === "lg" && "px-6 py-3 text-base",
        variant === "primary" &&
          "bg-brand-red text-white hover:bg-brand-red-light shadow-lg shadow-brand-red/30",
        variant === "gold" &&
          "bg-brand-red text-white font-semibold hover:bg-brand-red-light shadow-lg shadow-brand-red/25",
        variant === "secondary" &&
          "border border-border-strong bg-surface-elevated text-foreground hover:border-brand-red/40 hover:bg-stone-50",
        variant === "ghost" && "text-foreground-muted hover:bg-stone-100 hover:text-foreground",
        variant === "danger" &&
          "border border-red-300 bg-red-50 text-red-700 hover:bg-red-100",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
