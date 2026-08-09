import { redirect } from "next/navigation";
import { getSessionFn } from "@/lib/auth";

/**
 * (auth)/layout.tsx — protected layout for all authenticated pages.
 * Reads the session server-side and redirects to /login if unauthenticated.
 */
export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionFn();
  if (!user) {
    redirect("/login");
  }
  return <>{children}</>;
}
