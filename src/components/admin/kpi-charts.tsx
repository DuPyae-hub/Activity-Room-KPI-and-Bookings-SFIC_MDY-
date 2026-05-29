"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { motion } from "framer-motion";
import { formatHourLabel } from "@/lib/booking-hours";
import { GlassCard } from "@/components/ui/glass-card";

type KpiChartsProps = {
  topClubs: { name: string; count: number }[];
  peakHours: { hour: number; count: number }[];
  pendingCount: number;
};

export function KpiCharts({ topClubs, peakHours, pendingCount }: KpiChartsProps) {
  const maxClub = Math.max(...topClubs.map((c) => c.count), 1);
  const hourData = peakHours.map((h) => ({
    label: formatHourLabel(h.hour),
    count: h.count,
  }));

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <GlassCard gradient className="p-6">
        <h3 className="mb-1 text-lg font-semibold">Top Active Clubs</h3>
        <p className="mb-6 text-sm text-white/50">Approved bookings by club</p>
        <div className="space-y-4">
          {topClubs.length === 0 && (
            <p className="text-sm text-white/40">No approved data yet.</p>
          )}
          {topClubs.map((club, i) => (
            <div key={club.name}>
              <div className="mb-1 flex justify-between text-sm">
                <span>{club.name}</span>
                <span className="text-brand-red">{club.count}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(club.count / maxClub) * 100}%` }}
                  transition={{ delay: i * 0.1, duration: 0.6, ease: "easeOut" }}
                  className="h-full rounded-full bg-gradient-to-r from-brand-red to-brand-red"
                />
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      <GlassCard gradient className="p-6">
        <h3 className="mb-1 text-lg font-semibold">Peak Booking Hours</h3>
        <p className="mb-4 text-sm text-white/50">When clubs book most often</p>
        <div className="h-56">
          {hourData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="label" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }} />
                <YAxis tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    background: "#121826",
                    border: "1px solid rgba(255,215,0,0.3)",
                    borderRadius: 12,
                  }}
                />
                <Bar dataKey="count" fill="#FFD700" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-white/40">No peak hour data yet.</p>
          )}
        </div>
      </GlassCard>

      <GlassCard className="col-span-full flex items-center justify-between p-6 lg:col-span-2">
        <div>
          <p className="text-sm text-white/50">Pending approvals</p>
          <motion.p
            key={pendingCount}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-4xl font-bold text-gradient-gold"
          >
            {pendingCount}
          </motion.p>
        </div>
        <p className="max-w-xs text-sm text-white/45">
          Use the queue below for one-click approve/reject with instant optimistic UI.
        </p>
      </GlassCard>
    </div>
  );
}
