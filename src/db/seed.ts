import { config } from "dotenv";
config({ path: ".env.local" });
config();
import { createClient } from "@supabase/supabase-js";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import { users } from "./schema";

async function main() {
  const supabaseUrl = process.env["NEXT_PUBLIC_SUPABASE_URL"];
  const supabaseKey = process.env["NEXT_PUBLIC_SUPABASE_KEY"];
  const databaseUrl = process.env["DATABASE_URL"];

  const adminEmail = (
    process.env["DEFAULT_ADMIN_EMAIL"] ||
    process.env["ADMIN_EMAIL"] ||
    "admin@speechpro.com"
  ).trim();

  const adminPassword = (
    process.env["DEFAULT_ADMIN_PASSWORD"] ||
    process.env["ADMIN_PASSWORD"] ||
    "Admin123456!"
  ).trim();

  if (!supabaseUrl || !supabaseKey || !databaseUrl) {
    console.error("Missing required environment variables (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_KEY, DATABASE_URL).");
    process.exit(1);
  }

  console.log(`Setting up default admin: ${adminEmail}...`);

  const supabase = createClient(supabaseUrl, supabaseKey);
  const client = postgres(databaseUrl, { prepare: false });
  const db = drizzle(client);

  let userId: string | null = null;

  // 1. Try to sign in to verify if user already exists
  const signInRes = await supabase.auth.signInWithPassword({
    email: adminEmail,
    password: adminPassword,
  });

  if (signInRes.data.user) {
    userId = signInRes.data.user.id;
    console.log(`Found existing Supabase user ID: ${userId}`);
  } else {
    // 2. Try to sign up the admin user
    const signUpRes = await supabase.auth.signUp({
      email: adminEmail,
      password: adminPassword,
    });

    if (signUpRes.error) {
      console.warn(`Sign-up warning/error: ${signUpRes.error.message}`);
    }

    if (signUpRes.data.user) {
      userId = signUpRes.data.user.id;
      console.log(`Created new Supabase user ID: ${userId}`);
    }
  }

  // Ensure email is confirmed in auth.users so login doesn't fail with "Email not confirmed"
  try {
    const confirmed = await client`
      UPDATE auth.users
      SET email_confirmed_at = COALESCE(email_confirmed_at, NOW())
      WHERE lower(email) = lower(${adminEmail})
      RETURNING id
    `;
    if (confirmed.length > 0) {
      if (!userId) userId = confirmed[0].id as string;
      console.log(`Ensured email_confirmed_at is set for auth.users ID: ${userId}`);
    }
  } catch (err) {
    console.warn("Could not update auth.users email_confirmed_at:", err);
  }

  // 3. Upsert user in Postgres users table with isAdmin = true
  if (userId) {
    await db
      .insert(users)
      .values({
        id: userId,
        email: adminEmail,
        isAdmin: true,
      })
      .onConflictDoUpdate({
        target: users.id,
        set: { isAdmin: true, email: adminEmail },
      });

    console.log(`Default admin configured with isAdmin: true in database.`);
  } else {
    // If Supabase user could not be retrieved, attempt to set isAdmin: true for any existing row with this email
    const updated = await db
      .update(users)
      .set({ isAdmin: true })
      .where(eq(users.email, adminEmail));

    console.log("Updated database user record if existed.", updated);
  }

  await client.end();
  console.log("Done.");
}

main().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
