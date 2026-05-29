"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { CalendarDays, LayoutDashboard, LogOut, Shield, Ticket } from "lucide-react";
import { logoutAction } from "@/actions/auth";
import { BrandLogo } from "@/components/layout/brand-logo";
import { cn } from "@/lib/utils";
import type { UserWithClub } from "@/lib/types";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/book", label: "Book Room", icon: CalendarDays },
  { href: "/my-bookings", label: "My Bookings", icon: Ticket },
];

type PublicNavProps = {
  admin: UserWithClub | null;
};

export function PublicNav({ admin }: PublicNavProps) {
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
          {admin && (
            <Link
              href="/admin"
              className={cn(
                "relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm transition-colors",
                pathname.startsWith("/admin")
                  ? "text-brand-red"
                  : "text-brand-red-light hover:text-brand-red",
              )}
            >
              <Shield className="relative h-4 w-4" />
              <span className="relative hidden md:inline">Admin console</span>
            </Link>
          )}
        </div>

        {admin && (
          <div className="flex shrink-0 items-center gap-2 border-l border-white/10 pl-3">
            <div className="hidden text-right sm:block">
              <p className="max-w-[8rem] truncate text-xs font-medium">{admin.name}</p>
              <p className="text-[10px] text-white/45">Administrator</p>
            </div>
            <form action={logoutAction}>
              <button
                type="submit"
                className="rounded-lg p-2 text-white/50 transition hover:bg-white/5 hover:text-brand-red"
                aria-label="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </motion.nav>
  );
}
