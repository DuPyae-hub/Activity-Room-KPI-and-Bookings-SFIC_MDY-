"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { CalendarDays, LayoutDashboard, LogOut, Shield, Users } from "lucide-react";
import { logoutAction } from "@/actions/auth";
import { BrandLogo } from "@/components/layout/brand-logo";
import { getPublicDashboardHref } from "@/lib/public-site-url";
import { cn } from "@/lib/utils";
import type { UserWithClub } from "@/lib/types";

const adminLinks = [
  { href: "/admin", label: "KPI & Approvals", icon: Shield },
  { href: "/admin/clubs", label: "Clubs", icon: Users },
  { href: "/admin/rooms", label: "Rooms", icon: CalendarDays },
];

export function AdminNav({ admin }: { admin: UserWithClub }) {
  const pathname = usePathname();

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed left-1/2 top-4 z-50 w-[min(100%,56rem)] -translate-x-1/2"
    >
      <div className="glass-card gradient-border flex items-center justify-between gap-4 px-4 py-3">
        <Link href="/admin" className="flex items-center gap-3">
          <BrandLogo height={36} />
          <div className="hidden sm:block">
            <p className="brand-heading text-xs leading-tight">Admin Console</p>
            <p className="text-xs text-white/50">Strategy First · Mandalay</p>
          </div>
        </Link>

        <div className="flex items-center gap-1 overflow-x-auto">
          {adminLinks.map(({ href, label, icon: Icon }) => {
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
                    layoutId="admin-nav-pill"
                    className="absolute inset-0 rounded-lg bg-brand-red/15 ring-1 ring-brand-red/40"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon className="relative h-4 w-4" />
                <span className="relative hidden md:inline">{label}</span>
              </Link>
            );
          })}
          <Link
            href={getPublicDashboardHref()}
            className="relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-white/50 hover:text-white"
          >
            <LayoutDashboard className="h-4 w-4" />
            <span className="hidden md:inline">Public site</span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden text-right lg:block">
            <p className="text-sm font-medium">{admin.name}</p>
            <p className="text-xs text-white/50">Administrator</p>
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
      </div>
    </motion.nav>
  );
}
