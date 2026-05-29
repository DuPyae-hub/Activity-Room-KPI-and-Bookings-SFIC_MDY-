/** Hostname only, e.g. admin.rooms.sfic.edu (no https://) */
export function normalizeHost(host: string | null): string {
  if (!host) return "";
  return host.split(":")[0].toLowerCase();
}

export function getAdminHost(): string | null {
  const value = process.env.ADMIN_HOST?.trim().toLowerCase();
  return value || null;
}

export function getPublicHost(): string | null {
  const value = process.env.PUBLIC_HOST?.trim().toLowerCase();
  return value || null;
}

export function isHostSplitEnabled(): boolean {
  return Boolean(getAdminHost());
}

export function isAdminPath(pathname: string): boolean {
  return pathname.startsWith("/admin") || pathname.startsWith("/sfic/manage");
}

const PUBLIC_PREFIXES = [
  "/dashboard",
  "/book",
  "/clubs",
  "/my-bookings",
  "/booking",
  "/login",
];

export function isPublicAppPath(pathname: string): boolean {
  if (pathname === "/") return true;
  return PUBLIC_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function originForHost(
  host: string,
  protocol: string,
): string {
  const proto = protocol.endsWith(":") ? protocol : `${protocol}:`;
  return `${proto}//${host}`;
}
