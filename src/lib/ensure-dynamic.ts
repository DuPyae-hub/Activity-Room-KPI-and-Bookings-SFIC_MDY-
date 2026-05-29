import { connection } from "next/server";

/** Opt out of static prerender (required for DB-backed pages on Vercel build). */
export async function ensureDynamicPage(): Promise<void> {
  await connection();
}
