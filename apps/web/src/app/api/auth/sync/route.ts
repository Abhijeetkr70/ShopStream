import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@shopstream/db";
import { users } from "@shopstream/db/schema";
import { eq } from "drizzle-orm";

export async function POST() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const cu = await currentUser();
  if (!cu) {
    return NextResponse.json({ error: "No clerk user" }, { status: 401 });
  }
  const email = cu.emailAddresses[0]?.emailAddress;
  if (!email) {
    return NextResponse.json({ error: "Email missing" }, { status: 400 });
  }

  const existing = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, userId))
    .limit(1);

  if (existing.length === 0) {
    await db.insert(users).values({
      clerkId: userId,
      email,
      name: [cu.firstName, cu.lastName].filter(Boolean).join(" ") || null,
    });
  }

  return NextResponse.json({ ok: true });
}
