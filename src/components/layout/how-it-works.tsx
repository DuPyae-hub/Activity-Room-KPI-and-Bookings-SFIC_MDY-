import { CalendarCheck, Clock, Mail } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

const steps = [
  {
    icon: CalendarCheck,
    title: "Choose room & time",
    description:
      "Pick an activity room, your club, and a 2 or 3 hour slot between 8 AM and 10 PM (Myanmar Time).",
  },
  {
    icon: Mail,
    title: "Submit your request",
    description: "No account needed — use your name and email. Your request goes to the admin queue.",
  },
  {
    icon: Clock,
    title: "Track approval",
    description: "Check My Bookings with your email. Once approved, your session appears on Room KPI.",
  },
];

export function HowItWorks({ className }: { className?: string }) {
  return (
    <section className={className}>
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
        How booking works
      </h2>
      <div className="grid gap-3 sm:grid-cols-3">
        {steps.map(({ icon: Icon, title, description }, i) => (
          <GlassCard key={title} className="border-white/[0.06] bg-white/[0.02] p-5">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-brand-red/12 ring-1 ring-brand-red/20">
              <Icon className="h-[18px] w-[18px] text-brand-red-light" />
            </div>
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-red-light/80">
              Step {i + 1}
            </p>
            <h3 className="font-medium text-white">{title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-white/45">{description}</p>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}
