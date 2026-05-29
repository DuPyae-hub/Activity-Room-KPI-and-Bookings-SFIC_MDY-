import { redirect } from "next/navigation";
import { getSessionAdmin } from "@/lib/auth";

export default async function HomePage() {
  const admin = await getSessionAdmin();
  if (admin) redirect("/admin");
  redirect("/dashboard");
}
