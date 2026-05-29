"use client";

import Link from "next/link";
import { ChevronDown, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

export type ClubOption = {
  id: string;
  name: string;
  logo: string | null;
  description?: string | null;
};

type ClubSelectProps = {
  clubs: ClubOption[];
  value: string;
  onChange: (clubId: string) => void;
};

export function ClubSelect({ clubs, value, onChange }: ClubSelectProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return clubs;
    return clubs.filter((c) => c.name.toLowerCase().includes(q));
  }, [clubs, query]);

  const selected = clubs.find((c) => c.id === value);

  if (clubs.length === 0) {
    return (
      <div className="mt-2 rounded-xl border border-brand-red/30 bg-brand-red/10 px-4 py-3 text-sm text-white/70">
        No clubs in the system yet. An administrator must add clubs at{" "}
        <Link href="/sfic/manage" className="text-brand-red underline">
          admin login
        </Link>{" "}
        → Clubs, or run <code className="text-white">npm run db:seed</code> locally.
      </div>
    );
  }

  return (
    <div className="mt-2 space-y-2">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search clubs…"
          className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-9 pr-4 text-sm outline-none focus:border-brand-red/50 focus:ring-1 focus:ring-brand-red/25"
        />
      </div>

      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "w-full appearance-none rounded-xl border border-brand-red/35 bg-gradient-to-b from-white/10 to-white/5",
            "px-4 py-3 pr-10 text-sm text-white outline-none",
            "focus:border-brand-red focus:ring-2 focus:ring-brand-red/25",
          )}
        >
          {filtered.length === 0 ? (
            <option value="">No clubs match your search</option>
          ) : (
            filtered.map((club) => (
              <option key={club.id} value={club.id} className="bg-surface text-white">
                {club.logo ? `${club.logo} ` : ""}
                {club.name}
              </option>
            ))
          )}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50"
          aria-hidden
        />
      </div>

      {selected && (
        <p className="text-xs text-white/45">
          Booking as{" "}
          <span className="text-brand-red-light">
            {selected.logo ? `${selected.logo} ` : ""}
            {selected.name}
          </span>
          {" · "}
          <Link href="/clubs" className="underline hover:text-white">
            View all clubs
          </Link>
        </p>
      )}
    </div>
  );
}
