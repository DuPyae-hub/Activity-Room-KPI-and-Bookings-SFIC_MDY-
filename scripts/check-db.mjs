/**
 * Run: node scripts/check-db.mjs
 * Validates DATABASE_URL before db:push / dev.
 */
import { readFileSync } from "fs";
import { resolve } from "path";

const envPath = resolve(process.cwd(), ".env");
let url = process.env.DATABASE_URL;

if (!url) {
  try {
    const raw = readFileSync(envPath, "utf8");
    const match = raw.match(/^DATABASE_URL=(.+)$/m);
    if (match) {
      url = match[1].trim().replace(/^["']|["']$/g, "");
    }
  } catch {
    // ignore
  }
}

const problems = [];

if (!url) {
  problems.push("DATABASE_URL is missing. Create .env from .env.example.");
} else {
  if (url.includes("[YOUR-PASSWORD]") || url.includes("YOUR_PASSWORD")) {
    problems.push(
      "DATABASE_URL still has a placeholder password. In Supabase: Settings → Database → reset/copy password, then paste it into .env (no square brackets).",
    );
  }
  if (/\[[^\]]+\]@/.test(url)) {
    problems.push(
      "Password must not be wrapped in [brackets] — that breaks the connection URL. Use only the raw password.",
    );
  }
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.includes("supabase")) {
      problems.push(`Unexpected host: ${parsed.hostname}`);
    }
    console.log(`Host: ${parsed.hostname}:${parsed.port || "5432"}`);
    console.log(`User: ${parsed.username}`);

    if (/^db\.[a-z0-9]+\.supabase\.co$/i.test(parsed.hostname)) {
      problems.push(
        'Direct host "db.*.supabase.co" is IPv6-only on many networks. Use Session pooler from Supabase Connect (host like aws-1-REGION.pooler.supabase.com, user postgres.PROJECT_REF).',
      );
    }

    const dns = await import("dns/promises");
    try {
      await dns.lookup(parsed.hostname);
    } catch {
      problems.push(
        `Hostname "${parsed.hostname}" does not resolve. In Supabase → Connect, copy the FULL URI (project may be paused or ref is wrong).`,
      );
    }
  } catch {
    problems.push("DATABASE_URL is not a valid URL. Check quotes and special characters in the password.");
  }
}

if (problems.length) {
  console.error("\n❌ Database config issues:\n");
  for (const p of problems) console.error(`  • ${p}`);
  console.error(
    "\nSupabase: Project Settings → Database → Connection string → URI (Session or Direct).\nAppend ?sslmode=require if not present.\n",
  );
  process.exit(1);
}

console.log("✓ DATABASE_URL format looks OK. Testing TCP + Prisma…");

const { PrismaClient } = await import("@prisma/client");
const prisma = new PrismaClient();

try {
  await prisma.$queryRaw`SELECT 1`;
  console.log("✓ Connected to Supabase Postgres successfully.");
} catch (e) {
  console.error("\n❌ Could not connect:", e.message);
  console.error(`
Common fixes:
  1. Supabase dashboard → restore/unpause the project if it says "Paused"
  2. Use the exact URI from "Connect" (try Session pooler on port 5432 or Transaction on 6543)
  3. Add ?sslmode=require to the end of DATABASE_URL
  4. If password has @ # % etc., URL-encode it
`);
  process.exit(1);
} finally {
  await prisma.$disconnect();
}
