import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAdminSessionToken } from "@/lib/admin-session";
import {
  getAdminHost,
  getPublicHost,
  isAdminPath,
  isHostSplitEnabled,
  isPublicAppPath,
  normalizeHost,
  originForHost,
} from "@/lib/host-routing";

const SESSION_COOKIE = "sfic_admin_session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = normalizeHost(request.headers.get("host"));
  const adminHost = getAdminHost();
  const publicHost = getPublicHost();
  const split = isHostSplitEnabled() && adminHost;

  const onAdminSite = split && host === adminHost;
  const onPublicSite =
    split && publicHost ? host === publicHost : split && host !== adminHost;

  if (split) {
    if (onPublicSite && isAdminPath(pathname)) {
      const target = new URL(pathname + request.nextUrl.search, originForHost(adminHost, request.nextUrl.protocol));
      return NextResponse.redirect(target);
    }

    if (
      onAdminSite &&
      publicHost &&
      publicHost !== adminHost &&
      isPublicAppPath(pathname)
    ) {
      const target = new URL(pathname + request.nextUrl.search, originForHost(publicHost, request.nextUrl.protocol));
      return NextResponse.redirect(target);
    }

    if (onAdminSite && pathname === "/") {
      const token = request.cookies.get(SESSION_COOKIE)?.value;
      const session = await verifyAdminSessionToken(token);
      const dest = session ? "/admin" : "/sfic/manage";
      return NextResponse.redirect(new URL(dest, request.url));
    }
  }

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = await verifyAdminSessionToken(token);

  if (!session) {
    const loginBase =
      split && adminHost
        ? originForHost(adminHost, request.nextUrl.protocol)
        : request.nextUrl.origin;
    const login = new URL("/sfic/manage", loginBase);
    login.searchParams.set("next", pathname);
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/admin/:path*",
    "/sfic/manage",
    "/dashboard/:path*",
    "/book/:path*",
    "/clubs/:path*",
    "/my-bookings/:path*",
    "/booking/:path*",
    "/login",
  ],
};
