import { CalendarCheck, Clock, Mail } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

const steps = [
  {
    icon: CalendarCheck,
    title: "Choose room & time",
    description: "Pick an activity room, your club, and a 2 or 3 hour slot between 8 AM and 10 PM.",
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
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/40">
        How booking works
      </h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {steps.map(({ icon: Icon, title, description }, i) => (
          <GlassCard key={title} className="p-5">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-red/15 ring-1 ring-brand-red/30">
              <Icon className="h-5 w-5 text-brand-red-light" />
            </div>
            <p className="mb-1 text-xs font-medium text-brand-red">Step {i + 1}</p>
            <h3 className="font-semibold text-white">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/50">{description}</p>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}
