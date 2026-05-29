import { GlassCard } from "@/components/ui/glass-card";

export function DbErrorBanner() {
  return (
    <GlassCard className="mb-6 border-brand-red/30 bg-brand-red/10 p-4 text-sm text-brand-red-light">
      {process.env.VERCEL ? (
        <>
          Could not load data. Check <strong className="text-foreground">DATABASE_URL</strong> and{" "}
          <strong className="text-foreground">DIRECT_URL</strong> in Vercel → Environment Variables,
          then redeploy. If you set <strong className="text-foreground">ADMIN_HOST</strong> and{" "}
          <strong className="text-foreground">PUBLIC_HOST</strong>, they must be{" "}
          <strong className="text-foreground">different</strong> hostnames (or remove both for one URL).
        </>
      ) : (
        <>
          Could not load data. Run <code className="text-foreground">npm run db:check</code> then{" "}
          <code className="text-foreground">npm run fresh</code>.
        </>
      )}
    </GlassCard>
  );
}
