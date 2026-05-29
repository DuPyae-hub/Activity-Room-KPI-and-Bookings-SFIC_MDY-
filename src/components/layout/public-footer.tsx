import Link from "next/link";
import { BrandLogo } from "@/components/layout/brand-logo";
import { TimezoneNotice } from "@/components/layout/timezone-notice";

const links = [
  { href: "/dashboard", label: "Room KPI" },
  { href: "/book", label: "Book a room" },
  { href: "/clubs", label: "Clubs" },
  { href: "/my-bookings", label: "My bookings" },
];

export function PublicFooter() {
  return (
    <footer className="mt-20 border-t border-border pt-10 pb-8">
      <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <BrandLogo height={40} />
          <div>
            <p className="brand-heading text-xs">Strategy First</p>
            <p className="text-sm text-foreground-muted">Activity Room Booking · Mandalay</p>
            <p className="mt-2 max-w-xs text-xs leading-relaxed text-foreground-subtle">
              Official room reservations for SFIC MDY student clubs. Sessions are subject to admin approval.
            </p>
            <TimezoneNotice className="mt-3" />
          </div>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-foreground-muted transition hover:text-brand-red-light"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
      <p className="mt-8 text-center text-xs text-foreground-subtle sm:text-left">
        © {new Date().getFullYear()} Strategy First International College — Mandalay
      </p>
    </footer>
  );
}
