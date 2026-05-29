import { GlassCard } from "@/components/ui/glass-card";

export function DbUnavailableBanner() {
  return (
    <GlassCard className="border-brand-red/30 bg-brand-red/10 p-6 text-sm text-brand-red-light">
      <p className="font-medium text-foreground">Admin console cannot reach the database</p>
      {process.env.VERCEL ? (
        <p className="mt-2 leading-relaxed text-stone-700">
          In Vercel → <strong className="text-foreground">Settings → Environment Variables</strong>, set{" "}
          <code className="text-foreground">DATABASE_URL</code> and <code className="text-foreground">DIRECT_URL</code>{" "}
          (Supabase Session pooler + <code className="text-foreground">?sslmode=require</code>), then redeploy.
          First time: run <code className="text-foreground">npx prisma db push</code> and{" "}
          <code className="text-foreground">npm run db:seed</code> with your production URL so the admin user exists.
        </p>
      ) : (
        <p className="mt-2 leading-relaxed text-stone-700">
          Run <code className="text-foreground">npm run db:check</code> then{" "}
          <code className="text-foreground">npm run fresh</code> (Session pooler in .env).
        </p>
      )}
    </GlassCard>
  );
}
