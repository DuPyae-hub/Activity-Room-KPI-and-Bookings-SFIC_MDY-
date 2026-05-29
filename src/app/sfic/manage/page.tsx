import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/auth/admin-login-form";
import { AdminLoginMascot } from "@/components/auth/admin-login-mascot";
import { BrandLogo } from "@/components/layout/brand-logo";
import { getSessionAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminManageLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;
  const admin = await getSessionAdmin();
  if (admin) {
    const next =
      params.next && params.next.startsWith("/admin") ? params.next : "/admin";
    redirect(next);
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <AdminLoginMascot />
      <div className="mb-8 text-center">
        <BrandLogo className="mx-auto mb-4" height={56} />
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Management access</h1>
        <p className="brand-subheading mt-1">Strategy First International College</p>
        <p className="mt-2 text-sm text-foreground-muted">
          Authorized personnel only — enter your admin password below
        </p>
      </div>
      <AdminLoginForm next={params.next} />
    </div>
  );
}
