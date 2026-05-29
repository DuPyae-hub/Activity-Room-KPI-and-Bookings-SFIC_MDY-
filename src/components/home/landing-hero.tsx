"use client";

import Link from "next/link";
import { ArrowRight, CalendarDays, LayoutDashboard, Ticket } from "lucide-react";
import { motion } from "framer-motion";
import { AnimatedMascot } from "@/components/animated/animated-mascot";
import { MascotSpeechBubble } from "@/components/animated/mascot-animated-text";
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
      <section className="relative mb-16 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-12 sm:px-10 sm:py-16">
        <div
          className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-red/20 blur-3xl"
          aria-hidden
        />
        <div className="relative grid items-center gap-10 lg:grid-cols-[1fr_auto] lg:gap-6">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <BrandLogo height={64} className="mb-6" />
            <p className="brand-subheading">Strategy First International College</p>
            <h1 className="mt-2 max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
              Activity room booking,{" "}
              <span className="text-gradient-brand">made simple</span>
            </h1>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-white/55">
              Reserve SFIC MDY activity rooms for your club — no login required. Pick a slot,
              submit your request, and track approval online.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
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
            <div className="relative">
              <div className="absolute -top-2 right-0 z-10 max-w-[10rem] text-center sm:-left-4 sm:right-auto sm:max-w-[11rem]">
                <MascotSpeechBubble className="border-brand-red/35 bg-surface-elevated/95 text-center">
                  Hi! Ready to book a room for your club?
                </MascotSpeechBubble>
              </div>
              <AnimatedMascot size="xl" priority />
            </div>
          </div>
        </div>
      </section>

      <section className="mb-16 grid gap-4 sm:grid-cols-3">
        {quickLinks.map(({ href, label, description, icon: Icon, primary }, i) => (
          <motion.div
            key={href}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.08 }}
          >
            <Link href={href} className="group block h-full">
              <GlassCard
                gradient={primary}
                className="flex h-full flex-col p-6 transition group-hover:bg-white/[0.08]"
              >
                <div
                  className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${
                    primary
                      ? "bg-brand-red/25 ring-1 ring-brand-red/40"
                      : "bg-white/5 ring-1 ring-white/10"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 ${primary ? "text-brand-red-light" : "text-white/70"}`}
                  />
                </div>
                <h2 className="text-lg font-semibold text-white">{label}</h2>
                <p className="mt-2 flex-1 text-sm text-white/50">{description}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand-red-light transition-all group-hover:gap-2">
                  Open <ArrowRight className="h-4 w-4" />
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
