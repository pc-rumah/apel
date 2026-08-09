"use server";

import { createServerClient, parseCookieHeader, serializeCookieHeader } from "@supabase/ssr";
import { cookies } from "next/headers";
import { z } from "zod";
import { db, childProfiles, dailyLogs, screeningResults, parentNotes, users } from "@/db";
import { eq, desc, and } from "drizzle-orm";

// ─────────────────────────────────────────────────────────────────────────────
// Supabase server client
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

/** Get the authenticated user ID or throw */
async function requireUserId(): Promise<string> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  return user.id;
}

// ─────────────────────────────────────────────────────────────────────────────
// Child Profile
// ─────────────────────────────────────────────────────────────────────────────
export async function getUserProfileFn() {
  const userId = await requireUserId();
  const profile = await db.query.childProfiles.findFirst({
    where: eq(childProfiles.userId, userId),
  });
  return profile ?? null;
}

const SaveProfileSchema = z.object({
  name: z.string().min(1),
  birthDate: z.string(),
});

export async function saveUserProfileFn(input: { data: { name: string; birthDate: string } }) {
  const data = SaveProfileSchema.parse(input.data);
  const userId = await requireUserId();

  const existing = await db.query.childProfiles.findFirst({
    where: eq(childProfiles.userId, userId),
  });

  if (existing) {
    await db
      .update(childProfiles)
      .set({ name: data.name, birthDate: data.birthDate, updatedAt: new Date() })
      .where(eq(childProfiles.id, existing.id));
    return { id: existing.id };
  } else {
    const [inserted] = await db
      .insert(childProfiles)
      .values({ userId, name: data.name, birthDate: data.birthDate })
      .returning();
    return { id: inserted!.id };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Daily Logs
// ─────────────────────────────────────────────────────────────────────────────
export async function getUserLogsFn() {
  const userId = await requireUserId();
  const logs = await db.query.dailyLogs.findMany({
    where: eq(dailyLogs.userId, userId),
    orderBy: [desc(dailyLogs.date)],
  });
  return logs;
}

const SaveLogSchema = z.object({
  date: z.string(),
  minutes: z.number(),
  newWords: z.number(),
  response: z.enum(["Kurang", "Cukup", "Baik", "Sangat Baik"]),
  note: z.string(),
});

export async function saveLogFn(input: {
  data: { date: string; minutes: number; newWords: number; response: string; note: string };
}) {
  const data = SaveLogSchema.parse(input.data);
  const userId = await requireUserId();

  const profile = await db.query.childProfiles.findFirst({
    where: eq(childProfiles.userId, userId),
  });

  const existing = await db.query.dailyLogs.findFirst({
    where: and(eq(dailyLogs.userId, userId), eq(dailyLogs.date, data.date)),
  });

  if (existing) {
    await db
      .update(dailyLogs)
      .set({
        minutes: data.minutes,
        newWords: data.newWords,
        response: data.response,
        note: data.note,
      })
      .where(eq(dailyLogs.id, existing.id));
    return { id: existing.id };
  } else {
    const [inserted] = await db
      .insert(dailyLogs)
      .values({
        userId,
        childId: profile?.id ?? null,
        date: data.date,
        minutes: data.minutes,
        newWords: data.newWords,
        response: data.response,
        note: data.note,
      })
      .returning();
    return { id: inserted!.id };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Screening Results
// ─────────────────────────────────────────────────────────────────────────────
export async function getUserScreeningsFn() {
  const userId = await requireUserId();
  const screenings = await db.query.screeningResults.findMany({
    where: eq(screeningResults.userId, userId),
    orderBy: [desc(screeningResults.createdAt)],
  });
  return screenings;
}

const SaveScreeningSchema = z.object({
  date: z.string(),
  age: z.number(),
  yesCount: z.number(),
  totalCount: z.number(),
  verdict: z.string(),
});

export async function saveScreeningFn(input: {
  data: { date: string; age: number; yesCount: number; totalCount: number; verdict: string };
}) {
  const data = SaveScreeningSchema.parse(input.data);
  const userId = await requireUserId();

  const profile = await db.query.childProfiles.findFirst({
    where: eq(childProfiles.userId, userId),
  });

  const [inserted] = await db
    .insert(screeningResults)
    .values({
      userId,
      childId: profile?.id ?? null,
      date: data.date,
      age: data.age,
      yesCount: data.yesCount,
      totalCount: data.totalCount,
      verdict: data.verdict,
    })
    .returning();
  return { id: inserted!.id };
}

// ─────────────────────────────────────────────────────────────────────────────
// Parent Notes
// ─────────────────────────────────────────────────────────────────────────────
export async function getUserNoteFn() {
  const userId = await requireUserId();
  const note = await db.query.parentNotes.findFirst({
    where: eq(parentNotes.userId, userId),
  });
  return note?.note ?? "";
}

export async function saveNoteFn(input: { data: { note: string } }) {
  const data = z.object({ note: z.string() }).parse(input.data);
  const userId = await requireUserId();

  const profile = await db.query.childProfiles.findFirst({
    where: eq(childProfiles.userId, userId),
  });

  const existing = await db.query.parentNotes.findFirst({
    where: eq(parentNotes.userId, userId),
  });

  if (existing) {
    await db
      .update(parentNotes)
      .set({ note: data.note, updatedAt: new Date() })
      .where(eq(parentNotes.id, existing.id));
  } else {
    await db.insert(parentNotes).values({
      userId,
      childId: profile?.id ?? null,
      note: data.note,
    });
  }
  return { success: true };
}

// ─────────────────────────────────────────────────────────────────────────────
// Migration — one-time import from localStorage payload
// ─────────────────────────────────────────────────────────────────────────────
const MigrationSchema = z.object({
  profile: z.object({ name: z.string(), birthDate: z.string() }),
  logs: z.array(
    z.object({
      date: z.string(),
      minutes: z.number(),
      newWords: z.number(),
      response: z.enum(["Kurang", "Cukup", "Baik", "Sangat Baik"]),
      note: z.string(),
    }),
  ),
  screenings: z.array(
    z.object({
      id: z.string(),
      date: z.string(),
      age: z.number(),
      yes: z.number(),
      total: z.number(),
      verdict: z.string(),
    }),
  ),
  parentNote: z.string(),
});

export async function migrateLocalStorageFn(input: { data: z.infer<typeof MigrationSchema> }) {
  const data = MigrationSchema.parse(input.data);
  const userId = await requireUserId();

  // 1. Upsert child profile
  let profileId: string;
  const existing = await db.query.childProfiles.findFirst({
    where: eq(childProfiles.userId, userId),
  });

  if (existing) {
    await db
      .update(childProfiles)
      .set({ name: data.profile.name, birthDate: data.profile.birthDate })
      .where(eq(childProfiles.id, existing.id));
    profileId = existing.id;
  } else {
    const [inserted] = await db
      .insert(childProfiles)
      .values({ userId, name: data.profile.name, birthDate: data.profile.birthDate })
      .returning();
    profileId = inserted!.id;
  }

  // 2. Insert logs (skip duplicates)
  for (const log of data.logs) {
    const dup = await db.query.dailyLogs.findFirst({
      where: and(eq(dailyLogs.userId, userId), eq(dailyLogs.date, log.date)),
    });
    if (!dup) {
      await db.insert(dailyLogs).values({
        userId,
        childId: profileId,
        date: log.date,
        minutes: log.minutes,
        newWords: log.newWords,
        response: log.response,
        note: log.note,
      });
    }
  }

  // 3. Insert screenings
  for (const s of data.screenings) {
    await db.insert(screeningResults).values({
      userId,
      childId: profileId,
      date: s.date,
      age: s.age,
      yesCount: s.yes,
      totalCount: s.total,
      verdict: s.verdict,
    });
  }

  // 4. Upsert parent note
  if (data.parentNote) {
    const existingNote = await db.query.parentNotes.findFirst({
      where: eq(parentNotes.userId, userId),
    });
    if (existingNote) {
      await db
        .update(parentNotes)
        .set({ note: data.parentNote })
        .where(eq(parentNotes.id, existingNote.id));
    } else {
      await db.insert(parentNotes).values({ userId, childId: profileId, note: data.parentNote });
    }
  }

  return { success: true };
}

// ─────────────────────────────────────────────────────────────────────────────
// Reset all user data
// ─────────────────────────────────────────────────────────────────────────────
export async function resetUserDataFn() {
  const userId = await requireUserId();
  // Cascade deletes handle logs, screenings, notes
  await db.delete(childProfiles).where(eq(childProfiles.userId, userId));
  return { success: true };
}

// ─────────────────────────────────────────────────────────────────────────────
// Admin: get all users with stats
// ─────────────────────────────────────────────────────────────────────────────
export async function adminGetAllUsersFn() {
  const userId = await requireUserId();
  const me = await db.query.users.findFirst({ where: eq(users.id, userId) });
  if (!me?.isAdmin) throw new Error("Forbidden");

  const allUsers = await db.query.users.findMany({
    orderBy: [desc(users.createdAt)],
  });

  const enriched = await Promise.all(
    allUsers.map(async (u) => {
      const profile = await db.query.childProfiles.findFirst({
        where: eq(childProfiles.userId, u.id),
      });
      const logCount = await db.query.dailyLogs.findMany({
        where: eq(dailyLogs.userId, u.id),
      });
      const screeningCount = await db.query.screeningResults.findMany({
        where: eq(screeningResults.userId, u.id),
      });
      return {
        ...u,
        childName: profile?.name ?? null,
        childBirthDate: profile?.birthDate ?? null,
        logCount: logCount.length,
        screeningCount: screeningCount.length,
      };
    }),
  );

  return enriched;
}

// ─────────────────────────────────────────────────────────────────────────────
// Admin: get user detail
// ─────────────────────────────────────────────────────────────────────────────
export async function adminGetUserDetailFn(input: { data: { targetUserId: string } }) {
  const data = z.object({ targetUserId: z.string() }).parse(input.data);
  const userId = await requireUserId();
  const me = await db.query.users.findFirst({ where: eq(users.id, userId) });
  if (!me?.isAdmin) throw new Error("Forbidden");

  const user = await db.query.users.findFirst({
    where: eq(users.id, data.targetUserId),
  });
  if (!user) throw new Error("User not found");

  const profile = await db.query.childProfiles.findFirst({
    where: eq(childProfiles.userId, data.targetUserId),
  });

  const logs = await db.query.dailyLogs.findMany({
    where: eq(dailyLogs.userId, data.targetUserId),
    orderBy: [desc(dailyLogs.date)],
  });

  const screenings = await db.query.screeningResults.findMany({
    where: eq(screeningResults.userId, data.targetUserId),
    orderBy: [desc(screeningResults.createdAt)],
  });

  const note = await db.query.parentNotes.findFirst({
    where: eq(parentNotes.userId, data.targetUserId),
  });

  return { user, profile, logs, screenings, parentNote: note?.note ?? "" };
}

// ─────────────────────────────────────────────────────────────────────────────
// Admin: toggle is_admin
// ─────────────────────────────────────────────────────────────────────────────
export async function adminToggleAdminFn(input: {
  data: { targetUserId: string; isAdmin: boolean };
}) {
  const data = z
    .object({ targetUserId: z.string(), isAdmin: z.boolean() })
    .parse(input.data);
  const userId = await requireUserId();
  const me = await db.query.users.findFirst({ where: eq(users.id, userId) });
  if (!me?.isAdmin) throw new Error("Forbidden");

  await db
    .update(users)
    .set({ isAdmin: data.isAdmin })
    .where(eq(users.id, data.targetUserId));

  return { success: true };
}
