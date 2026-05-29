"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { CalendarDays, LayoutDashboard, Ticket, Users } from "lucide-react";
import { BrandLogo } from "@/components/layout/brand-logo";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Room KPI", icon: LayoutDashboard },
  { href: "/clubs", label: "Clubs", icon: Users },
  { href: "/book", label: "Book Room", icon: CalendarDays },
  { href: "/my-bookings", label: "My Bookings", icon: Ticket },
];

export function PublicNav() {
  const pathname = usePathname();

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed left-1/2 top-4 z-50 w-[min(100%,56rem)] -translate-x-1/2"
    >
      <div className="glass-card gradient-border flex items-center justify-between gap-4 px-4 py-3">
        <Link href="/dashboard" className="flex items-center gap-3">
          <BrandLogo height={36} />
          <div className="hidden sm:block">
            <p className="brand-heading text-xs leading-tight">Strategy First</p>
            <p className="text-xs text-white/50">Activity Rooms · Mandalay</p>
          </div>
        </Link>

        <div className="flex items-center gap-1 overflow-x-auto">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm transition-colors",
                  active ? "text-brand-red" : "text-white/60 hover:text-brand-red/80",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="public-nav-pill"
                    className="absolute inset-0 rounded-lg bg-brand-red/15 ring-1 ring-brand-red/40"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon className="relative h-4 w-4" />
                <span className="relative hidden md:inline">{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
}
