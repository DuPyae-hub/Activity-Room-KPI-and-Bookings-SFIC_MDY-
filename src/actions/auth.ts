"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  getAdminLoginPath,
  getAdminUserForLogin,
  isAdminPasswordConfigured,
  verifyAdminPassword,
} from "@/lib/admin-auth";
import { clearSession, setSessionAdmin } from "@/lib/auth";
import { adminLoginSchema } from "@/lib/validations";

export type AuthActionState = {
  error?: string;
};

export async function adminLoginAction(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = adminLoginSchema.safeParse({
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      error: parsed.error.flatten().fieldErrors.password?.[0] ?? "Invalid credentials",
    };
  }

  if (!isAdminPasswordConfigured()) {
    return {
      error:
        "Admin password is not configured on this server. Add ADMIN_PASSWORD in Vercel → Environment Variables, then redeploy.",
    };
  }

  if (!verifyAdminPassword(parsed.data.password)) {
    return { error: "Invalid admin password" };
  }

  const admin = await getAdminUserForLogin();
  if (!admin) {
    return { error: "No admin account in database. Run npm run db:seed." };
  }

  await setSessionAdmin(admin.id);
  revalidatePath("/", "layout");

  const next = formData.get("next");
  const safeNext =
    typeof next === "string" && next.startsWith("/admin") ? next : "/admin";
  redirect(safeNext);
}

export async function logoutAction(): Promise<void> {
  await clearSession();
  revalidatePath("/", "layout");
  redirect(getAdminLoginPath());
}
