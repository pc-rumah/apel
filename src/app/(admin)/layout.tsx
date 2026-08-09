import { redirect } from "next/navigation";
import { getSessionFn } from "@/lib/auth";

/**
 * (admin)/layout.tsx — admin-only layout guard.
 * Requires isAdmin === true. Non-admins are redirected to /.
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionFn();
  if (!user) {
    redirect("/login");
  }
  if (!user.isAdmin) {
    redirect("/");
  }
  return <>{children}</>;
}
