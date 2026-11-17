"use server";

import { createServerClient, parseCookieHeader } from "@supabase/ssr";
import { cookies } from "next/headers";
import { z } from "zod";
import { db, users } from "@/db";
import { eq, sql } from "drizzle-orm";

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

  const defaultAdminEmail = (
    process.env["DEFAULT_ADMIN_EMAIL"] ||
    process.env["ADMIN_EMAIL"]
  )?.toLowerCase().trim();

  const isDefaultAdmin = !!(
    defaultAdminEmail &&
    user.email &&
    user.email.toLowerCase() === defaultAdminEmail
  );

  const isAdmin = isDefaultAdmin || (dbUser?.isAdmin ?? false);

  if (isDefaultAdmin && dbUser && !dbUser.isAdmin) {
    try {
      await db.update(users).set({ isAdmin: true }).where(eq(users.id, user.id));
    } catch {
      // Non-critical background update failure
    }
  }

  return {
    id: user.id,
    email: user.email ?? "",
    isAdmin,
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

  if (error) {
    const defaultAdminEmail = (
      process.env["DEFAULT_ADMIN_EMAIL"] ||
      process.env["ADMIN_EMAIL"]
    )?.trim();
    const defaultAdminPass = (
      process.env["DEFAULT_ADMIN_PASSWORD"] ||
      process.env["ADMIN_PASSWORD"]
    )?.trim();

    // If default admin failed (not created yet or email not confirmed), auto-provision & confirm
    if (
      defaultAdminEmail &&
      defaultAdminPass &&
      data.email.toLowerCase() === defaultAdminEmail.toLowerCase() &&
      data.password === defaultAdminPass
    ) {
      // If user already exists with unconfirmed email, confirm it first
      try {
        await db.execute(
          sql`UPDATE auth.users SET email_confirmed_at = COALESCE(email_confirmed_at, NOW()) WHERE lower(email) = lower(${defaultAdminEmail})`,
        );
      } catch {
        // Ignore if auth.users update isn't permitted
      }

      const retryExisting = await supabase.auth.signInWithPassword({
        email: defaultAdminEmail,
        password: defaultAdminPass,
      });

      if (!retryExisting.error && retryExisting.data.user) {
        await db
          .insert(users)
          .values({
            id: retryExisting.data.user.id,
            email: defaultAdminEmail,
            isAdmin: true,
          })
          .onConflictDoUpdate({
            target: users.id,
            set: { isAdmin: true },
          });
        return { success: true };
      }

      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: defaultAdminEmail,
        password: defaultAdminPass,
      });

      if (!signUpError && signUpData.user) {
        try {
          await db.execute(
            sql`UPDATE auth.users SET email_confirmed_at = COALESCE(email_confirmed_at, NOW()) WHERE id = ${signUpData.user.id}::uuid`,
          );
        } catch {
          // Ignore if auth.users update isn't permitted
        }

        await db
          .insert(users)
          .values({
            id: signUpData.user.id,
            email: defaultAdminEmail,
            isAdmin: true,
          })
          .onConflictDoUpdate({
            target: users.id,
            set: { isAdmin: true },
          });

        const retry = await supabase.auth.signInWithPassword({
          email: defaultAdminEmail,
          password: defaultAdminPass,
        });

        if (!retry.error) {
          return { success: true };
        }
      }
    }

    throw new Error(error.message);
  }

  // Ensure default admin in env has isAdmin: true in db upon successful login
  const defaultAdminEmail = (
    process.env["DEFAULT_ADMIN_EMAIL"] ||
    process.env["ADMIN_EMAIL"]
  )?.toLowerCase().trim();

  if (defaultAdminEmail && data.email.toLowerCase() === defaultAdminEmail) {
    const { data: userData } = await supabase.auth.getUser();
    if (userData?.user) {
      await db
        .insert(users)
        .values({
          id: userData.user.id,
          email: data.email,
          isAdmin: true,
        })
        .onConflictDoNothing();

      await db
        .update(users)
        .set({ isAdmin: true })
        .where(eq(users.id, userData.user.id));
    }
  }

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

  const defaultAdminEmail = (
    process.env["DEFAULT_ADMIN_EMAIL"] ||
    process.env["ADMIN_EMAIL"]
  )?.toLowerCase().trim();

  const isDefaultAdmin = !!(
    defaultAdminEmail &&
    data.email.toLowerCase() === defaultAdminEmail
  );

  // Insert into our users table
  await db
    .insert(users)
    .values({
      id: authData.user.id,
      email: data.email,
      isAdmin: isDefaultAdmin,
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
