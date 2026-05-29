"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  getAdminLoginPath,
  getAdminUserForLogin,
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

  if (!verifyAdminPassword(parsed.data.password)) {
    return { error: "Invalid admin password" };
  }

  const admin = await getAdminUserForLogin();
  if (!admin) {
    return { error: "No admin account in database. Run npm run db:seed." };
  }

  await setSessionAdmin(admin.id);
  revalidatePath("/", "layout");
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await clearSession();
  revalidatePath("/", "layout");
  redirect(getAdminLoginPath());
}
