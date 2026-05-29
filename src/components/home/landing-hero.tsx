"use client";

import Link from "next/link";
import { ArrowRight, CalendarDays, LayoutDashboard, Ticket } from "lucide-react";
import { motion } from "framer-motion";
import { AnimatedStickers } from "@/components/animated/animated-stickers";
import { MascotSpot } from "@/components/animated/mascot-spot";
import { HowItWorks } from "@/components/layout/how-it-works";
import { BrandLogo } from "@/components/layout/brand-logo";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";

const quickLinks = [
  {
    href: "/book",
    label: "Book a room",
    description: "Reserve a 2 or 3 hour session for your club",
    icon: CalendarDays,
    primary: true,
  },
  {
    href: "/dashboard",
    label: "Room KPI",
    description: "See approved sessions on the calendar",
    icon: LayoutDashboard,
    primary: false,
  },
  {
    href: "/my-bookings",
    label: "My bookings",
    description: "Track pending and approved requests",
    icon: Ticket,
    primary: false,
  },
];

export function LandingHero() {
  return (
    <div>
      <section className="relative mb-14 overflow-hidden rounded-2xl border border-border bg-surface-elevated/60 px-6 py-10 sm:px-10 sm:py-14">
        <AnimatedStickers density="normal" />
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-brand-red/10 blur-3xl"
          aria-hidden
        />

        <div className="relative grid items-center gap-10 lg:grid-cols-[1fr_auto] lg:gap-12">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <BrandLogo height={56} className="mb-5" />
            <p className="brand-subheading">Strategy First International College</p>
            <h1 className="mt-2 max-w-2xl text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-[2.5rem] lg:leading-tight">
              Activity room booking,{" "}
              <span className="text-gradient-brand">made simple</span>
            </h1>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-foreground-muted">
              Reserve SFIC MDY activity rooms for your club — no login required. Pick a slot,
              submit your request, and track approval online.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-2.5 lg:justify-start">
              <Link href="/book">
                <Button variant="gold" size="lg">
                  Book a room
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="secondary" size="lg">
                  View Room KPI
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative flex justify-center lg:justify-end">
            <MascotSpot
              layout="card"
              size="xl"
              priority
              captionLabel="Welcome"
              caption="Ready to book a room for your club? Start with Book a room."
            />
          </div>
        </div>
      </section>

      <section className="mb-14 grid gap-3 sm:grid-cols-3">
        {quickLinks.map(({ href, label, description, icon: Icon, primary }, i) => (
          <motion.div
            key={href}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 + i * 0.06, duration: 0.35 }}
          >
            <Link href={href} className="group block h-full">
              <GlassCard
                gradient={primary}
                className="flex h-full flex-col p-5 transition-colors hover:bg-stone-50"
              >
                <div
                  className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${
                    primary
                      ? "bg-brand-red/15 ring-1 ring-brand-red/25"
                      : "bg-stone-50 ring-1 ring-border"
                  }`}
                >
                  <Icon
                    className={`h-[18px] w-[18px] ${primary ? "text-brand-red-light" : "text-foreground-muted"}`}
                  />
                </div>
                <h2 className="font-medium text-foreground">{label}</h2>
                <p className="mt-1.5 flex-1 text-sm text-foreground-muted">{description}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm text-brand-red-light/90 transition-all group-hover:gap-1.5">
                  Open <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </GlassCard>
            </Link>
          </motion.div>
        ))}
      </section>

      <HowItWorks />
    </div>
  );
}
