"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";

export type ClubCard = {
  id: string;
  name: string;
  logo: string | null;
  description: string | null;
};

export function ClubsGrid({ clubs }: { clubs: ClubCard[] }) {
  if (clubs.length === 0) {
    return (
      <GlassCard className="p-8 text-center text-foreground-muted">
        No clubs listed yet. Check back soon.
      </GlassCard>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {clubs.map((club, i) => (
        <motion.div
          key={club.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.04 }}
        >
          <GlassCard className="flex h-full flex-col p-5">
            <span className="text-3xl" aria-hidden>
              {club.logo ?? "🏫"}
            </span>
            <h3 className="mt-3 font-semibold leading-snug">{club.name}</h3>
            {club.description && (
              <p className="mt-2 flex-1 text-sm text-foreground-muted">{club.description}</p>
            )}
            <Link href="/book" className="mt-4">
              <Button variant="gold" size="sm" className="w-full">
                <CalendarDays className="h-4 w-4" />
                Book a room
              </Button>
            </Link>
          </GlassCard>
        </motion.div>
      ))}
    </div>
  );
}
