import { GlassCard } from "@/components/ui/glass-card";

export function DbErrorBanner() {
  return (
    <GlassCard className="mb-6 border-brand-red/30 bg-brand-red/10 p-4 text-sm text-brand-red-light">
      {process.env.VERCEL ? (
        <>
          Could not load data. Check <strong className="text-white">DATABASE_URL</strong> and{" "}
          <strong className="text-white">DIRECT_URL</strong> in Vercel → Environment Variables,
          then redeploy. If you set <strong className="text-white">ADMIN_HOST</strong> and{" "}
          <strong className="text-white">PUBLIC_HOST</strong>, they must be{" "}
          <strong className="text-white">different</strong> hostnames (or remove both for one URL).
        </>
      ) : (
        <>
          Could not load data. Run <code className="text-white">npm run db:check</code> then{" "}
          <code className="text-white">npm run fresh</code>.
        </>
      )}
    </GlassCard>
  );
}
