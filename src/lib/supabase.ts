import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env["NEXT_PUBLIC_SUPABASE_URL"] as string;
const supabaseAnonKey = process.env["NEXT_PUBLIC_SUPABASE_KEY"] as string;

/** Browser-side Supabase client (reads/writes cookies automatically) */
export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
