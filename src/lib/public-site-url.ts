/** Full public site URL for links from admin (set on Vercel when using split domains). */
export function getPublicSiteUrl(): string | null {
  const url = process.env.NEXT_PUBLIC_PUBLIC_SITE_URL?.trim();
  if (!url) return null;
  return url.replace(/\/$/, "");
}

export function getPublicDashboardHref(): string {
  const base = getPublicSiteUrl();
  return base ? `${base}/dashboard` : "/dashboard";
}
