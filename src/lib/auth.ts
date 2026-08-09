"use server";

import { createServerClient, parseCookieHeader, serializeCookieHeader } from "@supabase/ssr";
import { cookies } from "next/headers";
import { z } from "zod";
import { db, users } from "@/db";
import { eq } from "drizzle-orm";

// ─────────────────────────────────────────────────────────────────────────────
// Helper: build a Supabase server client wired to Next.js cookies
// ─────────────────────────────────────────────────────────────────────────────
async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env["NEXT_PUBLIC_SUPABASE_URL"]!,
    process.env["NEXT_PUBLIC_SUPABASE_KEY"]!,
    {
      cookies: {
        getAll() {
          return parseCookieHeader(cookieStore.toString());
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    },
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// getSession — returns { user, isAdmin } or null
// ─────────────────────────────────────────────────────────────────────────────
export async function getSessionFn() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Fetch is_admin from our users table
  const dbUser = await db.query.users.findFirst({
    where: eq(users.id, user.id),
  });

  return {
    id: user.id,
    email: user.email ?? "",
    isAdmin: dbUser?.isAdmin ?? false,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// login
// ─────────────────────────────────────────────────────────────────────────────
const LoginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export async function loginFn(input: { data: { email: string; password: string } }) {
  const data = LoginSchema.parse(input.data);
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (error) throw new Error(error.message);
  return { success: true };
}

// ─────────────────────────────────────────────────────────────────────────────
// register
// ─────────────────────────────────────────────────────────────────────────────
const RegisterSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export async function registerFn(input: { data: { email: string; password: string } }) {
  const data = RegisterSchema.parse(input.data);
  const supabase = await createSupabaseServerClient();
  const { data: authData, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
  });

  if (error) throw new Error(error.message);
  if (!authData.user) throw new Error("Registrasi gagal");

  // Insert into our users table
  await db
    .insert(users)
    .values({
      id: authData.user.id,
      email: data.email,
      isAdmin: false,
    })
    .onConflictDoNothing();

  return { success: true };
}

// ─────────────────────────────────────────────────────────────────────────────
// logout
// ─────────────────────────────────────────────────────────────────────────────
export async function logoutFn() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  return { success: true };
}
