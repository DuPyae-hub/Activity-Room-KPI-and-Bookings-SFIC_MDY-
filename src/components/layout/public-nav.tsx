"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { CalendarDays, LayoutDashboard, Ticket, Users } from "lucide-react";
import { BrandLogo } from "@/components/layout/brand-logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Room KPI", icon: LayoutDashboard },
  { href: "/clubs", label: "Clubs", icon: Users },
  { href: "/my-bookings", label: "My Bookings", icon: Ticket },
];

export function PublicNav() {
  const pathname = usePathname();
  const onBook = pathname === "/book" || pathname.startsWith("/book/");

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed left-1/2 top-4 z-50 w-[min(100%,60rem)] -translate-x-1/2 px-4"
      aria-label="Main navigation"
    >
      <div className="glass-card gradient-border flex items-center justify-between gap-3 px-3 py-2.5 sm:gap-4 sm:px-4 sm:py-3">
        <Link href="/" className="flex min-w-0 items-center gap-2 sm:gap-3">
          <BrandLogo height={36} />
          <div className="hidden min-w-0 sm:block">
            <p className="brand-heading truncate text-xs leading-tight">Strategy First</p>
            <p className="truncate text-xs text-foreground-muted">Activity Rooms</p>
          </div>
        </Link>

        <div className="flex items-center gap-0.5 sm:gap-1">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "relative flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm transition-colors sm:px-3",
                  active ? "text-brand-red" : "text-foreground-muted hover:text-foreground",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="public-nav-pill"
                    className="absolute inset-0 rounded-lg bg-brand-red/15 ring-1 ring-brand-red/40"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon className="relative h-4 w-4 shrink-0" />
                <span className="relative hidden lg:inline">{label}</span>
              </Link>
            );
          })}
        </div>

        <Link href="/book" className="shrink-0">
          <Button
            variant="gold"
            size="sm"
            className={cn(onBook && "ring-2 ring-stone-300")}
          >
            <CalendarDays className="h-4 w-4" />
            <span className="sr-only sm:not-sr-only sm:ml-0">Book</span>
          </Button>
        </Link>
      </div>
    </motion.nav>
  );
}
